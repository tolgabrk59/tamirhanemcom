#!/usr/bin/env python3
"""
SearchAPI.io ile tüm marka+model araç görsellerini indir
"""

import os
import re
import json
import time
import urllib.request
import ssl
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
MODELS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/models.txt"
LOG_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/download_models_log.txt"
PROGRESS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/progress.txt"

SEARCHAPI_KEY = "RKvN19279d9NjEH3cKjvN61g"

# SSL context for downloads
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

def clean_filename(name):
    """Dosya adı için temizle"""
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def search_google_images(brand, model):
    """SearchAPI.io ile Google Images'da ara"""
    query = f"{brand} {model} car"
    url = f"https://www.searchapi.io/api/v1/search?engine=google_images&q={quote(query)}&api_key={SEARCHAPI_KEY}"

    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())

            if 'images' in data and len(data['images']) > 0:
                # İlk 3 sonuçtan en büyük boyutlu olanı seç
                best_img = None
                best_size = 0

                for img in data['images'][:3]:
                    if 'original' in img:
                        width = img['original'].get('width', 0)
                        height = img['original'].get('height', 0)
                        size = width * height
                        if size > best_size:
                            best_size = size
                            best_img = img['original']['link']

                return best_img
    except Exception as e:
        print(f"  API hatası: {e}")
    return None

def download_image(url, output_path):
    """Görseli indir"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30, context=ssl_context) as response:
            content_type = response.headers.get('Content-Type', '')
            if 'image' not in content_type and 'octet-stream' not in content_type:
                return False

            with open(output_path, 'wb') as f:
                f.write(response.read())

            # Dosya boyutu kontrolü (en az 5KB)
            if os.path.getsize(output_path) < 5000:
                os.remove(output_path)
                return False
            return True
    except Exception as e:
        print(f"  İndirme hatası: {e}")
        if os.path.exists(output_path):
            os.remove(output_path)
        return False

def get_file_extension(url):
    """URL'den dosya uzantısını al"""
    url_lower = url.lower()
    if '.png' in url_lower:
        return '.png'
    elif '.webp' in url_lower:
        return '.webp'
    elif '.gif' in url_lower:
        return '.gif'
    return '.jpg'

def load_progress():
    """Kaldığı yerden devam etmek için ilerlemeyi yükle"""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return int(f.read().strip())
    return 0

def save_progress(index):
    """İlerlemeyi kaydet"""
    with open(PROGRESS_FILE, 'w') as f:
        f.write(str(index))

def main():
    # Modelleri oku
    models = []
    with open(MODELS_FILE, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 2:
                brand = parts[0].strip()
                model = parts[1].strip()
                models.append((brand, model))

    total = len(models)
    start_index = load_progress()

    print(f"Toplam {total} model için resim indirilecek")
    print(f"Başlangıç: {start_index + 1}. modelden devam ediliyor")
    print("=" * 60)

    downloaded = 0
    failed = 0
    skipped = 0

    with open(LOG_FILE, 'a') as log:
        log.write(f"\n{'='*60}\n")
        log.write(f"Yeni indirme oturumu: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        log.write(f"Başlangıç indeksi: {start_index}\n")
        log.write(f"{'='*60}\n")

        for i, (brand, model) in enumerate(models):
            if i < start_index:
                continue

            # Marka klasörü
            brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
            os.makedirs(brand_dir, exist_ok=True)

            # Model dosya adı
            model_filename = clean_filename(model)

            # Zaten var mı kontrol et
            existing_files = [f for f in os.listdir(brand_dir) if f.startswith(model_filename + '.')]
            if existing_files:
                print(f"[{i+1}/{total}] {brand} {model} - zaten var")
                skipped += 1
                save_progress(i + 1)
                continue

            print(f"[{i+1}/{total}] {brand} {model}...")

            # Google Images'da ara
            img_url = search_google_images(brand, model)

            if img_url:
                ext = get_file_extension(img_url)
                output_path = os.path.join(brand_dir, f"{model_filename}{ext}")

                if download_image(img_url, output_path):
                    downloaded += 1
                    print(f"  ✓ İndirildi")
                    log.write(f"[{i+1}] {brand} {model} - OK\n")
                else:
                    failed += 1
                    print(f"  ✗ İndirilemedi")
                    log.write(f"[{i+1}] {brand} {model} - FAIL (download)\n")
            else:
                failed += 1
                print(f"  ✗ Görsel bulunamadı")
                log.write(f"[{i+1}] {brand} {model} - FAIL (no image)\n")

            save_progress(i + 1)

            # Rate limiting - API limitlerine dikkat
            time.sleep(0.5)

            # Her 50 modelde durum raporu
            if (i + 1) % 50 == 0:
                print(f"\n--- Durum: {downloaded} indirildi, {failed} hata, {skipped} atlandı ---\n")

    print(f"\n{'='*60}")
    print(f"TAMAMLANDI!")
    print(f"İndirilen: {downloaded}")
    print(f"Hata: {failed}")
    print(f"Atlanan (zaten var): {skipped}")

if __name__ == "__main__":
    main()
