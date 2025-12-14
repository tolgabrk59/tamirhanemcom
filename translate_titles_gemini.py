#!/usr/bin/env python3
"""
Kronik Sorunlar - İngilizce Başlıkları Google Gemini ile Türkçeleştirme
3 API anahtarı ile paralel çalışarak hızlı çeviri yapar.
"""

import mysql.connector
import requests
import json
import time
import sys
from typing import Dict, List, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

# Veritabanı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

# Google Gemini API anahtarları (3 adet paralel kullanım için)
GEMINI_API_KEYS = [
    "AIzaSyA-h_MTJHlHEY8QySwLCxdDukrNcoCtj7Q",
    "AIzaSyBhDz1ohYPnd-EJjW9EQJl1UJYuVhqCGGA",
    "AIzaSyDARmu40CilsH7e7raGds08G_BZ-E64QQ8"
]

GEMINI_MODEL = "gemini-2.0-flash-exp"  # En hızlı ve ücretsiz model

# Batch ayarları
BATCH_SIZE = 25  # Her API çağrısında kaç başlık
MAX_WORKERS = 3  # Paralel worker sayısı (API key sayısı kadar)

def translate_with_gemini(titles: List[str], api_key: str, batch_id: int) -> Dict[str, str]:
    """Google Gemini API ile başlıkları toplu çevir"""
    
    # Prompt oluştur
    titles_json = json.dumps(titles, ensure_ascii=False, indent=2)
    
    prompt = f"""Aşağıdaki JSON array'deki araç sorun başlıklarını Türkçeye çevir.

KURALLAR:
1. "RECALL:" -> "GERİ ÇAĞIRMA:"
2. Teknik terimler:
   - Brakes -> Frenler
   - Transmission -> Şanzıman
   - Steering -> Direksiyon
   - Suspension -> Süspansiyon
   - Engine -> Motor
   - Air Bags -> Hava Yastıkları
   - Seat Belts -> Emniyet Kemerleri
   - Fuel System -> Yakıt Sistemi
   - Electrical System -> Elektrik Sistemi
   - Latches/Locks -> Kilitler
   - Equipment -> Ekipman
3. Marka/model isimlerini değiştirme
4. Kısa ve net çevir

GİRDİ:
{titles_json}

ÇIKTI (sadece JSON array, başka bir şey yazma):"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 8192
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        if response.status_code != 200:
            print(f"   ✗ Batch {batch_id} API Hatası: {response.status_code}")
            return {}
        
        result = response.json()
        
        if 'candidates' not in result or len(result['candidates']) == 0:
            print(f"   ✗ Batch {batch_id} yanıt alınamadı")
            return {}
        
        translated_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
        
        # JSON parse et
        # Markdown code block varsa temizle
        if '```json' in translated_text:
            translated_text = translated_text.split('```json')[1].split('```')[0].strip()
        elif '```' in translated_text:
            translated_text = translated_text.split('```')[1].split('```')[0].strip()
        
        translated_list = json.loads(translated_text)
        
        # Sözlük oluştur
        translations = {}
        for i, original in enumerate(titles):
            if i < len(translated_list):
                translations[original] = translated_list[i]
        
        return translations
        
    except json.JSONDecodeError as e:
        print(f"   ✗ Batch {batch_id} JSON parse hatası: {e}")
        print(f"   Response: {translated_text[:200]}")
        return {}
    except Exception as e:
        print(f"   ✗ Batch {batch_id} hata: {e}")
        return {}

def get_unique_english_titles(cursor) -> List[Tuple[str, int]]:
    """İngilizce başlıkları ve kullanım sayılarını getir"""
    query = """
        SELECT title, COUNT(*) as count 
        FROM kronik_sorunlar 
        WHERE title LIKE 'RECALL:%' 
           OR title LIKE '%Transmission%' 
           OR title LIKE '%Brakes%' 
           OR title LIKE '%Steering%' 
           OR title LIKE '%Suspension%' 
           OR title LIKE '%Engine%'
        GROUP BY title 
        ORDER BY count DESC
    """
    cursor.execute(query)
    return cursor.fetchall()

def update_titles(cursor, conn, translations: Dict[str, str]) -> int:
    """Çevirileri veritabanına uygula"""
    updated = 0
    
    for original, translated in translations.items():
        try:
            update_query = "UPDATE kronik_sorunlar SET title = %s WHERE title = %s"
            cursor.execute(update_query, (translated, original))
            updated += cursor.rowcount
        except Exception as e:
            print(f"   ✗ Güncelleme hatası: {e}")
    
    conn.commit()
    return updated

def main():
    print("=" * 70)
    print("Kronik Sorunlar - Google Gemini ile Paralel Türkçeleştirme")
    print("=" * 70)
    
    try:
        # Veritabanına bağlan
        print("\n1. Veritabanına bağlanılıyor...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Benzersiz İngilizce başlıkları çek
        print("2. İngilizce başlıklar çekiliyor...")
        unique_titles = get_unique_english_titles(cursor)
        total_unique = len(unique_titles)
        total_records = sum(count for _, count in unique_titles)
        
        print(f"   ✓ {total_unique} benzersiz başlık bulundu")
        print(f"   ✓ Toplam {total_records} kayıt etkilenecek")
        
        if total_unique == 0:
            print("\n   İşlenecek başlık bulunamadı.")
            return
        
        # Kullanıcıdan onay al
        print(f"\n3. {total_unique} başlık Google Gemini ile çevrilecek.")
        print(f"   {MAX_WORKERS} API anahtarı paralel çalışacak")
        print(f"   Tahmini süre: ~{(total_unique // (BATCH_SIZE * MAX_WORKERS) + 1) * 5} saniye")
        response = input("   Devam etmek istiyor musunuz? (e/h): ")
        
        if response.lower() != 'e':
            print("   İşlem iptal edildi.")
            return
        
        # Batch'leri hazırla
        print(f"\n4. Paralel çeviri başlıyor...")
        titles_only = [title for title, _ in unique_titles]
        
        # Batch'lere böl
        batches = []
        for i in range(0, len(titles_only), BATCH_SIZE):
            batch = titles_only[i:i + BATCH_SIZE]
            batches.append((batch, i // BATCH_SIZE))
        
        total_batches = len(batches)
        print(f"   {total_batches} batch oluşturuldu ({BATCH_SIZE}'er başlık)")
        
        all_translations = {}
        completed_batches = 0
        
        # Paralel işleme
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Her batch için API key döngüsel olarak ata
            futures = {}
            for batch, batch_id in batches:
                api_key = GEMINI_API_KEYS[batch_id % len(GEMINI_API_KEYS)]
                future = executor.submit(translate_with_gemini, batch, api_key, batch_id + 1)
                futures[future] = (batch, batch_id + 1)
            
            # Sonuçları topla
            for future in as_completed(futures):
                batch, batch_id = futures[future]
                try:
                    translations = future.result()
                    if translations:
                        all_translations.update(translations)
                        completed_batches += 1
                        print(f"   ✓ Batch {batch_id}/{total_batches} tamamlandı ({len(translations)} başlık)")
                        
                        # İlk çeviriyi göster
                        if translations:
                            first_key = list(translations.keys())[0]
                            print(f"      '{first_key[:50]}...' -> '{translations[first_key][:50]}...'")
                    else:
                        print(f"   ✗ Batch {batch_id}/{total_batches} başarısız")
                except Exception as e:
                    print(f"   ✗ Batch {batch_id} işlenirken hata: {e}")
        
        # Veritabanını güncelle
        print(f"\n5. Veritabanı güncelleniyor...")
        total_updated = update_titles(cursor, conn, all_translations)
        
        # Özet
        print("\n" + "=" * 70)
        print("İŞLEM TAMAMLANDI")
        print("=" * 70)
        print(f"Benzersiz başlık: {total_unique}")
        print(f"Çevrilen: {len(all_translations)}")
        print(f"Güncellenen kayıt: {total_updated}")
        print(f"Başarı oranı: {(len(all_translations)/total_unique*100):.1f}%")
        print("=" * 70)
        
        # Örnekler
        if all_translations:
            print("\nÖrnek Çeviriler:")
            for i, (orig, trans) in enumerate(list(all_translations.items())[:5]):
                print(f"  {i+1}. '{orig}'")
                print(f"     -> '{trans}'")
        
    except mysql.connector.Error as err:
        print(f"\n✗ Veritabanı hatası: {err}")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Beklenmeyen hata: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
