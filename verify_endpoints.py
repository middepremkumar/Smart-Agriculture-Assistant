import requests

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, func):
    try:
        print(f"Testing {name:.<45} ", end="")
        res = func()
        if res:
            print("SUCCESS")
        else:
            print("FAILED")
    except Exception as e:
        print(f"ERROR: {e}")

def run_tests():
    # 1. Root serving
    def test_root():
        r = requests.get(f"{BASE_URL}/")
        return r.status_code == 200 and "Smart Agriculture Assistant" in r.text
    test_endpoint("Root Page (/) serving", test_root)

    # 2. Favicon
    def test_favicon():
        r = requests.get(f"{BASE_URL}/favicon.svg")
        return r.status_code == 200
    test_endpoint("Favicon serving", test_favicon)

    # 3. Crop Prediction
    def test_crop():
        r = requests.post(f"{BASE_URL}/api/predict/crop", json={
            "nitrogen": 80.0,
            "phosphorus": 40.0,
            "potassium": 40.0,
            "ph": 6.5,
            "temperature": 25.0,
            "humidity": 70.0,
            "rainfall": 100.0,
            "top_n": 3
        })
        return r.status_code == 200 and "recommendations" in r.json()
    test_endpoint("Crop Prediction API", test_crop)

    # 4. Land Valuation
    def test_land():
        r = requests.post(f"{BASE_URL}/api/predict/land", json={
            "state": "AP",
            "area_acres": 2.5,
            "soil_type": 1,
            "irrigation": 1,
            "road_km": 1.0
        })
        return r.status_code == 200 and "total_value" in r.json()
    test_endpoint("Land Valuation API", test_land)

    # 5. Weather
    def test_weather():
        r = requests.get(f"{BASE_URL}/api/weather?city=Hyderabad")
        return r.status_code == 200 and "temperature" in r.json()
    test_endpoint("Weather Forecast API", test_weather)

    # 6. Market Prices
    def test_market():
        r = requests.get(f"{BASE_URL}/api/market/prices?category=all")
        return r.status_code == 200 and "data" in r.json()
    test_endpoint("Market Prices Tracker API", test_market)

    # 7. Survey Submission
    def test_survey():
        r = requests.post(f"{BASE_URL}/api/survey/submit", json={
            "name": "Verification Test",
            "village": "Test Village",
            "crop": "Paddy",
            "challenge": "Low market prices",
            "phone_access": "Yes, with internet",
            "language": "en"
        })
        return r.status_code == 200 and r.json().get("status") == "success"
    test_endpoint("Farmer Survey API", test_survey)

    # 8. Chat Companion
    def test_chat():
        r = requests.post(f"{BASE_URL}/api/chat", json={
            "message": "Hello",
            "location": "Hyderabad",
            "weather": "Sunny"
        })
        return r.status_code == 200 and "response" in r.json()
    test_endpoint("Gemini Voice AI Chatbot API", test_chat)

    # 9. Disease Prediction (Multipart Form upload)
    def test_disease():
        from PIL import Image
        import io
        img = Image.new('RGB', (10, 10), color='green')
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        png_data = img_byte_arr.getvalue()
        
        files = {'file': ('test.png', png_data, 'image/png')}
        r = requests.post(f"{BASE_URL}/api/predict/disease", files=files)
        if r.status_code != 200:
            print(f" (Status: {r.status_code}, Response: {r.text})", end="")
        return r.status_code == 200 and "disease" in r.json()
    test_endpoint("Leaf Disease Classifier API", test_disease)

if __name__ == "__main__":
    run_tests()
