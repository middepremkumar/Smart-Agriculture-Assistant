from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import os

try:
    import google.generativeai as genai
except Exception as e:
    genai = None
    print(f"Voice AI model notice: google.generativeai not loaded ({e})")

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    location: str = "Unknown"
    weather: str = "Unknown"
    soil_type: Optional[str] = None
    crop: Optional[str] = None
    disease: Optional[str] = None
    api_key: Optional[str] = None
    language: Optional[str] = None

# Model cache
_cached_models = {}

def get_gemini_model(custom_key: Optional[str] = None):
    """Dynamically configure and return the best available Gemini Flash model."""
    if not genai:
        return None
    
    api_key = custom_key or os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None

    if api_key in _cached_models:
        return _cached_models[api_key]

    try:
        genai.configure(api_key=api_key)
        available = []
        try:
            available = [m.name.split("/")[-1] for m in genai.list_models()]
        except Exception as list_err:
            print(f"Gemini model list notice: {list_err}")

        preferred = [
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-pro",
            "gemini-3.6-flash"
        ]
        selected_model = "gemini-1.5-flash"
        for p_model in preferred:
            if p_model in available:
                selected_model = p_model
                break

        print(f"Configuring Gemini model: {selected_model}")
        model = genai.GenerativeModel(selected_model)
        _cached_models[api_key] = model
        return model
    except Exception as e:
        print(f"Gemini configuration error: {e}")
        return None

def get_offline_response(
    message: str, 
    location: str, 
    weather: str, 
    requested_lang: Optional[str] = None,
    soil_type: Optional[str] = None,
    crop: Optional[str] = None,
    disease: Optional[str] = None
) -> str:
    """
    Intelligent agronomic fallback assistant for farmers without external API key or when offline.
    Context-aware of detected farm location, soil profile, recommended crop, and leaf pathology.
    Supports Telugu and English queries.
    """
    text = (message or "").lower()
    
    # Detect language preference
    is_telugu = (
        requested_lang == "te" or
        any("\u0c00" <= c <= "\u0c7f" for c in message) or
        any(k in text for k in ["namaste", "andi", "telugu", "panta", "eruvulu", "matti", "nela"])
    )
    if requested_lang == "en":
        is_telugu = False

    loc_str = location if location and location != "Unknown" else ("మీ ప్రాంతం" if is_telugu else "your area")
    weather_str = weather if weather and weather != "Unknown" else ("సాధారణ వాతావరణం" if is_telugu else "normal conditions")
    crop_str = crop if crop and crop != "Unknown" else None
    soil_str = soil_type if soil_type and soil_type != "Unknown" else None
    disease_str = disease if disease and disease != "Unknown" else None

    # 1. Greetings
    if any(k in text for k in ["నమస్తే", "హలో", "బాగున్నారా", "hello", "hi", "namaste", "hey"]):
        extra = ""
        if crop_str and is_telugu:
            extra = f" మీ {crop_str} పంట మరియు నేల నిర్వహణకు నేను ఎలా సహాయపడగలను?"
        elif crop_str:
            extra = f" How can I assist you with your {crop_str} crop and soil management today?"
        
        if is_telugu:
            return f"నమస్తే అండి! నేను అగ్రిస్మార్ట్ మీ వ్యవసాయ సహాయకుడిని.{extra or ' పంటలు, ఎరువులు, తెగుళ్లు, మార్కెట్ ధరలు లేదా భూమి విలువపై మీ ప్రశ్నను అడగండి.'}"
        return f"Hello! I am AgriSmart, your digital agriculture companion.{extra or ' How can I help you today with crops, fertilizers, pest management, or market prices?'}"

    # 2. Fertilizer Advice
    if any(k in text for k in ["ఎరువు", "యూరియా", "డీఏపీ", "పొటాష్", "fertilizer", "urea", "dap", "potash", "npk", "nutrient"]):
        if crop_str:
            if is_telugu:
                return f"మీ {crop_str} పంటకు సమతుల్య ఎరువుల మోతాదు: విత్తే సమయంలో డీఏపీ (DAP) లేదా ఎస్ఎస్పీ (SSP), ఎదుగుదల మరియు పూత దశల్లో యూరియాను 2-3 దఫాలుగా విభజించి వేయండి. గింజ నాణ్యత మరియు రోగనిరోధక శక్తి కోసం పొటాష్ (MOP) వాడండి. మా 'Crop Recommendation' ట్యాబ్‌లో ఖచ్చితమైన మోతాదు వివరాలు ఉన్నాయి."
            return f"For your {crop_str} crop: apply DAP or SSP as a basal dose at sowing. Split Urea into 2-3 top-dressings during active tillering/vegetative growth and flowering. Apply MOP (Potash) to boost grain weight and disease resistance. Check our Crop Recommendation tab for exact split schedules."
        if is_telugu:
            return "వరి, మొక్కజొన్న మరియు పత్తి పంటలకు యూరియా, డీఏపీ మరియు పొటాష్ సమతుల్యంగా వాడండి. విత్తే సమయంలో డీఏపీ, ఎదుగుదల మరియు పూత దశల్లో యూరియాను విభజించి వేయండి. సూక్ష్మపోషకాల లోపానికి జింక్ సల్ఫేట్ పిచికారీ చేయండి."
        return "Apply a balanced combination of Urea (Nitrogen), DAP (Phosphorus), and MOP (Potash). Apply DAP at sowing, and split Urea across active vegetative and flowering stages. Add Zinc Sulfate to prevent micronutrient deficiency."

    # 3. Soil Health & Land Amelioration
    if any(k in text for k in ["నేల", "మట్టి", "సారం", "సారవంతం", "జిప్సం", "సున్నం", "ఆర్గానిక్", "భూసారం", "soil", "fertility", "amelioration", "organic carbon", "vertisol", "saline", "alkaline", "acidic", "gypsum", "lime"]):
        if soil_str:
            if is_telugu:
                return f"మీ పొలంలో గుర్తించబడిన నేల: {soil_str}. సేంద్రీయ కర్బనం (Organic Carbon) పెంచడానికి ఎకరాకు 5-8 టన్నుల పశువుల ఎరువు లేదా జీలుగ/జనుము పచ్చిరొట్ట ఎరువు వాడండి. క్షార/చౌడు నేలలకు జిప్సం (400-500 కిలోలు/ఎకరా), ఆమ్ల నేలలకు సున్నం వాడండి. మా 'Soil Analysis' ట్యాబ్‌లో పూర్తి భూమి మెరుగుదల ప్రణాళికను చూడండి."
            return f"For your detected {soil_str}: incorporate 5-8 tonnes/acre of well-rotted FYM or green manure (Dhaincha) to rebuild organic carbon. Apply 400-500 kg/acre Agricultural Gypsum for tight/alkaline soils, or Agricultural Lime for acidic soils. View our Soil Analysis tab for your custom Land Amelioration Plan."
        if is_telugu:
            return "మీ నేల సారం పెంచడానికి ఎకరాకు 5-8 టన్నుల పశువుల ఎరువు లేదా వర్మీకంపోస్ట్ వాడండి. నేల చౌడుగా లేదా క్షారంగా (pH > 7.8) ఉంటే ఎకరాకు 400-500 కిలోల వ్యవసాయ జిప్సం చల్లండి; ఆమ్ల నేలలకు (pH < 6.2) సున్నం వాడండి. మా 'Soil Analysis' ట్యాబ్‌లో మీ పొలం నేల పరీక్ష పూర్తి ప్రణాళికను చూడవచ్చు."
        return "To improve soil fertility and organic carbon, incorporate 5-8 tonnes/acre of well-rotted FYM or green manure (Dhaincha). For alkaline/tight clay soils (pH > 7.8), broadcast 400-500 kg/acre Agricultural Gypsum before pre-sowing irrigation. For acidic soils (pH < 6.2), apply Agricultural Lime. Check our Soil Analysis tab for your complete personalized land conditioning schedule."

    # 4. Plant Disease / Pest Management
    if any(k in text for k in ["తెగులు", "పురుగు", "మచ్చ", "ఆకు", "రోగం", "నివారణ", "disease", "pest", "blight", "fungus", "spot", "insect", "rot", "spray", "treatment"]):
        if disease_str:
            if is_telugu:
                return f"మీ పంటలో గుర్తించిన తెగులు: {disease_str}. నివారణకు వెంటనే మాంకోజెబ్ 75 WP @ 2 గ్రా/లీ లేదా కాపర్ ఆక్సీక్లోరైడ్ @ 2.5 గ్రా/లీ నీటిలో కలిపి పిచికారీ చేయండి. తెగులు సోకిన ఆకులను తీసివేయండి. మా 'Disease Detection' విభాగంలో పూర్తి చికిత్స సూచనలు చూడవచ్చు."
            return f"For the detected {disease_str}: spray Mancozeb 75 WP @ 2g/L or Copper Oxychloride @ 2.5g/L water immediately. Remove severely blighted lower leaves and ensure good field drainage. View our Disease Detection section for detailed chemical and organic remedies."
        if is_telugu:
            return "ఆకులపై మచ్చలు లేదా బూజు తెగులు ఉంటే మాంకోజెబ్ 75 WP (2 గ్రా/లీ) లేదా కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) పిచికారీ చేయండి. మా 'Disease Detection' ట్యాబ్‌లో ఆకు ఫోటో తీసి అప్‌లోడ్ చేస్తే AI ద్వారా తక్షణ పరిష్కారం లభిస్తుంది."
        return "For leaf spots or blight, spray Mancozeb 75 WP @ 2g/L or Copper Oxychloride @ 2.5g/L. You can also upload a clear photo of the infected leaf to our Disease Detection tool for instant diagnosis."

    # 5. Crop Selection / Recommendation
    if any(k in text for k in ["పంట", "వరి", "మొక్కజొన్న", "గోధుమ", "వేరుశనగ", "పత్తి", "crop", "plant", "recommend", "sow", "grow", "paddy", "maize", "cotton", "yield"]):
        if crop_str:
            if is_telugu:
                return f"మీ నేల మరియు వాతావరణానికి సిఫార్సు చేయబడిన ప్రధాన పంట: {crop_str}. దీనికి సమతుల్య NPK ఎరువులు మరియు సకాలంలో నీటి పారుదల అందించడం ద్వారా అత్యధిక దిగుబడి సాధించవచ్చు. మా 'Market Prices' ట్యాబ్‌లో దీని ప్రస్తుత మార్కెట్ ధరను చూడవచ్చు."
            return f"Top recommended crop for your farm: {crop_str}. With balanced NPK nutrition and proper furrow/drip irrigation, you can achieve optimal yields. Check our Market Prices tab to see real-time mandi prices for {crop_str}."
        if is_telugu:
            return f"{loc_str} వాతావరణానికి మరియు మీ నేల గుణాన్ని బట్టి తగిన పంటను ఎంచుకోండి. మా 'Crop Recommendation' ట్యాబ్‌లో మీ నేల NPK మరియు pH విలువలను నమోదు చేసి టాప్ పంటల సిఫార్సులను పొందండి."
        return f"For {loc_str} under current weather ({weather_str}), check our Crop Recommendation tool. Enter your soil NPK and pH values to see machine-learning ranked crops with fertilizer schedules."

    # 6. Land Price Estimation & Value Enhancement
    if any(k in text for k in ["భూమి", "ధర", "ఎకరా", "రేటు", "వాల్యూ", "విలువ", "land", "price", "acre", "valuation", "worth", "cost"]):
        if soil_str and is_telugu:
            return f"మీ భూమి ({soil_str}) విలువను మరింత పెంచడానికి డ్రిప్ లేదా బోర్వెల్ నీటి వసతిని మెరుగుపరచండి మరియు శాశ్వత కంచె, రహదారి సౌకర్యాన్ని ఏర్పరచుకోండి. మా 'Land Price' ట్యాబ్‌లోని శాటిలైట్ మ్యాప్‌పై క్లిక్ చేసి ప్రత్యక్ష మార్కెట్ ధరను లెక్కించండి."
        elif soil_str:
            return f"For your farmland with {soil_str}: land valuation is strongly boosted by borewell/canal irrigation access and direct road connectivity. Use our Land Price interactive map to evaluate parcel rates per acre."
        if is_telugu:
            return "మీ వ్యవసాయ భూమి మార్కెట్ విలువను తెలుసుకోవడానికి మా 'Land Price' ట్యాబ్‌లోని శాటిలైట్ మ్యాప్‌పై క్లిక్ చేయండి. అది సమీప రహదారి దూరం, నేల రకం మరియు నీటి వసతిని బట్టి ఖచ్చితమైన ధరను లెక్కిస్తుంది."
        return "To inspect and estimate agricultural land value, click on your farm parcel using our interactive satellite map in the Land Price Estimator. It automatically evaluates road proximity, soil quality, and aquifer access."

    # 7. Weather & Climate Advisory
    if any(k in text for k in ["వాతావరణం", "వర్షం", "ఎండ", "weather", "rain", "rainy", "forecast", "temperature", "humid"]):
        if is_telugu:
            return f"{loc_str} లో ప్రస్తుత వాతావరణం: {weather_str}. అధిక వర్ష సూచన ఉంటే పురుగుమందుల పిచికారీని వాయిదా వేయండి మరియు పొలంలో నీరు నిల్వ ఉండకుండా కాలువలను సరిచేసుకోండి."
        return f"Current conditions in {loc_str}: {weather_str}. If heavy rain is expected, postpone pesticide applications and clear field drainage channels to prevent waterlogging."

    # 8. Mandi / Market Prices
    if any(k in text for k in ["మార్కెట్", "ధరలు", "మండి", "రేట్లు", "market", "mandi", "price", "rate"]):
        if crop_str and is_telugu:
            return f"మా 'Market Prices' ట్యాబ్‌లో {crop_str} మరియు ఇతర ప్రధాన పంటల తాజా మార్కెట్ ధరలను క్వింటాల్ చొప్పున చూడవచ్చు. సమీప మార్కెట్లలో ధరల పెరుగుదల/తగ్గుదల ట్రెండ్‌లు అందుబాటులో ఉన్నాయి."
        elif crop_str:
            return f"Check our Live Market Prices tab to view real-time mandi prices per quintal for {crop_str} and related commodities across nearby trading hubs."
        if is_telugu:
            return "కర్నూలు, గుంటూరు మరియు హైదరాబాద్ వంటి ప్రధాన మార్కెట్లలో వరి, మిర్చి, పత్తి మరియు ఇతర పంటల తాజా క్వింటాల్ ధరలను మా 'Market Prices' ట్యాబ్‌లో ప్రత్యక్షంగా చూడవచ్చు."
        return "Check our Live Market Prices tab to view real-time mandi prices per quintal for paddy, chilli, cotton, pulses, and vegetables across regional trading centers."

    # 9. Government Schemes
    if any(k in text for k in ["పథకం", "పీఎం కిసాన్", "రైతు భరోసా", "సబ్సిడీ", "scheme", "pm kisan", "subsidy", "yojana", "bima"]):
        if is_telugu:
            return "పీఎం-కిసాన్ ద్వారా అర్హులైన రైతులకు ఏడాదికి ₹6,000 (3 విడతల్లో) లభిస్తుంది. పంట నష్ట పరిహారం కోసం పీఎం ఫసల్ బీమా యోజనలో నమోదు చేసుకోండి. మరిన్ని వివరాలు మా 'Government Schemes' లో అందుబాటులో ఉన్నాయి."
        return "Eligible farmers receive ₹6,000 annually via PM-KISAN. Additionally, PM Fasal Bima Yojana offers crop insurance coverage against natural calamities. View our Government Schemes section for application links."

    # Default fallback
    if is_telugu:
        return f"నమస్తే! {loc_str} రైతు సోదరులకు స్వాగతం. పంటల ఎంపిక, ఎరువుల మోతాదు, ఆకు తెగుళ్ల నివారణ లేదా మార్కెట్ ధరలపై మీ ప్రశ్నను అడగండి, నేను మీకు సహాయం చేస్తాను."
    return f"Welcome! I am AgriSmart for {loc_str}. Ask me any questions about crop choices, fertilizer doses, pest management, mandi prices, or land valuation."

@router.post("")
async def chat_with_bot(
    req: ChatRequest,
    x_gemini_key: Optional[str] = Header(None)
):
    """
    Agricultural Voice & Text AI Chatbot.
    Uses Gemini AI when API key is provided (via request body, header, or .env),
    and falls back to intelligent agronomic domain knowledge responder when offline.
    Directly incorporates farm location, weather, soil type, recommended crop, and leaf pathology.
    """
    key = req.api_key or x_gemini_key or os.environ.get("GEMINI_API_KEY", "")
    active_model = get_gemini_model(key) if key else None

    if active_model:
        prompt = f"""
        You are AgriSmart, an expert agricultural AI assistant designed specifically for Indian farmers.
        Context:
        - Location: {req.location}
        - Weather: {req.weather}
        - Farm Soil Profile: {req.soil_type or 'Not specified'}
        - Recommended / Growing Crop: {req.crop or 'Not specified'}
        - Recent Leaf Pathology / Disease: {req.disease or 'None detected'}
        - Farmer's Query: "{req.message}"
        
        Instructions:
        1. If the farmer asks in Telugu or has language='te', respond ONLY in polite, natural Telugu with respect (అండి, నమస్తే).
        2. If the farmer asks in English, respond in clear, helpful English.
        3. Keep answers concise, actionable, and practical for Indian farming conditions (1-3 sentences).
        4. Recommend real dosages (e.g. Urea, DAP, Mancozeb @ 2g/L, Gypsum @ 400-500 kg/acre) when asked about fertilizers, soil, or disease.
        5. When relevant, reference how their soil type, crop, or weather relates to their query.
        """
        try:
            response = active_model.generate_content(prompt)
            if response and response.text:
                return {"response": response.text.strip(), "source": "Gemini AI"}
        except Exception as e:
            print(f"Gemini chat runtime note: {e}, using offline engine")

    # Offline / No API Key Engine
    ans = get_offline_response(
        req.message, 
        req.location, 
        req.weather, 
        req.language,
        req.soil_type,
        req.crop,
        req.disease
    )
    return {"response": ans, "source": "AgriSmart Offline Agronomic Engine"}
