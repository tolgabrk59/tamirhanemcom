#!/usr/bin/env python3
"""DuckDuckGo Search kütüphanesi ile araç resmi indirme"""

import os
import re
import urllib.request
from duckduckgo_search import DDGS

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def download_image(url, output_path):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())
        return True
    except Exception as e:
        print(f"  İndirme hatası: {e}")
        return False

# Test
test_cars = [
    ("BMW", "3_Series"),
    ("MERCEDES", "C_Class"),
    ("VOLKSWAGEN", "Golf"),
]

ddgs = DDGS()

for brand, model in test_cars:
    brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
    os.makedirs(brand_dir, exist_ok=True)
    output_path = os.path.join(brand_dir, clean_filename(model) + ".jpg")

    search_term = f"{brand} {model.replace('_', ' ')} car"
    print(f"Araniyor: {search_term}...")

    try:
        results = list(ddgs.images(keywords=search_term, max_results=1))
        if results:
            img_url = results[0]['image']
            print(f"  URL: {img_url[:60]}...")
            if download_image(img_url, output_path):
                size = os.path.getsize(output_path)
                print(f"  ✓ Başarılı ({size} bytes)")
            else:
                print(f"  ✗ İndirme başarısız")
        else:
            print(f"  ✗ Sonuç bulunamadı")
    except Exception as e:
        print(f"  ✗ Arama hatası: {e}")
