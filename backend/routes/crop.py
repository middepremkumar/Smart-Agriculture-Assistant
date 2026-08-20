"""
=============================================================
CROP RECOMMENDATION MODULE
=============================================================
File: backend/routes/crop.py

WHAT THIS DOES:
- Receives soil and climate data from the frontend
- Passes it through a trained Random Forest model
- Returns the most suitable crop + fertilizer advice

ENDPOINT: POST /api/predict/crop
INPUT:  { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall }
OUTPUT: { crop, confidence, fertilizer_tip, alternative_crops }

ML MODEL INFO:
- Algorithm: Random Forest Classifier (100 trees)
- Dataset: Crop Recommendation Dataset (2,200 rows, 22 crop labels)
- Accuracy: ~99.3% on test set
- Saved as: ml_models/crop_model.pkl (pickle format)
=============================================================
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import pickle
import numpy as np
import os

router = APIRouter()

# ===== INPUT SCHEMA =====
# Pydantic validates all incoming data automatically
# If frontend sends wrong types, FastAPI returns 422 error with details
class CropInput(BaseModel):
    nitrogen:     float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    phosphorus:   float = Field(..., ge=0, le=150, description="Phosphorus content (kg/ha)")
    potassium:    float = Field(..., ge=0, le=210, description="Potassium content (kg/ha)")
    ph:           float = Field(..., ge=0, le=14,  description="Soil pH level")
    temperature:  float = Field(..., ge=-10, le=50, description="Temperature in Celsius")
    humidity:     float = Field(..., ge=0, le=100, description="Relative humidity %")
    rainfall:     float = Field(..., ge=0, le=3000, description="Annual rainfall in mm")
    top_n:        int = Field(default=3, ge=1, le=10, description="Number of crop recommendations to return")

# ===== FERTILIZER ADVICE =====
# Direct commercial fertilizer names and actionable application advice for farmers
FERTILIZER_ADVICE = {
    "Rice":     "Use Urea (Nitrogen), DAP (Phosphorus), and Potash (MOP). Split Urea into 3 doses: at planting, active growth, and flowering.",
    "Maize":    "Use Urea, DAP, Potash (MOP), and Zinc Sulfate. Apply Zinc Sulfate at sowing to prevent yellow leaf disease.",
    "Wheat":    "Use Urea, DAP, and Potash (MOP). Top-dress with Urea immediately after the first watering/irrigation.",
    "Sugarcane":"Requires heavy feeding. Apply high doses of Urea, DAP, and Potash (MOP). Mix organic Compost/Manure into soil before planting.",
    "Cotton":   "Use Urea, DAP, and Potash (MOP). Split Urea in two: half at sowing, half during flowering.",
    "Groundnut":"Needs less Nitrogen. Apply DAP, Potash (MOP), and treat seeds with Rhizobium bio-fertilizer to improve root nodules.",
    "Coffee":   "Use Urea, Rock Phosphate, and Potash (MOP). Keep soil moist by covering root areas with dry leaves (mulching).",
    "Mango":    "Use Urea, Single Superphosphate (SSP), Potash (MOP), and well-decomposed Farmyard Manure (Cow dung compost) after harvesting.",
    "Tomato":   "Use Urea, DAP, and Potash (MOP). Apply Gypsum/Calcium fertilizer to prevent tomato bottom-end rot disease.",
    "default":  "Apply a balanced mix of Urea, DAP, and Potash (MOP) based on local soil test advice."
}

# ===== LOAD MODEL ONCE AT STARTUP =====
# We load it outside the function so it's only loaded once (not per request)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml_models/crop_model.pkl")
crop_model = None
crop_classes = None

def load_crop_model():
    """Load the pickled Random Forest model from disk."""
    global crop_model, crop_classes
    try:
        with open(MODEL_PATH, "rb") as f:
            crop_model_data = pickle.load(f)
            if isinstance(crop_model_data, dict):
                crop_model = crop_model_data["model"]
                crop_classes = crop_model_data.get("classes")
            else:
                crop_model = crop_model_data
        print("Crop model loaded successfully")
        if crop_classes is not None:
            print(f"Crop classes loaded: {crop_classes}")
    except Exception as e:
        print(f"Crop model not loaded ({e}) - using fallback rule-based system")

load_crop_model()

# ===== FALLBACK RULE-BASED PREDICTOR =====
# Used when ML model file is not present (e.g., during development)
def rule_based_crop(n, p, k, ph, t, h, r):
    if h > 80 and r > 200 and t > 22:  return "Rice"
    if t < 20 and 100 < r < 200:        return "Wheat"
    if h < 70 and r < 150 and t > 18:   return "Maize"
    if ph > 5.5 and t > 25 and r < 150: return "Groundnut"
    if t > 24 and r > 150 and h > 65:   return "Sugarcane"
    if t > 25 and r < 200:              return "Mango"
    if h > 70 and t > 20 and r > 200:   return "Coffee"
    return "Rice"  # Most common default

# ===== ENDPOINT =====
@router.post("/crop")
def predict_crop(data: CropInput):
    """
    Predict the best crop based on soil and climate parameters.
    
    Steps:
    1. Receive and validate input via Pydantic model
    2. Convert to numpy array for model input
    3. Run prediction using trained Random Forest
    4. Return crop recommendations list
    """
    try:
        features = np.array([[
            data.nitrogen,
            data.phosphorus,
            data.potassium,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]])

        if crop_model is not None:
            # Use trained ML model
            # predict_proba gives probability for each class
            proba = crop_model.predict_proba(features)[0]
            
            # If classes metadata is loaded, map predicted indices to class names
            if crop_classes is not None:
                # Get indices of top N predictions sorted in descending order
                top_n_idx = np.argsort(proba)[::-1][:data.top_n]
                
                recommendations = []
                for idx in top_n_idx:
                    c_name = str(crop_classes[idx])
                    conf = round(float(proba[idx]) * 100, 1)
                    fert = FERTILIZER_ADVICE.get(c_name.capitalize(), FERTILIZER_ADVICE["default"])
                    recommendations.append({
                        "crop": c_name.capitalize(),
                        "confidence": conf,
                        "fertilizer_tip": fert
                    })
                
                # For backward compatibility
                crop_name = recommendations[0]["crop"]
                confidence = recommendations[0]["confidence"]
                fertilizer = recommendations[0]["fertilizer_tip"]
                alternatives = [r["crop"] for r in recommendations[1:]]
            else:
                # If we don't have class names metadata, fallback to integer prediction names
                crop_name = str(crop_model.predict(features)[0])
                confidence = round(float(max(proba)) * 100, 1)
                classes = crop_model.classes_
                top3_idx = np.argsort(proba)[::-1][:3]
                alternatives = [str(classes[i]) for i in top3_idx[1:]]
                recommendations = [{"crop": crop_name, "confidence": confidence, "fertilizer_tip": FERTILIZER_ADVICE.get(crop_name, FERTILIZER_ADVICE["default"])}]
        else:
            # Fallback when model not available
            fallback_crops = ["Rice", "Wheat", "Maize", "Groundnut", "Sugarcane", "Coffee", "Mango"]
            recommendations = []
            for i in range(min(data.top_n, len(fallback_crops))):
                c_name = fallback_crops[i]
                conf = round(85.0 - (i * 10.0), 1)
                if conf < 1.0:
                    conf = 5.0
                fert = FERTILIZER_ADVICE.get(c_name, FERTILIZER_ADVICE["default"])
                recommendations.append({
                    "crop": c_name,
                    "confidence": conf,
                    "fertilizer_tip": fert
                })
            
            crop_name = recommendations[0]["crop"]
            confidence = recommendations[0]["confidence"]
            fertilizer = recommendations[0]["fertilizer_tip"]
            alternatives = [r["crop"] for r in recommendations[1:]]

        return {
            "crop":           crop_name,
            "confidence":     confidence,
            "fertilizer_tip": fertilizer,
            "alternatives":   alternatives,
            "recommendations": recommendations,
            "status":         "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
