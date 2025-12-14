#!/usr/bin/env python3
"""
Araç resimleri indirme scripti
Veritabanındaki marka/model kombinasyonları için Unsplash'tan resim indirir
"""

import os
import re
import time
import urllib.request
import mysql.connector
from urllib.parse import quote

BASE_DIR = "/home/dietpi/tamirhanem-next/aracresimleri"

def clean_filename(name):
    """Dosya adı için geçersiz karakterleri temizle"""
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('/', '-')
    return name[:100]  # Max 100 karakter

def extract_base_model(model_name):
    """Model isminden ana model adını çıkar (motor bilgisi vs hariç)"""
    # İlk 1-2 kelimeyi al (genellikle ana model adı)
    parts = model_name.split()
    if len(parts) >= 2:
        # Sayı içermiyorsa ilk 2 kelimeyi al
        if not any(c.isdigit() for c in parts[0]):
            return ' '.join(parts[:2])
        return parts[0]
    return model_name

def download_image(brand, model, output_path):
    """Unsplash'tan araç resmi indir"""
    if os.path.exists(output_path):
        return True  # Zaten var

    base_model = extract_base_model(model)
    search_term = f"{brand} {base_model} car"
    encoded_term = quote(search_term)

    # Unsplash source API - ücretsiz ve API key gerektirmez
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

def main():
    # MySQL bağlantısı
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        unix_socket="/run/mysqld/mysqld.sock",
        database="randevu_db"
    )
    cursor = conn.cursor()

    # Benzersiz marka/model çiftlerini al
    cursor.execute("""
        SELECT DISTINCT brand, model
        FROM arac_datasis
        ORDER BY brand, model
    """)

    rows = cursor.fetchall()
    total = len(rows)
    print(f"Toplam {total} araç resmi indirilecek...")

    downloaded = 0
    skipped = 0
    failed = 0

    for i, (brand, model) in enumerate(rows, 1):
        brand_dir = os.path.join(BASE_DIR, clean_filename(brand))
        os.makedirs(brand_dir, exist_ok=True)

        filename = clean_filename(model) + ".jpg"
        output_path = os.path.join(brand_dir, filename)

        if os.path.exists(output_path):
            skipped += 1
            continue

        print(f"[{i}/{total}] {brand} - {model[:50]}...")

        if download_image(brand, model, output_path):
            downloaded += 1
        else:
            failed += 1

        # Rate limiting - çok hızlı istek atmayalım
        time.sleep(0.5)

        # Her 100 araçta durum raporu
        if i % 100 == 0:
            print(f"\n--- Durum: {downloaded} indirildi, {skipped} atlandı, {failed} hata ---\n")

    cursor.close()
    conn.close()

    print(f"\n=== TAMAMLANDI ===")
    print(f"İndirilen: {downloaded}")
    print(f"Zaten var: {skipped}")
    print(f"Hata: {failed}")

if __name__ == "__main__":
    main()
