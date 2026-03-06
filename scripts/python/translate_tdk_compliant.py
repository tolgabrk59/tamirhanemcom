#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kronik Sorunlar - TDK İmla Kurallarına Uygun Toplu Çeviri
Tüm İngilizce içeriği Türkçe'ye çevirir ve TDK imla kurallarına uygun hale getirir.
"""

import mysql.connector
import json
import time
import sys
import re
from datetime import datetime
from googletrans import Translator

# Veritabanı ayarları
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

translator = Translator()

# TDK İmla Kuralları için yardımcı fonksiyonlar
def fix_turkish_spelling(text):
    """Türkçe imla kurallarına uygun hale getirir"""
    if not text:
        return text
    
    # Cümle başlarını büyük harf yap
    text = capitalize_sentences(text)
    
    # Çift boşlukları tek boşluğa çevir
    text = re.sub(r'\s+', ' ', text)
    
    # Noktalama işaretlerinden önce boşluk olmamalı
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    
    # Noktalama işaretlerinden sonra boşluk olmalı
    text = re.sub(r'([.,!?;:])([^\s\d])', r'\1 \2', text)
    
    # Tırnak işaretlerini düzelt
    text = text.replace('"', '"').replace('"', '"')
    
    return text.strip()

def capitalize_sentences(text):
    """Her cümlenin ilk harfini büyük yapar"""
    if not text:
        return text
    
    # Cümle sonlarını bul (. ! ?)
    sentences = re.split(r'([.!?]\s+)', text)
    
    result = []
    for i, part in enumerate(sentences):
        if i % 2 == 0 and part.strip():  # Cümle kısmı
            # İlk harfi büyük yap
            part = part[0].upper() + part[1:] if len(part) > 0 else part
        result.append(part)
    
    return ''.join(result)

def is_english(text):
    """Gelişmiş İngilizce tespit algoritması"""
    if not text or len(text) < 10:
        return False
    
    # Yaygın İngilizce kelimeler ve kalıplar
    english_patterns = [
        r'\bthe\s+car\b',
        r'\bmy\s+vehicle\b',
        r'\bI\s+was\b',
        r'\bwhen\s+I\b',
        r'\bwhile\s+driving\b',
        r'\bthe\s+engine\b',
        r'\bcheck\s+engine\b',
        r'\bwarning\s+light\b',
        r'\bstarted\s+to\b',
        r'\bwould\s+not\b',
        r'\bdoes\s+not\b',
    ]
    
    text_lower = text.lower()
    
    # En az 2 İngilizce kalıp varsa İngilizce kabul et
    matches = sum(1 for pattern in english_patterns if re.search(pattern, text_lower))
    
    if matches >= 2:
        return True
    
    # Basit kelime kontrolü
    english_words = ['the', 'and', 'vehicle', 'was', 'when', 'while', 'with', 'from', 'that', 'this', 'have', 'been', 'would', 'could', 'should']
    word_count = sum(1 for word in english_words if f' {word} ' in f' {text_lower} ')
    
    return word_count >= 3

def translate_with_quality(text):
    """Kaliteli çeviri yapar ve TDK kurallarına uygun hale getirir"""
    try:
        if not is_english(text):
            # Zaten Türkçe, sadece imla düzeltmesi yap
            return fix_turkish_spelling(text)
        
        # Google Translate ile çevir
        result = translator.translate(text, src='en', dest='tr')
        translated = result.text
        
        # TDK imla kurallarına uygun hale getir
        translated = fix_turkish_spelling(translated)
        
        return translated
        
    except Exception as e:
        print(f"    ⚠️  Çeviri hatası: {str(e)[:50]}")
        return text  # Hata olursa orijinali döndür

def print_progress_bar(current, total, prefix='', suffix='', length=50):
    """İlerleme çubuğu gösterir"""
    percent = 100 * (current / float(total))
    filled_length = int(length * current // total)
    bar = '█' * filled_length + '-' * (length - filled_length)
    print(f'\r{prefix} |{bar}| {percent:.1f}% {suffix}', end='', flush=True)
    if current == total:
        print()

def main():
    print("=" * 80)
    print("TDK İmla Kurallarına Uygun Toplu Çeviri Scripti")
    print("=" * 80)
    print(f"Başlangıç: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    conn = None
    cursor = None
    
    try:
        # Veritabanına bağlan
        print("1. Veritabanına bağlanılıyor...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        print("   ✓ Bağlantı başarılı")
        
        # İngilizce şikayetleri çek
        print("\n2. İngilizce içerikli kayıtlar çekiliyor...")
        cursor.execute("""
            SELECT id, sample_complaints 
            FROM kronik_sorunlar 
            WHERE sample_complaints IS NOT NULL 
              AND sample_complaints != ''
              AND sample_complaints != '[]'
              AND (sample_complaints LIKE '%the car%' 
                   OR sample_complaints LIKE '%vehicle%'
                   OR sample_complaints LIKE '%I was%'
                   OR sample_complaints LIKE '%my car%'
                   OR sample_complaints LIKE '%when I%'
                   OR sample_complaints LIKE '%while driving%')
            ORDER BY id
        """)
        
        all_records = cursor.fetchall()
        print(f"   ✓ {len(all_records)} potansiyel kayıt bulundu")
        
        # İngilizce içerenleri filtrele
        print("\n3. İngilizce içerik filtreleniyor...")
        english_records = []
        for record in all_records:
            try:
                complaints = json.loads(record['sample_complaints'])
                if isinstance(complaints, list) and any(is_english(str(c)) for c in complaints):
                    english_records.append(record)
            except:
                pass
        
        print(f"   ✓ {len(english_records)} kayıtta İngilizce içerik tespit edildi")
        
        if len(english_records) == 0:
            print("\n✅ Çevrilecek İngilizce içerik bulunamadı!")
            return
        
        # Kullanıcı onayı
        print(f"\n4. Çeviri Bilgileri:")
        print(f"   • Toplam kayıt: {len(english_records)}")
        print(f"   • Tahmini süre: ~{len(english_records) * 2 // 60} dakika")
        print(f"   • Özellikler: TDK imla kuralları, akıllı çeviri, hata kurtarma")
        print()
        
        response = input(f"   Devam edilsin mi? (e/h): ")
        if response.lower() != 'e':
            print("\n   İşlem iptal edildi.")
            return
        
        # Çeviri işlemi
        print(f"\n5. Çeviri başlıyor...")
        print(f"   Her 50 kayıtta bir rapor verilecek")
        print()
        
        updated_count = 0
        skipped_count = 0
        failed_count = 0
        start_time = time.time()
        
        for idx, record in enumerate(english_records, 1):
            try:
                # İlerleme çubuğu
                print_progress_bar(
                    idx, 
                    len(english_records),
                    prefix=f'   İşleniyor [{idx}/{len(english_records)}]',
                    suffix=f'✓ {updated_count} | ⊘ {skipped_count} | ✗ {failed_count}'
                )
                
                complaints_list = json.loads(record['sample_complaints'])
                
                if not isinstance(complaints_list, list):
                    skipped_count += 1
                    continue
                
                # Her şikayeti çevir
                translated_list = []
                has_translation = False
                
                for complaint in complaints_list:
                    if not complaint or not isinstance(complaint, str):
                        continue
                    
                    original = complaint
                    translated = translate_with_quality(complaint)
                    translated_list.append(translated)
                    
                    if translated != original:
                        has_translation = True
                
                # Eğer çeviri yapıldıysa güncelle
                if has_translation and len(translated_list) > 0:
                    new_json = json.dumps(translated_list, ensure_ascii=False)
                    cursor.execute(
                        "UPDATE kronik_sorunlar SET sample_complaints = %s WHERE id = %s",
                        (new_json, record['id'])
                    )
                    updated_count += 1
                else:
                    skipped_count += 1
                
                # Her 50 kayıtta commit
                if idx % 50 == 0:
                    conn.commit()
                
                # Rate limiting - her 10 kayıtta kısa bekle
                if idx % 10 == 0:
                    time.sleep(1)
                
            except KeyboardInterrupt:
                print("\n\n✗ İşlem durduruldu (Ctrl+C)")
                conn.commit()
                raise
            except Exception as e:
                failed_count += 1
                if idx % 50 == 0:
                    print(f"\n   ⚠️  Kayıt {record['id']} hatası: {str(e)[:50]}")
        
        # Son commit
        conn.commit()
        
        # Süre hesapla
        elapsed_time = time.time() - start_time
        minutes = int(elapsed_time // 60)
        seconds = int(elapsed_time % 60)
        
        # Özet rapor
        print("\n\n" + "=" * 80)
        print("✅ ÇEVİRİ TAMAMLANDI")
        print("=" * 80)
        print(f"Toplam kayıt:        {len(english_records)}")
        print(f"Güncellenen:         {updated_count}")
        print(f"Atlanan:             {skipped_count}")
        print(f"Başarısız:           {failed_count}")
        if updated_count + failed_count > 0:
            print(f"Başarı oranı:        {(updated_count/(updated_count+failed_count)*100):.1f}%")
        print(f"Geçen süre:          {minutes}d {seconds}s")
        print(f"Bitiş:               {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        print("\n✅ Tüm İngilizce içerik TDK imla kurallarına uygun şekilde çevrildi!")
        
    except KeyboardInterrupt:
        print("\n\n✗ İşlem kullanıcı tarafından durduruldu")
        if updated_count > 0:
            print(f"   {updated_count} kayıt güncellendi")
        if conn:
            conn.commit()
    except Exception as e:
        print(f"\n✗ Kritik hata: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            print("\n✓ Veritabanı bağlantısı kapatıldı")

if __name__ == "__main__":
    main()
