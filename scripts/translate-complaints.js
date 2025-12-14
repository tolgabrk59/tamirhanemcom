const mysql = require('mysql2/promise');
const https = require('https');

// MySQL bağlantı ayarları
const dbConfig = {
    host: 'localhost',
    user: 'tamirhanem',
    password: 'Aras2017@',
    database: 'randevu_db'
};

// Cümle başlangıçlarını büyük, geri kalanını küçük yap
function capitalizeText(text) {
    if (!text) return text;

    // Her cümlenin ilk harfini büyük yap
    return text
        .split(/([.!?]\s+)/)
        .map((part, index) => {
            if (index % 2 === 0 && part.trim()) {
                // Cümle kısmı
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            return part;
        })
        .join('');
}

// Google Translate API kullanarak çeviri yap
async function translateText(text, targetLang = 'tr') {
    return new Promise((resolve, reject) => {
        const encodedText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed[0]) {
                        const translated = parsed[0].map(item => item[0]).join('');
                        resolve(capitalizeText(translated));
                    } else {
                        resolve(text); // Çeviri başarısız olursa orijinali döndür
                    }
                } catch (error) {
                    console.error('Parse error:', error);
                    resolve(text);
                }
            });
        }).on('error', (error) => {
            console.error('Translation error:', error);
            resolve(text); // Hata durumunda orijinali döndür
        });
    });
}

// Delay fonksiyonu (rate limiting için)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ana çeviri fonksiyonu
async function translateComplaints() {
    let connection;

    try {
        console.log('Veritabanına bağlanılıyor...');
        connection = await mysql.createConnection(dbConfig);

        // İngilizce kayıtları çek
        console.log('İngilizce kayıtlar getiriliyor...');
        const [rows] = await connection.execute(`
            SELECT id, sample_complaints 
            FROM kronik_sorunlar 
            WHERE sample_complaints LIKE '%the car%' 
               OR sample_complaints LIKE '%I was%' 
               OR sample_complaints LIKE '%my car%'
            ORDER BY id
        `);

        console.log(`Toplam ${rows.length} kayıt bulundu. Çeviri başlıyor...`);

        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            try {
                processedCount++;
                console.log(`\n[${processedCount}/${rows.length}] ID: ${row.id} işleniyor...`);

                // JSON parse et
                let complaints = [];
                try {
                    complaints = JSON.parse(row.sample_complaints);
                } catch {
                    console.log('  ⚠️  JSON parse hatası, atlanıyor...');
                    errorCount++;
                    continue;
                }

                if (!Array.isArray(complaints) || complaints.length === 0) {
                    console.log('  ⚠️  Geçersiz veri formatı, atlanıyor...');
                    errorCount++;
                    continue;
                }

                // Her şikayeti çevir
                const translatedComplaints = [];
                for (let i = 0; i < complaints.length; i++) {
                    const complaint = complaints[i];

                    // Sadece İngilizce metinleri çevir
                    if (complaint && typeof complaint === 'string' && complaint.trim()) {
                        // Basit İngilizce kontrolü
                        const hasEnglishWords = /\b(the|car|was|my|and|with|for|this|that)\b/i.test(complaint);

                        if (hasEnglishWords) {
                            console.log(`  Çevriliyor [${i + 1}/${complaints.length}]...`);
                            const translated = await translateText(complaint);
                            translatedComplaints.push(translated);

                            // Rate limiting - her çeviriden sonra 500ms bekle
                            await delay(500);
                        } else {
                            // Zaten Türkçe, olduğu gibi ekle
                            translatedComplaints.push(complaint);
                        }
                    }
                }

                if (translatedComplaints.length > 0) {
                    // Veritabanını güncelle
                    const jsonData = JSON.stringify(translatedComplaints);
                    await connection.execute(
                        'UPDATE kronik_sorunlar SET sample_complaints = ? WHERE id = ?',
                        [jsonData, row.id]
                    );

                    console.log(`  ✅ Başarıyla güncellendi (${translatedComplaints.length} şikayet)`);
                    successCount++;
                } else {
                    console.log('  ⚠️  Çevrilecek metin bulunamadı');
                    errorCount++;
                }

                // Her 10 kayıtta bir durum raporu
                if (processedCount % 10 === 0) {
                    console.log(`\n📊 Durum: ${successCount} başarılı, ${errorCount} hata`);
                }

            } catch (error) {
                console.error(`  ❌ Hata (ID: ${row.id}):`, error.message);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Çeviri işlemi tamamlandı!');
        console.log(`📊 Toplam: ${processedCount} kayıt`);
        console.log(`✅ Başarılı: ${successCount}`);
        console.log(`❌ Hatalı: ${errorCount}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Kritik hata:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nVeritabanı bağlantısı kapatıldı.');
        }
    }
}

// Scripti çalıştır
console.log('🚀 Kronik Sorunlar Çeviri Scripti');
console.log('='.repeat(60));
translateComplaints();
