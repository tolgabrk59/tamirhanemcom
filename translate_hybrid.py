#!/usr/bin/env python3
"""
Kronik Sorunlar - Hibrit Türkçeleştirme
Pattern-based + OpenAI GPT-4 ile akıllı çeviri
"""

import mysql.connector
import requests
import json
import time
import sys
import re
from typing import Dict, List, Tuple

# Veritabanı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

# OpenAI API
OPENAI_API_KEY = "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"

# Çeviri sözlüğü
TRANSLATION_DICT = {
    # Genel terimler
    'RECALL:': 'GERİ ÇAĞIRMA:',
    'Brakes': 'Frenler',
    'Transmission': 'Şanzıman',
    'Steering': 'Direksiyon',
    'Suspension': 'Süspansiyon',
    'Engine': 'Motor',
    'Sorunları': 'Sorunları',  # Zaten Türkçe
    
    # RECALL kategorileri
    'SEATS': 'KOLTUKLAR',
    'AIR BAGS': 'HAVA YASTIKLARI',
    'SEAT BELTS': 'EMNİYET KEMERLERİ',
    'FUEL SYSTEM': 'YAKIT SİSTEMİ',
    'ELECTRICAL SYSTEM': 'ELEKTRİK SİSTEMİ',
    'SERVICE BRAKES': 'SERVİS FRENLERİ',
    'LATCHES/LOCKS/LINKAGES': 'KİLİTLER/MANDALLER',
    'EQUIPMENT': 'EKİPMAN',
    'EXTERIOR LIGHTING': 'DIŞ AYDINLATMA',
    'HEADLIGHTS': 'FAR',
    'UNKNOWN OR OTHER': 'BİLİNMEYEN VEYA DİĞER',
    
    # Detaylı terimler
    'FRONTAL': 'ÖNDEN',
    'PASSENGER SIDE': 'YOLCU TARAFI',
    'DRIVER SIDE': 'SÜRÜCÜ TARAFI',
    'INFLATOR MODULE': 'ŞIŞIRME MODÜLÜ',
    'CONTROL MODULE': 'KONTROL MODÜLÜ',
    'CONTROL UNIT': 'KONTROL ÜNİTESİ',
    'DOORS': 'KAPILAR',
    'LATCH': 'MANDAL',
    'FRONT': 'ÖN',
    'GASOLINE': 'BENZİN',
    'STORAGE': 'DEPOLAMA',
    'HYDRAULIC': 'HİDROLİK',
    'ANTILOCK': 'KİLİTLENME ÖNLEYİCİ',
    'TRACTION CONTROL': 'ÇEKİŞ KONTROLÜ',
    'ELECTRONIC LIMITED SLIP': 'ELEKTRONİK KAYMA ÖNLEYİCİ',
    'ADAPTIVE/MOBILITY': 'ADAPTIF/MOBİLİTE',
    'SENSOR': 'SENSÖR',
    'OCCUPANT CLASSIFICATION': 'YOLCU SINIFLANDIRMA',
    'DELIVERY': 'İLETİM',
    'HOSES': 'HORTUMLAR',
    'LINES/PIPING': 'HATLAR/BORULAR',
    'FITTINGS': 'BAĞLANTI PARÇALARI',
    'WIRING': 'KABLOLAMA',
    'ENGINE COOLING': 'MOTOR SOĞUTMA',
    'COOLING SYSTEM': 'SOĞUTMA SİSTEMİ',
    'SIDE/WINDOW': 'YAN/CAM',
    'TRUNK LID': 'BAGAJ KAPAĞI',
    'BUCKLE ASSEMBLY': 'TOKA DÜZENEĞI',
}

def pattern_translate(title: str) -> str:
    """Pattern-based basit çeviri"""
    translated = title
    
    # Sözlükteki terimleri değiştir (büyükten küçüğe sıralı)
    for eng, tr in sorted(TRANSLATION_DICT.items(), key=lambda x: len(x[0]), reverse=True):
        translated = translated.replace(eng, tr)
    
    return translated

def needs_ai_translation(title: str) -> bool:
    """AI çevirisine ihtiyaç var mı kontrol et"""
    # Eğer hala İngilizce kelimeler varsa AI gerekli
    english_pattern = r'[A-Z]{2,}'  # 2+ büyük harf yan yana
    
    # Pattern çeviriden sonra kontrol et
    after_pattern = pattern_translate(title)
    
    # Hala İngilizce terimler var mı?
    if re.search(english_pattern, after_pattern):
        # Ama marka/model isimleri değilse
        if not any(brand in after_pattern for brand in ['FORD', 'TOYOTA', 'HONDA', 'BMW', 'AUDI', 'MERCEDES']):
            return True
    
    return False

def translate_with_openai(titles: List[str]) -> Dict[str, str]:
    """OpenAI GPT-4 ile karmaşık başlıkları çevir"""
    
    titles_json = json.dumps(titles, ensure_ascii=False)
    
    prompt = f"""Aşağıdaki araç sorun başlıklarını Türkçeye çevir. Teknik terimleri doğru Türkçe karşılıklarıyla değiştir.

Başlıklar (JSON array):
{titles_json}

Sadece çevrilmiş başlıkları JSON array olarak döndür. Başka açıklama ekleme."""

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Sen profesyonel bir otomotiv teknik çevirmenisin. İngilizce araç sorun başlıklarını Türkçeye çeviriyorsun."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 4096
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"   ✗ OpenAI API Hatası: {response.status_code}")
            print(f"   {response.text[:200]}")
            return {}
        
        result = response.json()
        translated_text = result['choices'][0]['message']['content'].strip()
        
        # JSON parse
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
        
    except Exception as e:
        print(f"   ✗ OpenAI çeviri hatası: {e}")
        return {}

def get_unique_english_titles(cursor) -> List[Tuple[str, int]]:
    """İngilizce başlıkları getir"""
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
    """Veritabanını güncelle"""
    updated = 0
    for original, translated in translations.items():
        try:
            cursor.execute("UPDATE kronik_sorunlar SET title = %s WHERE title = %s", (translated, original))
            updated += cursor.rowcount
        except Exception as e:
            print(f"   ✗ Güncelleme hatası: {e}")
    conn.commit()
    return updated

def main():
    print("=" * 70)
    print("Kronik Sorunlar - Hibrit AI Türkçeleştirme")
    print("Pattern-based + OpenAI GPT-4")
    print("=" * 70)
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("\n1. İngilizce başlıklar çekiliyor...")
        unique_titles = get_unique_english_titles(cursor)
        total_unique = len(unique_titles)
        total_records = sum(count for _, count in unique_titles)
        
        print(f"   ✓ {total_unique} benzersiz başlık")
        print(f"   ✓ {total_records} kayıt etkilenecek")
        
        if total_unique == 0:
            print("\n   İşlenecek başlık yok.")
            return
        
        response = input(f"\n2. Devam? (e/h): ")
        if response.lower() != 'e':
            return
        
        print(f"\n3. Çeviri başlıyor...")
        
        all_translations = {}
        pattern_count = 0
        ai_count = 0
        
        # Önce pattern-based çeviri
        print("\n   A) Pattern-based çeviri...")
        for title, count in unique_titles:
            translated = pattern_translate(title)
            if translated != title:
                all_translations[title] = translated
                pattern_count += 1
        
        print(f"   ✓ {pattern_count} başlık pattern ile çevrildi")
        
        # AI gerektiren başlıkları bul
        ai_needed = []
        for title, count in unique_titles:
            if title not in all_translations and needs_ai_translation(title):
                ai_needed.append(title)
        
        print(f"\n   B) OpenAI ile çeviri ({len(ai_needed)} başlık)...")
        
        # 20'şer gruplar halinde OpenAI'a gönder
        BATCH_SIZE = 20
        for i in range(0, len(ai_needed), BATCH_SIZE):
            batch = ai_needed[i:i + BATCH_SIZE]
            print(f"      Batch {i//BATCH_SIZE + 1}/{(len(ai_needed)-1)//BATCH_SIZE + 1}...", end=" ")
            
            translations = translate_with_openai(batch)
            if translations:
                all_translations.update(translations)
                ai_count += len(translations)
                print(f"✓ {len(translations)} çevrildi")
            else:
                print("✗ Başarısız")
            
            time.sleep(1)  # Rate limiting
        
        # Veritabanını güncelle
        print(f"\n4. Veritabanı güncelleniyor...")
        updated = update_titles(cursor, conn, all_translations)
        
        # Özet
        print("\n" + "=" * 70)
        print("TAMAMLANDI")
        print("=" * 70)
        print(f"Toplam başlık: {total_unique}")
        print(f"Pattern çeviri: {pattern_count}")
        print(f"AI çeviri: {ai_count}")
        print(f"Güncellenen kayıt: {updated}")
        print("=" * 70)
        
        # Örnekler
        if all_translations:
            print("\nÖrnekler:")
            for i, (orig, trans) in enumerate(list(all_translations.items())[:5]):
                print(f"  {i+1}. '{orig}'")
                print(f"     -> '{trans}'")
        
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
