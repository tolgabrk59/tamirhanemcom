#!/usr/bin/env python3
"""DuckDuckGo Image Search ile araç resmi indirme"""

import os
import re
import json
import urllib.request
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def get_ddg_image(search_term):
    """DuckDuckGo'dan resim URL'si al"""
    try:
        # DuckDuckGo image search token al
        token_url = f"https://duckduckgo.com/?q={quote(search_term)}&iax=images&ia=images"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(token_url, headers=headers)

        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode()

        # vqd token bul
        import re
        vqd_match = re.search(r'vqd=["\']([^"\']+)["\']', html)
        if not vqd_match:
            return None

        vqd = vqd_match.group(1)

        # Resim arama API'si
        api_url = f"https://duckduckgo.com/i.js?l=tr-tr&o=json&q={quote(search_term)}&vqd={vqd}&f=,,,&p=1"
        req = urllib.request.Request(api_url, headers=headers)

        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

        if data.get('results'):
            return data['results'][0]['image']
        return None
    except Exception as e:
        print(f"  DDG Hata: {e}")
        return None

def download_image(url, output_path):
    """Resmi indir"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
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
    ("BMW", "3 Series"),
    ("MERCEDES", "C Class"),
    ("VOLKSWAGEN", "Golf"),
]

for brand, model in test_cars:
    brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
    os.makedirs(brand_dir, exist_ok=True)
    output_path = os.path.join(brand_dir, clean_filename(model) + ".jpg")

    search_term = f"{brand} {model} car photo"
    print(f"Araniyor: {search_term}...")

    img_url = get_ddg_image(search_term)
    if img_url:
        print(f"  URL bulundu, indiriliyor...")
        if download_image(img_url, output_path):
            size = os.path.getsize(output_path)
            print(f"  ✓ Başarılı ({size} bytes)")
        else:
            print(f"  ✗ İndirme başarısız")
    else:
        print(f"  ✗ Resim bulunamadı")
