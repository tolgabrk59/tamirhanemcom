#!/usr/bin/env node
/**
 * MySQL'deki tüm OBD Kodlarını Strapi'ye Aktarma Scripti
 * KALDI YERDEN DEVAM EDER - Strapi'deki mevcut sayıyı kontrol eder
 */

const mysql = require('mysql2/promise');

const STRAPI_API = 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = '131dd31cc245cd962ce0429a1bc119f91686a7cc1f50cae059dabd88847af68444c63750a4cc20911655bad7054f7532205e642b48988ce1957668eb1e07f7e71e7dee383b8b33acea5822458a828c360983c43773026ea91ddb9c4dcff749084912a9bc1bb350321c5bd69650acbb17f9bd7e8e381bac9c1406f928882a7b25';

// MySQL bağlantı ayarları
const DB_CONFIG = {
    host: 'localhost',
    user: 'tamirhanem',
    password: 'Aras2017@',
    database: 'randevu_db_web'
};

async function getStrapiExistingCodes() {
    try {
        // Strapi'deki mevcut kodları al
        const response = await fetch(
            `${STRAPI_API}/obd-codes?pagination[pageSize]=100&pagination[page]=1&fields[0]=code`,
            {
                headers: {
                    'Authorization': `Bearer ${STRAPI_TOKEN}`
                }
            }
        );
        
        if (!response.ok) return new Set();
        
        const data = await response.json();
        const total = data.meta?.pagination?.total || 0;
        const codes = new Set();
        
        // Her sayfadan kodları al
        const pageSize = 100;
        const pages = Math.ceil(total / pageSize);
        
        for (let page = 1; page <= pages; page++) {
            const pageResponse = await fetch(
                `${STRAPI_API}/obd-codes?pagination[pageSize]=${pageSize}&pagination[page]=${page}&fields[0]=code`,
                {
                    headers: {
                        'Authorization': `Bearer ${STRAPI_TOKEN}`
                    }
                }
            );
            
            if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                pageData.data?.forEach(item => {
                    const code = item.attributes?.code || item.code;
                    if (code) codes.add(code);
                });
            }
        }
        
        return codes;
    } catch (error) {
        console.error('Strapi kodları alınırken hata:', error.message);
        return new Set();
    }
}

async function addObdCodeToStrapi(code) {
    try {
        let causes = [];
        let solutions = [];
        
        try {
            causes = code.causes ? JSON.parse(code.causes) : [];
        } catch {
            causes = code.causes ? [code.causes] : [];
        }
        
        try {
            solutions = code.solutions ? JSON.parse(code.solutions) : [];
        } catch {
            solutions = code.solutions ? [code.solutions] : [];
        }

        const severityMap = {
            'YÜKSEK': 'high',
            'ORTA': 'medium',
            'DÜŞÜK': 'low',
            'HIGH': 'high',
            'MEDIUM': 'medium',
            'LOW': 'low'
        };

        const payload = {
            data: {
                code: code.code,
                title: code.title || '',
                description: code.description || '',
                symptoms: [],
                causes: causes,
                solutions: solutions,
                estimated_cost_min: null,
                estimated_cost_max: null,
                severity: severityMap[code.severity?.toUpperCase()] || 'medium',
                category: '',
                frequency: code.frequency || 0
            }
        };

        const response = await fetch(
            `${STRAPI_API}/obd-codes`,
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
    console.log('MySQL -> Strapi OBD Kodları Aktarımı (KALDI YERDEN DEVAM)');
    console.log('='.repeat(60));

    let connection;
    try {
        // Önce Strapi'deki mevcut kodları al
        console.log('\n1. Strapi\'deki mevcut kodlar kontrol ediliyor...');
        const existingCodes = await getStrapiExistingCodes();
        console.log(`   ✓ Strapi'de ${existingCodes.size} kod mevcut`);

        // MySQL bağlantısı
        console.log('\n2. MySQL bağlantısı kuruluyor...');
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('   ✓ Bağlantı başarılı');

        // Toplam kayıt sayısı
        const [countResult] = await connection.query('SELECT COUNT(*) as total FROM obdkodlari');
        const total = countResult[0].total;
        console.log(`\n3. MySQL'de toplam ${total} OBD kodu bulundu`);

        // Tüm kayıtları çek
        console.log('\n4. Kayıtlar çekiliyor...');
        const [rows] = await connection.query('SELECT * FROM obdkodlari ORDER BY id');
        console.log(`   ✓ ${rows.length} kayıt çekildi`);

        // Sadece Strapi'de olmayanları filtrele
        const newRows = rows.filter(row => !existingCodes.has(row.code));
        console.log(`   ✓ ${newRows.length} yeni kod eklenecek (${existingCodes.size} zaten var)`);

        if (newRows.length === 0) {
            console.log('\n✓ Tüm kodlar zaten Strapi\'de mevcut!');
            return;
        }

        // Strapi'ye aktar
        console.log('\n5. Strapi\'ye aktarım başlıyor...');
        let success = 0;
        let failed = 0;

        for (let i = 0; i < newRows.length; i++) {
            const code = newRows[i];
            const result = await addObdCodeToStrapi(code);
            
            if (result.success) {
                success++;
            } else {
                failed++;
                if (failed <= 5) {
                    console.error(`   ✗ ${code.code}: ${result.error?.substring(0, 100)}`);
                }
            }

            // Progress göster
            if ((i + 1) % 100 === 0 || i === newRows.length - 1) {
                const percent = Math.round(((i + 1) / newRows.length) * 100);
                console.log(`   [${percent}%] ${i + 1}/${newRows.length} - Başarılı: ${success}, Hatalı: ${failed}`);
            }

            // Rate limiting
            if ((i + 1) % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('TAMAMLANDI');
        console.log('='.repeat(60));
        console.log(`Strapi'de önceden var olan: ${existingCodes.size}`);
        console.log(`Yeni eklenen: ${success}`);
        console.log(`Hatalı: ${failed}`);
        console.log(`Toplam Strapi'de: ${existingCodes.size + success}`);

    } catch (error) {
        console.error('\n✗ Hata:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main().catch(console.error);
