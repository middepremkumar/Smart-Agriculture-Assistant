import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, ShieldCheck, Thermometer, Bot, TrendingUp, IndianRupee, Sprout, 
  Microscope, CloudSun, BarChart2, TestTube, ClipboardList, Globe, 
  MapPin, Camera, AlertTriangle, CheckCircle, Banknote, Droplet, 
  Smartphone, RefreshCw, Mic, Volume2, ChevronUp, X, Menu, Check
} from 'lucide-react';

// ================================================
// LANGUAGE TRANSLATIONS DICTIONARY
// ================================================
const translations = {
  en: {
    heroDesc: "AI-powered crop guidance, disease detection, weather forecasting, market prices, and land valuation — all in one platform designed for rural and semi-urban Indian farmers.",
    detect_farm: "Detect My Farm",
    detecting: "Locating...",
    detected: "Detected",
    nav_home: "Home",
    nav_tools: "Tools",
    nav_schemes: "Schemes",
    nav_market: "Market",
    nav_contact: "Contact",
    hero_title: "Empowering Indian Farmers with Smart AI",
    voice_prompt: "Tap the mic and speak in your language!",
    voice_listen: "Listening...",
    voice_thinking: "Thinking...",
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
    crop_recommendations_title: "Crop Recommendation Results",
    crop_top_n_label: "Number of Recommendations",
    top_1_rec: "Top 1 Recommendation",
    top_3_rec: "Top 3 Recommendations",
    top_5_rec: "Top 5 Recommendations",
    btn_use_current_climate: "Use Current Climate",
    manual_city_prompt: "We couldn't detect your location automatically. Please enter your city name below:",
  },
  te: {
    heroDesc: "AI ఆధారిత పంట మార్గదర్శనం, వ్యాధి గుర్తింపు, వాతావరణ అంచనా, మార్కెట్ ధరలు మరియు భూమి విలువ — అన్ని ఒకే వేదికపై.",
    detect_farm: "నా పొలాన్ని గుర్తించు",
    detecting: "గుర్తిస్తోంది...",
    detected: "గుర్తించబడింది",
    nav_home: "హోమ్",
    nav_tools: "సాధనాలు",
    nav_schemes: "పథకాలు",
    nav_market: "మార్కెట్",
    nav_contact: "సంప్రదించండి",
    hero_title: "స్మార్ట్ AIతో భారతీయ రైతులకు సాధికారత",
    voice_prompt: "మైక్‌ని నొక్కి మీ భాషలో మాట్లాడండి! (Tap the mic and speak!)",
    voice_listen: "వింటున్నాను...",
    voice_thinking: "ఆలోచిస్తున్నాను...",
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

  // Land Valuation States
  const [landState, setLandState] = useState("");
  const [landArea, setLandArea] = useState("");
  const [landSoil, setLandSoil] = useState("1");
  const [landIrrigation, setLandIrrigation] = useState("1");
  const [landRoad, setLandRoad] = useState("");
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

  // Soil Analysis States
  const [soilN, setSoilN] = useState("");
  const [soilP, setSoilP] = useState("");
  const [soilK, setSoilK] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [soilOc, setSoilOc] = useState("");
  const [soilType, setSoilType] = useState("black");
  const [soilResult, setSoilResult] = useState(null);

  // Survey States
  const [surveyName, setSurveyName] = useState("");
  const [surveyVillage, setSurveyVillage] = useState("");
  const [surveyCrop, setSurveyCrop] = useState("");
  const [surveyChallenge, setSurveyChallenge] = useState("");
  const [surveyPhone, setSurveyPhone] = useState("");
  const [surveySuccess, setSurveySuccess] = useState(false);
  const [surveySubmitting, setSurveySubmitting] = useState(false);

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [botBubbleText, setBotBubbleText] = useState("");
  const [showBotBubble, setShowBotBubble] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const recognitionRef = useRef(null);
  const currentLangRef = useRef(currentLang);
  const userLocationRef = useRef(userLocation);
  const weatherDataRef = useRef(weatherData);

  // Keep references updated for async callbacks
  useEffect(() => {
    currentLangRef.current = currentLang;
  }, [currentLang]);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  useEffect(() => {
    weatherDataRef.current = weatherData;
  }, [weatherData]);

  // Translate helper
  const t = (key) => translations[currentLang]?.[key] || key;

  // Speak aloud helper
  const speakText = (text, lang = "te-IN") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  // Switch language
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem("agri_lang", lang);
    const msg = lang === "te" ? "భాష తెలుగులోకి మార్చబడింది." : "Language changed to English.";
    speakText(msg, lang === "te" ? "te-IN" : "en-US");
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

    // Initial voice prompt
    setBotBubbleText(t("voice_prompt"));

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

  // Sync recognition language configurations
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLang === "te" ? "te-IN" : "en-IN";
    }
    setBotBubbleText(t("voice_prompt"));
  }, [currentLang]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setBotBubbleText(currentLangRef.current === "te" ? "వింటున్నాను..." : "Listening...");
        setShowBotBubble(true);
      };

      rec.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setBotBubbleText(`You: "${transcript}"`);
        await sendToChatbot(transcript);
      };

      rec.onerror = () => {
        setBotBubbleText("Didn't catch that. Tap to try again.");
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Voice AI Bot Toggle
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Voice AI. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
    }
  };

  const sendToChatbot = async (text) => {
    setBotBubbleText(currentLangRef.current === "te" ? "ఆలోచిస్తున్నాను..." : "Thinking...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          location: userLocationRef.current,
          weather: weatherDataRef.current ? weatherDataRef.current.description : "Unknown",
        }),
      });
      const data = await res.json();
      setBotBubbleText(data.response);
      speakText(data.response, currentLangRef.current === "te" ? "te-IN" : "en-IN");
    } catch (err) {
      setBotBubbleText("Sorry, I am having trouble connecting.");
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

    const activeWeather = weatherObj || weatherData;

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

  // Sync crop top N changes
  useEffect(() => {
    if (userLocation !== "Unknown" || weatherData !== null) {
      predictCrop();
    }
  }, [cropTopN]);

  // GEOLOCATION
  const autoDetectLocation = async () => {
    if (locationLoading) return;
    setLocationLoading(true);

    const handleSuccess = async (city, region) => {
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
        const res = await fetchWithTimeout("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city) {
          await handleSuccess(data.city, data.region);
        } else {
          throw new Error("No city returned from IP");
        }
      } catch (e) {
        console.error("IP Location Error:", e);
        setLocationLoading(false);
        speakText(
          "Unable to detect location. Please enter your city manually.",
          currentLangRef.current === "te" ? "te-IN" : "en-US"
        );
        triggerManualInputFallback();
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
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.village || addr.town || addr.city || addr.suburb || addr.county || "Your Area";
          const state = addr.state || "";
          await handleSuccess(city, state);
        } catch (e) {
          console.error("Nominatim Geocode Error:", e);
          await fallbackToIP();
        }
      },
      async (err) => {
        console.warn("GPS coordinate access denied:", err.message);
        await fallbackToIP();
      },
      { timeout: 10000, enableHighAccuracy: true }
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
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDiseaseFile(file);
    setDiseasePreview(URL.createObjectURL(file));
    setDiseaseResult(null); // Reset previous results
  };

  const handleDiseaseDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
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
    try {
      const res = await fetch("/api/predict/disease", {
        method: "POST",
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

  // Land valuation estimator
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

  // Soil analysis client-side logic
  const handleSoilAnalysis = (e) => {
    e.preventDefault();
    const n = parseFloat(soilN);
    const ph = parseFloat(soilPh);
    if (isNaN(n) && isNaN(ph)) {
      alert("Enter soil parameters (minimum Nitrogen or pH)");
      return;
    }

    const p = parseFloat(soilP || 0);
    const k = parseFloat(soilK || 0);
    const oc = parseFloat(soilOc || 0);

    const alerts = [];
    if (n < 50) alerts.push("Low Nitrogen — Apply Urea 120 kg/ha");
    if (n > 150) alerts.push("High Nitrogen — Reduce N fertilizer");
    if (p < 25) alerts.push("Low Phosphorus — Apply DAP 60 kg/ha");
    if (k < 50) alerts.push("Low Potassium — Apply MOP 80 kg/ha");
    if (ph < 5.5) alerts.push("Acidic soil — Apply lime 2 t/ha");
    if (ph > 8) alerts.push("Alkaline soil — Apply gypsum 4 t/ha");
    if (oc < 0.5) alerts.push("Low organic matter — Add FYM 5 t/ha");

    setSoilResult(alerts);
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
            {Array.from({ length: 18 }).map((_, i) => {
              const size = Math.random() * 6 + 3;
              return (
                <div 
                  key={i} 
                  className="particle" 
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 15 + 10}s`,
                    animationDelay: `${Math.random() * -20}s`
                  }} 
                />
              );
            })}
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

              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: "8px", marginBottom: "16px" }}
                onClick={() => predictCrop()}
                disabled={cropPredicting}
              >
                {cropPredicting ? <span className="spinner"></span> : <RefreshCw size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />} 
                Refresh Recommendations
              </button>

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
              <h4 style={{ textAlign: "left" }}>Upload Leaf Image</h4>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LAND PRICE PREDICTION ===== */}
      <section id="land" className="tool-section">
        <div className="container">
          <div className="tool-layout">
            <div className="tool-content text-left">
              <div className="tool-badge">
                <span className="badge badge-earth">
                  <IndianRupee size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> ML Regression
                </span>
              </div>
              <h2 className="tool-title">Land Price<br />Estimator</h2>
              <p className="tool-desc">
                Get an estimated land valuation based on location, land size,
                irrigation type, soil quality, and proximity to roads. Powered by
                a Gradient Boosting regressor.
              </p>
            </div>
            <div className="tool-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <h4 style={{ textAlign: "left" }}>Land Details</h4>
              <form onSubmit={handleLandEstimate} style={{ textAlign: "left" }}>
                <div className="form-group">
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
                  </select>
                  <label className="form-label" style={{ transform: landState ? "translateY(-18px) scale(0.85)" : "none" }}>State / Region</label>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
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
                      <option value="1">Black</option>
                      <option value="2">Red</option>
                      <option value="3">Loamy</option>
                      <option value="4">Sandy</option>
                      <option value="5">Alluvial</option>
                    </select>
                    <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>Soil Type</label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <select 
                      className="form-select"
                      value={landIrrigation}
                      onChange={(e) => setLandIrrigation(e.target.value)}
                    >
                      <option value="1">Canal</option>
                      <option value="2">Borewell</option>
                      <option value="3">Rain-fed</option>
                      <option value="4">Drip</option>
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
                  style={{ width: "100%", marginTop: "8px" }}
                  disabled={landEstimating}
                >
                  {landEstimating ? <span className="spinner"></span> : <IndianRupee size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />} 
                  Estimate Value
                </button>
              </form>
              {landResult && (
                <div className="result-box visible" style={{ textAlign: "left" }}>
                  <div className="result-title">Estimated Land Value</div>
                  <div className="result-value">₹{landResult.total_value.toLocaleString("en-IN")}</div>
                  <div className="result-sub">
                    ≈ ₹{landResult.per_acre.toLocaleString("en-IN")} per acre | Confidence: {landResult.confidence}
                  </div>
                </div>
              )}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      {marketLoading ? "Loading market rates..." : "No market rates available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== SOIL ANALYSIS ===== */}
      <section id="soil" className="tool-section">
        <div className="container">
          <div className="tool-layout">
            <div className="tool-content text-left">
              <div className="tool-badge">
                <span className="badge badge-earth">
                  <TestTube size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} /> Soil Science
                </span>
              </div>
              <h2 className="tool-title">Soil Analysis &<br />Recommendations</h2>
              <p className="tool-desc">
                Enter your soil test parameters and receive specific fertilizer
                dosage recommendations, deficiency warnings, and crop suitability
                scores tailored for Indian agriculture.
              </p>
            </div>
            <div className="tool-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight"></div>
              <h4 style={{ textAlign: "left" }}>Soil Test Report Values</h4>
              <form onSubmit={handleSoilAnalysis} style={{ textAlign: "left" }}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={soilN}
                      onChange={(e) => setSoilN(e.target.value)}
                      placeholder=" "
                    />
                    <label className="form-label">N (kg/ha)</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={soilP}
                      onChange={(e) => setSoilP(e.target.value)}
                      placeholder=" "
                    />
                    <label className="form-label">P (kg/ha)</label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={soilK}
                      onChange={(e) => setSoilK(e.target.value)}
                      placeholder=" "
                    />
                    <label className="form-label">K (kg/ha)</label>
                  </div>
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={soilPh}
                      onChange={(e) => setSoilPh(e.target.value)}
                      placeholder=" "
                      step="0.1"
                    />
                    <label className="form-label">pH</label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-input"
                      value={soilOc}
                      onChange={(e) => setSoilOc(e.target.value)}
                      placeholder=" "
                      step="0.01"
                    />
                    <label className="form-label">Organic Carbon (%)</label>
                  </div>
                  <div className="form-group">
                    <select 
                      className="form-select"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                    >
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="loam">Loamy</option>
                      <option value="sandy">Sandy</option>
                    </select>
                    <label className="form-label" style={{ transform: "translateY(-18px) scale(0.85)" }}>Soil Type</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  <TestTube size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} /> Analyze Soil
                </button>
              </form>
              {soilResult !== null && (
                <div className="result-box visible" style={{ textAlign: "left" }}>
                  <div className="result-title">Soil Status</div>
                  {soilResult.length > 0 ? (
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {soilResult.map((alertItem, idx) => (
                        <li key={idx} style={{ fontSize: "0.85rem", color: "var(--earth-200)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <AlertTriangle size={14} style={{ color: "var(--earth-400)" }} /> {alertItem}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "var(--green-400)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle size={16} /> Soil is in good condition for most crops!
                    </div>
                  )}
                </div>
              )}
            </div>
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

      {/* Voice Assistant Bot Bubble */}
      <div className="voice-bot">
        {showBotBubble && (
          <div className="bot-bubble" id="botBubble" style={{ display: "block" }}>
            {botBubbleText}
          </div>
        )}
        <button 
          className={`bot-btn ${isListening ? "listening" : ""}`} 
          onClick={toggleVoice} 
          id="voiceBtn"
        >
          <Mic size={24} style={{ color: "white", margin: "0 auto" }} />
        </button>
      </div>
    </>
  );
}

export default App;
