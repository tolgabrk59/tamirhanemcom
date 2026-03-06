#!/usr/bin/env python3
"""
NHTSA Recall Verilerini Strapi (MySQL) Veritabanına Aktar
"""

import json
import mysql.connector
from datetime import datetime
import os

# Veritabanı bağlantı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'dietpi',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

# Dosya yolu
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'recalls.json')

def parse_date(date_str):
    """Tarih string'ini MySQL date formatına çevir"""
    if not date_str:
        return None
    try:
        # Format: DD/MM/YYYY
        parts = date_str.split('/')
        if len(parts) == 3:
            return f"{parts[2]}-{parts[1]}-{parts[0]}"
    except:
        pass
    return None

def extract_brand_from_manufacturer(manufacturer):
    """Üretici adından marka çıkar"""
    brand_map = {
        'Toyota': 'TOYOTA',
        'Honda': 'HONDA',
        'Volkswagen': 'VOLKSWAGEN',
        'Ford': 'FORD',
        'BMW': 'BMW',
        'Mercedes': 'MERCEDES',
        'Audi': 'AUDI',
        'Nissan': 'NISSAN',
        'Hyundai': 'HYUNDAI',
        'Kia': 'KIA',
        'Mazda': 'MAZDA',
        'Subaru': 'SUBARU',
        'Chrysler': 'CHRYSLER',
        'Jeep': 'JEEP',
        'Dodge': 'DODGE',
        'Ram': 'RAM',
        'Chevrolet': 'CHEVROLET',
        'GMC': 'GMC',
        'Cadillac': 'CADILLAC',
        'Buick': 'BUICK',
        'Porsche': 'PORSCHE',
        'Jaguar': 'JAGUAR',
        'Land Rover': 'LAND ROVER',
        'Tesla': 'TESLA',
        'Volvo': 'VOLVO',
        'Mitsubishi': 'MITSUBISHI',
        'Suzuki': 'SUZUKI',
        'Alfa Romeo': 'ALFA ROMEO',
        'Fiat': 'FIAT',
        'Mini': 'MINI',
        'Lexus': 'LEXUS',
        'Infiniti': 'INFINITI',
        'Acura': 'ACURA',
        'Lincoln': 'LINCOLN',
        'Genesis': 'GENESIS',
    }

    manufacturer_lower = manufacturer.lower() if manufacturer else ''
    for key, value in brand_map.items():
        if key.lower() in manufacturer_lower:
            return value

    # Bulunamazsa üreticinin ilk kelimesini al
    if manufacturer:
        return manufacturer.split()[0].upper()
    return 'DIGER'

def main():
    print("=" * 70)
    print("NHTSA Recall Verilerini Strapi'ye Aktarma")
    print("=" * 70)

    # JSON dosyasını yükle
    print("\n1. Veriler yükleniyor...")
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        recalls = json.load(f)
    print(f"   Toplam kayıt: {len(recalls)}")

    # Veritabanına bağlan
    print("\n2. Veritabanına bağlanılıyor...")
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # Mevcut kayıtları kontrol et
    cursor.execute("SELECT COUNT(*) FROM geri_cagirmalar")
    existing_count = cursor.fetchone()[0]
    print(f"   Mevcut kayıt sayısı: {existing_count}")

    if existing_count > 0:
        print("\n   Mevcut kayıtlar siliniyor...")
        cursor.execute("DELETE FROM geri_cagirmalar")
        conn.commit()

    # Verileri ekle
    print("\n3. Veriler ekleniyor...")

    insert_query = """
        INSERT INTO geri_cagirmalar
        (kampanya_no, marka, model, yil, uretici, bilesen, sikayet, sonuc, cozum, geri_cagirma_tarihi, veri_kaynagi, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    inserted = 0
    errors = 0
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for i, r in enumerate(recalls):
        try:
            # Marka çıkar
            marka = extract_brand_from_manufacturer(r.get('manufacturer', ''))

            # Yıl
            yil = None
            if r.get('year'):
                try:
                    yil = int(r['year'])
                except:
                    pass

            # Tarih
            tarih = parse_date(r.get('recall_date', ''))

            values = (
                r.get('id', ''),
                marka,
                r.get('model', ''),
                yil,
                r.get('manufacturer', ''),
                r.get('component', ''),
                r.get('summary', ''),
                r.get('consequence', ''),
                r.get('remedy', ''),
                tarih,
                'NHTSA',
                now,
                now
            )

            cursor.execute(insert_query, values)
            inserted += 1

            if inserted % 100 == 0:
                print(f"   {inserted}/{len(recalls)} kayıt eklendi...")
                conn.commit()

        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"   Hata ({r.get('id')}): {e}")

    conn.commit()

    # Özet
    print("\n" + "=" * 70)
    print("TAMAMLANDI")
    print("=" * 70)
    print(f"Eklenen: {inserted}")
    print(f"Hatalı: {errors}")
    print("=" * 70)

    # Son kontrol
    cursor.execute("SELECT COUNT(*) FROM geri_cagirmalar")
    final_count = cursor.fetchone()[0]
    print(f"\nVeritabanındaki toplam kayıt: {final_count}")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
