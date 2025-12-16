const mysql = require('mysql2/promise');

const STRAPI_API = 'https://api.tamirhanem.net/api';
const BATCH_SIZE = 50;

// Use Strapi's local MySQL connection (same database)
const mysqlConfig = {
    host: '127.0.0.1',
    user: 'strapi',
    password: 'GucluBirSifre123!',
    database: 'randevu_db'
};

async function migrateObdCodes() {
    console.log('🚀 Starting OBD Codes Migration (Local MySQL)...');
    
    let connection;
    try {
        connection = await mysql.createConnection(mysqlConfig);
        console.log('✅ MySQL connected');
    } catch (err) {
        console.error('❌ MySQL connection failed:', err.message);
        return;
    }
    
    // Check if obdkodlari table exists
    try {
        const [tables] = await connection.execute("SHOW TABLES LIKE 'obdkodlari'");
        if (tables.length === 0) {
            console.log('⚠️ obdkodlari table not found in local database');
            console.log('📋 Will create sample OBD codes instead...');
            await createSampleObdCodes();
            await connection.end();
            return;
        }
    } catch (err) {
        console.error('❌ Table check failed:', err.message);
    }
    
    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as cnt FROM obdkodlari');
    const totalCount = countResult[0].cnt;
    console.log(`📊 Total OBD codes to migrate: ${totalCount}`);
    
    if (totalCount === 0) {
        console.log('⚠️ No OBD codes found in source table');
        await connection.end();
        return;
    }
    
    let migrated = 0;
    let errors = 0;
    let skipped = 0;
    let offset = 0;
    
    while (offset < totalCount) {
        // Fetch batch from MySQL
        const [rows] = await connection.execute(
            `SELECT id, code, title, description, causes, solutions, severity, frequency 
             FROM obdkodlari 
             ORDER BY id 
             LIMIT ${BATCH_SIZE} OFFSET ${offset}`
        );
        
        // Insert each row to Strapi
        for (const row of rows) {
            try {
                // Parse JSON fields
                let causes = null;
                let solutions = null;
                
                try {
                    causes = row.causes ? JSON.parse(row.causes) : null;
                } catch (e) {
                    causes = row.causes ? [row.causes] : null;
                }
                
                try {
                    solutions = row.solutions ? JSON.parse(row.solutions) : null;
                } catch (e) {
                    solutions = row.solutions ? [row.solutions] : null;
                }
                
                const payload = {
                    data: {
                        code: row.code,
                        title: row.title || '',
                        description: row.description || '',
                        causes: causes,
                        solutions: solutions,
                        severity: row.severity || 'medium',
                        frequency: row.frequency || 0
                    }
                };
                
                const response = await fetch(`${STRAPI_API}/obd-codes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    migrated++;
                } else {
                    const error = await response.text();
                    if (error.includes('unique') || error.includes('Unique')) {
                        skipped++;
                    } else {
                        console.error(`❌ Error migrating ${row.code}: ${error.substring(0, 100)}`);
                        errors++;
                    }
                }
            } catch (err) {
                console.error(`❌ Error migrating ${row.code}:`, err.message);
                errors++;
            }
        }
        
        offset += BATCH_SIZE;
        console.log(`📦 Progress: ${Math.min(offset, totalCount)}/${totalCount} (${migrated} new, ${skipped} skipped, ${errors} errors)`);
    }
    
    await connection.end();
    console.log(`\n✅ Migration complete!`);
    console.log(`📊 Total: ${totalCount}, New: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`);
}

async function createSampleObdCodes() {
    const sampleCodes = [
        { code: 'P0300', title: 'Rastgele/Çoklu Silindir Misfire Algılandı', severity: 'high', frequency: 100 },
        { code: 'P0420', title: 'Katalizör Sistem Verimliliği Eşik Altında (Banka 1)', severity: 'medium', frequency: 95 },
        { code: 'P0171', title: 'Sistem Çok Fakir (Banka 1)', severity: 'medium', frequency: 90 },
        { code: 'P0172', title: 'Sistem Çok Zengin (Banka 1)', severity: 'medium', frequency: 85 },
        { code: 'P0442', title: 'Buharlaşma Sistemi Küçük Kaçak Algılandı', severity: 'low', frequency: 80 },
        { code: 'P0455', title: 'Buharlaşma Sistemi Büyük Kaçak Algılandı', severity: 'medium', frequency: 75 }
    ];
    
    console.log('📝 Creating sample OBD codes...');
    for (const code of sampleCodes) {
        try {
            await fetch(`${STRAPI_API}/obd-codes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: code })
            });
            console.log(`✅ Created ${code.code}`);
        } catch (err) {
            console.error(`❌ Failed ${code.code}`);
        }
    }
}

migrateObdCodes().catch(console.error);
