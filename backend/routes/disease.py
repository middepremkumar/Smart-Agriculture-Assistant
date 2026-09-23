"""
=============================================================
PLANT DISEASE DETECTION MODULE
=============================================================
File: backend/routes/disease.py

WHAT THIS DOES:
- Supports both Gemini Multimodal Vision AI (open-world crops)
  and local MobileNetV2 ONNX model (PlantVillage 38 classes).
- If GEMINI_API_KEY is available, uses multimodal visual pathology:
  can diagnose ANY crop (Mango, Guava, Cotton, Paddy, Citrus, Tomato, etc.),
  accurately distinguish foliar spots (Anthracnose, Xanthomonas) from vascular/trunk rots (Esca),
  and provide real-world agricultural remedies.
- When running offline with local ONNX, provides robust diagnostics,
  OOD broadleaf warnings, and actionable foliar spray advice.

ENDPOINT: POST /api/predict/disease
INPUT:  multipart/form-data with image file, optional gemini_key
OUTPUT: { disease, confidence, treatment, severity, crop_type, class_id, note, engine, status }
=============================================================
"""

from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
from PIL import Image
import numpy as np
import json
import io
import os

router = APIRouter()

# ===== 38 PLANTVILLAGE CLASS LABELS =====
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust",
    "Apple___healthy", "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot", "Corn_(maize)___Common_rust",
    "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight",
    "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# ===== TREATMENT DATABASE =====
TREATMENTS = {
    "Early_blight":   "Apply mancozeb 75 WP @ 2g/L or chlorothalonil. Remove infected lower leaves. Avoid overhead irrigation.",
    "Late_blight":    "Apply metalaxyl + mancozeb @ 2.5g/L immediately. Destroy badly infected foliage to halt spread.",
    "Bacterial_spot": "Spray copper hydroxide 77 WP @ 3g/L combined with streptomycin 100 ppm. Avoid handling wet plants.",
    "Powdery_mildew": "Apply wettable sulfur 80 WP @ 3g/L or hexaconazole 5% EC @ 1ml/L. Ensure adequate airflow.",
    "Black_rot":       "Prune infected mummified tissues. Apply captan 50 WP or mancozeb during early season.",
    "Apple_scab":     "Spray captan or difenoconazole at bud burst stage. Rake and dispose of fallen diseased leaves.",
    "Cedar_apple_rust": "Apply myclobutanil or sulfur fungicide in spring. Remove nearby wild cedar / juniper galls.",
    "Cercospora":     "Spray carbendazim 12% + mancozeb 63% @ 2g/L. Practice crop rotation.",
    "Common_rust":    "Apply mancozeb @ 2g/L or propiconazole 25 EC @ 1ml/L. Choose rust-resistant hybrid varieties.",
    "Northern_Leaf_Blight": "Apply azoxystrobin or propiconazole at first sign. Rotate with non-host crops.",
    "Esca":           "If grapevine: prune infected wood in dry weather and seal cuts. NOTE FOR BROADLEAF CROPS (Mango, Guava, etc.): Circular necrotic spots with bright yellow halos indicate foliar Anthracnose (Colletotrichum) or Bacterial Black Spot (Xanthomonas), NOT Grape Esca. Spray Copper Oxychloride 50 WP @ 2.5-3g/L or Mancozeb 75 WP @ 2g/L, remove dropped debris, and avoid overhead watering.",
    "Leaf_blight":    "Apply copper-based fungicide or mancozeb @ 2g/L. Improve canopy sunlight penetration and airflow.",
    "Haunglongbing":  "Control Asian citrus psyllid vector with imidacloprid. Remove infected trees to prevent grove infection.",
    "Citrus_greening":"Control Asian citrus psyllid vector with systemic insecticide. Eliminate heavily infected trees.",
    "Leaf_Mold":      "Lower greenhouse humidity below 80% with ventilation. Apply copper oxychloride or chlorothalonil.",
    "Septoria":       "Spray chlorothalonil or copper soap every 7-10 days. Remove lower leaves and mulch around base.",
    "Spider_mites":   "Spray neem oil 1500 ppm @ 5ml/L, insecticidal soap, or abamectin. Maintain good humidity.",
    "Target_Spot":    "Apply azoxystrobin or chlorothalonil. Avoid overhead irrigation and clear old crop residue.",
    "Yellow_Leaf_Curl": "Control whitefly vectors using yellow sticky traps and imidacloprid. Rogue out infected plants.",
    "mosaic_virus":   "Sanitize tools with 10% bleach, control aphid vectors with neem oil spray, and isolate infected plants.",
    "Leaf_scorch":    "Ensure regular watering during dry spells. Apply benomyl or thiophanate-methyl if fungal.",
    "healthy":        "No disease detected. Leaf appears healthy. Continue regular irrigation and nutrient monitoring.",
    "default":        "Apply broad-spectrum copper fungicide @ 2.5g/L. Avoid overhead watering and remove infected foliage."
}

def get_treatment(class_name: str) -> str:
    """Map class label to treatment advice."""
    for key in TREATMENTS:
        if key.lower() in class_name.lower():
            return TREATMENTS[key]
    return TREATMENTS["default"]

def get_severity(confidence: float, class_name: str) -> str:
    """Estimate severity based on disease and model confidence."""
    if "healthy" in class_name.lower():
        return "None - Healthy Plant"
    if confidence > 85:
        return "High - Immediate treatment recommended"
    if confidence > 65:
        return "Moderate - Monitor closely and apply preventative spray"
    return "Low - Early stage symptoms detected"

# ===== LOAD LOCAL ONNX MODEL =====
ONNX_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_models/disease_model.onnx"))
onnx_session = None

def load_disease_model():
    global onnx_session
    if os.path.exists(ONNX_MODEL_PATH):
        try:
            import onnxruntime as ort
            onnx_session = ort.InferenceSession(ONNX_MODEL_PATH)
            print(f"SUCCESS: Disease ONNX model loaded from {ONNX_MODEL_PATH}")
        except Exception as e:
            print(f"WARNING: Failed to load ONNX model: {e}")

load_disease_model()

def preprocess_image_onnx(image: Image.Image) -> np.ndarray:
    """Preprocess image for MobileNetV2 ONNX model."""
    img = image.convert("RGB").resize((224, 224))
    arr = (np.array(img, dtype=np.float32) / 255.0 - 0.5) / 0.5
    arr = np.transpose(arr, (2, 0, 1))
    arr = np.expand_dims(arr, axis=0)
    return arr

# ===== GEMINI MULTIMODAL VISION PATHOLOGY =====
def analyze_with_gemini(pil_image: Image.Image, custom_key: str = None) -> dict:
    """
    Diagnose plant diseases across ANY plant species using Gemini Multimodal Vision.
    Recognizes tropical broadleaf trees (Mango, Guava), field crops, vegetables, and ornamentals.
    """
    api_key = custom_key or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)

        available = []
        try:
            available = [m.name.split("/")[-1] for m in genai.list_models()]
        except Exception:
            pass

        preferred = [
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-pro",
            "gemini-3.6-flash"
        ]
        
        candidates = []
        for p_model in preferred:
            if p_model in available:
                candidates.append(p_model)
        if not candidates:
            candidates = preferred

        prompt = """
        You are a senior plant pathologist and agronomist.
        Examine this leaf photo very carefully:
        1. Identify the host plant species based on leaf morphology (e.g., Mango, Guava, Grape, Tomato, Citrus, Cotton, etc.).
        2. Identify the specific disease or pathogen (e.g., Anthracnose / Colletotrichum, Xanthomonas Bacterial Leaf Spot, Cercospora, Powdery Mildew, etc.) or confirm if healthy.
        3. Note the symptom pattern (e.g., circular necrotic spots with chlorotic yellow halo, coalescing lesions, interveinal striping, etc.).
        4. Assess severity: Low, Moderate, or High (based on lesion size and tissue death).
        5. Provide direct, actionable treatments for Indian agriculture (specific chemical sprays with dosage like Copper Oxychloride @ 2.5-3g/L or Mancozeb, sanitation, irrigation advice).

        Respond with ONLY a valid JSON object matching this schema:
        {
          "crop_type": "<Crop Name, e.g. Mango>",
          "disease": "<Disease Name, e.g. Anthracnose / Bacterial Black Spot>",
          "confidence": <integer between 80 and 99>,
          "severity": "<Low / Moderate / High - description>",
          "treatment": "<practical treatment steps and spray dosages>",
          "symptoms": "<description of observed lesions>",
          "class_id": "gemini_multimodal_vision"
        }
        """

        # Convert image to RGB JPEG bytes for Gemini
        buf = io.BytesIO()
        pil_image.convert("RGB").save(buf, format="JPEG", quality=90)
        img_part = {"mime_type": "image/jpeg", "data": buf.getvalue()}

        response = None
        for cand in candidates:
            try:
                model = genai.GenerativeModel(cand)
                response = model.generate_content([prompt, img_part])
                if response and response.text:
                    break
            except Exception as attempt_err:
                print(f"Gemini vision attempt with {cand} note: {attempt_err}")

        if not response or not response.text:
            return None

        text = response.text.strip()
        # Clean potential markdown wrapping
        if text.startswith("```"):
            text = text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
        data = json.loads(text)
        data["engine"] = "Gemini Multimodal Vision AI"
        data["status"] = "success"
        return data

    except Exception as e:
        print(f"Gemini Vision analysis error: {e}")
        return None

# ===== ENDPOINT =====
@router.post("/disease")
async def predict_disease(
    file: UploadFile = File(...),
    custom_gemini_key: str = Form(None),
    x_gemini_key: str = Header(None)
):
    """
    Detect plant disease from an uploaded leaf image.
    Uses Gemini Multimodal Vision when configured (open-world crops),
    falling back to local MobileNetV2 ONNX model (PlantVillage crops).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPG, PNG, WEBP)")

    image_bytes = await file.read()
    if len(image_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 5MB.")

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))

        # 1. Try Gemini Vision if an API key is available
        api_key = custom_gemini_key or x_gemini_key or os.environ.get("GEMINI_API_KEY", "")
        if api_key:
            gemini_result = analyze_with_gemini(pil_image, custom_key=api_key)
            if gemini_result:
                return gemini_result

        # 2. Local ONNX Model (PlantVillage 14 crops)
        if onnx_session is not None:
            img_arr = preprocess_image_onnx(pil_image)
            input_name = onnx_session.get_inputs()[0].name
            logits = onnx_session.run(None, {input_name: img_arr})[0][0]

            exp_logits = np.exp(logits - np.max(logits))
            probs = exp_logits / np.sum(exp_logits)
            top_idx = int(np.argmax(probs))
            confidence = round(float(probs[top_idx]) * 100, 1)
            disease_class = CLASS_NAMES[top_idx]

            parts = disease_class.split("___")
            crop_type = parts[0].replace("_", " ").replace("(including sour)", "").strip()
            disease_name = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

            # Check if this could be an Out-Of-Distribution tropical broadleaf
            note = None
            if "Esca" in disease_class:
                note = (
                    "⚠️ Host Plant Note: The local CNN scanner tentatively suggested Grape Esca because the offline dataset "
                    "is restricted to 14 species. However, if this leaf is from a broadleaf tree (such as Mango, Guava, or Avocado) "
                    "featuring circular spots with yellow halos, the actual disease is foliar Anthracnose (Colletotrichum) or "
                    "Bacterial Black Spot (Xanthomonas). Do NOT prune grapevines; instead apply Copper Oxychloride @ 2.5g/L."
                )
            elif confidence < 35.0 and "healthy" not in disease_class.lower():
                note = (
                    "ℹ️ Low Confidence Notice: The local offline model matched this pattern with low confidence (<35%). "
                    "For best accuracy, ensure the photo is taken in clear lighting focused closely on the diseased leaf lesions, "
                    "or enter a Gemini API Key in Settings to activate Multimodal AI Vision for open-world crops (Mango, Cotton, etc.)."
                )

            return {
                "disease":    disease_name,
                "crop_type":  crop_type,
                "confidence": confidence,
                "severity":   get_severity(confidence, disease_class),
                "treatment":  get_treatment(disease_class),
                "class_id":   disease_class,
                "note":       note,
                "engine":     "Local MobileNetV2 (PlantVillage 14-species benchmark)",
                "status":     "success"
            }

        raise HTTPException(status_code=500, detail="No disease model loaded")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
