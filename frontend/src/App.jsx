import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Leaf, ShieldCheck, Thermometer, Bot, TrendingUp, IndianRupee, Sprout, 
  Microscope, CloudSun, BarChart2, TestTube, ClipboardList, Globe, 
  MapPin, Camera, AlertTriangle, CheckCircle, Banknote, Droplet, 
  Smartphone, RefreshCw, Mic, Volume2, VolumeX, Send, RotateCcw, ChevronUp, X, Menu, Check,
  Search, Navigation, Sliders, ChevronDown, Layers
} from 'lucide-react';

// ================================================
// LANGUAGE TRANSLATIONS DICTIONARY
// ================================================
const translations = {
  en: {
    heroDesc: "AI-powered crop guidance, disease detection, weather forecasting, market prices, land valuation, and soil intelligence — all in one platform designed for Indian farmers.",
    detect_farm: "Detect My Farm",
    detecting: "Locating...",
    detected: "Detected",
    nav_home: "Home",
    nav_tools: "Tools",
    nav_soil: "Soil Science",
    nav_schemes: "Schemes",
    nav_market: "Market",
    nav_contact: "Contact",
    hero_title: "Empowering Indian Farmers with Smart AI",
    voice_prompt: "Tap the mic and speak in your language!",
    voice_listen: "Listening...",
    voice_thinking: "Thinking...",
    voice_assistant_title: "AgriSmart Voice & AI Assistant",
    apply_to_crop_advisor: "Apply to Crop Recommendation →",
    nav_cta: "Try Now",
    hero_subtitle: "Empowering Indian Farmers with Smart AI",
    hero_title_1: "Smart",
    hero_title_2: "Agriculture",
    hero_title_3: "for Every",
    hero_desc: "AI-powered crop guidance, disease detection, weather forecasting, market prices, and land valuation — all in one platform designed for rural and semi-urban farmers.",
    tool_crop_title: "Crop Recommendation by Soil & Climate",
    tool_disease_title: "Plant Disease Detection by Image",
    tool_market_title: "Market Price Analysis",
    tool_land_title: "Smart Land Valuation",
    tool_soil_title: "Soil Intelligence & Land Amelioration",
    soil_auto_detect_btn: "Auto-Detect My Soil (Live Location)",
    soil_detecting: "Detecting Farmland Soil...",
    soil_amelioration_title: "Actionable Plan: How to Make Your Land Better",
    soil_top_crops_title: "Top High-Yield Crops for this Land",
    soil_manual_toggle: "Manual Soil Test Card / Lab Adjustments",
    soil_recalc_btn: "Recalculate Soil Plan",
    soil_nutrients_title: "Soil Chemistry & Health Meters",
    soil_dosages_title: "Precision Fertilizer Schedule (kg / acre)",
    crop_recommendations_title: "Crop Recommendation Results",
    crop_top_n_label: "Number of Recommendations",
    top_1_rec: "Top 1 Recommendation",
    top_3_rec: "Top 3 Recommendations",
    top_5_rec: "Top 5 Recommendations",
    btn_use_current_climate: "Use Current Climate",
    manual_city_prompt: "We couldn't detect your location automatically. Please enter your city name below:",
  },
  te: {
    heroDesc: "AI ఆధారిత పంట మార్గదర్శనం, వ్యాధి గుర్తింపు, వాతావరణ అంచనా, మార్కెట్ ధరలు, భూమి విలువ మరియు నేల విశ్లేషణ — అన్ని ఒకే వేదికపై.",
    detect_farm: "నా పొలాన్ని గుర్తించు",
    detecting: "గుర్తిస్తోంది...",
    detected: "గుర్తించబడింది",
    nav_home: "హోమ్",
    nav_tools: "సాధనాలు",
    nav_soil: "నేల విశ్లేషణ",
    nav_schemes: "పథకాలు",
    nav_market: "మార్కెట్",
    nav_contact: "సంప్రదించండి",
    hero_title: "స్మార్ట్ AIతో భారతీయ రైతులకు సాధికారత",
    voice_prompt: "మైక్‌ని నొక్కి మీ భాషలో మాట్లాడండి! (Tap the mic and speak!)",
    voice_listen: "వింటున్నాను...",
    voice_thinking: "ఆలోచిస్తున్నాను...",
    voice_assistant_title: "అగ్రిస్మార్ట్ వాయిస్ & AI సహాయకుడు",
    apply_to_crop_advisor: "ఈ విలువలను పంట సిఫార్సులో వాడండి →",
    nav_cta: "ప్రయత్నించండి",
    hero_subtitle: "స్మార్ట్ AIతో భారతీయ రైతులకు సాధికారత",
    hero_title_1: "స్మార్ట్",
    hero_title_2: "వ్యవసాయం",
    hero_title_3: "ప్రతి రైతు కోసం",
    hero_desc: "AI-ఆధారిత పంట మార్గదర్శకత్వం, వ్యాధి గుర్తింపు, వాతావరణ సూచన, మార్కెట్ ధరలు మరియు భూమి మూల్యాంకనం — గ్రామీణ రైతులకు రూపొందించబడిన ఒకే వేదిక.",
    tool_crop_title: "నేల మరియు వాతావరణం ద్వారా పంట సిఫార్సు",
    tool_disease_title: "చిత్రం ద్వారా మొక్కల వ్యాధి గుర్తింపు",
    tool_market_title: "మార్కెట్ ధరల విశ్లేషణ",
    tool_land_title: "స్మార్ట్ భూమి మూల్యాంకనం",
    tool_soil_title: "నేల విశ్లేషణ & భూమి సారం పెంపు",
    soil_auto_detect_btn: "నా నేలను గుర్తించండి (లైవ్ లొకేషన్)",
    soil_detecting: "పొలం నేలను గుర్తిస్తోంది...",
    soil_amelioration_title: "భూమిని మరింత సారవంతం చేయడానికి కార్యాచరణ ప్రణాళిక",
    soil_top_crops_title: "ఈ భూమికి అత్యధిక దిగుబడినిచ్చే పంటలు",
    soil_manual_toggle: "మ్యాన్యువల్ సాయిల్ టెస్ట్ కార్డ్ / విలువల మార్పు",
    soil_recalc_btn: "నేల ప్రణాళికను తిరిగి లెక్కించండి",
    soil_nutrients_title: "నేల పోషకాలు & ఆరోగ్య సూచికలు",
    soil_dosages_title: "ఎరువుల మోతాదు ప్రణాళిక (ఎకరాకు కిలోల్లో)",
    crop_recommendations_title: "పంట సిఫార్సు ఫలితాలు",
    crop_top_n_label: "సిఫార్సుల సంఖ్య",
    top_1_rec: "టాప్ 1 సిఫార్సు",
    top_3_rec: "టాప్ 3 సిఫార్సులు",
    top_5_rec: "టాప్ 5 సిఫార్సులు",
    btn_use_current_climate: "ప్రస్తుత వాతావరణాన్ని వాడండి",
    manual_city_prompt: "మేము మీ స్థానాన్ని స్వయంచాలకంగా గుర్తించలేకపోయాము. దయచేసి దిగువన మీ నగరం పేరును నమోదు చేయండి:",
  },
};

// ================================================
// GOVERNMENT SCHEMES DATA
// ================================================
const schemesData = [
  {
    icon: <Banknote />,
    name: "PM-KISAN",
    desc: "₹6,000/year direct income support to eligible farmer families in three equal installments.",
    link: "#",
  },
  {
    icon: <Sprout />,
    name: "PM Fasal Bima Yojana",
    desc: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage.",
    link: "#",
  },
  {
    icon: <Droplet />,
    name: "PM Krishi Sinchai Yojana",
    desc: '"Har Khet Ko Pani" — irrigation water to every field through targeted investment for irrigation.',
    link: "#",
  },
  {
    icon: <TestTube />,
    name: "Soil Health Card",
    desc: "Free soil testing and Health Card to farmers with crop-wise recommendations for nutrients.",
    link: "#",
  },
  {
    icon: <Smartphone />,
    name: "e-NAM",
    desc: "National Agriculture Market — online trading platform connecting farmers to multiple buyers.",
    link: "#",
  },
  {
    icon: <Leaf />,
    name: "Paramparagat Krishi",
    desc: "Cluster-based organic farming with financial assistance, capacity building, and market support.",
    link: "#",
  },
];

function App() {
  // State
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem("agri_lang") || "en");
  const [userLocation, setUserLocation] = useState("Unknown");
  const [locationDisplay, setLocationDisplay] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCityInput, setManualCityInput] = useState("");

  // Crop Prediction States
  const [cropTopN, setCropTopN] = useState("3");
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [cropPredicting, setCropPredicting] = useState(false);
  const [cropLocationStatus, setCropLocationStatus] = useState("Detecting your location and weather to recommend crops...");

  // Leaf Disease States
  const [diseaseFile, setDiseaseFile] = useState(null);
  const [diseasePreview, setDiseasePreview] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseAnalyzing, setDiseaseAnalyzing] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Land Valuation States
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const landAreaRef = useRef(2.5);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 15.8281, lon: 78.0373 });
  const [landAreaSlider, setLandAreaSlider] = useState(2.5);
  const [landInspectionData, setLandInspectionData] = useState(null);
  const [landInspectLoading, setLandInspectLoading] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [searchingMap, setSearchingMap] = useState(false);
  const [showManualLandForm, setShowManualLandForm] = useState(false);

  const [landState, setLandState] = useState("AP");
  const [landArea, setLandArea] = useState("2.5");
  const [landSoil, setLandSoil] = useState("1");
  const [landIrrigation, setLandIrrigation] = useState("2");
  const [landRoad, setLandRoad] = useState("1.38");
  const [landResult, setLandResult] = useState(null);
  const [landEstimating, setLandEstimating] = useState(false);

  // Weather States
  const [weatherCity, setWeatherCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Market Prices States
  const [marketFilter, setMarketFilter] = useState("all");
  const [marketData, setMarketData] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);

  // Soil Intelligence & Amelioration States
  const [soilN, setSoilN] = useState("125");
  const [soilP, setSoilP] = useState("22");
  const [soilK, setSoilK] = useState("315");
  const [soilPh, setSoilPh] = useState("8.1");
  const [soilOc, setSoilOc] = useState("0.42");
  const [soilType, setSoilType] = useState("black");
  const [soilReport, setSoilReport] = useState(null);
  const [soilLoading, setSoilLoading] = useState(false);
  const [soilLocationLabel, setSoilLocationLabel] = useState("");
  const [soilAutoDetected, setSoilAutoDetected] = useState(false);
  const [showManualSoilForm, setShowManualSoilForm] = useState(false);

  // Survey States
  const [surveyName, setSurveyName] = useState("");
  const [surveyVillage, setSurveyVillage] = useState("");
  const [surveyCrop, setSurveyCrop] = useState("");
  const [surveyChallenge, setSurveyChallenge] = useState("");
  const [surveyPhone, setSurveyPhone] = useState("");
  const [surveySuccess, setSurveySuccess] = useState(false);
  const [surveySubmitting, setSurveySubmitting] = useState(false);

  // Voice & Chat Assistant States
  const [isListening, setIsListening] = useState(false);
  const [showVoiceDrawer, setShowVoiceDrawer] = useState(false);
  const [voiceLang, setVoiceLang] = useState(currentLang === "te" ? "te-IN" : "en-IN");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [chatInputText, setChatInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botBubbleText, setBotBubbleText] = useState("");
  const [showBotBubble, setShowBotBubble] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: currentLang === "te" 
        ? "నమస్తే! నేను మీ అగ్రిస్మార్ట్ వాయిస్ & AI సహాయకుడిని. మైక్ నొక్కి మాట్లాడండి లేదా కింద ప్రశ్న రాయండి." 
        : "Namaste! I am your AgriSmart Voice & AI Companion. Tap the mic to speak in your language or type your question below.",
      time: "Just now"
    }
  ]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const currentLangRef = useRef(currentLang);
  const voiceLangRef = useRef(voiceLang);
  const userLocationRef = useRef(userLocation);
  const weatherDataRef = useRef(weatherData);
  const messagesEndRef = useRef(null);

  // Stable memoized background floating particles
  const heroParticles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.round(((i * 7 + 13) % 7) + 3),
      left: `${((i * 37 + 19) % 94) + 3}%`,
      animationDuration: `${12 + (i % 8) * 2}s`,
      animationDelay: `-${(i % 5) * 4}s`
    }));
  }, []);

  // Keep references updated for async callbacks
  useEffect(() => {
    currentLangRef.current = currentLang;
  }, [currentLang]);

  useEffect(() => {
    voiceLangRef.current = voiceLang;
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLang;
    }
  }, [voiceLang]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    weatherDataRef.current = weatherData;
  }, [weatherData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, liveTranscript]);

  // Translate helper
  const t = (key) => translations[currentLang]?.[key] || key;

  // Speak aloud & audio controls
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
      setIsSpeaking(false);
    }
  };

  const speakText = (text, lang = "te-IN") => {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    setIsSpeaking(false);

    // Give browser audio queue 60ms to cancel previous buffer cleanly
    setTimeout(() => {
      try {
        const cleanText = text.replace(/[*#_~`]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang;
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices() || [];
        const isTe = lang.startsWith("te");
        let matchedVoice = null;
        if (isTe) {
          matchedVoice = voices.find(v => v.lang && (v.lang.startsWith("te") || v.name.toLowerCase().includes("telugu")));
        }
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.lang && (v.lang.includes("en-IN") || v.name.toLowerCase().includes("india")));
        }
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (err) => {
          console.warn("TTS audio error:", err);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("TTS speak exception:", e);
        setIsSpeaking(false);
      }
    }, 60);
  };

  // Switch language
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem("agri_lang", lang);
    const vLang = lang === "te" ? "te-IN" : "en-IN";
    setVoiceLang(vLang);
    const msg = lang === "te" ? "భాష తెలుగులోకి మార్చబడింది." : "Language changed to English.";
    speakText(msg, vLang);
  };

  // Scroll animations observer & Scroll Top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            e.target.style.animationDelay = `${i * 0.1}s`;
            e.target.classList.add("fade-in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".feature-card, .scheme-card, .tech-card, .step").forEach((el) => {
      observer.observe(el);
    });

    // Load initial market list
    fetchMarketPrices(marketFilter);

    // Initial live weather prefetch so weather display is active immediately on load
    fetchWeatherDirect("Kurnool").then((wData) => {
      if (wData) {
        setWeatherCity("Kurnool");
        predictCrop("Kurnool", wData);
      }
    });

    // Auto-detect location after 1 sec
    const timer = setTimeout(() => {
      autoDetectLocation();
    }, 1000);

    // Fallback: if location auto-detection hangs/fails, show manual input after 6 seconds
    const fallbackTimer = setTimeout(() => {
      if (userLocationRef.current === "Unknown") {
        triggerManualInputFallback();
      }
    }, 6000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = voiceLang;

      rec.onstart = () => {
        setIsListening(true);
        isRecognizingRef.current = true;
        setLiveTranscript("");
        setBotBubbleText(voiceLangRef.current === "te-IN" ? "వింటున్నాను... మాట్లాడండి" : "Listening... Speak now");
        setShowBotBubble(true);
      };

      rec.onresult = async (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (interim) {
          setLiveTranscript(interim);
          setBotBubbleText(`"${interim}..."`);
        }
        if (final) {
          setLiveTranscript("");
          setBotBubbleText(`"${final}"`);
          handleSendChatMessage(final);
        }
      };

      rec.onerror = (event) => {
        console.warn("Speech recognition error event:", event.error);
        isRecognizingRef.current = false;
        setIsListening(false);

        let errMsg = "Didn't catch that. Tap to try again.";
        if (event.error === "not-allowed") {
          errMsg = voiceLangRef.current === "te-IN"
            ? "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ URL బార్‌లోని లాక్ ఐకాన్‌పై క్లిక్ చేసి మైక్ అనుమతించండి."
            : "Microphone access blocked. Please allow mic permission in your browser address bar.";
        } else if (event.error === "no-speech") {
          errMsg = voiceLangRef.current === "te-IN"
            ? "ధ్వని వినిపించలేదు. దయచేసి మైక్ దగ్గర స్పష్టంగా మాట్లాడండి."
            : "No voice detected. Please speak clearly into your microphone.";
        } else if (event.error === "audio-capture") {
          errMsg = voiceLangRef.current === "te-IN"
            ? "మైక్రోఫోన్ హార్డ్‌వేర్ కనుగొనబడలేదు. దయచేసి మైక్ ప్లగ్ చేయండి."
            : "No microphone hardware detected. Please connect a microphone.";
        } else if (event.error === "network") {
          errMsg = voiceLangRef.current === "te-IN"
            ? "నెట్‌వర్క్ సమస్య. దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి."
            : "Speech recognition network error. Please check your internet connection.";
        }
        setBotBubbleText(errMsg);
      };

      rec.onend = () => {
        isRecognizingRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Voice AI Bot Toggle
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support the Speech Recognition Web API. You can still type your questions in the assistant chat drawer!");
      setShowVoiceDrawer(true);
      return;
    }

    setShowVoiceDrawer(true);

    if (isListening || isRecognizingRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.warn("Stop recognition exception:", err);
      }
      setIsListening(false);
      isRecognizingRef.current = false;
    } else {
      stopSpeaking();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = voiceLangRef.current;
          recognitionRef.current.start();
          isRecognizingRef.current = true;
          setIsListening(true);
          setLiveTranscript("");
          setBotBubbleText(voiceLangRef.current === "te-IN" ? "వింటున్నాను... మాట్లాడండి" : "Listening... Speak now");
          setShowBotBubble(true);
        }
      } catch (err) {
        console.warn("Start recognition exception:", err);
        try { recognitionRef.current?.stop(); } catch (_) {}
        isRecognizingRef.current = false;
        setIsListening(false);
      }
    }
  };

  const handleSendChatMessage = async (text) => {
    if (!text || !text.trim()) return;
    const userMsg = text.trim();
    setChatInputText("");
    setShowVoiceDrawer(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now() + "-user", sender: "user", text: userMsg, time: timeStr }
    ]);

    await sendToChatbot(userMsg);
  };

  const handleChatFormSubmit = (e) => {
    e.preventDefault();
    handleSendChatMessage(chatInputText);
  };

  const sendToChatbot = async (text) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBotBubbleText(voiceLangRef.current === "te-IN" ? "ఆలోచిస్తున్నాను..." : "Thinking...");
    try {
      const headers = { "Content-Type": "application/json" };
      if (geminiApiKey) {
        headers["x-gemini-key"] = geminiApiKey;
      }
      const langCode = voiceLangRef.current.startsWith("te") ? "te" : "en";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
          location: userLocationRef.current,
          weather: weatherDataRef.current ? weatherDataRef.current.description : "Unknown",
          soil_type: soilReport?.soil_profile?.name || undefined,
          crop: cropRecommendations.length > 0 && !cropRecommendations[0].error ? cropRecommendations[0].crop : undefined,
          disease: diseaseResult?.disease || undefined,
          api_key: geminiApiKey || undefined,
          language: langCode,
        }),
      });
      const data = await res.json();
      const botResponse = data.response || (voiceLangRef.current === "te-IN" 
        ? "మీ వ్యవసాయ ప్రశ్నకు సమాధానం సిద్ధంగా ఉంది." 
        : "I am here to help you with your crops, soil, and fertilizers.");

      setBotBubbleText(botResponse);
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + "-bot", sender: "bot", text: botResponse, time: timeStr, source: data.source }
      ]);
      speakText(botResponse, voiceLangRef.current);
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = voiceLangRef.current === "te-IN" 
        ? "నమస్తే, సర్వర్ కనెక్ట్ కావడంలో ఇబ్బందిగా ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి." 
        : "Sorry, I am having trouble connecting to the agronomic server. Please try again.";
      setBotBubbleText(errMsg);
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + "-bot", sender: "bot", text: errMsg, time: timeStr }
      ]);
    }
  };

  // SPOTLIGHT CARD EFFECT Mouse Handler
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  // CROP PREDICTION TRIGGER
  const predictCrop = async (cityVal = null, weatherObj = null) => {
    setCropPredicting(true);

    const activeCity = cityVal || (userLocation !== "Unknown" ? userLocation.split(",")[0].trim() : "Default");
    
    // Deterministic hash function to generate consistent NPK values for the same city
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const locSeed = hashCode(activeCity);

    // Helper to generate values based on seed
    const seededValue = (seed, min, max, offset = 0) => {
      const val = ((seed + offset) % 1000) / 1000;
      return Math.round(min + val * (max - min));
    };

    // Seeded soil parameters
    const n = seededValue(locSeed, 35, 130, 1);
    const p = seededValue(locSeed, 25, 75, 2);
    const k = seededValue(locSeed, 25, 80, 3);
    const ph = +(seededValue(locSeed, 56, 76, 4) / 10).toFixed(1);

    // Climate parameters
    let tVal = 25;
    let hVal = 70;
    let rVal = 120;

    const baseRainfall = seededValue(locSeed, 45, 210, 5);

    const activeWeather = weatherObj || weatherDataRef.current || weatherData;

    if (activeWeather) {
      tVal = activeWeather.temperature;
      hVal = activeWeather.humidity;
      rVal = Math.round(baseRainfall + (activeWeather.rain_chance * 0.9));
    }

    const locLabelName = userLocation !== "Unknown" ? userLocation : activeCity;
    const climateStr = activeWeather
      ? `(${tVal}°C, ${hVal}% Humidity, ~${rVal}mm Rainfall)`
      : `(Using regional average climate conditions)`;

    setCropLocationStatus(`
      Recommending crops for ${locLabelName} ${climateStr}
    `);

    try {
      const res = await fetch("/api/predict/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          ph: ph,
          temperature: tVal,
          humidity: hVal,
          rainfall: rVal,
          top_n: parseInt(cropTopN)
        }),
      });
      const data = await res.json();
      if (data.recommendations) {
        setCropRecommendations(data.recommendations);
      } else {
        setCropRecommendations([]);
      }
    } catch (err) {
      console.error("Crop API Error:", err);
      setCropRecommendations([{ error: true, message: err.message }]);
    } finally {
      setCropPredicting(false);
    }
  };

  // Explicitly fetch and apply real-time weather to crop recommendation
  const handleTakeRealtimeWeather = async () => {
    setCropPredicting(true);
    const targetCity = weatherCity.trim() || (userLocation !== "Unknown" ? userLocation.split(",")[0].trim() : "Kurnool");
    const freshWeather = await fetchWeatherDirect(targetCity);
    if (freshWeather) {
      setWeatherData(freshWeather);
      weatherDataRef.current = freshWeather;
      await predictCrop(freshWeather.city, freshWeather);
    } else {
      await predictCrop(targetCity);
    }
  };

  // Sync crop top N changes
  useEffect(() => {
    if (userLocation !== "Unknown" || weatherData !== null) {
      predictCrop();
    }
  }, [cropTopN]);

  // SOIL AUTO-DETECTION HELPER
  const detectSoilFromLocation = async (lat = null, lon = null, city = null, state = null) => {
    setSoilLoading(true);
    try {
      const payload = {};
      if (lat != null && lon != null) {
        payload.lat = parseFloat(lat);
        payload.lon = parseFloat(lon);
      }
      if (city) payload.city = city;
      if (state) payload.state = state;

      const res = await fetch("/api/soil/auto-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.status === 200 && data.status === "success") {
        setSoilReport(data);
        setSoilLocationLabel(data.location_detected?.place_name || "Detected Farmland");
        setSoilAutoDetected(true);
        if (data.soil_chemistry) {
          setSoilN(data.soil_chemistry.nitrogen.toString());
          setSoilP(data.soil_chemistry.phosphorus.toString());
          setSoilK(data.soil_chemistry.potassium.toString());
          setSoilPh(data.soil_chemistry.ph.toString());
          setSoilOc(data.soil_chemistry.organic_carbon.toString());
        }
        if (data.soil_profile?.type_code) {
          setSoilType(data.soil_profile.type_code);
        }
      }
    } catch (err) {
      console.error("Soil auto-detect error:", err);
    } finally {
      setSoilLoading(false);
    }
  };

  const handleLiveSoilDetection = () => {
    if (!navigator.geolocation) {
      detectSoilFromLocation(null, null, userLocation !== "Unknown" ? userLocation.split(",")[0].trim() : "Kurnool", null);
      return;
    }
    setSoilLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        detectSoilFromLocation(lat, lon, null, null);
      },
      (err) => {
        console.warn("Soil GPS prompt denied or error:", err.message);
        detectSoilFromLocation(null, null, userLocation !== "Unknown" ? userLocation.split(",")[0].trim() : "Kurnool", null);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // Initial soil load for default location (Kurnool, AP)
  useEffect(() => {
    detectSoilFromLocation(15.8281, 78.0373, "Kurnool", "Andhra Pradesh");
  }, []);

  // GEOLOCATION
  const autoDetectLocation = async () => {
    if (locationLoading) return;
    setLocationLoading(true);

    const handleSuccess = async (city, region, lat = null, lon = null) => {
      const formattedLoc = `${city}, ${region}`;
      setUserLocation(formattedLoc);
      setLocationDisplay(formattedLoc);
      
      setWeatherCity(city);
      const wData = await fetchWeatherDirect(city);

      speakText(
        `Location detected as ${city}. I am AgriSmart. How can I help you today?`,
        currentLangRef.current === "te" ? "te-IN" : "en-IN"
      );

      // Trigger crop recommendations with these new values
      predictCrop(city, wData);

      // Auto-detect real soil profile for this location
      detectSoilFromLocation(lat, lon, city, region);

      setLocationLoading(false);
    };

    const fetchWithTimeout = (url, timeout = 8000) => {
      return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeout)),
      ]);
    };

    const fallbackToIP = async () => {
      try {
        let city = "";
        let region = "";
        let lat = null;
        let lon = null;

        // Primary IP service: ipwho.is (reliable, free, non-rate-limited)
        try {
          const res = await fetchWithTimeout("https://ipwho.is/", 5000);
          const data = await res.json();
          if (data && data.success !== false && data.city) {
            city = data.city;
            region = data.region || "";
            if (data.latitude && data.longitude) {
              lat = data.latitude;
              lon = data.longitude;
            }
          }
        } catch (e1) {
          console.warn("ipwho.is lookup failed, trying secondary:", e1);
        }

        // Secondary IP service: ipapi.co
        if (!city) {
          try {
            const res = await fetchWithTimeout("https://ipapi.co/json/", 4000);
            const data = await res.json();
            if (data && data.city && !data.error) {
              city = data.city;
              region = data.region || "";
              if (data.latitude && data.longitude) {
                lat = data.latitude;
                lon = data.longitude;
              }
            }
          } catch (e2) {
            console.warn("ipapi.co lookup failed:", e2);
          }
        }

        // Guaranteed fallback city
        if (!city) {
          city = "Kurnool";
          region = "Andhra Pradesh";
          lat = 15.8281;
          lon = 78.0373;
        }

        await handleSuccess(city, region, lat, lon);
      } catch (e) {
        console.error("IP Location Error:", e);
        setLocationLoading(false);
        await handleSuccess("Kurnool", "Andhra Pradesh", 15.8281, 78.0373);
      }
    };

    if (!navigator.geolocation) {
      await fallbackToIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const res = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
            5000
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.village || addr.town || addr.city || addr.suburb || addr.county || "Your Area";
          const state = addr.state || "";
          await handleSuccess(city, state, lat, lon);
        } catch (e) {
          console.error("Nominatim Geocode Error:", e);
          await fallbackToIP();
        }
      },
      async (err) => {
        console.warn("GPS coordinate access not granted or timed out:", err.message);
        await fallbackToIP();
      },
      { timeout: 6000, enableHighAccuracy: false }
    );
  };

  const triggerManualInputFallback = () => {
    setShowManualInput(true);
    setCropLocationStatus(
      currentLangRef.current === "te"
        ? "ఆటో-లొకేషన్ చాలా సమయం తీసుకుంది. దయచేసి పైన మీ నగరాన్ని నమోదు చేయండి."
        : "Auto-detection took too long. Please enter your city manually above."
    );
  };

  // Weather query directly helper
  const fetchWeatherDirect = async (city) => {
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (res.status === 200) {
        const wData = await res.json();
        setWeatherData(wData);
        return wData;
      }
    } catch (err) {
      console.error("Weather load error:", err);
    }
    return null;
  };

  // Weather search form
  const handleWeatherSearch = async (e) => {
    e.preventDefault();
    if (!weatherCity.trim()) {
      alert("Enter a city name");
      return;
    }
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(weatherCity)}`);
      const data = await res.json();
      if (res.status !== 200) {
        alert(data.detail || "City not found");
        return;
      }
      setWeatherData(data);
      setUserLocation(data.city);
      setShowManualInput(false);
      
      // Auto recommend crops
      await predictCrop(data.city, data);
    } catch (err) {
      alert("API Error: " + err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Manual fallback crop recommendation
  const handleManualCropRecommend = async (e) => {
    e.preventDefault();
    if (!manualCityInput.trim()) {
      alert("Please enter a city name");
      return;
    }
    setCropPredicting(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(manualCityInput)}`);
      if (res.status === 200) {
        const data = await res.json();
        setWeatherData(data);
        setUserLocation(data.city);
        setWeatherCity(data.city);
        setShowManualInput(false);
        await predictCrop(data.city, data);
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "City not found");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setCropPredicting(false);
    }
  };

  // Leaf Disease image handler
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDiseaseFile(file);
    setDiseasePreview(URL.createObjectURL(file));
    setDiseaseResult(null); // Reset previous results
  };

  const handleDiseaseDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setDiseaseFile(file);
      setDiseasePreview(URL.createObjectURL(file));
      setDiseaseResult(null);
    }
  };

  const analyzeDisease = async () => {
    if (!diseaseFile) return;
    setDiseaseAnalyzing(true);
    const formData = new FormData();
    formData.append("file", diseaseFile);
    if (geminiApiKey) {
      formData.append("custom_gemini_key", geminiApiKey);
    }
    try {
      const headers = {};
      if (geminiApiKey) headers["x-gemini-key"] = geminiApiKey;
      const res = await fetch("/api/predict/disease", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      if (res.status === 200) {
        setDiseaseResult(data);
      } else {
        alert("Server error: " + data.detail);
      }
    } catch (err) {
      alert("API Error: " + err.message);
    } finally {
      setDiseaseAnalyzing(false);
    }
  };

  // Indian currency formatting helper
  const formatIndianCurrency = (num) => {
    if (!num && num !== 0) return "₹0";
    const n = Math.round(Number(num));
    if (n >= 10000000) {
      return `₹${(n / 10000000).toFixed(2)} Cr`;
    } else if (n >= 100000) {
      return `₹${(n / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${n.toLocaleString("en-IN")}`;
  };

  // Spatial inspection of farm coordinates
  const inspectLand = async (lat, lon, area) => {
    const acres = area !== undefined ? parseFloat(area) : (landAreaRef.current || 2.5);
    setSelectedCoords({ lat, lon });
    setLandInspectLoading(true);
    try {
      const res = await fetch("/api/predict/land/inspect-coords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          area_acres: acres
        })
      });
      const data = await res.json();
      if (res.status === 200) {
        setLandInspectionData(data);
        setLandResult(data.valuation);
        setLandState(data.detected_state || "AP");
        setLandArea(acres.toString());
        if (data.detected_soil?.code) {
          setLandSoil(data.detected_soil.code.toString());
        }
        if (data.detected_irrigation?.code) {
          setLandIrrigation(data.detected_irrigation.code.toString());
        }
        if (data.road_distance_km !== undefined) {
          setLandRoad(data.road_distance_km.toString());
        }
      } else {
        console.error("Land inspect error:", data);
      }
    } catch (err) {
      console.error("Land inspect request failed:", err);
    } finally {
      setLandInspectLoading(false);
    }
  };

  const jumpToLocation = (lat, lon, zoom = 14) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], zoom, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      }
    }
    inspectLand(lat, lon, landAreaRef.current);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        jumpToLocation(latitude, longitude, 15);
      },
      (err) => {
        alert("Could not access GPS location. Please click directly on the satellite map or search your town.");
      }
    );
  };

  const handleMapSearch = async (e) => {
    if (e) e.preventDefault();
    if (!mapSearchQuery.trim()) return;
    setSearchingMap(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery + ", India")}&limit=1`);
      const results = await res.json();
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        jumpToLocation(lat, lon, 14);
      } else {
        alert("Location not found. Try searching a district, mandal, or village name.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed: " + err.message);
    } finally {
      setSearchingMap(false);
    }
  };

  const handleAreaSliderChange = (newArea) => {
    const val = parseFloat(newArea);
    setLandAreaSlider(val);
    landAreaRef.current = val;
    setLandArea(val.toString());
    if (landInspectionData && landInspectionData.valuation) {
      const perAcre = landInspectionData.valuation.per_acre || 0;
      const newTotal = Math.round(perAcre * val);
      setLandInspectionData(prev => ({
        ...prev,
        area_acres: val,
        valuation: {
          ...prev.valuation,
          total_value: newTotal,
          total_formatted: formatIndianCurrency(newTotal),
        }
      }));
    }
  };

  // Initialize Satellite Leaflet Map
  useEffect(() => {
    let checkTimer;
    const initMap = () => {
      const mapContainer = document.getElementById("land-map");
      if (!mapContainer || mapRef.current) return;
      if (typeof window === "undefined" || !window.L) {
        checkTimer = setTimeout(initMap, 200);
        return;
      }

      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }

      const initialLat = 15.8281;
      const initialLon = 78.0373;

      const map = window.L.map("land-map", {
        center: [initialLat, initialLon],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Esri Satellite Imagery
      window.L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Esri Satellite"
        }
      ).addTo(map);

      // Esri Labels & Boundaries
      window.L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          opacity: 0.85
        }
      ).addTo(map);

      // Custom pulsing radar pin
      const radarIcon = window.L.divIcon({
        className: "custom-radar-pin",
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div class="pin-radar-ring"></div>
            <div class="pin-dot"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = window.L.marker([initialLat, initialLon], { icon: radarIcon }).addTo(map);
      markerRef.current = marker;
      mapRef.current = map;

      // Invalidate size after mount to ensure crisp layout
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 350);

      // Inspect initial coordinates
      inspectLand(initialLat, initialLon, landAreaRef.current);

      // Map click handler
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        inspectLand(lat, lng, landAreaRef.current);
      });
    };

    initMap();

    return () => {
      if (checkTimer) clearTimeout(checkTimer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Manual land valuation estimator
  const handleLandEstimate = async (e) => {
    e.preventDefault();
    if (!landState || !landArea) {
      alert("Please fill out the State and Area fields.");
      return;
    }
    setLandEstimating(true);
    try {
      const res = await fetch("/api/predict/land", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: landState,
          area_acres: parseFloat(landArea),
          soil_type: parseInt(landSoil),
          irrigation: parseInt(landIrrigation),
          road_km: parseFloat(landRoad || 0),
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setLandResult(data);
        const stateLabels = {
          AP: "Andhra Pradesh", TS: "Telangana", KA: "Karnataka",
          TN: "Tamil Nadu", MH: "Maharashtra", UP: "Uttar Pradesh",
          PB: "Punjab", RJ: "Rajasthan", GJ: "Gujarat"
        };
        const soilLabels = ["Black Cotton Soil", "Red Sandy/Loam", "Loamy Soil", "Sandy / Arid", "Alluvial Soil"];
        const irrLabels = ["Canal Irrigation", "Borewell / Tube-well", "Rain-fed", "Drip / Micro-irrigation"];
        const sName = stateLabels[landState] || landState;
        const soilName = soilLabels[parseInt(landSoil) - 1] || "Agricultural Soil";
        const irrName = irrLabels[parseInt(landIrrigation) - 1] || "Borewell";
        const roadDist = parseFloat(landRoad || 0);

        setLandInspectionData(prev => {
          if (!prev) {
            return {
              place_name: `${sName} Farmland Parcel`,
              detected_state: landState,
              detected_state_name: sName,
              area_acres: parseFloat(landArea),
              road_distance_km: roadDist,
              road_access_level: `${roadDist} km from Access Road`,
              detected_soil: { name: soilName, fertility: "Fertile agricultural tract" },
              detected_irrigation: { name: irrName, type: "Active water source" },
              valuation: {
                total_value: data.total_value,
                total_formatted: data.total_formatted || formatIndianCurrency(data.total_value),
                per_acre: data.per_acre,
                per_acre_formatted: data.per_acre_formatted || formatIndianCurrency(data.per_acre),
                confidence: data.confidence || "High Accuracy"
              }
            };
          }
          return {
            ...prev,
            detected_state: landState,
            detected_state_name: sName,
            area_acres: parseFloat(landArea),
            road_distance_km: roadDist,
            road_access_level: `${roadDist} km from Access Road`,
            detected_soil: { ...prev.detected_soil, name: soilName },
            detected_irrigation: { ...prev.detected_irrigation, name: irrName },
            valuation: {
              ...prev.valuation,
              ...data,
              total_formatted: data.total_formatted || formatIndianCurrency(data.total_value),
              per_acre_formatted: data.per_acre_formatted || formatIndianCurrency(data.per_acre),
            }
          };
        });
      } else {
        alert("Valuation failed: " + data.detail);
      }
    } catch (err) {
      alert("API Error: " + err.message);
    } finally {
      setLandEstimating(false);
    }
  };

  // Market prices fetch
  const fetchMarketPrices = async (category) => {
    setMarketLoading(true);
    try {
      const res = await fetch(`/api/market/prices?category=${category}`);
      const data = await res.json();
      if (res.status === 200) {
        setMarketData(data.data);
      }
    } catch (err) {
      console.error("Market fetch error:", err);
    } finally {
      setMarketLoading(false);
    }
  };

  const handleMarketFilterChange = (e) => {
    const val = e.target.value;
    setMarketFilter(val);
    fetchMarketPrices(val);
  };

  // Soil analysis customized / manual submission
  const handleSoilAnalysis = async (e) => {
    e.preventDefault();
    const n = parseFloat(soilN);
    const p = parseFloat(soilP);
    const k = parseFloat(soilK);
    const ph = parseFloat(soilPh);
    const oc = parseFloat(soilOc || 0.45);

    if (isNaN(n) || isNaN(p) || isNaN(k) || isNaN(ph)) {
      alert("Please enter valid numeric values for Nitrogen, Phosphorus, Potassium, and pH.");
      return;
    }

    setSoilLoading(true);
    try {
      const res = await fetch("/api/soil/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          ph: ph,
          organic_carbon: oc,
          soil_type: soilType,
          location_name: soilLocationLabel || "Custom Farmland"
        }),
      });
      const data = await res.json();
      if (res.status === 200 && data.status === "success") {
        setSoilReport(data);
        setSoilAutoDetected(false);
        setShowManualSoilForm(false);
      } else {
        const errDetail = Array.isArray(data.detail)
          ? data.detail.map(d => `${d.loc?.slice(-1)[0] || 'Field'}: ${d.msg}`).join("\n")
          : (data.detail || "Unable to analyze soil.");
        alert("Soil analysis error:\n" + errDetail);
      }
    } catch (err) {
      alert("API Error: " + err.message);
    } finally {
      setSoilLoading(false);
    }
  };

  // Farmer feedback survey submit
  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    if (!surveyName || !surveyVillage || !surveyChallenge) {
      alert("Please fill all required fields");
      return;
    }
    setSurveySubmitting(true);
    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: surveyName,
          village: surveyVillage,
          crop: surveyCrop,
          challenge: surveyChallenge,
          phone_access: surveyPhone,
          language: currentLang
        }),
      });
      if (res.ok) {
        setSurveySuccess(true);
        // Reset form
        setSurveyName("");
        setSurveyVillage("");
        setSurveyCrop("");
        setSurveyChallenge("");
        setSurveyPhone("");
      }
    } catch (err) {
      alert("Failed to submit");
    } finally {
      setSurveySubmitting(false);
    }
  };

  const scrollToSection = (id_) => {
    document.querySelector(id_)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  // ===== CROSS-MODULE FEATURE INTERLINKING HELPERS =====
  const handleJumpToMandi = (cropName, category = "all") => {
    if (category && category !== "all") {
      setMarketFilter(category);
      fetchMarketPrices(category);
    } else {
      setMarketFilter("all");
      fetchMarketPrices("all");
    }
    scrollToSection("#market");
  };

  const handleJumpToDisease = (cropName) => {
    scrollToSection("#disease");
  };

  const handleJumpToSoilForCrop = (idealSoilId) => {
    if (idealSoilId) {
      const soilMap = { 1: "black", 2: "red", 3: "loam", 4: "sandy", 5: "alluvial" };
      if (soilMap[idealSoilId]) setSoilType(soilMap[idealSoilId]);
    }
    scrollToSection("#soil");
  };

  const handleAskVoiceAboutCrop = (cropName) => {
    setShowVoiceDrawer(true);
    const q = voiceLangRef.current === "te-IN"
      ? `${cropName} పంట దిగుబడి పెంచడానికి ఎరువుల సమయం మరియు సలహా ఇవ్వండి.`
      : `What is the best irrigation, fertilizer split, and yield advice for ${cropName}?`;
    handleSendChatMessage(q);
  };

  const handleAskVoiceAboutDisease = (cropType, diseaseName) => {
    setShowVoiceDrawer(true);
    const q = voiceLangRef.current === "te-IN"
      ? `${cropType} లో ${diseaseName} తెగులు నివారణకు సరైన పిచికారీ మందులు మరియు జాగ్రత్తలు ఏమిటి?`
      : `How do I treat ${diseaseName} on ${cropType} with exact chemical spray and organic steps?`;
    handleSendChatMessage(q);
  };

  const handleAskVoiceAboutSoil = () => {
    setShowVoiceDrawer(true);
    const q = voiceLangRef.current === "te-IN"
      ? "నా పొలం నేల సారం పెంచడానికి మరియు చౌడు/ఆమ్లతను సరిచేయడానికి ప్రణాళిక చెప్పండి."
      : "How do I implement my soil amelioration plan and apply Gypsum or FYM on my land?";
    handleSendChatMessage(q);
  };

  const handleAskVoiceAboutLand = () => {
    setShowVoiceDrawer(true);
    const loc = landInspectionData?.place_name || userLocation;
    const q = voiceLangRef.current === "te-IN"
      ? `${loc} లో నా వ్యవసాయ భూమి మార్కెట్ విలువ మరియు దిగుబడిని ఎలా పెంచుకోవచ్చు?`
      : `What farm improvements can best increase the agricultural market value of my land in ${loc}?`;
    handleSendChatMessage(q);
  };

  const handleAskVoiceAboutWeather = () => {
    setShowVoiceDrawer(true);
    const loc = weatherData?.city || userLocation;
    const q = voiceLangRef.current === "te-IN"
      ? `${loc} లో ఈరోజు ఉన్న వాతావరణానికి పురుగుమందులు లేదా ఎరువులు పిచికారీ చేయవచ్చా?`
      : `Based on current weather in ${loc}, is it suitable for pesticide and foliar fertilizer spraying today?`;
    handleSendChatMessage(q);
  };

  const handleApplySoilToLand = () => {
    if (soilReport?.soil_profile?.type_id) {
      setLandSoil(String(soilReport.soil_profile.type_id));
    }
    if (soilReport?.location_detected?.lat && soilReport?.location_detected?.lon) {
      setSelectedCoords({
        lat: soilReport.location_detected.lat,
        lon: soilReport.location_detected.lon
      });
      inspectLandCoords(soilReport.location_detected.lat, soilReport.location_detected.lon, landAreaSlider);
    }
    scrollToSection("#land");
  };

  const handleInspectParcelSoil = () => {
    if (selectedCoords?.lat && selectedCoords?.lon) {
      fetchAutoSoil(selectedCoords.lat, selectedCoords.lon);
    }
    scrollToSection("#soil");
  };

  const handleInspectParcelCrops = () => {
    predictCrop(landInspectionData?.place_name || null);
    scrollToSection("#crop");
  };

  return (
    <>
      {/* ===== NAVIGATION ===== */}
      <nav>
        <div className="nav-logo" onClick={() => scrollToSection("#home")} style={{ cursor: "pointer" }}>
          <span className="leaf"><Leaf size={24} /></span>
          <span>AgriSmart</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }}>{t("nav_home")}</a></li>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("#features"); }}>{t("nav_tools")}</a></li>
          <li><a href="#soil" onClick={(e) => { e.preventDefault(); scrollToSection("#soil"); }}>{t("nav_soil")}</a></li>
          <li><a href="#schemes" onClick={(e) => { e.preventDefault(); scrollToSection("#schemes"); }}>{t("nav_schemes")}</a></li>
          <li><a href="#market" onClick={(e) => { e.preventDefault(); scrollToSection("#market"); }}>{t("nav_market")}</a></li>
          <li><a href="#survey" onClick={(e) => { e.preventDefault(); scrollToSection("#survey"); }}>{t("nav_contact")}</a></li>
        </ul>
        <div className="nav-right">
          <a href="#crop" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollToSection("#crop"); }}>{t("nav_cta")}</a>
          <button className="hamburger" onClick={() => setMobileNavOpen(true)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`} id="mobileNav">
        <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}><X size={28} /></button>
        <a href="#features" onClick={() => scrollToSection("#features")}>Features</a>
        <a href="#soil" onClick={() => scrollToSection("#soil")}>Soil Science</a>
        <a href="#crop" onClick={() => scrollToSection("#crop")}>Crop AI</a>
        <a href="#disease" onClick={() => scrollToSection("#disease")}>Disease</a>
        <a href="#weather" onClick={() => scrollToSection("#weather")}>Weather</a>
        <a href="#market" onClick={() => scrollToSection("#market")}>Market</a>
        <a href="#schemes" onClick={() => scrollToSection("#schemes")}>Schemes</a>
        <a href="#survey" onClick={() => scrollToSection("#survey")}>Survey</a>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section id="home">
        <div id="hero">
          <div className="particles">
            {heroParticles.map((p) => (
              <div 
                key={p.id} 
                className="particle" 
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: p.left,
                  animationDuration: p.animationDuration,
                  animationDelay: p.animationDelay
                }} 
              />
            ))}
          </div>
          <div className="container">
            <div className="hero-content text-left">
              <div className="hero-tag">
                <span className="icon"><ShieldCheck size={16} /></span>AI-Powered Agricultural Intelligence
              </div>
              <h1 className="hero-title">
                <span>{t("hero_title_1")}</span>{' '}
                <span className="accent">{t("hero_title_2")}</span><br />
                <span>{t("hero_title_3")}</span>{' '}
                <span className="earth-accent">Farmer</span>
              </h1>
              <p className="hero-desc">{t("heroDesc")}</p>
              <div className="hero-actions">
                <a href="#crop" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollToSection("#crop"); }}>
                  <Sprout size={18} /> Try Crop Advisor
                </a>
                <a href="#features" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollToSection("#features"); }}>
                  Explore Features →
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Smart Features</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">38</span>
                  <span className="stat-label">Crops Covered</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Disease Accuracy</span>
                </div>
              </div>
            </div>
          </div>
          {/* Floating cards */}
          <div className="floating-card fc-1" onClick={() => scrollToSection("#weather")}>
            <span className="icon"><Thermometer size={16} /></span>Live Weather Updates
          </div>
          <div className="floating-card fc-2" onClick={() => scrollToSection("#disease")}>
            <span className="icon"><Bot size={16} /></span>AI Disease Detection
          </div>
          <div className="floating-card fc-3" onClick={() => scrollToSection("#market")}>
            <span className="icon"><TrendingUp size={16} /></span>Market Prices
          </div>
          <div className="floating-card fc-4" onClick={() => scrollToSection("#land")}>
            <span className="icon"><IndianRupee size={16} /></span>Land Valuation
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section id="features">
        <div className="container">
          <div className="features-header">
            <p className="section-subtitle">What we offer</p>
            <h2 className="section-title">Everything a Farmer Needs</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#crop")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><Sprout size={24} /></div>
              <div className="feature-name">Crop Recommendation</div>
              <p className="feature-desc">
                Input soil NPK, pH, temperature & rainfall to get the most
                suitable crop for your land powered by ML.
              </p>
              <div className="feature-link">Try it <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#disease")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><Microscope size={24} /></div>
              <div className="feature-name">Disease Detection</div>
              <p className="feature-desc">
                Upload a leaf photo. Our CNN model identifies diseases instantly
                with 95%+ accuracy and gives treatment tips.
              </p>
              <div className="feature-link">Try it <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#land")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><IndianRupee size={24} /></div>
              <div className="feature-name">Land Price Prediction</div>
              <p className="feature-desc">
                Estimate land value based on location, size, water source, and
                soil quality using regression models.
              </p>
              <div className="feature-link">Try it <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#weather")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><CloudSun size={24} /></div>
              <div className="feature-name">Weather Forecast</div>
              <p className="feature-desc">
                Real-time 7-day weather including temperature, humidity, wind
                speed, and farming advisories.
              </p>
              <div className="feature-link">View <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#market")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><BarChart2 size={24} /></div>
              <div className="feature-name">Market Price Tracker</div>
              <p className="feature-desc">
                Live mandi prices for 50+ crops across major agricultural markets
                updated daily.
              </p>
              <div className="feature-link">View <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#soil")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><TestTube size={24} /></div>
              <div className="feature-name">Soil Analysis</div>
              <p className="feature-desc">
                Enter soil parameters and receive fertilizer recommendations and
                crop suitability scores.
              </p>
              <div className="feature-link">Try it <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => scrollToSection("#schemes")}>
              <div className="spotlight"></div>
              <div className="feature-icon"><ClipboardList size={24} /></div>
              <div className="feature-name">Government Schemes</div>
              <p className="feature-desc">
                Stay updated on PM-Kisan, Fasal Bima, and other central & state
                agricultural schemes.
              </p>
              <div className="feature-link">View <span>→</span></div>
            </div>

            <div className="feature-card" onMouseMove={handleCardMouseMove} onClick={() => changeLanguage(currentLang === 'te' ? 'en' : 'te')}>
              <div className="spotlight"></div>
              <div className="feature-icon"><Globe size={24} /></div>
              <div className="feature-name">Telugu Support</div>
              <p className="feature-desc">
                Full bilingual interface in English and Telugu so every farmer can
                use the platform comfortably.
              </p>
              <div className="feature-link">Switch <span>→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CROP RECOMMENDATION ===== */}
      <section id="crop" className="tool-section">
        <div className="container">
          <div className="tool-layout">
            <div className="tool-content text-left">
              <div className="tool-badge">
                <span className="badge badge-green">
                  <Sprout size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> AI Powered
                </span>
              </div>
              <h2 className="tool-title">
                {t("tool_crop_title")}
              </h2>
              <p className="tool-desc">
                Our Random Forest model trained on 2,200+ data points analyzes
                your soil's nitrogen, phosphorus, potassium, pH, humidity,
                temperature, and rainfall to predict the best crop with high
                accuracy.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> 38 crop types supported
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> Real-time predictions via API
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> Fertilizer suggestions included
                </li>
              </ul>
            </div>
            <div className="tool-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <div style={{ display: "flex", justifySpaceBetween: "space-between", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px", textAlign: "left" }}>
                <h4 style={{ margin: 0 }}>{t("crop_recommendations_title")}</h4>
                <div style={{ margin: 0, width: "auto", display: "inline-flex", alignItems: "center", gap: "8px", flexDirection: "row-reverse" }}>
                  <select 
                    className="form-select" 
                    id="crop-top-n" 
                    value={cropTopN}
                    onChange={(e) => setCropTopN(e.target.value)}
                    style={{ padding: "6px 12px 6px 8px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)", margin: 0, height: "auto", width: "160px", background: "rgba(10,46,26,0.6)", color: "var(--white)", border: "1px solid rgba(46,204,113,0.2)" }}
                  >
                    <option value="1">{t("top_1_rec")}</option>
                    <option value="3">{t("top_3_rec")}</option>
                    <option value="5">{t("top_5_rec")}</option>
                  </select>
                  <label className="form-label" style={{ position: "static", fontSize: "0.8rem", color: "var(--gray-400)", fontWeight: 500, transform: "none", marginRight: "4px" }}>
                    {t("crop_top_n_label")}
                  </label>
                </div>
              </div>

              <div style={{ fontSize: "0.9rem", color: "var(--gray-300)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(46, 204, 113, 0.05)", padding: "10px 12px", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--green-500)", lineHeight: "1.4", textAlign: "left" }}>
                <MapPin size={16} style={{ color: "var(--green-400)", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>
                      {currentLang === "te" ? "సిఫార్సు పంటలు:" : "Recommending crops for"}{' '}
                      <strong>{userLocation !== "Unknown" ? userLocation : "Detected Location"}</strong>{' '}
                      {weatherData 
                        ? `(${weatherData.temperature}°C, ${weatherData.humidity}% Humidity, ~${Math.round(120 + (weatherData.rain_chance * 0.9))}mm Rain)`
                        : `(Using regional average climate conditions)`}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontStyle: "italic", fontWeight: 500 }}>
                    {currentLang === "te" 
                      ? "(తప్పా? దిగువ వాతావరణ విభాగంలో మీ నగరాన్ని శోధించండి)" 
                      : "(Not correct? Search your city in the weather section below)"}
                  </span>
                </div>
              </div>

              {showManualInput && (
                <div style={{ marginBottom: "16px", background: "rgba(10, 46, 26, 0.2)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px dashed rgba(46, 204, 113, 0.2)", textAlign: "left" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--gray-400)", marginBottom: "8px" }}>
                    {t("manual_city_prompt")}
                  </p>
                  <form onSubmit={handleManualCropRecommend} style={{ display: "flex", gap: "8px" }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Kurnool" 
                      value={manualCityInput}
                      onChange={(e) => setManualCityInput(e.target.value)}
                      style={{ flex: 1, padding: "10px 12px", background: "rgba(10,46,26,0.6)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: "var(--radius-sm)", color: "var(--white)", fontSize: "0.9rem" }} 
                    />
                    <button type="submit" className="btn-primary" style={{ padding: "10px 16px", margin: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Sprout size={14} /> Recommend
                    </button>
                  </form>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, minWidth: "220px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px 18px" }}
                  onClick={handleTakeRealtimeWeather}
                  disabled={cropPredicting}
                >
                  {cropPredicting ? <span className="spinner"></span> : <CloudSun size={16} />} 
                  {currentLang === "te" ? "రియల్-టైమ్ వాతావరణాన్ని తీసుకోండి" : "Take Real-Time Weather"}
                </button>
                {soilReport && (
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px 16px", borderColor: "rgba(46,204,113,0.4)", color: "var(--green-400)" }}
                    onClick={() => {
                      if (soilReport.soil_chemistry) {
                        setSoilN(String(soilReport.soil_chemistry.nitrogen));
                        setSoilP(String(soilReport.soil_chemistry.phosphorus));
                        setSoilK(String(soilReport.soil_chemistry.potassium));
                        setSoilPh(String(soilReport.soil_chemistry.ph));
                      }
                      predictCrop();
                    }}
                    title="Import N, P, K, pH from latest Soil Analysis test"
                  >
                    <TestTube size={14} /> {currentLang === "te" ? "నేల పరీక్ష NPK వాడండి" : "Import Soil Test NPK"}
                  </button>
                )}
                <button
                  className="btn-outline"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px 16px" }}
                  onClick={() => predictCrop()}
                  disabled={cropPredicting}
                  title="Recalculate recommendations"
                >
                  <RefreshCw size={14} /> {currentLang === "te" ? "రిఫ్రెష్" : "Refresh"}
                </button>
              </div>

              <div className="result-box visible" style={{ marginTop: 0, display: "block", background: "transparent", border: "none", padding: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {cropRecommendations.length > 0 ? (
                    cropRecommendations.map((item, idx) => {
                      if (item.error) {
                        return (
                          <div key={idx} className="result-sub" style={{ color: "var(--red-400)", textAlign: "center" }}>
                            Error fetching recommendations: {item.message}
                          </div>
                        );
                      }
                      const cropImgFile = item.crop.toLowerCase() + ".png";
                      const cropImgPath = `/assets/images/${cropImgFile}`;
                      return (
                        <div key={idx} className="crop-rec-item" style={{ textAlign: "left" }}>
                          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                            <img 
                              src={cropImgPath} 
                              alt={item.crop} 
                              className="crop-rec-img" 
                              onError={(e) => { e.target.src = '/assets/images/rice.png'; }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div className="crop-rec-header" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span className="crop-rec-name" style={{ fontWeight: "700" }}>{idx + 1}. {item.crop}</span>
                                <span className="crop-rec-conf" style={{ fontSize: "0.85rem", color: "var(--green-400)", fontWeight: "600" }}>
                                  {currentLang === "te" ? "విశ్వసనీయత" : "Confidence"}: {item.confidence}%
                                </span>
                              </div>
                              <div className="crop-rec-bar-bg" style={{ background: "rgba(255,255,255,0.06)", height: "6px", borderRadius: "99px", overflow: "hidden", margin: "8px 0" }}>
                                <div className="crop-rec-bar" style={{ width: `${item.confidence}%`, background: "var(--green-500)", height: "100%", borderRadius: "99px", transition: "width 1s ease" }}></div>
                              </div>
                              <div className="crop-rec-tip" style={{ fontSize: "0.8rem", color: "var(--gray-300)", marginTop: "4px" }}>
                                <strong>{currentLang === "te" ? "ఎరువుల చిట్కా" : "Fertilizer Tip"}:</strong> {item.fertilizer_tip}
                              </div>
                              {/* Feature Cross-Links */}
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                                <button
                                  type="button"
                                  className="btn-link-action"
                                  onClick={() => handleJumpToMandi(item.crop, item.interlinks?.mandi_category)}
                                  title="Check real-time Mandi market rates for this crop"
                                >
                                  💰 {currentLang === "te" ? "మార్కెట్ ధరలు" : "Mandi Prices"}
                                </button>
                                <button
                                  type="button"
                                  className="btn-link-action"
                                  onClick={() => handleJumpToDisease(item.crop)}
                                  title="Scan leaf for diseases"
                                >
                                  🔬 {currentLang === "te" ? "ఆకు తెగుళ్లు" : "Disease Scanner"}
                                </button>
                                <button
                                  type="button"
                                  className="btn-link-action"
                                  onClick={() => handleAskVoiceAboutCrop(item.crop)}
                                  title="Ask Voice AI about this crop"
                                >
                                  🎙️ {currentLang === "te" ? "వాయిస్ సలహా" : "Ask Voice AI"}
                                </button>
                                <button
                                  type="button"
                                  className="btn-link-action"
                                  onClick={() => handleJumpToSoilForCrop(item.interlinks?.ideal_soil_id)}
                                  title="Check ideal soil conditioning for this crop"
                                >
                                  🧪 {currentLang === "te" ? "నేల సరిపోలిక" : "Soil Plan"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="result-sub" style={{ textAlign: "center" }}>
                      Please wait, detecting location & climate conditions...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DISEASE DETECTION ===== */}
      <section id="disease" className="tool-section">
        <div className="container">
          <div className="tool-layout reverse">
            <div className="tool-content text-left">
              <div className="tool-badge">
                <span className="badge badge-earth">
                  <Microscope size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> CNN Model
                </span>
              </div>
              <h2 className="tool-title">
                {t("tool_disease_title")}
              </h2>
              <p className="tool-desc">
                Upload a clear photo of the affected leaf. Our Convolutional
                Neural Network trained on the PlantVillage dataset (54,000+
                images) classifies 38 disease categories across 14 plant species.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> 38 disease categories
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> Treatment recommendations
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "start", fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)" }}>✓</span> Confidence score shown
                </li>
              </ul>
            </div>
            <div className="tool-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ margin: 0, textAlign: "left" }}>Upload Leaf Image</h4>
                <button
                  type="button"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "6px",
                    color: geminiApiKey ? "var(--green-400)" : "var(--gray-300)",
                    fontSize: "0.75rem",
                    padding: "4px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                  title="Switch between Local 14-species CNN and 1M+ Multimodal Vision AI"
                >
                  {geminiApiKey ? "⚡ 1M+ AI Vision Active" : "⚙️ 1M+ Dataset Mode"}
                </button>
              </div>

              {showKeyInput && (
                <div style={{ marginBottom: "12px", padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "left" }}>
                  <label style={{ fontSize: "0.78rem", color: "var(--gray-200)", display: "block", marginBottom: "4px", fontWeight: 500 }}>
                    Gemini Vision API Key (Unlocks 1M+ Multimodal Dataset for Mango, Guava, Cotton, etc.):
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="password"
                      placeholder="Paste free Gemini API key here..."
                      value={geminiApiKey}
                      onChange={(e) => {
                        setGeminiApiKey(e.target.value);
                        localStorage.setItem("gemini_api_key", e.target.value);
                      }}
                      style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "0.8rem" }}
                    />
                    {geminiApiKey && (
                      <button
                        type="button"
                        onClick={() => { setGeminiApiKey(""); localStorage.removeItem("gemini_api_key"); }}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "none", borderRadius: "6px", cursor: "pointer" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginTop: "4px" }}>
                    Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: "var(--green-400)", textDecoration: "underline" }}>aistudio.google.com</a>
                  </div>
                </div>
              )}
              <div
                className="upload-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDiseaseDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{ cursor: "pointer" }}
              >
                <div className="upload-icon"><Camera size={36} /></div>
                <div className="upload-text">
                  Click or drag & drop a leaf photo here
                </div>
                <div className="upload-sub">JPG, PNG, WEBP — max 5MB</div>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </div>
              {diseasePreview && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <img
                    src={diseasePreview}
                    alt="Preview"
                    style={{ maxHeight: "180px", borderRadius: "10px", margin: "0 auto" }}
                  />
                  <button
                    onClick={analyzeDisease}
                    className="btn-primary"
                    style={{ width: "100%", marginTop: "12px" }}
                    disabled={diseaseAnalyzing}
                  >
                    {diseaseAnalyzing ? <span className="spinner"></span> : <Microscope size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />} 
                    Analyze Disease
                  </button>
                </div>
              )}
              {diseaseResult && (
                <div className="result-box visible" style={{ textAlign: "left" }}>
                  <div className="result-title">Detected Disease</div>
                  <div className="result-value" style={{ textTransform: "capitalize" }}>
                    {diseaseResult.crop_type}: {diseaseResult.disease}
                  </div>
                  <div className="result-sub" style={{ marginTop: "6px" }}>
                    <strong>Treatment:</strong> {diseaseResult.treatment} <br />
                    <span style={{ fontSize: "0.8rem", color: "var(--green-400)", display: "inline-block", marginTop: "6px" }}>
                      Confidence: {diseaseResult.confidence}% | Severity: {diseaseResult.severity}
                    </span>
                    {diseaseResult.symptoms && (
                      <div style={{ marginTop: "8px", fontSize: "0.85rem", opacity: 0.9 }}>
                        <strong>Symptoms:</strong> {diseaseResult.symptoms}
                      </div>
                    )}
                    {diseaseResult.note && (
                      <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(234, 179, 8, 0.12)", borderLeft: "3px solid #eab308", borderRadius: "6px", fontSize: "0.82rem", color: "#fef08a", lineHeight: 1.4 }}>
                        {diseaseResult.note}
                      </div>
                    )}
                    {diseaseResult.engine && (
                      <div style={{ marginTop: "8px", fontSize: "0.75rem", opacity: 0.65 }}>
                        Engine: {diseaseResult.engine}
                      </div>
                    )}
                    {/* Disease Cross-Links */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => handleAskVoiceAboutDisease(diseaseResult.crop_type, diseaseResult.disease)}
                        title="Ask Voice AI for spoken step-by-step spray instructions"
                      >
                        🎙️ {currentLang === "te" ? "వాయిస్ చికిత్స సలహా" : "Voice Treatment Guide"}
                      </button>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => scrollToSection("#soil")}
                        title="Check soil potash and micronutrients to build disease resistance"
                      >
                        🧪 {currentLang === "te" ? "నేల రోగనిరోధకత" : "Check Soil Potash"}
                      </button>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => scrollToSection("#crop")}
                        title="Check alternate resistant crops in Crop Recommendation"
                      >
                        🌾 {currentLang === "te" ? "పంట సిఫార్సు" : "Alternate Crops"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SATELLITE LAND PRICE & SPATIAL AI ===== */}
      <section id="land" className="tool-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: "2rem" }}>
            <div className="tool-badge" style={{ display: "inline-block", marginBottom: "8px" }}>
              <span className="badge badge-earth">
                <Globe size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                Spatial Satellite AI • 1-Click Valuation
              </span>
            </div>
            <h2 className="section-title">Satellite Land Price & Soil Estimator</h2>
            <p className="section-desc" style={{ maxWidth: "780px", margin: "0 auto" }}>
              Click or tap on any agricultural land or farm parcel across India. Our spatial intelligence automatically calculates highway/road distance, detects aquifer irrigation potential, and classifies regional agro-ecological soil zones to generate an accurate ML market valuation.
            </p>
          </div>

          <div className="land-layout">
            {/* LEFT COLUMN: SATELLITE MAP */}
            <div className="land-map-wrapper">
              {/* Map controls overlay */}
              <div className="map-control-overlay">
                <form onSubmit={handleMapSearch} className="map-search-bar">
                  <Search size={16} color="#2ecc71" style={{ alignSelf: "center" }} />
                  <input
                    type="text"
                    className="map-search-input"
                    placeholder="Search district, mandal, or village in India (e.g., Kurnool, Warangal)..."
                    value={mapSearchQuery}
                    onChange={(e) => setMapSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ padding: "4px 12px", fontSize: "0.78rem", minHeight: "unset", borderRadius: "99px" }}
                    disabled={searchingMap}
                  >
                    {searchingMap ? <span className="spinner" style={{ width: "12px", height: "12px" }}></span> : "Search"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    title="Find My Location"
                    className="btn-glass"
                    style={{ padding: "4px 10px", fontSize: "0.78rem", minHeight: "unset", borderRadius: "99px", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Navigation size={12} color="#2ecc71" /> Locate Me
                  </button>
                </form>

                {/* Quick Indian Agricultural Hubs */}
                <div className="map-quick-tags">
                  <span style={{ fontSize: "0.7rem", color: "var(--gray-300)", alignSelf: "center", marginRight: "2px" }}>Quick Hubs:</span>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(15.8281, 78.0373)}>Kurnool, AP</button>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(16.3067, 80.4365)}>Guntur, AP</button>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(17.9689, 79.5941)}>Warangal, TS</button>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(11.0168, 76.9558)}>Coimbatore, TN</button>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(19.9975, 73.7898)}>Nashik, MH</button>
                  <button type="button" className="map-tag-btn" onClick={() => jumpToLocation(30.9010, 75.8573)}>Ludhiana, PB</button>
                </div>
              </div>

              {/* The Leaflet Canvas */}
              <div id="land-map"></div>

              {/* Click instruction floating pill */}
              <div className="map-click-hint">
                <MapPin size={13} color="#2ecc71" />
                <span>Click anywhere on farmland to inspect instantly</span>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE INSPECTION & VALUATION CARD */}
            <div className="inspection-card" style={{ position: "relative" }}>
              {landInspectLoading && (
                <div className="land-scanner-overlay">
                  <div className="spinner" style={{ width: "24px", height: "24px" }}></div>
                  <div className="land-scanner-line"></div>
                  <span>Inspecting satellite telemetry & soil grid...</span>
                </div>
              )}

              {/* Location & GPS Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-300)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Detected Farm Location
                  </div>
                  <h3 style={{ margin: "2px 0 0 0", fontSize: "1.15rem", fontWeight: "700", color: "#fff" }}>
                    {landInspectionData?.place_name || "Pinpointed Farm Parcel"}
                  </h3>
                </div>
                <div className="badge badge-earth" style={{ fontSize: "0.72rem", padding: "4px 8px", whiteSpace: "nowrap" }}>
                  📍 {selectedCoords.lat.toFixed(4)}, {selectedCoords.lon.toFixed(4)}
                </div>
              </div>

              {/* Valuation Hero Box */}
              <div className="land-inspect-hero">
                <div style={{ fontSize: "0.75rem", color: "var(--gray-300)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Estimated Fair Market Valuation
                </div>
                <div className="land-val-total">
                  {landInspectionData?.valuation?.total_formatted || formatIndianCurrency(landInspectionData?.valuation?.total_value || 0)}
                </div>
                <div className="land-val-sub">
                  <span><strong>{landInspectionData?.valuation?.per_acre_formatted || "₹0 / Acre"}</strong> per acre</span>
                  <span>•</span>
                  <span className="land-val-badge">
                    {landInspectionData?.valuation?.confidence || "High Accuracy"} Confidence
                  </span>
                </div>
              </div>

              {/* Dynamic Acreage Slider */}
              <div className="land-slider-box">
                <label>
                  <span>Selected Farm Size</span>
                  <span style={{ color: "#2ecc71", fontSize: "0.95rem" }}>{landAreaSlider} Acres</span>
                </label>
                <input
                  type="range"
                  min="0.25"
                  max="50"
                  step="0.25"
                  value={landAreaSlider}
                  onChange={(e) => handleAreaSliderChange(e.target.value)}
                />
                <div className="land-slider-presets">
                  {[0.5, 1, 2.5, 5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-chip ${landAreaSlider === preset ? "active" : ""}`}
                      onClick={() => handleAreaSliderChange(preset)}
                    >
                      {preset} Ac
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Spatial Intelligence Grid */}
              <div className="feature-badge-row">
                <div className="feature-pill">
                  <div className="feature-pill-label">Nearest Road Distance</div>
                  <div className="feature-pill-val">
                    {landInspectionData?.road_distance_km !== undefined ? `${landInspectionData.road_distance_km} km` : "Detecting..."}
                  </div>
                  <div className="feature-pill-sub">
                    {landInspectionData?.road_access_level || (landInspectionData?.road_distance_km <= 0.5 ? "Immediate Access" : landInspectionData?.road_distance_km <= 2 ? "Good Rural Access" : "Interior Farm Track")}
                  </div>
                </div>

                <div className="feature-pill">
                  <div className="feature-pill-label">Irrigation & Aquifer</div>
                  <div className="feature-pill-val">
                    {landInspectionData?.detected_irrigation?.name || "Borewell Potential"}
                  </div>
                  <div className="feature-pill-sub">
                    {landInspectionData?.detected_irrigation?.type || "Groundwater Source"}
                  </div>
                </div>

                <div className="feature-pill">
                  <div className="feature-pill-label">Regional Soil Classification</div>
                  <div className="feature-pill-val">
                    {landInspectionData?.detected_soil?.name || "Black Soil"}
                  </div>
                  <div className="feature-pill-sub">
                    {landInspectionData?.detected_soil?.fertility || "High Moisture Retention"}
                  </div>
                </div>

                <div className="feature-pill">
                  <div className="feature-pill-label">Administrative Zone</div>
                  <div className="feature-pill-val">
                    {landInspectionData?.detected_state_name || landInspectionData?.detected_state || "Andhra Pradesh"}
                  </div>
                  <div className="feature-pill-sub">
                    Agro-Climatic Reg. Zone
                  </div>
                </div>
              </div>

              {/* Land Spatial Cross-Links */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "14px 0" }}>
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={handleInspectParcelSoil}
                  title="Run precision soil test & amelioration plan for this parcel's GPS"
                >
                  🧪 {currentLang === "te" ? "ఈ భూమి నేల పరీక్ష" : "Analyze Parcel Soil"}
                </button>
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={handleInspectParcelCrops}
                  title="Recommend optimal crops for this parcel"
                >
                  🌾 {currentLang === "te" ? "తగిన పంటలు" : "Recommend Crops"}
                </button>
                <button
                  type="button"
                  className="btn-link-action"
                  onClick={handleAskVoiceAboutLand}
                  title="Ask Voice AI how to boost this land's yield and value"
                >
                  🎙️ {currentLang === "te" ? "వాయిస్ AI సలహా" : "Ask Voice AI"}
                </button>
              </div>

              {/* Manual Override / Tuning Accordion */}
              <div>
                <button
                  type="button"
                  className="land-accordion-toggle"
                  onClick={() => setShowManualLandForm(!showManualLandForm)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sliders size={14} color="#2ecc71" />
                    Fine-tune attributes or override manually
                  </span>
                  {showManualLandForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showManualLandForm && (
                  <form onSubmit={handleLandEstimate} style={{ marginTop: "12px", background: "rgba(0,0,0,0.2)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="form-group" style={{ marginBottom: "10px" }}>
                      <select 
                        className="form-select" 
                        value={landState} 
                        onChange={(e) => setLandState(e.target.value)}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="AP">Andhra Pradesh</option>
                        <option value="TS">Telangana</option>
                        <option value="KA">Karnataka</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="MH">Maharashtra</option>
                        <option value="UP">Uttar Pradesh</option>
                        <option value="PB">Punjab</option>
                        <option value="RJ">Rajasthan</option>
                        <option value="GJ">Gujarat</option>
                      </select>
                      <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>State / Region</label>
                    </div>

                    <div className="form-row" style={{ marginBottom: "10px" }}>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-input"
                          value={landArea}
                          onChange={(e) => {
                            setLandArea(e.target.value);
                            if (e.target.value) setLandAreaSlider(parseFloat(e.target.value));
                          }}
                          placeholder=" "
                          step="0.1"
                          min="0.1"
                          required
                        />
                        <label className="form-label">Area (Acres)</label>
                      </div>
                      <div className="form-group">
                        <select 
                          className="form-select"
                          value={landSoil}
                          onChange={(e) => setLandSoil(e.target.value)}
                        >
                          <option value="1">Black Cotton Soil</option>
                          <option value="2">Red Soil</option>
                          <option value="3">Loamy Soil</option>
                          <option value="4">Sandy Soil</option>
                          <option value="5">Alluvial Soil</option>
                        </select>
                        <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>Soil Type</label>
                      </div>
                    </div>

                    <div className="form-row" style={{ marginBottom: "12px" }}>
                      <div className="form-group">
                        <select 
                          className="form-select"
                          value={landIrrigation}
                          onChange={(e) => setLandIrrigation(e.target.value)}
                        >
                          <option value="1">Canal Irrigated</option>
                          <option value="2">Borewell Irrigated</option>
                          <option value="3">Rain-fed</option>
                          <option value="4">Drip Irrigated</option>
                        </select>
                        <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>Irrigation</label>
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-input"
                          value={landRoad}
                          onChange={(e) => setLandRoad(e.target.value)}
                          placeholder=" "
                          step="0.1"
                          min="0"
                        />
                        <label className="form-label">Road Distance (km)</label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: "100%", padding: "8px" }}
                      disabled={landEstimating}
                    >
                      {landEstimating ? <span className="spinner"></span> : <IndianRupee size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />} 
                      Recalculate Value
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WEATHER ===== */}
      <section id="weather" className="tool-section">
        <div className="container">
          <div className="tool-layout reverse">
            <div className="tool-content text-left">
              <div className="tool-badge">
                <span className="badge badge-green">
                  <CloudSun size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> Live Data
                </span>
              </div>
              <h2 className="tool-title">Real-time Weather<br />& Farm Advisory</h2>
              <p className="tool-desc">
                Enter your city or let us detect your location. Get current
                conditions plus a 7-day forecast with specific farming advisories
                like irrigation need, pest risk warnings, and harvesting windows.
              </p>
            </div>
            <div className="weather-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <form onSubmit={handleWeatherSearch} style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <input
                  type="text"
                  className="form-input"
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  placeholder="Enter city e.g. Kurnool"
                  style={{ flex: 1 }}
                  required
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "10px 20px" }}
                  disabled={weatherLoading}
                >
                  {weatherLoading ? <span className="spinner"></span> : "Go"}
                </button>
              </form>
              <div id="weather-display" style={{ textAlign: "center" }}>
                <div className="weather-icon"><CloudSun size={64} style={{ color: "var(--green-400)", margin: "0 auto" }} /></div>
                <div className="weather-temp">{weatherData ? `${weatherData.temperature}°C` : "—°C"}</div>
                <div style={{ fontSize: "1.1rem", color: "var(--gray-300)", marginTop: "4px" }}>
                  {weatherData ? `${weatherData.description} in ${weatherData.city}` : "Enter city to load weather"}
                </div>
                <div className="weather-detail" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "20px" }}>
                  <div className="weather-item">
                    <strong>{weatherData ? `${weatherData.humidity}%` : "—%"}</strong>Humidity
                  </div>
                  <div className="weather-item">
                    <strong>{weatherData ? `${weatherData.wind_speed} km/h` : "— km/h"}</strong>Wind
                  </div>
                  <div className="weather-item">
                    <strong>{weatherData ? `${weatherData.feels_like}°C` : "—°C"}</strong>Feels Like
                  </div>
                  <div className="weather-item">
                    <strong>{weatherData ? `${weatherData.rain_chance}%` : "—%"}</strong>Rain Chance
                  </div>
                </div>
                {weatherData && weatherData.farming_advisory && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px",
                      background: "rgba(46, 204, 113, 0.08)",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: "var(--gray-300)",
                      textAlign: "left",
                      borderLeft: "4px solid var(--green-500)"
                    }}
                  >
                    {weatherData.farming_advisory}
                  </div>
                )}
                {weatherData && (
                  <button
                    onClick={() => {
                      predictCrop(weatherData.city, weatherData);
                      scrollToSection("#crop");
                    }}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px 18px"
                    }}
                  >
                    <Sprout size={16} />
                    {currentLang === "te"
                      ? `ఈ రియల్-టైమ్ వాతావరణంతో పంటను సిఫార్సు చేయండి (${weatherData.temperature}°C)`
                      : `Use This Real-Time Weather for Crop Recommendation (${weatherData.temperature}°C)`}
                  </button>
                )}
                {weatherData && (
                  <button
                    type="button"
                    onClick={handleAskVoiceAboutWeather}
                    className="btn-outline"
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 16px"
                    }}
                  >
                    <Mic size={15} />
                    {currentLang === "te"
                      ? "పురుగుమందుల పిచికారీకి వాతావరణం అనుకూలమా? (వాయిస్ AI)"
                      : "Is Today Safe for Spraying? (Ask Voice AI)"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARKET PRICES ===== */}
      <section id="market" className="tool-section">
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", gap: "16px", textAlign: "left" }}>
            <div>
              <p className="section-subtitle">Live mandi rates</p>
              <h2 className="section-title">Market Price Tracker</h2>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select
                className="form-select"
                value={marketFilter}
                onChange={handleMarketFilterChange}
                style={{ width: "auto", margin: 0, padding: "10px 32px 10px 16px" }}
              >
                <option value="all">All Crops</option>
                <option value="cereal">Cereals</option>
                <option value="pulse">Pulses</option>
                <option value="vegetable">Vegetables</option>
                <option value="fruit">Fruits</option>
              </select>
              <button
                onClick={() => fetchMarketPrices(marketFilter)}
                className="btn-outline"
                style={{ padding: "10px 18px" }}
                disabled={marketLoading}
              >
                {marketLoading ? <span className="spinner"></span> : "↻ Refresh"}
              </button>
            </div>
          </div>
          <div className="tool-card" onMouseMove={handleCardMouseMove} style={{ overflowX: "auto" }}>
            <div className="spotlight"></div>
            <table className="market-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Crop</th>
                  <th style={{ textAlign: "left" }}>Category</th>
                  <th style={{ textAlign: "left" }}>Market</th>
                  <th style={{ textAlign: "left" }}>Price (₹/qtl)</th>
                  <th style={{ textAlign: "left" }}>Change</th>
                  <th style={{ textAlign: "left" }}>Updated</th>
                  <th style={{ textAlign: "center" }}>Cross-Module Action</th>
                </tr>
              </thead>
              <tbody>
                {marketData.length > 0 ? (
                  marketData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, textAlign: "left" }}>{row.crop}</td>
                      <td style={{ textAlign: "left" }}>
                        <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>{row.category}</span>
                      </td>
                      <td style={{ color: "var(--gray-300)", textAlign: "left" }}>{row.market}</td>
                      <td style={{ fontWeight: 700, textAlign: "left" }}>₹{row.price}</td>
                      <td style={{ textAlign: "left" }}>
                        <div className={`price-change ${row.change >= 0 ? "price-up" : "price-down"}`} style={{ display: "inline-block" }}>
                          {row.change >= 0 ? "▲" : "▼"} {Math.abs(row.change)}%
                        </div>
                      </td>
                      <td style={{ color: "var(--gray-600)", fontSize: "0.8rem", textAlign: "left" }}>{row.updated}</td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="btn-link-action"
                            style={{ padding: "4px 8px", fontSize: "0.72rem" }}
                            onClick={() => {
                              predictCrop(row.market);
                              scrollToSection("#crop");
                            }}
                            title="Check if this crop can grow on your farmland"
                          >
                            🌾 {currentLang === "te" ? "పండించవచ్చా?" : "Can I Grow?"}
                          </button>
                          <button
                            type="button"
                            className="btn-link-action"
                            style={{ padding: "4px 8px", fontSize: "0.72rem" }}
                            onClick={() => {
                              setShowVoiceDrawer(true);
                              handleSendChatMessage(
                                voiceLangRef.current === "te-IN"
                                  ? `${row.market} లో ${row.crop} రాబోయే మార్కెట్ ధరల ట్రెండ్ మరియు అమ్మకపు సలహా ఏమిటి?`
                                  : `What is the expected market price trend and selling advice for ${row.crop} in ${row.market}?`
                              );
                            }}
                            title="Ask Voice AI for price trends"
                          >
                            🎙️ {currentLang === "te" ? "ధర ట్రెండ్" : "AI Trend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      {marketLoading ? "Loading market rates..." : "No market rates available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== SOIL ANALYSIS & LAND AMELIORATION ===== */}
      <section id="soil" className="tool-section">
        <div className="container">
          <div style={{ textAlign: "left", marginBottom: "28px" }}>
            <div className="tool-badge" style={{ marginBottom: "10px" }}>
              <span className="badge badge-earth">
                <TestTube size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> Soil Science & Land Amelioration
              </span>
            </div>
            <h2 className="section-title">{t("tool_soil_title")}</h2>
            <p className="section-subtitle" style={{ maxWidth: "800px", lineHeight: "1.6" }}>
              Auto-detects real regional soil classification, chemistry ratings, and provides an actionable land conditioning plan with precision fertilizer dosages to significantly improve your farmland fertility.
            </p>
          </div>

          <div className="soil-container">
            {/* Top Action & Location Bar */}
            <div className="soil-header-bar">
              <div className="soil-location-badge">
                <MapPin size={20} style={{ color: "var(--green-400)", flexShrink: 0 }} />
                <div>
                  <div style={{ color: "var(--green-400)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                    {soilAutoDetected ? "📍 Auto-Detected Farmland" : "🌾 Farmland Zone"}
                  </div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>
                    {soilReport?.location_detected?.place_name || soilLocationLabel || "Kurnool, Andhra Pradesh"}
                  </div>
                </div>
                <span className="soil-pulse-dot" title="Live Soil Geo-Mapping Active"></span>
              </div>

              <div className="soil-header-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleLiveSoilDetection}
                  disabled={soilLoading}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", fontSize: "0.88rem" }}
                >
                  <RefreshCw size={15} className={soilLoading ? "spin" : ""} />
                  {soilLoading ? t("soil_detecting") : t("soil_auto_detect_btn")}
                </button>
                {soilReport && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (soilReport.soil_chemistry) {
                        setCropN(soilReport.soil_chemistry.nitrogen.toString());
                        setCropP(soilReport.soil_chemistry.phosphorus.toString());
                        setCropK(soilReport.soil_chemistry.potassium.toString());
                        setCropPh(soilReport.soil_chemistry.ph.toString());
                      }
                      scrollToSection("#crop");
                      predictCrop();
                    }}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", fontSize: "0.85rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
                    title="Send these soil values to Crop Advisor"
                  >
                    <Sprout size={15} /> {t("apply_to_crop_advisor")}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowManualSoilForm(!showManualSoilForm)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", fontSize: "0.85rem" }}
                >
                  <Sliders size={15} />
                  {t("soil_manual_toggle")} {showManualSoilForm ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Collapsible Manual Soil Form */}
            {showManualSoilForm && (
              <div className="manual-soil-form" style={{ textAlign: "left" }}>
                <h4 style={{ marginBottom: "16px", color: "var(--green-400)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <TestTube size={18} /> Official Soil Health Card / Laboratory Values Adjustment
                </h4>
                <form onSubmit={handleSoilAnalysis}>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={soilN}
                        min="0"
                        max="1000"
                        onChange={(e) => setSoilN(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label className="form-label">Available Nitrogen N (kg/ha)</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={soilP}
                        min="0"
                        max="500"
                        onChange={(e) => setSoilP(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label className="form-label">Available Phosphorus P (kg/ha)</label>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={soilK}
                        min="0"
                        max="1000"
                        onChange={(e) => setSoilK(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label className="form-label">Available Potassium K (kg/ha)</label>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={soilPh}
                        min="3.0"
                        max="11.0"
                        step="0.1"
                        onChange={(e) => setSoilPh(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label className="form-label">Soil pH (Reaction 3.0 - 11.0)</label>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="number"
                        className="form-input"
                        value={soilOc}
                        min="0.01"
                        max="10.0"
                        step="0.01"
                        onChange={(e) => setSoilOc(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label className="form-label">Organic Carbon OC (%)</label>
                    </div>
                    <div className="form-group">
                      <select 
                        className="form-select"
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                      >
                        <option value="black">Black Cotton Soil (Vertisol)</option>
                        <option value="red">Red Sandy / Loam (Alfisol)</option>
                        <option value="loam">Loamy Soil (Inceptisol)</option>
                        <option value="alluvial">Alluvial Soil (Entisol)</option>
                        <option value="sandy">Sandy / Arid Soil</option>
                      </select>
                      <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>Soil Type Classification</label>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button type="submit" className="btn-primary" disabled={soilLoading} style={{ padding: "10px 24px" }}>
                      <TestTube size={15} style={{ display: "inline", marginRight: "6px" }} />
                      {soilLoading ? "Recalculating..." : t("soil_recalc_btn")}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => setShowManualSoilForm(false)} style={{ padding: "10px 18px" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main Soil Report Display */}
            {soilReport && (
              <>
                {/* 1. Soil Classification Profile Card */}
                <div className="soil-profile-card" style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(46, 204, 113, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(46, 204, 113, 0.3)" }}>
                        <Layers size={24} style={{ color: "var(--green-400)" }} />
                      </div>
                      <div>
                        <span className="badge badge-green" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>Ground-Truth Soil Classification</span>
                        <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                          {soilReport.soil_profile.name}
                        </h3>
                      </div>
                    </div>
                    <span className="badge" style={{ background: "rgba(46, 204, 113, 0.15)", color: "var(--green-400)", border: "1px solid rgba(46, 204, 113, 0.3)", padding: "6px 14px", fontSize: "0.8rem" }}>
                      ✓ ICAR Regional Match
                    </span>
                  </div>

                  <p style={{ color: "var(--gray-100)", marginTop: "14px", lineHeight: "1.65", fontSize: "0.95rem" }}>
                    {soilReport.soil_profile.description}
                  </p>

                  <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                      <strong style={{ color: "var(--green-400)" }}>Texture:</strong> <span style={{ color: "var(--gray-200)" }}>{soilReport.soil_profile.texture}</span>
                    </div>
                    <div style={{ background: "rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                      <strong style={{ color: "var(--green-400)" }}>Drainage & Aeration:</strong> <span style={{ color: "var(--gray-200)" }}>{soilReport.soil_profile.drainage}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Soil Health & Nutrient Meters (5 metrics) */}
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <TestTube size={18} style={{ color: "var(--green-400)" }} /> {t("soil_nutrients_title")}
                  </h3>
                  <div className="soil-nutrients-grid">
                    {/* Nitrogen Card */}
                    <div className="soil-nutrient-card">
                      <div className="soil-metric-header">
                        <span className="soil-metric-title">Available N</span>
                        <span className="badge" style={{
                          background: soilReport.ratings.nitrogen.color === "green" ? "rgba(46, 204, 113, 0.15)" : soilReport.ratings.nitrogen.color === "orange" ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          color: soilReport.ratings.nitrogen.color === "green" ? "#2ecc71" : soilReport.ratings.nitrogen.color === "orange" ? "#fbbf24" : "#60a5fa",
                          border: `1px solid ${soilReport.ratings.nitrogen.color === "green" ? "rgba(46, 204, 113, 0.3)" : soilReport.ratings.nitrogen.color === "orange" ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                          fontSize: "0.72rem"
                        }}>
                          {soilReport.ratings.nitrogen.level}
                        </span>
                      </div>
                      <div className="soil-metric-value">
                        {soilReport.soil_chemistry.nitrogen} <span className="soil-metric-unit">kg/ha</span>
                      </div>
                      <div className="soil-progress-track">
                        <div 
                          className="soil-progress-fill" 
                          style={{
                            width: `${Math.min(100, Math.round(((soilReport.soil_chemistry.nitrogen || 0) / 280) * 100))}%`,
                            background: soilReport.ratings.nitrogen.color === "green" ? "#2ecc71" : soilReport.ratings.nitrogen.color === "orange" ? "#f59e0b" : "#3b82f6"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-300)", lineHeight: "1.4" }}>
                        {soilReport.ratings.nitrogen.comment}
                      </div>
                    </div>

                    {/* Phosphorus Card */}
                    <div className="soil-nutrient-card">
                      <div className="soil-metric-header">
                        <span className="soil-metric-title">Available P</span>
                        <span className="badge" style={{
                          background: soilReport.ratings.phosphorus.color === "green" ? "rgba(46, 204, 113, 0.15)" : soilReport.ratings.phosphorus.color === "orange" ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          color: soilReport.ratings.phosphorus.color === "green" ? "#2ecc71" : soilReport.ratings.phosphorus.color === "orange" ? "#fbbf24" : "#60a5fa",
                          border: `1px solid ${soilReport.ratings.phosphorus.color === "green" ? "rgba(46, 204, 113, 0.3)" : soilReport.ratings.phosphorus.color === "orange" ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                          fontSize: "0.72rem"
                        }}>
                          {soilReport.ratings.phosphorus.level}
                        </span>
                      </div>
                      <div className="soil-metric-value">
                        {soilReport.soil_chemistry.phosphorus} <span className="soil-metric-unit">kg/ha</span>
                      </div>
                      <div className="soil-progress-track">
                        <div 
                          className="soil-progress-fill" 
                          style={{
                            width: `${Math.min(100, Math.round(((soilReport.soil_chemistry.phosphorus || 0) / 50) * 100))}%`,
                            background: soilReport.ratings.phosphorus.color === "green" ? "#2ecc71" : soilReport.ratings.phosphorus.color === "orange" ? "#f59e0b" : "#3b82f6"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-300)", lineHeight: "1.4" }}>
                        {soilReport.ratings.phosphorus.comment}
                      </div>
                    </div>

                    {/* Potassium Card */}
                    <div className="soil-nutrient-card">
                      <div className="soil-metric-header">
                        <span className="soil-metric-title">Available K</span>
                        <span className="badge" style={{
                          background: soilReport.ratings.potassium.color === "green" ? "rgba(46, 204, 113, 0.15)" : soilReport.ratings.potassium.color === "orange" ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          color: soilReport.ratings.potassium.color === "green" ? "#2ecc71" : soilReport.ratings.potassium.color === "orange" ? "#fbbf24" : "#60a5fa",
                          border: `1px solid ${soilReport.ratings.potassium.color === "green" ? "rgba(46, 204, 113, 0.3)" : soilReport.ratings.potassium.color === "orange" ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                          fontSize: "0.72rem"
                        }}>
                          {soilReport.ratings.potassium.level}
                        </span>
                      </div>
                      <div className="soil-metric-value">
                        {soilReport.soil_chemistry.potassium} <span className="soil-metric-unit">kg/ha</span>
                      </div>
                      <div className="soil-progress-track">
                        <div 
                          className="soil-progress-fill" 
                          style={{
                            width: `${Math.min(100, Math.round(((soilReport.soil_chemistry.potassium || 0) / 400) * 100))}%`,
                            background: soilReport.ratings.potassium.color === "green" ? "#2ecc71" : soilReport.ratings.potassium.color === "orange" ? "#f59e0b" : "#3b82f6"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-300)", lineHeight: "1.4" }}>
                        {soilReport.ratings.potassium.comment}
                      </div>
                    </div>

                    {/* Soil pH Card */}
                    <div className="soil-nutrient-card">
                      <div className="soil-metric-header">
                        <span className="soil-metric-title">Soil Reaction</span>
                        <span className="badge" style={{
                          background: soilReport.ratings.ph.color === "green" ? "rgba(46, 204, 113, 0.15)" : soilReport.ratings.ph.color === "purple" ? "rgba(168, 85, 247, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: soilReport.ratings.ph.color === "green" ? "#2ecc71" : soilReport.ratings.ph.color === "purple" ? "#c084fc" : "#f87171",
                          border: `1px solid ${soilReport.ratings.ph.color === "green" ? "rgba(46, 204, 113, 0.3)" : soilReport.ratings.ph.color === "purple" ? "rgba(168, 85, 247, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          fontSize: "0.72rem"
                        }}>
                          {soilReport.ratings.ph.level}
                        </span>
                      </div>
                      <div className="soil-metric-value">
                        {soilReport.soil_chemistry.ph} <span className="soil-metric-unit">pH</span>
                      </div>
                      <div className="soil-progress-track">
                        <div 
                          className="soil-progress-fill" 
                          style={{
                            width: `${Math.min(100, Math.max(0, Math.round((((soilReport.soil_chemistry.ph || 7) - 4) / 6) * 100)))}%`,
                            background: soilReport.ratings.ph.color === "green" ? "#2ecc71" : soilReport.ratings.ph.color === "purple" ? "#a855f7" : "#ef4444"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-300)", lineHeight: "1.4" }}>
                        {soilReport.ratings.ph.comment}
                      </div>
                    </div>

                    {/* Organic Carbon Card */}
                    <div className="soil-nutrient-card">
                      <div className="soil-metric-header">
                        <span className="soil-metric-title">Organic Carbon</span>
                        <span className="badge" style={{
                          background: soilReport.ratings.organic_carbon.color === "green" ? "rgba(46, 204, 113, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: soilReport.ratings.organic_carbon.color === "green" ? "#2ecc71" : "#fbbf24",
                          border: `1px solid ${soilReport.ratings.organic_carbon.color === "green" ? "rgba(46, 204, 113, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                          fontSize: "0.72rem"
                        }}>
                          {soilReport.ratings.organic_carbon.level}
                        </span>
                      </div>
                      <div className="soil-metric-value">
                        {soilReport.soil_chemistry.organic_carbon}% <span className="soil-metric-unit">OC</span>
                      </div>
                      <div className="soil-progress-track">
                        <div 
                          className="soil-progress-fill" 
                          style={{
                            width: `${Math.min(100, Math.round(((soilReport.soil_chemistry.organic_carbon || 0) / 1.0) * 100))}%`,
                            background: soilReport.ratings.organic_carbon.color === "green" ? "#2ecc71" : "#f59e0b"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-300)", lineHeight: "1.4" }}>
                        {soilReport.ratings.organic_carbon.comment}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Actionable Amelioration Plan: How to Make Land Better */}
                <div className="soil-amelioration-section" style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                        <Sprout size={22} style={{ color: "var(--green-400)" }} />
                        {t("soil_amelioration_title")}
                      </h3>
                      <p style={{ color: "var(--gray-300)", fontSize: "0.88rem", marginTop: "4px" }}>
                        Scientifically verified agronomic soil conditioning to restore chemical balance, structure, and maximize long-term harvest yields.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={handleApplySoilToLand}
                        title="Valuate your farmland using this soil type and GPS coordinates"
                      >
                        🏡 {currentLang === "te" ? "ఈ నేలతో భూమి విలువ" : "Valuate Land with Soil"}
                      </button>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={handleAskVoiceAboutSoil}
                        title="Ask Voice AI to walk you through implementing this amelioration plan"
                      >
                        🎙️ {currentLang === "te" ? "వాయిస్ AI సలహా" : "Ask Voice AI"}
                      </button>
                    </div>
                  </div>

                  <div className="amelioration-grid">
                    {soilReport.land_amelioration_plan?.actions?.map((act, idx) => (
                      <div key={idx} className={`amelioration-card ${act.priority === "Critical" ? "priority-critical" : act.priority === "Recommended" ? "priority-recommended" : "priority-standard"}`}>
                        <div className="amelioration-header">
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-300)", fontWeight: 600 }}>
                            {act.category}
                          </span>
                          <span className="badge" style={{
                            fontSize: "0.68rem",
                            background: act.priority === "Critical" ? "rgba(239, 68, 68, 0.2)" : act.priority === "Recommended" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
                            color: act.priority === "Critical" ? "#f87171" : act.priority === "Recommended" ? "#fbbf24" : "#34d399",
                            border: `1px solid ${act.priority === "Critical" ? "rgba(239, 68, 68, 0.4)" : act.priority === "Recommended" ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`
                          }}>
                            {act.priority}
                          </span>
                        </div>
                        <div className="amelioration-title">{act.title}</div>
                        <p style={{ fontSize: "0.88rem", color: "var(--gray-200)", lineHeight: "1.55", margin: 0 }}>
                          {act.description}
                        </p>
                        <div className="amelioration-benefit">
                          <strong>Expected Benefit:</strong> {act.benefit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Precision Fertilizer Schedule Table */}
                <div className="tool-card" onMouseMove={handleCardMouseMove} style={{ textAlign: "left", overflowX: "auto" }}>
                  <div className="spotlight"></div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <Droplet size={18} style={{ color: "var(--sky-300)" }} />
                    {t("soil_dosages_title")}
                  </h3>
                  <p style={{ color: "var(--gray-300)", fontSize: "0.85rem", marginBottom: "16px" }}>
                    Exact per-acre fertilizer requirements calculated to balance this specific soil's chemistry without causing toxic salt accumulation.
                  </p>

                  <table className="soil-fertilizer-table">
                    <thead>
                      <tr>
                        <th>Target Nutrient</th>
                        <th>Recommended Commercial Fertilizer</th>
                        <th>Dosage (kg / acre)</th>
                        <th>Application Timing & Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {soilReport.land_amelioration_plan?.fertilizer_dosages?.map((dose, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: "#fff" }}>{dose.nutrient}</td>
                          <td>
                            <span className="badge badge-green" style={{ fontSize: "0.78rem" }}>
                              {dose.fertilizer}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800, color: "var(--green-400)", fontSize: "1.05rem" }}>
                            {dose.dosage_kg_acre} kg/acre
                          </td>
                          <td style={{ color: "var(--gray-200)", fontSize: "0.85rem" }}>
                            <strong>{dose.timing}</strong> — {dose.application_method}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 5. Top Suitable High-Yield Crops for this Land */}
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <Sprout size={20} style={{ color: "var(--green-400)" }} />
                    {t("soil_top_crops_title")}
                  </h3>
                  <p style={{ color: "var(--gray-300)", fontSize: "0.88rem", marginBottom: "16px" }}>
                    Crops proven through ICAR field trials to achieve highest yield potential on this specific soil classification.
                  </p>

                  <div className="soil-crops-grid">
                    {soilReport.best_crops?.map((c, idx) => (
                      <div key={idx} className="soil-crop-card">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Sprout size={16} style={{ color: "var(--green-400)" }} /> {c.crop}
                          </span>
                          <span className="badge badge-green" style={{ fontSize: "0.72rem" }}>
                            {c.suitability} Match
                          </span>
                        </div>
                        <p style={{ color: "var(--gray-300)", fontSize: "0.82rem", lineHeight: "1.5", margin: 0 }}>
                          {c.reason}
                        </p>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                          <button
                            type="button"
                            className="btn-link-action"
                            style={{ padding: "3px 8px", fontSize: "0.72rem" }}
                            onClick={() => handleJumpToMandi(c.crop)}
                            title="Check live mandi market rates"
                          >
                            💰 {currentLang === "te" ? "మార్కెట్ ధర" : "Mandi Price"}
                          </button>
                          <button
                            type="button"
                            className="btn-link-action"
                            style={{ padding: "3px 8px", fontSize: "0.72rem" }}
                            onClick={() => handleAskVoiceAboutCrop(c.crop)}
                            title="Ask Voice AI about this crop"
                          >
                            🎙️ {currentLang === "te" ? "వాయిస్ AI" : "Ask Voice"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== GOVERNMENT SCHEMES ===== */}
      <section id="schemes">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="section-subtitle">Stay informed</p>
            <h2 className="section-title">Government Schemes for Farmers</h2>
          </div>
          <div className="schemes-grid">
            {schemesData.map((scheme, idx) => (
              <div key={idx} className="scheme-card" onMouseMove={handleCardMouseMove}>
                <div className="spotlight"></div>
                <div className="scheme-icon">{scheme.icon}</div>
                <div className="scheme-name">{scheme.name}</div>
                <p className="scheme-desc">{scheme.desc}</p>
                <a href={scheme.link} className="scheme-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "0" }}>
            <p className="section-subtitle">Simple process</p>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-title">Enter Your Data</div>
              <p className="step-desc">
                Provide soil test values, climate data, or upload a plant image
                using the simple forms.
              </p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-title">AI Processes</div>
              <p className="step-desc">
                Our ML models (Random Forest, CNN, Gradient Boost) analyze your
                inputs instantly.
              </p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-title">Get Recommendations</div>
              <p className="step-desc">
                Receive crop suggestions, disease diagnoses, price forecasts, and
                actionable tips.
              </p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div className="step-title">Act & Improve</div>
              <p className="step-desc">
                Follow the guidance to increase yield, prevent losses, and make
                smarter decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SURVEY / FEEDBACK ===== */}
      <section id="survey">
        <div className="container">
          <div className="survey-wrapper">
            <div className="survey-content text-left">
              <p className="section-subtitle">Community Engagement</p>
              <h2 className="section-title">Farmer<br />Feedback</h2>
              <p style={{ color: "var(--gray-300)", lineHeight: 1.8, marginTop: "16px" }}>
                We are conducting a survey to understand the real agricultural
                challenges in your area. Your feedback directly improves the
                system.
              </p>
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)", fontSize: "1.2rem" }}>✓</span> Takes only 2 minutes
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)", fontSize: "1.2rem" }}>✓</span> Anonymous & confidential
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.9rem", color: "var(--gray-300)" }}>
                  <span style={{ color: "var(--green-400)", fontSize: "1.2rem" }}>✓</span> Available in Telugu
                </div>
              </div>
            </div>
            <div className="survey-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <h3 style={{ textAlign: "left" }}>Farmer Feedback Form</h3>
              {!surveySuccess ? (
                <form onSubmit={handleSurveySubmit} style={{ textAlign: "left" }}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={surveyName}
                      onChange={(e) => setSurveyName(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label className="form-label">Your Name</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={surveyVillage}
                      onChange={(e) => setSurveyVillage(e.target.value)}
                      placeholder=" "
                      required
                    />
                    <label className="form-label">Village / Town</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={surveyCrop}
                      onChange={(e) => setSurveyCrop(e.target.value)}
                      placeholder=" "
                    />
                    <label className="form-label">Main Crop Grown</label>
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-select"
                      value={surveyChallenge}
                      onChange={(e) => setSurveyChallenge(e.target.value)}
                      required
                    >
                      <option value="">Select a challenge</option>
                      <option>Crop disease / pests</option>
                      <option>Unpredictable weather</option>
                      <option>Low market prices</option>
                      <option>Soil fertility issues</option>
                      <option>Lack of government scheme access</option>
                      <option>No irrigation facilities</option>
                    </select>
                    <label className="form-label" style={{ transform: surveyChallenge ? "translateY(-18px) scale(0.85)" : "none" }}>Biggest Challenge</label>
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-select"
                      value={surveyPhone}
                      onChange={(e) => setSurveyPhone(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Yes, with internet</option>
                      <option>Yes, limited internet</option>
                      <option>No smartphone</option>
                    </select>
                    <label className="form-label" style={{ transform: surveyPhone ? "translateY(-18px) scale(0.85)" : "none" }}>Smartphone Access</label>
                  </div>
                  <button type="submit" className="btn-submit" disabled={surveySubmitting}>
                    {surveySubmitting ? "Submitting..." : "Submit Feedback →"}
                  </button>
                </form>
              ) : (
                <div
                  id="survey-success"
                  style={{
                    padding: "24px 12px",
                    background: "rgba(46, 204, 113, 0.1)",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.95rem",
                    color: "var(--green-400)",
                    border: "1px solid rgba(46,204,113,0.3)"
                  }}
                >
                  🙏 Thank you! Your feedback has been recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="container">
          <div className="footer-grid text-left">
            <div className="footer-brand">
              <div className="nav-logo" style={{ fontSize: "1.4rem" }}>
                <span><Leaf size={20} /></span><span>AgriSmart</span>
              </div>
              <p>
                Empowering farmers with AI-driven insights and real-time market data.
              </p>
              <p style={{ marginTop: "12px", fontSize: "0.8rem", color: "var(--gray-600)" }}>
                Developed By: Midde Prem Kumar
              </p>
            </div>
            <div className="footer-col">
              <h5>Features</h5>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }}>{t("nav_home")}</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("#features"); }}>{t("nav_tools")}</a></li>
                <li><a href="#schemes" onClick={(e) => { e.preventDefault(); scrollToSection("#schemes"); }}>{t("nav_schemes")}</a></li>
                <li><a href="#market" onClick={(e) => { e.preventDefault(); scrollToSection("#market"); }}>{t("nav_market")}</a></li>
                <li><a href="#survey" onClick={(e) => { e.preventDefault(); scrollToSection("#survey"); }}>{t("nav_contact")}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Resources</h5>
              <ul>
                <li><a href="#weather" onClick={(e) => { e.preventDefault(); scrollToSection("#weather"); }}>Weather</a></li>
                <li><a href="#market" onClick={(e) => { e.preventDefault(); scrollToSection("#market"); }}>Market Prices</a></li>
                <li><a href="#schemes" onClick={(e) => { e.preventDefault(); scrollToSection("#schemes"); }}>Gov Schemes</a></li>
                <li><a href="#survey" onClick={(e) => { e.preventDefault(); scrollToSection("#survey"); }}>Survey</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 AgriSmart</span>
            <span>Built with <span className="accent">♥</span> for farmers of India</span>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        id="scrollTop"
        className={showScrollTop ? "visible" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

      {/* 🛠️ Floating Actions (Top Right) */}
      <div className="floating-actions">
        {/* Dual Language Switcher */}
        <div
          className="action-btn"
          style={{ padding: "4px", gap: "4px", background: "rgba(10, 46, 26, 0.95)", display: "flex" }}
        >
          <button
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
            style={{
              padding: "6px 12px",
              borderRadius: "99px",
              fontSize: "0.75rem",
              fontWeight: 700,
              background: currentLang === 'en' ? 'var(--green-600)' : 'transparent',
              color: currentLang === 'en' ? 'var(--white)' : 'var(--gray-300)',
            }}
          >
            EN
          </button>
          <button
            className={`lang-btn ${currentLang === 'te' ? 'active' : ''}`}
            onClick={() => changeLanguage('te')}
            style={{
              padding: "6px 12px",
              borderRadius: "99px",
              fontSize: "0.75rem",
              fontWeight: 700,
              background: currentLang === 'te' ? 'var(--green-600)' : 'transparent',
              color: currentLang === 'te' ? 'var(--white)' : 'var(--gray-300)',
            }}
          >
            తె
          </button>
        </div>

        {/* GPS Detector */}
        <button 
          className="action-btn" 
          onClick={autoDetectLocation} 
          disabled={locationLoading}
          id="gpsBtn"
        >
          {locationLoading ? <span className="spinner"></span> : <MapPin size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />}
          <span>{locationLoading ? t("detecting") : t("detect_farm")}</span>
        </button>

        {locationDisplay && (
          <div
            id="locationDisplay"
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(10, 46, 26, 0.85)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(46, 204, 113, 0.3)",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "var(--green-400)",
              fontSize: "0.8rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              gap: "6px"
            }}
          >
            <MapPin size={12} /> {locationDisplay}
          </div>
        )}
      </div>

      {/* ===== UPGRADED VOICE & AI CHAT ASSISTANT ===== */}
      <div className="voice-bot-container">
        {/* Floating Bubble preview if drawer is closed */}
        {!showVoiceDrawer && showBotBubble && (
          <div className="bot-bubble-floating" onClick={() => setShowVoiceDrawer(true)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--green-400)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Bot size={13} /> {t("voice_assistant_title")}
              </span>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setShowBotBubble(false); }}
                style={{ background: "transparent", border: "none", color: "var(--gray-300)", cursor: "pointer", padding: "2px" }}
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </div>
            <div style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
              {liveTranscript ? `"${liveTranscript}..."` : (botBubbleText || t("voice_prompt"))}
            </div>
          </div>
        )}

        {/* Floating Trigger Mic Button */}
        <button 
          className={`bot-btn ${isListening ? "listening" : ""} ${isSpeaking ? "speaking" : ""}`} 
          onClick={toggleVoice} 
          id="voiceBtn"
          title={isListening ? "Listening... Tap to stop" : "Tap to speak with AgriSmart Voice AI"}
        >
          {isListening ? (
            <div className="sound-wave-bars">
              <span></span><span></span><span></span><span></span>
            </div>
          ) : isSpeaking ? (
            <Volume2 size={24} style={{ color: "white", margin: "0 auto" }} />
          ) : (
            <Mic size={24} style={{ color: "white", margin: "0 auto" }} />
          )}
        </button>

        {/* Complete Voice & Chat Assistant Modal Drawer */}
        {showVoiceDrawer && (
          <div className="voice-drawer-card">
            {/* Header */}
            <div className="voice-drawer-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="bot-avatar">
                  <Bot size={20} style={{ color: "var(--green-400)" }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.98rem", color: "#fff", fontWeight: 700 }}>
                    {t("voice_assistant_title")}
                  </h4>
                  <div style={{ fontSize: "0.72rem", color: isListening ? "#ef4444" : isSpeaking ? "var(--green-400)" : "var(--gray-300)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className={`status-dot ${isListening ? "pulse-red" : isSpeaking ? "pulse-green" : ""}`}></span>
                    {isListening 
                      ? (voiceLang === "te-IN" ? "మీ స్వరాన్ని వింటున్నాను..." : "Listening to your voice...")
                      : isSpeaking 
                      ? (voiceLang === "te-IN" ? "సమాధానం చెబుతోంది..." : "Speaking response aloud...")
                      : (voiceLang === "te-IN" ? "మాట్లాడటానికి సిద్ధంగా ఉంది" : "Ready to assist you")}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Language Switcher Pill */}
                <button
                  type="button"
                  className="voice-lang-pill"
                  onClick={() => {
                    const nextLang = voiceLang === "te-IN" ? "en-IN" : "te-IN";
                    setVoiceLang(nextLang);
                    if (recognitionRef.current) {
                      recognitionRef.current.lang = nextLang;
                    }
                  }}
                  title="Switch speech language"
                >
                  <Globe size={13} />
                  {voiceLang === "te-IN" ? "తెలుగు (TE)" : "English (IN)"}
                </button>

                {/* Stop Speech / Mute button */}
                {isSpeaking && (
                  <button 
                    type="button" 
                    className="icon-btn-danger" 
                    onClick={stopSpeaking}
                    title="Stop speaking"
                  >
                    <VolumeX size={16} />
                  </button>
                )}

                {/* Close Drawer button */}
                <button 
                  type="button" 
                  className="icon-btn-close" 
                  onClick={() => { setShowVoiceDrawer(false); stopSpeaking(); }}
                  title="Close assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation Messages Box */}
            <div className="voice-messages-container">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-message-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}>
                  {msg.sender === "bot" && (
                    <div className="message-avatar">
                      <Leaf size={14} style={{ color: "var(--green-400)" }} />
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble-inside"}`}>
                    <p style={{ margin: 0, lineHeight: "1.5" }}>{msg.text}</p>
                    <div className="message-meta">
                      <span>{msg.time}</span>
                      {msg.sender === "bot" && (
                        <button
                          type="button"
                          className="msg-replay-btn"
                          onClick={() => speakText(msg.text, voiceLang)}
                          title="Replay voice audio"
                        >
                          <Volume2 size={13} /> Speak
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Live speech transcription preview */}
              {isListening && liveTranscript && (
                <div className="chat-message-row user-row">
                  <div className="chat-bubble user-bubble live-interim">
                    <p style={{ margin: 0, fontStyle: "italic" }}>"{liveTranscript}..."</p>
                    <span className="live-badge">Speaking now</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (Dynamic Farm Context + Core) */}
            <div className="quick-prompts-bar">
              {cropRecommendations.length > 0 && !cropRecommendations[0].error && (
                <button 
                  type="button" 
                  className="prompt-chip active-chip" 
                  onClick={() => handleAskVoiceAboutCrop(cropRecommendations[0].crop)}
                  title="Ask AI about your recommended crop"
                >
                  🌾 {voiceLang === "te-IN" ? `${cropRecommendations[0].crop} సాగు సలహా` : `Tips for ${cropRecommendations[0].crop}`}
                </button>
              )}
              {diseaseResult && (
                <button 
                  type="button" 
                  className="prompt-chip active-chip" 
                  onClick={() => handleAskVoiceAboutDisease(diseaseResult.crop_type, diseaseResult.disease)}
                  title="Ask AI about treating this detected leaf disease"
                >
                  🔬 {voiceLang === "te-IN" ? `${diseaseResult.disease} నివారణ` : `Spray for ${diseaseResult.disease}`}
                </button>
              )}
              {soilReport && (
                <button 
                  type="button" 
                  className="prompt-chip" 
                  onClick={handleAskVoiceAboutSoil}
                  title="Ask AI how to implement this soil amelioration plan"
                >
                  🧪 {voiceLang === "te-IN" ? "నా నేల ప్రణాళిక" : "My Soil Plan"}
                </button>
              )}
              {landInspectionData && (
                <button 
                  type="button" 
                  className="prompt-chip" 
                  onClick={handleAskVoiceAboutLand}
                  title="Ask AI how to increase this land's value"
                >
                  🏡 {voiceLang === "te-IN" ? "భూమి విలువ పెంపు" : "Increase Land Value"}
                </button>
              )}
              <button 
                type="button" 
                className="prompt-chip" 
                onClick={() => handleSendChatMessage(voiceLang === "te-IN" ? "నా నేల సారం ఎలా పెంచాలి?" : "How to improve my soil fertility and health?")}
              >
                🧪 {voiceLang === "te-IN" ? "నేల సారం పెంపు" : "Improve Soil Fertility"}
              </button>
              <button 
                type="button" 
                className="prompt-chip" 
                onClick={() => handleSendChatMessage(voiceLang === "te-IN" ? "ఈ నేలకు ఏ పంటలు అనుకూలం?" : "Top high yield crops for my soil")}
              >
                🌾 {voiceLang === "te-IN" ? "అనుకూల పంటలు" : "Best Crops for Soil"}
              </button>
              <button 
                type="button" 
                className="prompt-chip" 
                onClick={() => handleSendChatMessage(voiceLang === "te-IN" ? "ఆకు తెగులు నివారణ మందులు ఏమిటి?" : "Leaf disease spray and pest treatment")}
              >
                🐛 {voiceLang === "te-IN" ? "తెగుళ్ల నివారణ" : "Disease Spray"}
              </button>
              <button 
                type="button" 
                className="prompt-chip" 
                onClick={() => handleSendChatMessage(voiceLang === "te-IN" ? "తాజా మార్కెట్ ధరలు ఎంత?" : "Today's Mandi market prices")}
              >
                💰 {voiceLang === "te-IN" ? "మార్కెట్ ధరలు" : "Mandi Prices"}
              </button>
            </div>

            {/* Input & Mic Bar */}
            <form onSubmit={handleChatFormSubmit} className="voice-input-form">
              <button 
                type="button" 
                className={`drawer-mic-btn ${isListening ? "listening" : ""}`}
                onClick={toggleVoice}
                title={isListening ? "Listening... Click to stop" : "Click to speak in your language"}
              >
                <Mic size={18} />
              </button>
              <input
                type="text"
                className="voice-text-input"
                placeholder={voiceLang === "te-IN" ? "ప్రశ్నను ఇక్కడ టైప్ చేయండి లేదా మైక్ నొక్కండి..." : "Type farming question or tap mic to speak..."}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
              />
              <button 
                type="submit" 
                className="voice-send-btn" 
                disabled={!chatInputText.trim()}
                title="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
