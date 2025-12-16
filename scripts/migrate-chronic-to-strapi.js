#!/usr/bin/env node
/**
 * MySQL Kronik Sorunlar -> Strapi Migration Script
 * randevu_db_web.kronik_sorunlar -> Strapi chronic-problems
 * 
 * Kaldığı yerden devam eder - Strapi'deki mevcut kayıtları kontrol eder
 */

const mysql = require('mysql2/promise');

const STRAPI_API = 'http://localhost:1337/api';
const STRAPI_TOKEN = '131dd31cc245cd962ce0429a1bc119f91686a7cc1f50cae059dabd88847af68444c63750a4cc20911655bad7054f7532205e642b48988ce1957668eb1e07f7e71e7dee383b8b33acea5822458a828c360983c43773026ea91ddb9c4dcff749084912a9bc1bb350321c5bd69650acbb17f9bd7e8e381bac9c1406f928882a7b25';

const DB_CONFIG = {
    host: 'localhost',
    user: 'tamirhanem',
    password: 'Aras2017@',
    database: 'randevu_db_web'
};

// Strapi'deki mevcut kayıt ID'lerini al
async function getStrapiExistingIds() {
    try {
        const codes = new Set();
        let page = 1;
        const pageSize = 100;
        
        while (true) {
            const response = await fetch(
                `${STRAPI_API}/chronic-problems?pagination[pageSize]=${pageSize}&pagination[page]=${page}&fields[0]=mysql_id`,
                {
                    headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
                }
            );
            
            if (!response.ok) {
                // Collection henüz yok olabilir
                console.log('   ⚠ chronic-problems collection henüz oluşturulmamış veya erişim yok');
                return new Set();
            }
            
            const data = await response.json();
            if (!data.data || data.data.length === 0) break;
            
            data.data.forEach(item => {
                const mysqlId = item.attributes?.mysql_id || item.mysql_id;
                if (mysqlId) codes.add(mysqlId);
            });
            
            if (data.data.length < pageSize) break;
            page++;
        }
        
        return codes;
    } catch (error) {
        console.error('Strapi bağlantı hatası:', error.message);
        return new Set();
    }
}

async function addToStrapi(record) {
    try {
        // sample_complaints ve recalls JSON parse et
        let sampleComplaints = [];
        let recalls = [];
        
        try {
            sampleComplaints = record.sample_complaints ? JSON.parse(record.sample_complaints) : [];
        } catch {
            sampleComplaints = record.sample_complaints ? [record.sample_complaints] : [];
        }
        
        try {
            recalls = record.recalls ? JSON.parse(record.recalls) : [];
        } catch {
            recalls = record.recalls ? [record.recalls] : [];
        }

        const payload = {
            data: {
                mysql_id: record.id,
                brand: record.brand,
                model: record.model,
                year_start: record.year_start,
                year_end: record.year_end,
                issue_code: record.issue_code,
                title: record.title || '',
                component: record.component || '',
                risk_level: record.risk_level || 'orta',
                estimated_cost_band: record.estimated_cost_band || '',
                complaint_count: record.complaint_count || 0,
                crash_count: record.crash_count || 0,
                injury_count: record.injury_count || 0,
                death_count: record.death_count || 0,
                fire_count: record.fire_count || 0,
                recall_count: record.recall_count || 0,
                sample_complaints: sampleComplaints,
                recalls: recalls,
                source: 'database'
            }
        };

        const response = await fetch(
            `${STRAPI_API}/chronic-problems`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            const error = await response.text();
            if (error.includes('duplicate') || error.includes('unique')) {
                return { success: true, skipped: true };
            }
            return { success: false, error };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('MySQL -> Strapi Kronik Sorunlar Migration');
    console.log('='.repeat(60));

    let connection;
    try {
        // Strapi'deki mevcut kayıtları kontrol et
        console.log('\n1. Strapi\'deki mevcut kayıtlar kontrol ediliyor...');
        const existingIds = await getStrapiExistingIds();
        console.log(`   ✓ Strapi'de ${existingIds.size} kayıt mevcut`);

        // MySQL bağlantısı
        console.log('\n2. MySQL bağlantısı kuruluyor...');
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('   ✓ Bağlantı başarılı');

        // Toplam kayıt sayısı
        const [countResult] = await connection.query('SELECT COUNT(*) as total FROM kronik_sorunlar');
        const total = countResult[0].total;
        console.log(`\n3. MySQL'de toplam ${total} kronik sorun kaydı bulundu`);

        // Kayıtları batch halinde çek ve işle
        console.log('\n4. Aktarım başlıyor...');
        
        const batchSize = 1000;
        let offset = 0;
        let success = 0;
        let skipped = 0;
        let failed = 0;
        let processed = 0;

        while (offset < total) {
            const [rows] = await connection.query(
                `SELECT * FROM kronik_sorunlar ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`
            );

            for (const record of rows) {
                processed++;
                
                // Zaten Strapi'de varsa atla
                if (existingIds.has(record.id)) {
                    skipped++;
                    continue;
                }

                const result = await addToStrapi(record);
                
                if (result.success) {
                    if (result.skipped) {
                        skipped++;
                    } else {
                        success++;
                    }
                } else {
                    failed++;
                    if (failed <= 5) {
                        console.error(`   ✗ ID ${record.id}: ${result.error?.substring(0, 100)}`);
                    }
                }

                // Progress
                if (processed % 500 === 0 || processed === total) {
                    const percent = Math.round((processed / total) * 100);
                    console.log(`   [${percent}%] ${processed}/${total} - Eklenen: ${success}, Atlanan: ${skipped}, Hatalı: ${failed}`);
                }

                // Rate limiting
                if (success % 20 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            offset += batchSize;
        }

        console.log('\n' + '='.repeat(60));
        console.log('TAMAMLANDI');
        console.log('='.repeat(60));
        console.log(`Toplam işlenen: ${processed}`);
        console.log(`Yeni eklenen: ${success}`);
        console.log(`Atlanan (zaten var): ${skipped}`);
        console.log(`Hatalı: ${failed}`);

    } catch (error) {
        console.error('\n✗ Hata:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main().catch(console.error);
