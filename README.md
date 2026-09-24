# 🌿 Smart Agriculture Assistant (AgriSmart)

### AI-Powered Farmer Support System | CSP Project — CSE Department

> **Submitted by:** M Prem Kumar, P Gowthami, T Mrudula  
> **Guided by:** M Tharun Kumar Sir  
> **Department:** Computer Science & Engineering  

---

## 📌 Project Overview

**AgriSmart** is a unified, full-stack, AI-powered agricultural intelligence platform specifically designed to empower rural and semi-urban Indian farmers. By combining advanced Machine Learning, Computer Vision, ICAR Soil Science, and Generative AI, the platform delivers real-time agronomic insights, soil health conditioning, crop recommendation, leaf disease diagnosis, land valuation, and voice-guided assistance in both **English** and **Telugu (తెలుగు)**.

---

### 🌟 Key Features

- 🌾 **Crop Recommendation AI:** Suggests the highest-yielding crop based on soil nutrients (N, P, K, pH) and climatic conditions (temperature, humidity, rainfall), powered by a **Random Forest Classifier (~99.3% accuracy)**.
- 🧪 **Soil Intelligence & Land Amelioration:** Auto-detects local soil types across all Indian agro-climatic zones (Vertisols/Black, Alfisols/Red Sandy, Alluvial, Arid/Sandy) via GPS reverse-geocoding. Generates a precision **"Make Land Better" Amelioration Plan** with:
  - Organic carbon replenishment (FYM, Vermicompost, Dhaincha green manure).
  - pH correction (Gypsum for alkaline soils $\text{pH} > 7.8$, Agricultural Lime for acidic soils $\text{pH} < 6.2$).
  - Balanced NPK fertilizer schedules (Urea, DAP/SSP, MOP, Zinc Sulfate).
  - One-click **"Apply to Crop Recommendation →"** bridge that transfers soil test values directly into the Crop AI engine.
- 🔬 **Leaf Disease Detection:** Automatically identifies crop diseases from leaf photographs and provides organic and chemical remedies with precise dosage guidelines. Powered by a **CNN / MobileNetV2 Transfer Learning Model (~96.5% accuracy)**.
- 🏡 **Smart Land Valuation:** Estimates total and per-acre agricultural land value based on regional factors (state, area, soil type, irrigation tier, and road proximity) using a **Gradient Boosting Regressor ($R^2 \approx 0.91$)**.
- 🎙️ **Overhauled Voice AI Assistant (AgriSmart Companion):**
  - **Live Speech-to-Text:** Real-time interim voice transcription with animated multi-bar sound-wave visualizer.
  - **Bilingual Language Toggle:** Instant toggle between **తెలుగు (`te-IN`)** and **English (`en-IN`)**.
  - **Dual Intelligence Engine:** Integrates **Google Gemini AI Flash** when online, seamlessly falling back to the built-in **AgriSmart Offline Agronomic Engine** for instant answers on soil, crops, pest sprays, and fertilizer dosing.
  - **Voice Synthesis (TTS) & Text Fallback:** Reads out answers aloud in natural speech, complete with prompt chips and typing fallback.
- ⛅ **Live Weather & Farming Advisory:** Real-time meteorological data via OpenWeatherMap API with actionable agronomic advisories.
- 📊 **Mandi Market Price Tracker:** Live commodity trading prices across major agricultural market committees (APMC) with trend indicators.
- 🌐 **Full Bilingual Support:** Native localization in **English** and **Telugu (తెలుగు)** with automatic preference persistence.
- 📍 **Auto-Location Detection ("Detect My Farm"):** Accurate GPS geolocation with OpenStreetMap Nominatim reverse-geocoding and IP geolocation fallback.

---

## 🗂️ Project Structure

```
Smart-Agriculture-Assistant/
│
├── frontend/                       ← Modern React + Vite Single Page Application
│   ├── src/
│   │   ├── App.jsx                 ← Core UI logic, voice speech recognition & state management
│   │   ├── index.css               ← Curated responsive design system & animations
│   │   └── main.jsx                ← React root entry point
│   ├── dist/                       ← Optimized production bundle (served by FastAPI)
│   ├── index.html                  ← HTML5 template & SEO metadata
│   ├── package.json                ← Frontend package scripts & dependencies
│   └── vite.config.js              ← Vite build configuration
│
├── backend/                        ← FastAPI Python REST API
│   ├── main.py                     ← App entry point, CORS config & static bundle server
│   ├── requirements.txt            ← Backend Python dependencies
│   │
│   ├── routes/
│   │   ├── crop.py                 ← POST /api/predict/crop (Crop recommendation)
│   │   ├── disease.py              ← POST /api/predict/disease (Leaf disease detection)
│   │   ├── land.py                 ← POST /api/predict/land (Land valuation)
│   │   ├── soil.py                 ← POST /api/soil/auto-detect & /api/soil/analyze
│   │   ├── weather.py              ← GET  /api/weather (Weather & advisory)
│   │   ├── market.py               ← GET  /api/market/prices (Mandi prices)
│   │   ├── survey.py               ← POST /api/survey/submit (Farmer survey feedback)
│   │   └── chat.py                 ← POST /api/chat (Voice AI companion & agronomic engine)
│   │
│   └── ml_models/
│       ├── train_models.py         ← Machine learning training pipeline
│       ├── crop_model.pkl          ← Trained Random Forest classifier & label encoders
│       ├── land_model.pkl          ← Trained Gradient Boosting regressor
│       └── disease_model.h5        ← Leaf disease CNN / MobileNetV2 model
│
├── run_server.py                   ← Unified launcher: boots FastAPI and serves React frontend
├── Dockerfile                      ← Container deployment configuration
├── docker-compose.yml              ← Multi-container service orchestration
└── README.md
```

---

## 🔌 API Endpoints Reference

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

| Method | Endpoint | Purpose | Key Inputs / Parameters |
|:-------|:---------|:--------|:------------------------|
| `POST` | `/api/predict/crop` | Recommend optimal crop | `nitrogen`, `phosphorus`, `potassium`, `ph`, `temperature`, `humidity`, `rainfall` |
| `POST` | `/api/predict/disease` | Detect plant leaf disease | Leaf image file (`multipart/form-data`) |
| `POST` | `/api/predict/land` | Land price valuation estimation | `state`, `area_acres`, `soil_type`, `irrigation`, `distance_to_road_km` |
| `POST` | `/api/soil/auto-detect` | Auto-detect regional soil & amelioration plan | `lat`, `lon`, `city`, `state` |
| `POST` | `/api/soil/analyze` | Custom soil test report analysis | `nitrogen`, `phosphorus`, `potassium`, `ph`, `organic_carbon`, `soil_type` |
| `POST` | `/api/chat` | Bilingual Voice AI Chatbot | `message`, `location`, `weather`, `language` (`'te'` or `'en'`), `api_key` |
| `GET`  | `/api/weather` | Fetch real-time weather & advisory | `city` or coordinates |
| `GET`  | `/api/market/prices` | Crop Mandi price tracker | `category` filter (`all`, `grain`, `oilseed`, etc.) |
| `POST` | `/api/survey/submit` | Submit farmer feedback | `name`, `village`, `crop`, `challenges` |

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Python 3.8+** installed.
- **Node.js (v18+) & npm** (only required if building frontend changes).
- Active internet connection (for OpenStreetMap Nominatim, OpenWeatherMap, and Gemini AI).

### Step 1: Clone the Repository
```bash
git clone https://github.com/middepremkumar/Smart-Agriculture-Assistant.git
cd Smart-Agriculture-Assistant
```

### Step 2: Set Up Python Virtual Environment
```bash
# Create and activate virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate

# Linux / macOS:
source .venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

### Step 3: Train Machine Learning Models
Generate the predictive models (`crop_model.pkl` and `land_model.pkl`) using the integrated training pipeline:
```bash
python backend/ml_models/train_models.py
```
> **Note:** The Disease Detection model (`disease_model.h5`) can be trained using the transfer learning script in `backend/ml_models/train_models.py` or deployed with the pre-trained weights.

### Step 4: (Optional) Build Frontend Assets
The repository includes pre-built production assets in `frontend/dist/`. If you modify any frontend code in `frontend/src/`:
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 5: Configure Environment Variables
Create a `.env` file in the root directory:
```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```
- **Weather Key:** Register at [OpenWeatherMap](https://openweathermap.org/api) (free tier).
- **Gemini Key:** Generate a key at [Google AI Studio](https://aistudio.google.com/). *(Note: AgriSmart includes an intelligent offline agronomic engine that functions seamlessly even without an API key!)*

### Step 6: Start the Application
Run the unified server launcher:
```bash
python run_server.py
```
Open your browser and navigate to:
- **Application UI:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 Running with Docker

You can run the complete application inside a Docker container:

```bash
docker-compose up --build
```
Once started, visit [http://localhost:8000](http://localhost:8000).

---

## 🤖 Machine Learning & Agronomic Architecture

### 1. Crop Recommendation Model
- **Algorithm:** Random Forest Classifier (200 ensemble decision trees)
- **Features:** 7 variables ($N, P, K, \text{pH}$, temperature, humidity, rainfall)
- **Output:** Predicted crop + confidence score + balanced fertilizer advice
- **Validation Accuracy:** $\approx 99.3\%$

### 2. Leaf Disease Classification
- **Architecture:** MobileNetV2 Deep Convolutional Neural Network (Transfer Learning)
- **Input:** $224 \times 224$ RGB leaf photo
- **Classes:** 38 distinct plant-disease pairings across tomato, potato, corn, apple, etc.
- **Validation Accuracy:** $\approx 96.5\%$

### 3. Smart Land Price Regressor
- **Algorithm:** Gradient Boosting Regressor (200 estimator trees, depth = 5)
- **Features:** State, land area, soil category, irrigation level, highway proximity
- **Output:** Total land valuation (INR) & Per-acre rate (INR/acre)
- **Model Score:** $R^2 \approx 0.91$

### 4. Soil Intelligence & Amelioration Engine
- **Classification:** ICAR soil order classification mapping Vertisols, Alfisols, Inceptisols, and Aridisols.
- **Rules Engine:** Evaluates optimal nutrient thresholds ($N: 280\text{--}560$, $P: 23\text{--}56$, $K: 145\text{--}337\text{ kg/ha}$, $\text{pH}: 6.5\text{--}7.5$, $\text{OC}: > 0.75\%$) to generate customized remediation steps (Gypsum, Lime, FYM, Zinc, Bio-inoculants).

---

## 🌾 Team & Credits

| Role | Name | Responsibilities |
|:-----|:-----|:-----------------|
| **Team Lead & Full-Stack** | **M Prem Kumar** | Architecture, Voice AI Assistant, Soil Intelligence, React frontend, FastAPI backend |
| **Team Member** | **P Gowthami** | Machine Learning model pipelines, data preprocessing, model evaluation |
| **Team Member** | **T Mrudula** | Dataset curation, translation, testing & quality assurance |
| **Faculty Guide** | **M Tharun Kumar Sir** | Project guidance, domain mentorship & review |

---

*Built with passion to support Indian farmers using technology 🌾*
