#!/usr/bin/env python3
"""
Kronik Sorunlar - Tam Türkçeleştirme
Başlıklar + sample_complaints sütununu OpenAI ile çevir
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

# Ek terimler sözlüğü
EXTRA_TERMS = {
    'POWER TRAIN': 'GÜÇ AKTARIMı',
    'MANUAL TRANSMISSION': 'MANUEL ŞANZıMAN',
    'AUTOMATIC TRANSMISSION': 'OTOMATİK ŞANZıMAN',
    'LUBRICANT': 'YAĞLAMA',
    'SHOCK ABSORBER': 'AMORTISÖR',
    'ELECTRIC POWER ASSIST SYSTEM': 'ELEKTRİKLİ DİREKSİYON SİSTEMİ',
    'CONTROL ARM': 'KONTROL KOLU',
    'LOWER ARM': 'ALT KOL',
    'REAR': 'ARKA',
    'LINKAGES': 'BAĞLANTILAR',
    'TIE ROD ASSEMBLY': 'ROT BAŞI DÜZENEĞ İ',
    'GEAR BOX': 'DİŞLİ KUTUSU',
    'RACK AND PINION': 'KREMALİYER',
    'LANE DEPARTURE': 'ŞERİT TAKIP',
    'LANE KEEP': 'ŞERİT KORUMA',
    'STEERING ASSIST': 'DİREKSİYON YARDIMI',
}

def translate_remaining_titles_with_openai(titles):
    """Kalan başlıkları OpenAI ile çevir"""
    
    titles_json = json.dumps(titles, ensure_ascii=False)
    
    prompt = f"""Aşağıdaki araç geri çağırma başlıklarını Türkçeye çevir.

Başlıklar:
{titles_json}

Sadece çevrilmiş başlıkları JSON array olarak döndür."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Otomotiv teknik çevirmen"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=60)
        if r.status_code != 200:
            print(f"   ✗ API Hatası: {r.status_code}")
            return {}
        
        text = r.json()['choices'][0]['message']['content'].strip()
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        
        translated = json.loads(text)
        return {titles[i]: translated[i] for i in range(min(len(titles), len(translated)))}
    except Exception as e:
        print(f"   ✗ Hata: {e}")
        return {}

def translate_complaints_with_openai(complaints_list):
    """Şikayetleri OpenAI ile çevir"""
    
    # JSON array olarak gönder
    complaints_json = json.dumps(complaints_list, ensure_ascii=False)
    
    prompt = f"""Aşağıdaki araç şikayetlerini Türkçeye çevir. Teknik terimler ve durumları doğru çevir.

Şikayetler (JSON array):
{complaints_json}

Sadece çevrilmiş şikayetleri JSON array olarak döndür."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Otomotiv şikayet çevirmeni. Kullanıcı şikayetlerini Türkçeye çeviriyorsun."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 4096
    }
    
    try:
        r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=60)
        if r.status_code != 200:
            print(f"   ✗ API Hatası: {r.status_code}")
            return None
        
        text = r.json()['choices'][0]['message']['content'].strip()
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"   ✗ Şikayet çeviri hatası: {e}")
        return None

def main():
    print("=" * 70)
    print("Kronik Sorunlar - Tam Türkçeleştirme (Başlıklar + Şikayetler)")
    print("=" * 70)
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # 1. Kalan başlıkları çevir
        print("\n1. Kalan İngilizce başlıklar çekiliyor...")
        cursor.execute("""
            SELECT DISTINCT title 
            FROM kronik_sorunlar 
            WHERE title LIKE '%Transmission%' 
               OR title LIKE '%Brakes%' 
               OR title LIKE '%Steering%' 
               OR title LIKE '%Suspension%'
               OR title LIKE '%POWER TRAIN%'
               OR title LIKE '%SHOCK ABSORBER%'
            LIMIT 50
        """)
        
        remaining_titles = [row['title'] for row in cursor.fetchall()]
        print(f"   ✓ {len(remaining_titles)} başlık bulundu")
        
        if remaining_titles:
            print("\n2. Başlıklar çevriliyor...")
            # Pattern-based önce
            title_translations = {}
            for title in remaining_titles:
                translated = title
                for eng, tr in EXTRA_TERMS.items():
                    translated = translated.replace(eng, tr)
                if translated != title:
                    title_translations[title] = translated
            
            print(f"   ✓ {len(title_translations)} başlık pattern ile çevrildi")
            
            # Kalanları OpenAI ile
            ai_needed = [t for t in remaining_titles if t not in title_translations]
            if ai_needed:
                print(f"   OpenAI ile {len(ai_needed)} başlık çevriliyor...")
                ai_trans = translate_remaining_titles_with_openai(ai_needed[:20])
                title_translations.update(ai_trans)
            
            # Başlıkları güncelle
            for orig, trans in title_translations.items():
                cursor.execute("UPDATE kronik_sorunlar SET title = %s WHERE title = %s", (trans, orig))
            conn.commit()
            print(f"   ✓ {cursor.rowcount} kayıt güncellendi")
        
        # 2. İngilizce şikayetleri çevir
        print("\n3. İngilizce şikayetler çekiliyor...")
        cursor.execute("""
            SELECT id, sample_complaints 
            FROM kronik_sorunlar 
            WHERE sample_complaints IS NOT NULL 
              AND sample_complaints != ''
              AND (sample_complaints LIKE '%the %' 
                   OR sample_complaints LIKE '%vehicle%'
                   OR sample_complaints LIKE '%and %')
            LIMIT 100
        """)
        
        complaint_records = cursor.fetchall()
        print(f"   ✓ {len(complaint_records)} kayıt bulundu")
        
        if complaint_records:
            response = input(f"\n4. {len(complaint_records)} kaydın şikayetlerini çevir? (e/h): ")
            if response.lower() == 'e':
                print("\n5. Şikayetler çevriliyor...")
                updated_count = 0
                
                for record in complaint_records[:50]:  # İlk 50 kayıt
                    try:
                        complaints_json = record['sample_complaints']
                        complaints_list = json.loads(complaints_json)
                        
                        # Sadece İngilizce olanları çevir
                        english_complaints = [c for c in complaints_list if any(word in c.lower() for word in ['the ', 'vehicle', 'and '])]
                        
                        if english_complaints:
                            print(f"   Kayıt {record['id']}: {len(english_complaints)} şikayet çevriliyor...", end=" ")
                            translated = translate_complaints_with_openai(english_complaints)
                            
                            if translated:
                                # Orijinal listeyi güncelle
                                for i, orig in enumerate(complaints_list):
                                    if orig in english_complaints:
                                        idx = english_complaints.index(orig)
                                        if idx < len(translated):
                                            complaints_list[i] = translated[idx]
                                
                                # Veritabanını güncelle
                                new_json = json.dumps(complaints_list, ensure_ascii=False)
                                cursor.execute("UPDATE kronik_sorunlar SET sample_complaints = %s WHERE id = %s", (new_json, record['id']))
                                updated_count += 1
                                print("✓")
                            else:
                                print("✗")
                            
                            time.sleep(2)  # Rate limiting
                    
                    except Exception as e:
                        print(f"   ✗ Kayıt {record['id']} hatası: {e}")
                
                conn.commit()
                print(f"\n   ✓ {updated_count} kaydın şikayetleri güncellendi")
        
        print("\n" + "=" * 70)
        print("TAMAMLANDI")
        print("=" * 70)
        
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
