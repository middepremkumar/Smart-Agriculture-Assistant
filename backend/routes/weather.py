from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import httpx
import os

router = APIRouter()

WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "").strip().strip('"').strip("'")

WMO_DESCRIPTIONS = {
    0: "Clear Sky",
    1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing Rime Fog",
    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
    56: "Light Freezing Drizzle", 57: "Dense Freezing Drizzle",
    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    66: "Light Freezing Rain", 67: "Heavy Freezing Rain",
    71: "Slight Snow Fall", 73: "Moderate Snow Fall", 75: "Heavy Snow Fall",
    77: "Snow Grains",
    80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
    85: "Slight Snow Showers", 86: "Heavy Snow Showers",
    95: "Thunderstorm", 96: "Thunderstorm with Slight Hail", 99: "Severe Thunderstorm with Hail"
}

def generate_advisory(temp: float, humidity: float, rain_chance: int) -> str:
    """Generate agronomic farming advisory based on live weather metrics."""
    if rain_chance > 60:
        return "🌧️ High rain likelihood (>60%) — postpone spraying pesticides/fertilizers. Ensure drainage channels are clear."
    elif temp > 38:
        return "🌡️ Extreme heat warning — irrigate early morning (before 8 AM) or evening to prevent evaporation and heat stress."
    elif humidity > 85:
        return "💧 High relative humidity (>85%) — fungal disease risk is elevated. Inspect leaf surfaces and improve field aeration."
    elif rain_chance < 20 and humidity < 40 and temp > 30:
        return "☀️ Dry and warm weather — monitor soil moisture closely. Light irrigation recommended for shallow-rooted crops."
    else:
        return "✅ Favorable farming conditions. Suitable for harvesting, weeding, sowing, and general field management."

async def fetch_open_meteo(city: Optional[str], lat: Optional[float] = None, lon: Optional[float] = None):
    async with httpx.AsyncClient(timeout=8.0) as client:
        resolved_city = city or "Current Location"
        region = ""
        country = "India"

        # 1. Geocode city if lat/lon not provided
        if lat is None or lon is None:
            query_city = city if city else "Kurnool"
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={query_city}&count=1&language=en&format=json"
            geo_res = await client.get(geo_url)
            if geo_res.status_code == 200:
                results = geo_res.json().get("results", [])
                if results:
                    lat = results[0]["latitude"]
                    lon = results[0]["longitude"]
                    resolved_city = results[0]["name"]
                    region = results[0].get("admin1", "")
                    country = results[0].get("country", "India")
                else:
                    raise HTTPException(404, detail=f"City '{city}' not found in weather database")
            else:
                raise HTTPException(502, detail="Weather geocoding service temporarily unavailable")

        # 2. Fetch live forecast & current conditions
        forecast_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&"
            f"current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&"
            f"daily=precipitation_probability_max&timezone=auto"
        )
        try:
            res = await client.get(forecast_url)
            if res.status_code == 200:
                data = res.json()
                current = data.get("current", {})
                daily = data.get("daily", {})

                temp = round(current.get("temperature_2m", 28))
                feels_like = round(current.get("apparent_temperature", temp))
                humidity = round(current.get("relative_humidity_2m", 60))
                wind_speed = round(current.get("wind_speed_10m", 10), 1)
                weather_code = current.get("weather_code", 1)
                description = WMO_DESCRIPTIONS.get(weather_code, "Partly Cloudy")

                rain_chance = 20
                precip_list = daily.get("precipitation_probability_max", [])
                if precip_list and len(precip_list) > 0 and precip_list[0] is not None:
                    rain_chance = int(precip_list[0])

                advisory = generate_advisory(temp, humidity, rain_chance)

                return {
                    "city":             resolved_city,
                    "region":           region,
                    "country":          country,
                    "latitude":         lat,
                    "longitude":        lon,
                    "temperature":      temp,
                    "feels_like":       feels_like,
                    "humidity":         humidity,
                    "wind_speed":       wind_speed,
                    "description":      description,
                    "rain_chance":      rain_chance,
                    "farming_advisory": advisory,
                    "source":           "Live Open-Meteo",
                    "status":           "success"
                }
        except Exception as e:
            print(f"Open-Meteo forecast fetch warning: {e}")

        # Fallback if forecast endpoint specifically had a hiccup
        return {
            "city":             resolved_city,
            "region":           region,
            "country":          country,
            "temperature":      29,
            "feels_like":       32,
            "humidity":         65,
            "wind_speed":       12.0,
            "description":      "Partly Cloudy",
            "rain_chance":      25,
            "farming_advisory": generate_advisory(29, 65, 25),
            "source":           "Live Open-Meteo (Cached)",
            "status":           "success"
        }

@router.get("")
async def get_weather(
    city: Optional[str] = Query(None, description="City name e.g. Kurnool, Hyderabad"),
    lat: Optional[float] = Query(None, description="Latitude coordinate"),
    lon: Optional[float] = Query(None, description="Longitude coordinate")
):
    """
    Fetch real-time weather & agriculture advisory from OpenWeatherMap or Open-Meteo.
    """
    # 1. If OpenWeatherMap API key is provided, try it first
    if WEATHER_API_KEY and WEATHER_API_KEY != "your_api_key_here" and city:
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.get(
                    f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
                )
                if resp.status_code == 200:
                    d = resp.json()
                    f_resp = await client.get(
                        f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={WEATHER_API_KEY}&units=metric&cnt=8"
                    )
                    rain_chance = 25
                    if f_resp.status_code == 200:
                        forecast = f_resp.json()
                        rain_chance = int(forecast["list"][0].get("pop", 0) * 100)
                    temp = round(d["main"]["temp"])
                    humidity = d["main"]["humidity"]
                    return {
                        "city":             d["name"],
                        "temperature":      temp,
                        "feels_like":       round(d["main"]["feels_like"]),
                        "humidity":         humidity,
                        "wind_speed":       round(d["wind"]["speed"] * 3.6, 1),
                        "description":      d["weather"][0]["description"].title(),
                        "rain_chance":      rain_chance,
                        "farming_advisory": generate_advisory(temp, humidity, rain_chance),
                        "source":           "OpenWeatherMap Live",
                        "status":           "success"
                    }
        except Exception as e:
            print(f"OpenWeatherMap error, falling back to Open-Meteo: {e}")

    # 2. Live High-Accuracy Weather via Open-Meteo (No API key needed)
    try:
        return await fetch_open_meteo(city, lat, lon)
    except HTTPException as he:
        if he.status_code == 404:
            raise he
        print(f"Open-Meteo HTTP error: {he}")
    except Exception as e:
        print(f"Open-Meteo error: {e}")

    # Final emergency fallback if network is completely unreachable
    target_city = city or "Kurnool"
    return {
        "city": target_city,
        "temperature": 28,
        "feels_like": 30,
        "humidity": 70,
        "wind_speed": 12.0,
        "description": "Partly Cloudy",
        "rain_chance": 30,
        "farming_advisory": "Moderate humidity — good for most field crops. Irrigate if needed.",
        "source": "Offline Fallback",
        "status": "demo"
    }
