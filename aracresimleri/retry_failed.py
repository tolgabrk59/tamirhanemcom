#!/usr/bin/env python3
"""
Hatalı modelleri tekrar dene - farklı arama terimleri ile
"""

import os
import re
import json
import time
import urllib.request
import ssl

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
SERPER_API_KEY = "c54a2c0b18f493218783bd24abef63aceb9c1b18"

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Hatalı modeller
FAILED_MODELS = [
    ("ALFA ROMEO", "BRERA"),
    ("BMW", "216d"),
    ("BMW", "316i"),
    ("BMW", "318"),
    ("BMW", "320"),
    ("CHRYSLER", "CROSSFIRE"),
    ("CHRYSLER", "PT"),
    ("CITROEN", "C-ELLYSE"),
    ("CITROEN", "C-ELYSEE"),
    ("CITROEN", "NEMO"),
    ("DAIHATSU", "CUORE"),
    ("FERRARI", "599"),
    ("FERRARI", "FF"),
    ("FERRARI", "ROMA"),
    ("FIAT", "DUCATO"),
    ("FORD", "T."),
    ("HYUNDAI", "MATRIX"),
    ("JAECOO", "JAECOO"),
    ("KIA", "PREGIO"),
    ("LANCIA", "THEMA"),
    ("LANCIA", "VOYAGER"),
    ("MERCEDES", "MCLAREN"),
    ("MERCEDES", "MERCEDES-MAYBACH"),
    ("MERCURY", "SABLE"),
    ("MITSUBISHI", "L300"),
    ("NISSAN", "NP300"),
    ("OPEL", "MERIVA"),
    ("RENAULT", "MODUS"),
    ("ROLLS-ROYCE", "GHOST"),
    ("SEAT", "ALTEA"),
    ("SSANGYONG", "RODIUS"),
    ("TOYOTA", "4RUNNER"),
    ("TOYOTA", "GT86"),
    ("TOYOTA", "HIACE"),
    ("TOYOTA", "PRIUS"),
    ("VOLKSWAGEN", "BEETLE"),
]

def clean_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def search_serper_images(query):
    """Serper.dev ile ara"""
    url = "https://google.serper.dev/images"
    data = json.dumps({
        "q": query,
        "num": 10,
        "gl": "tr",
        "hl": "tr"
    }).encode('utf-8')

    try:
        req = urllib.request.Request(url, data=data)
        req.add_header('X-API-KEY', SERPER_API_KEY)
        req.add_header('Content-Type', 'application/json')

        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
            if 'images' in result and len(result['images']) > 0:
                for img in result['images']:
                    # YouTube ve sorunlu domainleri atla
                    domain = img.get('domain', '')
                    if any(x in domain for x in ['youtube', 'facebook', 'instagram', 'pinterest']):
                        continue
                    if img.get('imageUrl'):
                        return img['imageUrl']
    except Exception as e:
        print(f"    API hatası: {e}")
    return None

def download_image(url, output_path):
    """Görseli indir"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.google.com/'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            content = response.read()
            if len(content) < 5000:
                return False
            with open(output_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"    İndirme hatası: {e}")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False

def get_file_extension(url):
    url_lower = url.lower()
    if '.png' in url_lower:
        return '.png'
    elif '.webp' in url_lower:
        return '.webp'
    return '.jpg'

def main():
    print(f"Toplam {len(FAILED_MODELS)} hatalı model tekrar denenecek")
    print("=" * 60)

    success = 0
    failed = 0

    for brand, model in FAILED_MODELS:
        brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
        model_filename = clean_filename(model)

        # Zaten var mı?
        existing = [f for f in os.listdir(brand_dir) if f.startswith(model_filename + '.')]
        if existing:
            print(f"[SKIP] {brand} {model} - zaten var")
            continue

        print(f"[RETRY] {brand} {model}...")

        # Farklı arama terimleri dene
        search_queries = [
            f"{brand} {model} araba",
            f"{brand} {model} car 2024",
            f"{brand} {model} vehicle",
            f"{brand} {model}",
        ]

        found = False
        for query in search_queries:
            print(f"  Deneniyor: {query}")
            img_url = search_serper_images(query)

            if img_url:
                ext = get_file_extension(img_url)
                output_path = os.path.join(brand_dir, f"{model_filename}{ext}")

                if download_image(img_url, output_path):
                    success += 1
                    print(f"  ✓ İndirildi!")
                    found = True
                    break

            time.sleep(0.3)

        if not found:
            failed += 1
            print(f"  ✗ Bulunamadı")

        time.sleep(0.5)

    print(f"\n{'='*60}")
    print(f"TAMAMLANDI!")
    print(f"Başarılı: {success}")
    print(f"Hala hatalı: {failed}")

if __name__ == "__main__":
    main()
