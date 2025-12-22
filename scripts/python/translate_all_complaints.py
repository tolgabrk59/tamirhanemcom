#!/usr/bin/env python3
"""
Kronik Sorunlar - Tüm Şikayetleri Toplu Çevir
OpenAI ile batch processing
"""

import mysql.connector
import requests
import json
import time
import sys

DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

OPENAI_API_KEY = "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"

def is_english(text):
    """Basit İngilizce kontrolü"""
    english_words = ['the ', 'and ', 'vehicle', 'was ', 'when ', 'while ', 'with ', 'from ', 'that ', 'this ']
    text_lower = text.lower()
    return any(word in text_lower for word in english_words)

def translate_batch_with_openai(complaints_batch):
    """Bir batch şikayeti OpenAI ile çevir"""
    
    # Sadece İngilizce olanları al
    english_complaints = [c for c in complaints_batch if is_english(c)]
    
    if not english_complaints:
        return {}
    
    complaints_json = json.dumps(english_complaints, ensure_ascii=False)
    
    prompt = f"""Aşağıdaki araç şikayetlerini Türkçeye çevir. Doğal ve anlaşılır Türkçe kullan.

Şikayetler:
{complaints_json}

Sadece çevrilmiş şikayetleri JSON array olarak döndür. Başka açıklama ekleme."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Araç şikayetlerini Türkçeye çeviren profesyonel çevirmen."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 4096
    }
    
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=90)
        
        if r.status_code != 200:
            print(f" ✗ API Hatası: {r.status_code}")
            return {}
        
        text = r.json()['choices'][0]['message']['content'].strip()
        
        # JSON parse
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].split('```')[0].strip()
        
        translated = json.loads(text)
        
        # Sözlük oluştur
        result = {}
        for i, orig in enumerate(english_complaints):
            if i < len(translated):
                result[orig] = translated[i]
        
        return result
        
    except Exception as e:
        print(f" ✗ Hata: {str(e)[:100]}")
        return {}

def main():
    print("=" * 70)
    print("Kronik Sorunlar - Tüm Şikayetleri Toplu Çevir")
    print("=" * 70)
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # İngilizce şikayetleri çek
        print("\n1. İngilizce şikayetler çekiliyor...")
        cursor.execute("""
            SELECT id, sample_complaints 
            FROM kronik_sorunlar 
            WHERE sample_complaints IS NOT NULL 
              AND sample_complaints != ''
              AND sample_complaints != '[]'
            ORDER BY id
        """)
        
        all_records = cursor.fetchall()
        print(f"   ✓ {len(all_records)} kayıt bulundu")
        
        # İngilizce içerenleri filtrele
        english_records = []
        for record in all_records:
            try:
                complaints = json.loads(record['sample_complaints'])
                if any(is_english(c) for c in complaints):
                    english_records.append(record)
            except:
                pass
        
        print(f"   ✓ {len(english_records)} kayıtta İngilizce şikayet var")
        
        if len(english_records) == 0:
            print("\n   Çevrilecek şikayet yok!")
            return
        
        response = input(f"\n2. {len(english_records)} kaydı çevir? (e/h): ")
        if response.lower() != 'e':
            return
        
        print(f"\n3. Çeviri başlıyor...")
        print(f"   Her 10 kayıtta bir durum raporu verilecek")
        print()
        
        updated_count = 0
        failed_count = 0
        
        for idx, record in enumerate(english_records, 1):
            try:
                complaints_list = json.loads(record['sample_complaints'])
                
                # Çevir
                translations = translate_batch_with_openai(complaints_list)
                
                if translations:
                    # Listeyi güncelle
                    for i, complaint in enumerate(complaints_list):
                        if complaint in translations:
                            complaints_list[i] = translations[complaint]
                    
                    # Veritabanını güncelle
                    new_json = json.dumps(complaints_list, ensure_ascii=False)
                    cursor.execute(
                        "UPDATE kronik_sorunlar SET sample_complaints = %s WHERE id = %s",
                        (new_json, record['id'])
                    )
                    updated_count += 1
                    
                    # Her 10 kayıtta rapor
                    if idx % 10 == 0:
                        conn.commit()
                        print(f"   [{idx}/{len(english_records)}] ✓ {updated_count} güncellendi, {failed_count} başarısız")
                else:
                    failed_count += 1
                
                # Rate limiting - her 5 kayıtta 2 saniye bekle
                if idx % 5 == 0:
                    time.sleep(2)
                
            except Exception as e:
                failed_count += 1
                if idx % 10 == 0:
                    print(f"   [{idx}/{len(english_records)}] ✗ Kayıt {record['id']} hatası")
        
        # Son commit
        conn.commit()
        
        # Özet
        print("\n" + "=" * 70)
        print("TAMAMLANDI")
        print("=" * 70)
        print(f"Toplam kayıt: {len(english_records)}")
        print(f"Güncellenen: {updated_count}")
        print(f"Başarısız: {failed_count}")
        print(f"Başarı oranı: {(updated_count/len(english_records)*100):.1f}%")
        print("=" * 70)
        
    except KeyboardInterrupt:
        print("\n\n✗ İşlem kullanıcı tarafından durduruldu")
        print(f"   {updated_count} kayıt güncellendi")
        conn.commit()
    except Exception as e:
        print(f"\n✗ Hata: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
