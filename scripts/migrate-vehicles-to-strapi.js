/**
 * MySQL'den Strapi'ye arac_dataveri verilerini taşıma scripti
 * 
 * Kullanım: node scripts/migrate-vehicles-to-strapi.js
 */

const mysql = require('mysql2/promise');

// MySQL bağlantı ayarları (local MySQL)
const MYSQL_CONFIG = {
    host: '192.168.0.250',
    user: 'dietpi',
    password: 'Aras2017@',
    database: 'randevu_db'
};

// Strapi API ayarları
const STRAPI_URL = process.env.STRAPI_URL || 'https://api.tamirhanem.net';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '131dd31cc245cd962ce0429a1bc119f91686a7cc1f50cae059dabd88847af68444c63750a4cc20911655bad7054f7532205e642b48988ce1957668eb1e07f7e71e7dee383b8b33acea5822458a828c360983c43773026ea91ddb9c4dcff749084912a9bc1bb350321c5bd69650acbb17f9bd7e8e381bac9c1406f928882a7b25';

async function fetchFromMySQL() {
    console.log('📊 MySQL bağlantısı kuruluyor...');
    
    const connection = await mysql.createConnection(MYSQL_CONFIG);
    
    const [rows] = await connection.execute(
        'SELECT DISTINCT brand, model FROM arac_datasis WHERE brand IS NOT NULL ORDER BY brand, model'
    );
    
    await connection.end();
    
    console.log(`✅ ${rows.length} kayıt MySQL'den alındı`);
    return rows;
}

async function postToStrapi(data) {
    const response = await fetch(`${STRAPI_URL}/api/arac-dataveris`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        },
        body: JSON.stringify({ data })
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Strapi API Error: ${response.status} - ${error}`);
    }
    
    return response.json();
}

async function checkExistsInStrapi(brand, model, year) {
    const response = await fetch(
        `${STRAPI_URL}/api/arac-dataveris?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`,
        {
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            }
        }
    );
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.data && data.data.length > 0;
}

async function migrate() {
    console.log('🚀 Migration başlıyor...\n');
    
    try {
        // MySQL'den verileri çek
        const vehicles = await fetchFromMySQL();
        
        if (vehicles.length === 0) {
            console.log('⚠️ MySQL\'de arac_dataveri tablosunda veri bulunamadı');
            return;
        }
        
        console.log('\n📤 Strapi\'ye aktarım başlıyor...\n');
        
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];
            
            try {
                // Zaten var mı kontrol et
                const exists = await checkExistsInStrapi(
                    vehicle.brand, 
                    vehicle.model, 
                    vehicle.year
                );
                
                if (exists) {
                    skipCount++;
                    process.stdout.write(`\r⏭️ Atlanan: ${skipCount} | ✅ Eklenen: ${successCount} | ❌ Hata: ${errorCount}`);
                    continue;
                }
                
                // Strapi'ye ekle
                await postToStrapi({
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year || null,
                    fuelType: vehicle.fuel_type || vehicle.fuelType || null,
                    engineType: vehicle.engine_type || vehicle.engineType || null
                });
                
                successCount++;
                process.stdout.write(`\r⏭️ Atlanan: ${skipCount} | ✅ Eklenen: ${successCount} | ❌ Hata: ${errorCount}`);
                
                // Rate limiting - her 10 kayıtta 100ms bekle
                if (i % 10 === 0) {
                    await new Promise(r => setTimeout(r, 100));
                }
                
            } catch (error) {
                errorCount++;
                console.error(`\n❌ Hata (${vehicle.brand} ${vehicle.model}): ${error.message}`);
            }
        }
        
        console.log('\n\n📊 Migration Özeti:');
        console.log(`   ✅ Başarılı: ${successCount}`);
        console.log(`   ⏭️ Atlanan (zaten var): ${skipCount}`);
        console.log(`   ❌ Hatalı: ${errorCount}`);
        console.log('\n🎉 Migration tamamlandı!');
        
    } catch (error) {
        console.error('❌ Migration hatası:', error.message);
        process.exit(1);
    }
}

migrate();
