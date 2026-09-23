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

def get_offline_response(message: str, location: str, weather: str, requested_lang: Optional[str] = None) -> str:
    """
    Intelligent agronomic fallback assistant for farmers without external API key or when offline.
    Supports Telugu and English queries.
    """
    text = (message or "").lower()
    
    # Detect language preference
    is_telugu = (
        requested_lang == "te" or
        any("\u0c00" <= c <= "\u0c7f" for c in message) or
        any(k in text for k in ["namaste", "andi", "telugu", "panta", "eruvulu"])
    )
    if requested_lang == "en":
        is_telugu = False

    loc_str = location if location and location != "Unknown" else ("మీ ప్రాంతం" if is_telugu else "your area")
    weather_str = weather if weather and weather != "Unknown" else ("సాధారణ వాతావరణం" if is_telugu else "normal conditions")

    # 1. Greetings
    if any(k in text for k in ["నమస్తే", "హలో", "బాగున్నారా", "hello", "hi", "namaste", "hey"]):
        if is_telugu:
            return "నమస్తే అండి! నేను అగ్రిస్మార్ట్ మీ వ్యవసాయ సహాయకుడిని. మీకు పంటలు, ఎరువులు, తెగుళ్లు, మార్కెట్ ధరలు లేదా భూమి విలువపై ఎలా సహాయపడగలను?"
        return "Hello! I am AgriSmart, your digital agriculture assistant. How can I help you today with crops, fertilizers, pest management, or market prices?"

    # 2. Fertilizer Advice
    if any(k in text for k in ["ఎరువు", "యూరియా", "డీఏపీ", "పొటాష్", "fertilizer", "urea", "dap", "potash", "npk", "nutrient"]):
        if is_telugu:
            return "వరి, మొక్కజొన్న పంటలకు యూరియా, డీఏపీ మరియు పొటాష్ సమతుల్యంగా వాడండి. విత్తే సమయంలో డీఏపీ, ఎదుగుదల మరియు పూత దశల్లో యూరియాను విభజించి వేయండి. సూక్ష్మపోషకాల లోపానికి జింక్ సల్ఫేట్ పిచికారీ చేయండి."
        return "Apply a balanced combination of Urea (Nitrogen), DAP (Phosphorus), and MOP (Potash). Apply DAP at sowing, and split Urea across active vegetative and flowering stages. Add Zinc Sulfate to prevent micronutrient deficiency."

    # 3. Crop Selection / Recommendation
    if any(k in text for k in ["పంట", "వరి", "మొక్కజొన్న", "గోధుమ", "వేరుశనగ", "crop", "plant", "recommend", "sow", "grow", "paddy", "maize", "cotton"]):
        if is_telugu:
            return f"{loc_str} వాతావరణానికి మరియు మీ నేల గుణాన్ని బట్టి తగిన పంటను ఎంచుకోండి. మా 'Crop Recommendation' ట్యాబ్‌లో మీ నేల NPK మరియు pH విలువలను నమోదు చేసి టాప్ పంటల సిఫార్సులను పొందండి."
        return f"For {loc_str} under current weather ({weather_str}), check our Crop Recommendation tool. Enter your soil NPK and pH values to see machine-learning ranked crops with fertilizer schedules."

    # 4. Plant Disease / Pest Management
    if any(k in text for k in ["తెగులు", "పురుగు", "మచ్చ", "ఆకు", "రోగం", "disease", "pest", "blight", "fungus", "spot", "insect", "rot", "spray"]):
        if is_telugu:
            return "ఆకులపై మచ్చలు లేదా బూజు తెగులు ఉంటే మాంకోజెబ్ 75 WP (2 గ్రా/లీ) లేదా కాపర్ ఆక్సీక్లోరైడ్ (2.5 గ్రా/లీ) పిచికారీ చేయండి. మా 'Disease Detection' ట్యాబ్‌లో ఆకు ఫోటో తీసి అప్‌లోడ్ చేస్తే AI ద్వారా తక్షణ పరిష్కారం లభిస్తుంది."
        return "For leaf spots or blight, spray Mancozeb 75 WP @ 2g/L or Copper Oxychloride @ 2.5g/L. You can also upload a clear photo of the infected leaf to our Disease Detection tool for instant diagnosis."

    # 5. Land Price Estimation
    if any(k in text for k in ["భూమి", "ధర", "ఎకరా", "రేటు", "వాల్యూ", "land", "price", "acre", "valuation", "worth", "cost"]):
        if is_telugu:
            return "మీ వ్యవసాయ భూమి మార్కెట్ విలువను తెలుసుకోవడానికి మా 'Land Price' ట్యాబ్‌లోని శాటిలైట్ మ్యాప్‌పై క్లిక్ చేయండి. అది సమీప రహదారి దూరం, నేల రకం మరియు నీటి వసతిని బట్టి ఖచ్చితమైన ధరను లెక్కిస్తుంది."
        return "To inspect and estimate agricultural land value, click on your farm parcel using our interactive satellite map in the Land Price Estimator. It automatically evaluates road proximity, soil quality, and aquifer access."

    # 6. Weather & Climate Advisory
    if any(k in text for k in ["వాతావరణం", "వర్షం", "ఎండ", "weather", "rain", "rainy", "forecast", "temperature", "humid"]):
        if is_telugu:
            return f"{loc_str} లో ప్రస్తుత వాతావరణం: {weather_str}. అధిక వర్ష సూచన ఉంటే పురుగుమందుల పిచికారీని వాయిదా వేయండి మరియు పొలంలో నీరు నిల్వ ఉండకుండా కాలువలను సరిచేసుకోండి."
        return f"Current conditions in {loc_str}: {weather_str}. If heavy rain is expected, postpone pesticide applications and clear field drainage channels to prevent waterlogging."

    # 7. Mandi / Market Prices
    if any(k in text for k in ["మార్కెట్", "ధరలు", "మండి", "రేట్లు", "market", "mandi", "price", "rate"]):
        if is_telugu:
            return "కర్నూలు, గుంటూరు మరియు హైదరాబాద్ వంటి ప్రధాన మార్కెట్లలో వరి, మిర్చి, పత్తి మరియు ఇతర పంటల తాజా క్వింటాల్ ధరలను మా 'Market Prices' ట్యాబ్‌లో ప్రత్యక్షంగా చూడవచ్చు."
        return "Check our Live Market Prices tab to view real-time mandi prices per quintal for paddy, chilli, cotton, pulses, and vegetables across regional trading centers."

    # 8. Government Schemes
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
    """
    key = req.api_key or x_gemini_key or os.environ.get("GEMINI_API_KEY", "")
    active_model = get_gemini_model(key) if key else None

    if active_model:
        prompt = f"""
        You are AgriSmart, an expert agricultural AI assistant designed specifically for Indian farmers.
        Context:
        - Location: {req.location}
        - Weather: {req.weather}
        - Farmer's Query: "{req.message}"
        
        Instructions:
        1. If the farmer asks in Telugu or has language='te', respond ONLY in polite, natural Telugu with respect (అండి, నమస్తే).
        2. If the farmer asks in English, respond in clear, helpful English.
        3. Keep answers concise, actionable, and practical for Indian farming conditions (1-3 sentences).
        4. Recommend real dosages (e.g. Urea, DAP, Mancozeb @ 2g/L) when asked about fertilizers or disease.
        """
        try:
            response = active_model.generate_content(prompt)
            if response and response.text:
                return {"response": response.text.strip(), "source": "Gemini AI"}
        except Exception as e:
            print(f"Gemini chat runtime note: {e}, using offline engine")

    # Offline / No API Key Engine
    ans = get_offline_response(req.message, req.location, req.weather, req.language)
    return {"response": ans, "source": "AgriSmart Offline Agronomic Engine"}
