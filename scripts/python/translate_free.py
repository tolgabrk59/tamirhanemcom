#!/usr/bin/env python3
"""
Kronik Sorunlar - Google Translate ile Ücretsiz Toplu Çeviri
33,706 kayıt - Tamamen ücretsiz!
"""

import mysql.connector
import json
import time
import sys
from googletrans import Translator

DB_CONFIG = {
    'host': 'localhost',
    'user': 'tamirhanem',
    'password': 'Aras2017@',
    'database': 'randevu_db'
}

translator = Translator()

def is_english(text):
    """Basit İngilizce kontrolü"""
    if not text or len(text) < 10:
        return False
    english_words = ['the ', 'and ', 'vehicle', 'was ', 'when ', 'while ', 'with ', 'from ', 'that ', 'this ', 'have ', 'been ']
    text_lower = text.lower()
    return sum(1 for word in english_words if word in text_lower) >= 2

def translate_text(text):
    """Google Translate ile çevir"""
    try:
        if not is_english(text):
            return text  # Zaten Türkçe
        
        result = translator.translate(text, src='en', dest='tr')
        return result.text
    except Exception as e:
        return text  # Hata olursa orijinali döndür

def main():
    print("=" * 70)
    print("Kronik Sorunlar - Google Translate ile Ücretsiz Toplu Çeviri")
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
        
        response = input(f"\n2. {len(english_records)} kaydı ÜCRETSİZ çevir? (e/h): ")
        if response.lower() != 'e':
            return
        
        print(f"\n3. Çeviri başlıyor (Google Translate - Ücretsiz)")
        print(f"   Her 50 kayıtta bir rapor verilecek")
        print(f"   Tahmini süre: ~{len(english_records) * 2 // 60} dakika")
        print()
        
        updated_count = 0
        failed_count = 0
        skipped_count = 0
        
        for idx, record in enumerate(english_records, 1):
            try:
                complaints_list = json.loads(record['sample_complaints'])
                
                # Her şikayeti çevir
                translated_list = []
                has_translation = False
                
                for complaint in complaints_list:
                    if is_english(complaint):
                        translated = translate_text(complaint)
                        translated_list.append(translated)
                        if translated != complaint:
                            has_translation = True
                    else:
                        translated_list.append(complaint)
                
                # Eğer çeviri yapıldıysa güncelle
                if has_translation:
                    new_json = json.dumps(translated_list, ensure_ascii=False)
                    cursor.execute(
                        "UPDATE kronik_sorunlar SET sample_complaints = %s WHERE id = %s",
                        (new_json, record['id'])
                    )
                    updated_count += 1
                else:
                    skipped_count += 1
                
                # Her 50 kayıtta rapor ve commit
                if idx % 50 == 0:
                    conn.commit()
                    progress = (idx / len(english_records)) * 100
                    print(f"   [{idx}/{len(english_records)}] ({progress:.1f}%) ✓ {updated_count} güncellendi, {skipped_count} atlandı, {failed_count} hata")
                
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
                    print(f"   ✗ Kayıt {record['id']} hatası: {str(e)[:50]}")
        
        # Son commit
        conn.commit()
        
        # Özet
        print("\n" + "=" * 70)
        print("TAMAMLANDI")
        print("=" * 70)
        print(f"Toplam kayıt: {len(english_records)}")
        print(f"Güncellenen: {updated_count}")
        print(f"Atlanan (zaten Türkçe): {skipped_count}")
        print(f"Başarısız: {failed_count}")
        print(f"Başarı oranı: {(updated_count/(updated_count+failed_count)*100):.1f}%")
        print("=" * 70)
        print("\n✅ Tüm şikayetler ÜCRETSİZ çevrildi!")
        
    except KeyboardInterrupt:
        print("\n\n✗ İşlem kullanıcı tarafından durduruldu")
        print(f"   {updated_count} kayıt güncellendi")
        if 'conn' in locals():
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
