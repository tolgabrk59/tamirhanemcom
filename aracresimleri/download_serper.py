#!/usr/bin/env python3
"""
Serper.dev ile tüm marka+model araç görsellerini indir
2500 sorgu hakkı var
"""

import os
import re
import json
import time
import urllib.request
import ssl

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"
MODELS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/models.txt"
LOG_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/serper_log.txt"
PROGRESS_FILE = "/home/dietpi/tamirhanem-next/aracresimleri/serper_progress.txt"

SERPER_API_KEY = "c54a2c0b18f493218783bd24abef63aceb9c1b18"

# SSL context
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

def clean_filename(name):
    """Dosya adı için temizle"""
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]

def search_serper_images(brand, model):
    """Serper.dev ile Google Images'da ara (TR lokasyonu, en güncel model)"""
    # En güncel model yılı için 2024/2025 ekle
    query = f"{brand} {model} 2024 2025 car"
    url = "https://google.serper.dev/images"

    data = json.dumps({
        "q": query,
        "num": 5,
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
                # En büyük boyutlu görseli seç
                best_img = None
                best_size = 0

                for img in result['images'][:5]:
                    width = img.get('imageWidth', 0)
                    height = img.get('imageHeight', 0)
                    size = width * height

                    # YouTube thumbnail'lerini atla
                    if 'youtube.com' in img.get('domain', ''):
                        continue

                    if size > best_size and img.get('imageUrl'):
                        best_size = size
                        best_img = img['imageUrl']

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
            content = response.read()

            # Minimum boyut kontrolü (5KB)
            if len(content) < 5000:
                return False

            with open(output_path, 'wb') as f:
                f.write(content)
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
    """İlerlemeyi yükle"""
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
    print(f"Başlangıç: {start_index + 1}. modelden devam")
    print(f"Kalan API sorgusu: ~{2500 - start_index}")
    print("=" * 60)

    downloaded = 0
    failed = 0
    skipped = 0
    api_calls = 0

    with open(LOG_FILE, 'a') as log:
        log.write(f"\n{'='*60}\n")
        log.write(f"Oturum: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        log.write(f"Başlangıç: {start_index}\n")
        log.write(f"{'='*60}\n")

        for i, (brand, model) in enumerate(models):
            if i < start_index:
                continue

            # Marka klasörü
            brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
            os.makedirs(brand_dir, exist_ok=True)

            # Model dosya adı
            model_filename = clean_filename(model)

            # Zaten var mı?
            existing = [f for f in os.listdir(brand_dir) if f.startswith(model_filename + '.')]
            if existing:
                print(f"[{i+1}/{total}] {brand} {model} - zaten var")
                skipped += 1
                save_progress(i + 1)
                continue

            print(f"[{i+1}/{total}] {brand} {model}...", end=" ", flush=True)

            # Serper API'den ara
            img_url = search_serper_images(brand, model)
            api_calls += 1

            if img_url:
                ext = get_file_extension(img_url)
                output_path = os.path.join(brand_dir, f"{model_filename}{ext}")

                if download_image(img_url, output_path):
                    downloaded += 1
                    print("✓")
                    log.write(f"[{i+1}] {brand} {model} - OK\n")
                else:
                    failed += 1
                    print("✗ (indirme hatası)")
                    log.write(f"[{i+1}] {brand} {model} - FAIL\n")
            else:
                failed += 1
                print("✗ (bulunamadı)")
                log.write(f"[{i+1}] {brand} {model} - NOT FOUND\n")

            save_progress(i + 1)

            # Rate limiting
            time.sleep(0.3)

            # Her 100'de durum
            if (i + 1) % 100 == 0:
                print(f"\n--- API: {api_calls} | OK: {downloaded} | Hata: {failed} | Atlandı: {skipped} ---\n")

    print(f"\n{'='*60}")
    print(f"TAMAMLANDI!")
    print(f"API sorgusu: {api_calls}")
    print(f"İndirilen: {downloaded}")
    print(f"Hata: {failed}")
    print(f"Atlanan: {skipped}")

if __name__ == "__main__":
    main()
