#!/usr/bin/env python3
"""Pexels API ile araç resmi indirme"""

import os
import re
import json
import urllib.request
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
# Pexels API key - ücretsiz key al: https://www.pexels.com/api/
PEXELS_API_KEY = "K7cc1eqjqbqVHJ0Y7Q3RqUfVYZJeHWnzwUOcZuN8YqlmYVhLmYwF2UyU"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def download_from_pexels(brand, model, output_path):
    search_term = f"{brand} {model} car"
    encoded_term = quote(search_term)
    api_url = f"https://api.pexels.com/v1/search?query={encoded_term}&per_page=1"

    try:
        req = urllib.request.Request(api_url)
        req.add_header('Authorization', PEXELS_API_KEY)

        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())

        if data['photos']:
            img_url = data['photos'][0]['src']['medium']
            urllib.request.urlretrieve(img_url, output_path)
            return True
        return False
    except Exception as e:
        print(f"  Hata: {e}")
        return False

# Test
test_cars = [("BMW", "320i"), ("MERCEDES", "C180")]
for brand, model in test_cars:
    brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
    os.makedirs(brand_dir, exist_ok=True)
    output_path = os.path.join(brand_dir, clean_filename(model) + ".jpg")

    print(f"İndiriliyor: {brand} {model}...")
    if download_from_pexels(brand, model, output_path):
        print(f"  ✓ Başarılı")
    else:
        print(f"  ✗ Başarısız")
