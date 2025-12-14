#!/usr/bin/env python3
"""Test scripti - sadece 5 resim indir"""

import os
import re
import urllib.request
from urllib.parse import quote
import mysql.connector

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def extract_base_model(model_name):
    parts = model_name.split()
    if len(parts) >= 2:
        if not any(c.isdigit() for c in parts[0]):
            return ' '.join(parts[:2])
        return parts[0]
    return model_name

def download_image(brand, model, output_path):
    base_model = extract_base_model(model)
    search_term = f"{brand} {base_model} car"
    encoded_term = quote(search_term)
    url = f"https://source.unsplash.com/800x600/?{encoded_term}"

    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"  Hata: {e}")
        return False

# Test: 5 farklı markadan birer araç
test_cars = [
    ("BMW", "320i"),
    ("MERCEDES", "C180"),
    ("VOLKSWAGEN", "Golf"),
    ("RENAULT", "Clio"),
    ("TOYOTA", "Corolla")
]

for brand, model in test_cars:
    brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
    os.makedirs(brand_dir, exist_ok=True)

    filename = clean_filename(model) + ".jpg"
    output_path = os.path.join(brand_dir, filename)

    print(f"İndiriliyor: {brand} {model}...")
    if download_image(brand, model, output_path):
        size = os.path.getsize(output_path)
        print(f"  ✓ Başarılı ({size} bytes)")
    else:
        print(f"  ✗ Başarısız")
