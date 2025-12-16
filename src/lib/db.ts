import mysql from 'mysql2/promise';
import type { ObdCode } from '@/types';

// MySQL bağlantı havuzu - trim() ile trailing whitespace temizlenir
const pool = mysql.createPool({
    host: (process.env.DB_HOST || 'localhost').trim(),
    user: (process.env.DB_USER || 'tamirhanem').trim(),
    password: (process.env.DB_PASSWORD || 'Aras2017@').trim(),
    database: (process.env.DB_NAME || 'randevu_db').trim(),
    waitForConnections: true,
    connectionLimit: parseInt((process.env.DB_CONNECTION_LIMIT || '10').trim()),
    queueLimit: 0,
    ssl: (process.env.DB_SSL || '').trim() === 'true' ? { rejectUnauthorized: true } : undefined,
});

export default pool;

// Kategorileri çek
export async function getCategories() {
    try {
        const [rows] = await pool.execute('SELECT id, name, description FROM categories ORDER BY name ASC') as [any[], any];

        // Türkçe karakterleri slug'a çevir
        const slugify = (text: string) => {
            return text
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        };

        return rows.map((row: { id: number; name: string; description: string }) => ({
            id: row.id,
            name: row.name,
            title: row.name, // CategoryCard'ın beklediği alan
            description: row.description || '',
            slug: slugify(row.name)
        }));
    } catch (error) {
        console.error('MySQL Error:', error);
        return [];
    }
}

// Markaları çek (benzersiz)
export async function getBrands() {
    try {
        const [rows] = await pool.execute('SELECT DISTINCT brand FROM arac_dataveri WHERE brand IS NOT NULL ORDER BY brand ASC');
        return rows;
    } catch (error) {
        console.error('MySQL Error:', error);
        return [];
    }
}

// Modelleri markaya göre çek
export async function getModelsByBrand(brand: string) {
    try {
        const [rows] = await pool.execute(
            'SELECT DISTINCT model FROM arac_dataveri WHERE brand = ? AND model IS NOT NULL ORDER BY model ASC',
            [brand]
        );
        return rows;
    } catch (error) {
        console.error('MySQL Error:', error);
        return [];
    }
}

// Paketleri (full_model) markaya ve modele göre çek
export async function getPackagesByBrandModel(brand: string, model: string) {
    try {
        const [rows] = await pool.execute(
            'SELECT DISTINCT fuel_type, engine_type, year FROM arac_dataveri WHERE brand = ? AND model = ? ORDER BY year DESC',
            [brand, model]
        );
        return rows;
    } catch (error) {
        console.error('MySQL Error:', error);
        return [];
    }
}

// Servisleri filtrele ve ara

export async function searchServices(filters: {
    brand?: string;
    model?: string;
    category?: string;
    city?: string;
    district?: string;
    fuel_type?: string;
}) {

    try {
        let query = `
            SELECT DISTINCT
                s.id,
                s.name,
                s.location,
                s.rating,
                s.rating_count,
                s.latitude,
                s.longitude,
                s.phone,
                s.supported_vehicles,
                s.supports_all_vehicles,
                s.is_official_service,
                s.provides_roadside_assistance
            FROM services s
            WHERE s.published_at IS NOT NULL
        `;

        const params: any[] = [];

        // Marka filtresi (supported_vehicles JSON array'inde arama)
        if (filters.brand) {
            query += ` AND (s.supports_all_vehicles = 1 OR JSON_CONTAINS(s.supported_vehicles, ?, '$'))`;
            params.push(JSON.stringify(filters.brand.toUpperCase()));
        }

        // Kategori filtresi (categories tablosu ile join)
        if (filters.category) {
            query += ` 
                AND EXISTS (
                    SELECT 1 FROM categories_services_links csl
                    JOIN categories c ON c.id = csl.category_id
                    WHERE csl.service_id = s.id AND c.name = ?
                )
            `;
            params.push(filters.category);
        }


        // Lokasyon filtresi
        if (filters.city) {
            query += ` AND s.location LIKE ?`;
            params.push(`%${filters.city}%`);
        }

        if (filters.district) {
            query += ` AND s.location LIKE ?`;
            params.push(`%${filters.district}%`);
        }
        
        // Yakıt türü filtresi (supported_fuel_types JSON array'inde arama - Örn: ["Benzin", "LPG"])
        if (filters.fuel_type) {
             query += ` AND (s.supported_fuel_types IS NULL OR JSON_CONTAINS(s.supported_fuel_types, ?, '$'))`;
             // Basit string karşılaştırması için JSON string formatına çeviriyoruz. 
             // Ancak veritabanında "Benzin" (Büyük harf) olabilir, bu yüzden insensitive arama gerekebilir. 
             // Şimdilik gelen değeri olduğu gibi veya formatlayarak arıyoruz.
             // Frontendden 'benzin', 'dizel' gibi küçük harf gelebilir. 
             // Veri standardı: İlk harf büyük varsayalım (Benzin, Dizel...).
             const formatFuel = filters.fuel_type.charAt(0).toUpperCase() + filters.fuel_type.slice(1).toLowerCase();
             params.push(JSON.stringify(formatFuel));
        }


        query += ` ORDER BY s.rating DESC, s.rating_count DESC LIMIT 50`;

        const [rows] = await pool.execute(query, params) as [any[], any];
        return rows;
    } catch (error) {
        console.error('MySQL Service Search Error:', error);
        return [];
    }
}

// OBD kodlarını ara
export async function searchObdCodes(query: string, limit: number = 20): Promise<ObdCode[]> {
    try {
        const searchTerm = `%${query}%`;
        const [rows] = await pool.execute(
            `SELECT 
                id,
                code,
                title,
                description,
                causes,
                solutions,
                severity,
                frequency
            FROM obdkodlari 
            WHERE code LIKE ? OR title LIKE ? OR description LIKE ?
            ORDER BY 
                CASE 
                    WHEN code = ? THEN 1
                    WHEN code LIKE ? THEN 2
                    ELSE 3
                END,
                frequency DESC,
                code ASC
            LIMIT ?`,
            [searchTerm, searchTerm, searchTerm, query.toUpperCase(), `${query.toUpperCase()}%`, limit]
        ) as [any[], any];

        // Verileri frontend formatına çevir
        return rows.map((row: any): ObdCode => {
            // Severity mapping
            const severityMap: { [key: string]: ObdCode['severity'] } = {
                'YÜKSEK': 'high',
                'ORTA': 'medium',
                'DÜŞÜK': 'low'
            };

            // causes ve solutions JSON array olarak saklanmış
            let causes: string[] = [];
            let solutions: string[] = [];

            try {
                causes = row.causes ? JSON.parse(row.causes) : [];
            } catch {
                // Eğer JSON değilse, satır satır ayır
                causes = row.causes ? row.causes.split('\n').filter((c: string) => c.trim()) : [];
            }

            try {
                solutions = row.solutions ? JSON.parse(row.solutions) : [];
            } catch {
                // Eğer JSON değilse, satır satır ayır
                solutions = row.solutions ? row.solutions.split('\n').filter((s: string) => s.trim()) : [];
            }

            return {
                id: row.id,
                code: row.code,
                title: row.title,
                description: row.description || '',
                causes: causes,
                fixes: solutions, // 'solutions' -> 'fixes' (frontend beklediği alan)
                symptoms: [], // Şu an veritabanında yok, boş array
                severity: severityMap[row.severity] || 'medium',
                category: '', // Şu an veritabanında yok
                estimatedCostMin: null,
                estimatedCostMax: null,
                frequency: row.frequency || 0
            };
        });
    } catch (error) {
        console.error('MySQL OBD Search Error:', error);
        return [];
    }
}

// Popüler OBD kodlarını çek
export async function getPopularObdCodes(limit: number = 6): Promise<ObdCode[]> {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                id,
                code,
                title,
                description,
                causes,
                solutions,
                severity,
                frequency
            FROM obdkodlari 
            ORDER BY frequency DESC, code ASC
            LIMIT ?`,
            [limit]
        ) as [any[], any];

        // Verileri frontend formatına çevir (aynı mapping logic)
        return rows.map((row: any): ObdCode => {
            const severityMap: { [key: string]: ObdCode['severity'] } = {
                'YÜKSEK': 'high',
                'ORTA': 'medium',
                'DÜŞÜK': 'low'
            };

            let causes: string[] = [];
            let solutions: string[] = [];

            try {
                causes = row.causes ? JSON.parse(row.causes) : [];
            } catch {
                causes = row.causes ? row.causes.split('\n').filter((c: string) => c.trim()) : [];
            }

            try {
                solutions = row.solutions ? JSON.parse(row.solutions) : [];
            } catch {
                solutions = row.solutions ? row.solutions.split('\n').filter((s: string) => s.trim()) : [];
            }

            return {
                id: row.id,
                code: row.code,
                title: row.title,
                description: row.description || '',
                causes: causes,
                fixes: solutions,
                symptoms: [],
                severity: severityMap[row.severity] || 'medium',
                category: '',
                estimatedCostMin: null,
                estimatedCostMax: null,
                frequency: row.frequency || 0
            };
        });
    } catch (error) {
        console.error('MySQL Popular OBD Codes Error:', error);
        return [];
    }
}

// Kronik sorunları ara
export async function searchChronicProblems(brand?: string, model?: string, year?: number, problemQuery?: string) {
    try {
        let query = 'SELECT * FROM kronik_sorunlar WHERE 1=1';
        const params: any[] = [];

        if (brand) {
            query += ' AND brand = ?';
            params.push(brand);
        }

        if (model) {
            query += ' AND model = ?';
            params.push(model);
        }

        if (year) {
            query += ' AND (year_start IS NULL OR year_start <= ?) AND (year_end IS NULL OR year_end >= ?)';
            params.push(year, year);
        }

        if (problemQuery && problemQuery.trim()) {
            query += ' AND (title LIKE ? OR component LIKE ? OR sample_complaints LIKE ?)';
            const searchTerm = `%${problemQuery}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY brand, model, year_start';

        const [rows] = await pool.execute(query, params) as [any[], any];
        return rows;
    } catch (error) {
        console.error('MySQL Kronik Sorunlar Search Error:', error);
        return [];
    }
}

// Cache expiration config (in days)
const CACHE_TTL = {
    PRICES: 30,           // Fiyat verileri 30 gün
    CHRONIC_PROBLEMS: 30, // Kronik sorunlar 30 gün
    TECHNICAL: 120        // Teknik veriler 120 gün
};

// AI Analizlerini getir (Cache with expiration)
export async function getVehicleAnalysis(brand: string, model: string, year: number) {
    try {
        const [rows] = await pool.execute(
            'SELECT data, updated_at FROM ai_vehicle_analysis WHERE brand = ? AND model = ? AND year = ?',
            [brand, model, year]
        ) as [any[], any];

        if (rows.length > 0) {
            const cachedData = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
            const updatedAt = new Date(rows[0].updated_at);
            const now = new Date();
            const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

            // Check if prices need refresh (30 days)
            const pricesExpired = daysSinceUpdate >= CACHE_TTL.PRICES;
            // Check if chronic problems need refresh (30 days)
            const chronicExpired = daysSinceUpdate >= CACHE_TTL.CHRONIC_PROBLEMS;
            // Check if technical data needs refresh (120 days)
            const technicalExpired = daysSinceUpdate >= CACHE_TTL.TECHNICAL;

            // If all data is still valid, return from cache
            if (!pricesExpired && !chronicExpired && !technicalExpired) {
                return { ...cachedData, _fromCache: true, _cacheAge: daysSinceUpdate };
            }

            // If only some parts expired, return partial data with refresh flags
            return {
                ...cachedData,
                _fromCache: true,
                _cacheAge: daysSinceUpdate,
                _needsRefresh: {
                    prices: pricesExpired,
                    chronic_problems: chronicExpired,
                    technical: technicalExpired,
                    full: technicalExpired // If technical expired, refresh everything
                }
            };
        }
        return null;
    } catch (error) {
        console.error('MySQL Get Vehicle Analysis Error:', error);
        return null;
    }
}

// AI Analizini kaydet (Cache)
export async function saveVehicleAnalysis(brand: string, model: string, year: number, data: any) {
    try {
        await pool.execute(
            `INSERT INTO ai_vehicle_analysis (brand, model, year, data, updated_at) 
             VALUES (?, ?, ?, ?, NOW()) 
             ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()`,
            [brand, model, year, JSON.stringify(data)]
        );
        return true;
    } catch (error) {
        console.error('MySQL Save Vehicle Analysis Error:', error);
        return false;
    }
}

