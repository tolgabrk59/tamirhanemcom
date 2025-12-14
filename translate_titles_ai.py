#!/usr/bin/env python3
"""
Kronik Sorunlar - İngilizce Başlıkları AI ile Türkçeleştirme
Claude API kullanarak benzersiz başlıkları çevirir ve veritabanını günceller.
"""

import mysql.connector
import requests
import json
import time
import sys
from typing import Dict, List, Tuple

# Veritabanı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

# Claude API ayarları
CLAUDE_API_KEY = "sk-87gtEK7F3Emot4FGP9ov551KUJXWxyKAp31lVZpd8lqm1fAH"
CLAUDE_BASE_URL = "https://claudecode.codefast.app/alt"
CLAUDE_MODEL = "claude-sonnet-4"

# Batch ayarları
BATCH_SIZE = 20  # Her seferde kaç başlık çevirelim
DELAY_BETWEEN_BATCHES = 2  # Batch'ler arası bekleme (saniye)

def translate_with_claude(titles: List[str]) -> Dict[str, str]:
    """Claude API ile başlıkları toplu çevir"""
    
    # Prompt oluştur
    titles_text = "\n".join([f"{i+1}. {title}" for i, title in enumerate(titles)])
    
    prompt = f"""Aşağıdaki araç sorun başlıklarını Türkçeye çevir. Teknik terimler için uygun Türkçe karşılıkları kullan.

KURALLAR:
- "RECALL:" ifadesini "GERİ ÇAĞIRMA:" olarak çevir
- Teknik terimleri Türkçeleştir (örn: "Brakes" -> "Frenler", "Transmission" -> "Şanzıman", "Steering" -> "Direksiyon")
- Marka ve model isimlerini olduğu gibi bırak
- Kısa ve net çeviriler yap
- Her satırı aynı sırada çevir

Başlıklar:
{titles_text}

SADECE çevirileri ver, her satırı numarasıyla. Başka açıklama ekleme."""

    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    payload = {
        "model": CLAUDE_MODEL,
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{CLAUDE_BASE_URL}/v1/messages",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"   ✗ API Hatası: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return {}
        
        result = response.json()
        translated_text = result['content'][0]['text']
        
        # Çevirileri parse et
        translations = {}
        lines = translated_text.strip().split('\n')
        
        for i, line in enumerate(lines):
            if i >= len(titles):
                break
            # Numarayı kaldır (örn: "1. " veya "1) ")
            translated = line.strip()
            if '. ' in translated:
                translated = translated.split('. ', 1)[1]
            elif ') ' in translated:
                translated = translated.split(') ', 1)[1]
            
            translations[titles[i]] = translated.strip()
        
        return translations
        
    except Exception as e:
        print(f"   ✗ Çeviri hatası: {e}")
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
            print(f"   ✗ Güncelleme hatası ({original}): {e}")
    
    conn.commit()
    return updated

def main():
    print("=" * 70)
    print("Kronik Sorunlar - AI ile Başlık Türkçeleştirme")
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
        print(f"\n3. {total_unique} başlık Claude API ile çevrilecek.")
        print(f"   Tahmini maliyet: ~{total_unique * 2} kredi")
        response = input("   Devam etmek istiyor musunuz? (e/h): ")
        
        if response.lower() != 'e':
            print("   İşlem iptal edildi.")
            return
        
        # Batch'ler halinde çevir
        print(f"\n4. Çeviri başlıyor ({BATCH_SIZE}'li gruplar halinde)...")
        
        all_translations = {}
        total_translated = 0
        total_updated_records = 0
        
        # Sadece başlıkları al
        titles_only = [title for title, _ in unique_titles]
        
        for i in range(0, len(titles_only), BATCH_SIZE):
            batch = titles_only[i:i + BATCH_SIZE]
            batch_num = (i // BATCH_SIZE) + 1
            total_batches = (len(titles_only) + BATCH_SIZE - 1) // BATCH_SIZE
            
            print(f"\n   Batch {batch_num}/{total_batches} ({len(batch)} başlık)")
            
            # Çevir
            translations = translate_with_claude(batch)
            
            if translations:
                # Veritabanını güncelle
                updated = update_titles(cursor, conn, translations)
                all_translations.update(translations)
                total_translated += len(translations)
                total_updated_records += updated
                
                print(f"   ✓ {len(translations)} başlık çevrildi, {updated} kayıt güncellendi")
                
                # Örnek göster
                if len(translations) > 0:
                    first_key = list(translations.keys())[0]
                    print(f"   Örnek: '{first_key}' -> '{translations[first_key]}'")
            else:
                print(f"   ✗ Batch çevrilemedi")
            
            # Rate limiting
            if i + BATCH_SIZE < len(titles_only):
                time.sleep(DELAY_BETWEEN_BATCHES)
        
        # Özet
        print("\n" + "=" * 70)
        print("İŞLEM TAMAMLANDI")
        print("=" * 70)
        print(f"Benzersiz başlık: {total_unique}")
        print(f"Çevrilen: {total_translated}")
        print(f"Güncellenen kayıt: {total_updated_records}")
        print(f"Başarı oranı: {(total_translated/total_unique*100):.1f}%")
        print("=" * 70)
        
        # Birkaç örnek göster
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
