#!/usr/bin/env python3
"""
Her marka için 1 genel araç resmi indir
"""

import os
import re
import json
import time
import urllib.request
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
BRANDS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/brands.txt"
PIXABAY_API_KEY = "53697307-c8a4a56d15b30c98e13eae2c2"

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def search_pixabay(query):
    """Pixabay'da resim ara - yandan görünüm tercih et"""
    url = f"https://pixabay.com/api/?key={PIXABAY_API_KEY}&q={quote(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true"

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            if data['hits']:
                # En geniş resmi seç (muhtemelen yandan görünüm)
                best = max(data['hits'], key=lambda x: x['imageWidth'])
                return best['webformatURL']
    except Exception as e:
        print(f"  API hatası: {e}")
    return None

def download_image(url, output_path):
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
    with open(BRANDS_FILE, 'r') as f:
        brands = [line.strip() for line in f if line.strip()]

    total = len(brands)
    print(f"Toplam {total} marka için resim indirilecek...")
    print("="*50)

    downloaded = 0
    failed = 0

    for i, brand in enumerate(brands, 1):
        brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
        os.makedirs(brand_dir, exist_ok=True)

        output_path = os.path.join(brand_dir, "default.jpg")

        if os.path.exists(output_path):
            print(f"[{i}/{total}] {brand} - zaten var")
            continue

        # Marka + car araması
        search_term = f"{brand} car side view"
        print(f"[{i}/{total}] {brand}...")

        img_url = search_pixabay(search_term)
        if img_url:
            if download_image(img_url, output_path):
                downloaded += 1
                print(f"  ✓ İndirildi")
            else:
                failed += 1
        else:
            # Sadece marka ismi ile dene
            img_url = search_pixabay(f"{brand} automobile")
            if img_url and download_image(img_url, output_path):
                downloaded += 1
                print(f"  ✓ İndirildi (alternatif)")
            else:
                failed += 1
                print(f"  ✗ Bulunamadı")

        time.sleep(0.6)

    print(f"\n{'='*50}")
    print(f"TAMAMLANDI!")
    print(f"İndirilen: {downloaded}")
    print(f"Hata: {failed}")

if __name__ == "__main__":
    main()
