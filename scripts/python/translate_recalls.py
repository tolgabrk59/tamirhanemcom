#!/usr/bin/env python3
"""
Kronik Sorunlar Veritabanı - JSON Alan Adlarını Türkçeleştirme Script'i
Bu script, randevu_db.kronik_sorunlar tablosundaki recalls alanındaki
JSON field name'lerini İngilizce'den Türkçe'ye çevirir.
"""

import mysql.connector
import json
import sys

# Veritabanı bağlantı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

# Alan adı çeviri haritası
FIELD_TRANSLATIONS = {
    'campaign_number': 'kampanya_numarasi',
    'component': 'komponent',
    'summary': 'ozet',
    'consequence': 'sonuc',
    'remedy': 'cozum',
    'manufacturer': 'uretici',
    'report_date': 'rapor_tarihi'
}

def translate_recall_fields(recall_data):
    """Tek bir recall objesinin alan adlarını çevir"""
    if not isinstance(recall_data, dict):
        return recall_data
    
    translated = {}
    for key, value in recall_data.items():
        # Alan adını çevir (varsa)
        new_key = FIELD_TRANSLATIONS.get(key, key)
        translated[new_key] = value
    
    return translated

def process_recalls_json(recalls_str):
    """Recalls JSON string'ini parse et, çevir ve geri serialize et"""
    if not recalls_str or recalls_str.strip() == '':
        return recalls_str
    
    try:
        # JSON parse et
        recalls_list = json.loads(recalls_str)
        
        # Liste değilse, tek obje olabilir
        if isinstance(recalls_list, dict):
            recalls_list = [recalls_list]
        
        # Her recall objesini çevir
        translated_list = [translate_recall_fields(recall) for recall in recalls_list]
        
        # Geri JSON'a çevir (ensure_ascii=False Türkçe karakterler için)
        return json.dumps(translated_list, ensure_ascii=False)
    
    except json.JSONDecodeError as e:
        print(f"JSON parse hatası: {e}")
        return recalls_str
    except Exception as e:
        print(f"Beklenmeyen hata: {e}")
        return recalls_str

def main():
    print("=" * 60)
    print("Kronik Sorunlar - JSON Alan Adları Türkçeleştirme")
    print("=" * 60)
    
    try:
        # Veritabanına bağlan
        print("\n1. Veritabanına bağlanılıyor...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # JSON içeren kayıtları çek
        print("2. JSON içeren kayıtlar çekiliyor...")
        cursor.execute("""
            SELECT id, brand, model, recalls 
            FROM kronik_sorunlar 
            WHERE recalls LIKE '%"summary"%' OR recalls LIKE '%summary%'
            ORDER BY id
        """)
        
        records = cursor.fetchall()
        total_records = len(records)
        print(f"   ✓ {total_records} kayıt bulundu")
        
        if total_records == 0:
            print("\n   İşlenecek kayıt bulunamadı.")
            return
        
        # Kullanıcıdan onay al
        print(f"\n3. {total_records} kayıt güncellenecek.")
        response = input("   Devam etmek istiyor musunuz? (e/h): ")
        
        if response.lower() != 'e':
            print("   İşlem iptal edildi.")
            return
        
        # Kayıtları işle
        print("\n4. Kayıtlar işleniyor...")
        updated_count = 0
        error_count = 0
        
        for i, record in enumerate(records, 1):
            try:
                record_id = record['id']
                brand = record['brand']
                model = record['model']
                recalls_str = record['recalls']
                
                # JSON'ı çevir
                translated_json = process_recalls_json(recalls_str)
                
                # Veritabanını güncelle
                update_query = """
                    UPDATE kronik_sorunlar 
                    SET recalls = %s 
                    WHERE id = %s
                """
                cursor.execute(update_query, (translated_json, record_id))
                
                updated_count += 1
                print(f"   [{i}/{total_records}] ✓ ID: {record_id} - {brand} {model}")
                
            except Exception as e:
                error_count += 1
                print(f"   [{i}/{total_records}] ✗ ID: {record_id} - Hata: {e}")
        
        # Değişiklikleri kaydet
        conn.commit()
        
        # Özet
        print("\n" + "=" * 60)
        print("İŞLEM TAMAMLANDI")
        print("=" * 60)
        print(f"Toplam kayıt: {total_records}")
        print(f"Başarılı: {updated_count}")
        print(f"Hatalı: {error_count}")
        print("=" * 60)
        
    except mysql.connector.Error as err:
        print(f"\n✗ Veritabanı hatası: {err}")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Beklenmeyen hata: {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
