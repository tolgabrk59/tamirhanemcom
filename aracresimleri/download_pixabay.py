#!/usr/bin/env python3
"""
Pixabay API ile araç resmi indirme
Sadece benzersiz marka + ana model için resim indirir
"""

import os
import re
import json
import time
import urllib.request
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
MODELS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/models.txt"
PIXABAY_API_KEY = "53697307-c8a4a56d15b30c98e13eae2c2"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def search_pixabay(query):
    """Pixabay'da resim ara"""
    url = f"https://pixabay.com/api/?key={PIXABAY_API_KEY}&q={quote(query)}&image_type=photo&per_page=3&safesearch=true"

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            if data['hits']:
                return data['hits'][0]['webformatURL']
    except Exception as e:
        print(f"  API hatası: {e}")
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

def main():
    # Dosyadan model listesini oku
    with open(MODELS_FILE, 'r') as f:
        lines = f.readlines()

    rows = []
    for line in lines:
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            rows.append((parts[0], parts[1]))

    total = len(rows)
    print(f"Toplam {total} benzersiz araç modeli için resim indirilecek...")
    print("="*50)

    downloaded = 0
    skipped = 0
    failed = 0

    for i, (brand, base_model) in enumerate(rows, 1):
        brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
        os.makedirs(brand_dir, exist_ok=True)

        filename = clean_filename(base_model) + ".jpg"
        output_path = os.path.join(brand_dir, filename)

        if os.path.exists(output_path):
            skipped += 1
            continue

        search_term = f"{brand} {base_model} car side view full"
        print(f"[{i}/{total}] {brand} {base_model}...")

        img_url = search_pixabay(search_term)
        if img_url:
            if download_image(img_url, output_path):
                downloaded += 1
                print(f"  ✓ İndirildi")
            else:
                failed += 1
        else:
            # Sadece marka ile dene
            img_url = search_pixabay(f"{brand} car")
            if img_url and download_image(img_url, output_path):
                downloaded += 1
                print(f"  ✓ İndirildi (marka resmi)")
            else:
                failed += 1
                print(f"  ✗ Bulunamadı")

        # Rate limiting
        time.sleep(0.6)

        if i % 50 == 0:
            print(f"\n--- Durum: {downloaded} indirildi, {skipped} atlandı, {failed} hata ---\n")

    print(f"\n{'='*50}")
    print(f"TAMAMLANDI!")
    print(f"İndirilen: {downloaded}")
    print(f"Zaten var: {skipped}")
    print(f"Hata: {failed}")

if __name__ == "__main__":
    main()
