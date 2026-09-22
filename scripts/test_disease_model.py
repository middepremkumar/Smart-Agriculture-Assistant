import os
import sys
import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/ml_models/disease_model.onnx"))

# 38 PlantVillage Classes
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
    "Esca":           "Prune diseased vine wood during dry weather. Seal pruning cuts with wound paste.",
    "Leaf_blight":    "Apply copper-based fungicide or mancozeb. Improve sunlight penetration by pruning canopy.",
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
    "default":        "Apply broad-spectrum copper fungicide @ 2g/L. Consult local agricultural extension officer."
}

def get_treatment(class_name: str) -> str:
    for key in TREATMENTS:
        if key.lower() in class_name.lower():
            return TREATMENTS[key]
    return TREATMENTS["default"]

def get_severity(confidence: float, class_name: str) -> str:
    if "healthy" in class_name.lower():
        return "None - Healthy Plant"
    if confidence > 85:
        return "High - Immediate treatment recommended"
    if confidence > 65:
        return "Moderate - Monitor closely and apply preventative spray"
    return "Low - Early stage symptoms detected"

def load_session():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")
    return ort.InferenceSession(MODEL_PATH)

def predict(session, img: Image.Image):
    img = img.convert("RGB").resize((224, 224))
    arr = (np.array(img, dtype=np.float32) / 255.0 - 0.5) / 0.5
    arr = np.transpose(arr, (2, 0, 1))
    arr = np.expand_dims(arr, axis=0)

    input_name = session.get_inputs()[0].name
    logits = session.run(None, {input_name: arr})[0][0]

    exp = np.exp(logits - np.max(logits))
    probs = exp / np.sum(exp)
    top_indices = np.argsort(probs)[::-1][:3]

    top_class = CLASS_NAMES[top_indices[0]]
    top_conf = float(probs[top_indices[0]]) * 100

    parts = top_class.split("___")
    crop = parts[0].replace("_", " ").replace("(including sour)", "").strip()
    disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

    top3 = [(CLASS_NAMES[i], float(probs[i]) * 100) for i in top_indices]

    return {
        "crop": crop,
        "disease": disease,
        "class_id": top_class,
        "confidence": top_conf,
        "severity": get_severity(top_conf, top_class),
        "treatment": get_treatment(top_class),
        "top3": top3
    }

def main():
    print("=" * 65)
    print("      PLANT LEAF DISEASE DETECTION MODEL VERIFICATION")
    print("=" * 65)

    session = load_session()
    print(f"Loaded ONNX Model: {MODEL_PATH}\n")

    # If image argument is provided
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        if not os.path.exists(img_path):
            print(f"File not found: {img_path}")
            return
        test_images = [img_path]
    else:
        sample_dir = os.path.join(os.path.dirname(__file__), "../backend/tests/sample_leaves")
        test_images = []
        if os.path.exists(sample_dir):
            for f in os.listdir(sample_dir):
                if f.lower().endswith((".jpg", ".jpeg", ".png")):
                    test_images.append(os.path.join(sample_dir, f))

        if not test_images:
            # Create a synthetic healthy leaf test image
            print("No external sample images found. Testing with synthesized healthy green leaf...")
            synth = Image.new("RGB", (224, 224), color=(34, 139, 34))
            res = predict(session, synth)
            print_result("Synthesized Green Leaf", res)
            return

    for path in test_images:
        img = Image.open(path)
        res = predict(session, img)
        print_result(os.path.basename(path), res)

def print_result(name, res):
    print(f"Image Tested  : {name}")
    print(f"Detected Crop : {res['crop']}")
    print(f"Disease Name  : {res['disease']}")
    print(f"Class ID      : {res['class_id']}")
    print(f"Confidence    : {res['confidence']:.2f}%")
    print(f"Severity      : {res['severity']}")
    print(f"Treatment     : {res['treatment']}")
    print("Top 3 Predictions:")
    for c, p in res['top3']:
        print(f"  - {c}: {p:.2f}%")
    print("-" * 65)

if __name__ == "__main__":
    main()
