import os
import requests

def download_file(url, dest_path):
    print(f"Downloading {url} -> {dest_path}")
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, stream=True, timeout=60)
    response.raise_for_status()
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=1024 * 64):
            if chunk:
                f.write(chunk)
    size = os.path.getsize(dest_path)
    print(f"Successfully downloaded {dest_path} ({size / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    url = "https://huggingface.co/onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX/resolve/main/onnx/model.onnx"
    dest = os.path.join(os.path.dirname(__file__), "../backend/ml_models/disease_model.onnx")
    download_file(url, os.path.abspath(dest))
