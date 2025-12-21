import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api/arac-dataveri';

// Türkiye pazarında olmayan veya pasif edilecek OTOMOBİL markaları
// (Kamyon, otobüs, ticari araç markaları da dahil)
const EXCLUDED_CAR_BRANDS = [
    // Türkiye'de olmayan/pasif markalar
    'BUGATTI',
    'CADILLAC',
    'DAF',
    'DFM',
    'DODGE',
    'GMC',
    'INFINITI',
    'LANCIA',
    'LINCOLN',
    'LOTUS',
    'MAYBACH',
    'MCLAREN',
    'OTOKAR/MAGIRUS',
    'OTOYOLIVECOFIAT',
    'PIAGGIO',
    'PROTON',
    'RAM',
    'ROLLS-ROYCE',
    'SAAB',
    'SETRA',
    'SMART',
    'TEMSA',
    'VOYAH',
    'HARLEY-DAVIDSON',
    'RAMZEY',
    // Kamyon, otobüs, ticari araç markaları (otomobil değil)
    'BMC',
    'ISUZU',
    'MAN',
    'DFSK',
    'MAXUS',
    'TATA',
    // Birleştirilmiş markalar (FIAT altında gösterilecek)
    'TOFAS-FIAT',
];

// Türkiye'de aktif olan MOTORSİKLET markaları (whitelist)
const ACTIVE_MOTORCYCLE_BRANDS = [
    'APRILIA',
    'ARORA',
    'ASKOLL',
    'ASYA',
    'AYTIMUR',
    'BAJAJ',
    'BENDA',
    'BENELLI',
    'BENLING',
    'BETA',
    'BISAN',
    'BMW',
    'BRIXTON',
    'BRP',
    'CAN-AM',
    'CAGIVA',
    'CFMOTO',
    'DAELIM',
    'DERBI',
    'DUCATI',
    'ECOOTER',
    'ENERGICA',
    'EVOKE',
    'FALCON',
    'FANTIC',
    'GASGAS',
    'GILERA',
    'HAOJUE',
    'HARLEY-DAVIDSON',
    'HERO',
    'HONDA',
    'HORWIN',
    'HUSQVARNA',
    'HYOSUNG',
    'INDIAN',
    'ITALJET',
    'JAWA',
    'KANUNI',
    'KAWASAKI',
    'KEEWAY',
    'KOVE',
    'KRAL',
    'KTM',
    'KUBA',
    'KYMCO',
    'LAMBRETTA',
    'LIFAN',
    'LINHAI',
    'LONCIN',
    'MALAGUTI',
    'MIKU',
    'MONDIAL',
    'MOTOGUZZI',
    'MOTOLUX',
    'MOTORAN',
    'MUTT',
    'MV',
    'MVAGUSTO',
    'NIU',
    'NOVA',
    'PGO',
    'PIAGGIO',
    'POLARIS',
    'QJ',
    'RAMZEY',
    'REVOLT',
    'RIEJU',
    'RKS',
    'ROYAL',
    'RVM',
    'SALCANO',
    'SHERCO',
    'SHINERAY',
    'SILENCE',
    'SPADA',
    'STELVIO',
    'SUNRA',
    'SUPER',
    'SUZUKI',
    'SWM',
    'SYM',
    'TGB',
    'TM',
    'TOMOTO',
    'TRIUMPH',
    'TROMOX',
    'TVS',
    'URAL',
    'VESPA',
    'VICTORY',
    'VITELLO',
    'VMOTO',
    'VOGE',
    'VOLTA',
    'XEV',
    'YAMAHA',
    'YUKI',
    'ZAFFERANO',
    'ZD',
    'ZEEHO',
    'ZERO',
    'ZONGSHEN',
    'ZONTES',
    'ZORRO',
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleType = searchParams.get('vehicleType') || undefined;
        
        let brands: string[] = [];
        
        if (vehicleType === 'motorsiklet') {
            // Motorsiklet için: MOTORSIKLET markasının modellerini çek
            const response = await fetch(`${STRAPI_API}/models/MOTORSIKLET`, {
                next: { revalidate: 3600 }
            });
            
            if (!response.ok) throw new Error('Strapi API erişim hatası');
            
            const json = await response.json();
            const allMotorcycleBrands = json.data || [];
            
            // Sadece aktif markaları filtrele
            brands = allMotorcycleBrands.filter((b: string) => 
                ACTIVE_MOTORCYCLE_BRANDS.includes(b)
            );
            
            // Harley-Davidson ve Ramzey'i ekle (otomobilden taşındı, Strapi'de olmayabilir)
            if (!brands.includes('HARLEY-DAVIDSON')) brands.push('HARLEY-DAVIDSON');
            if (!brands.includes('RAMZEY')) brands.push('RAMZEY');
            
            // Alfabetik sırala
            brands.sort();
        } else {
            // Otomobil veya tüm markalar için
            const response = await fetch(`${STRAPI_API}/unique-brands`, {
                next: { revalidate: 3600 }
            });
            
            if (!response.ok) throw new Error('Strapi API erişim hatası');
            
            const json = await response.json();
            const allBrands = json.data || [];
            
            if (vehicleType === 'otomobil') {
                // Otomobil için: MOTORSIKLET ve pasif markaları çıkar
                brands = allBrands.filter((b: string) => 
                    b !== 'MOTORSIKLET' && !EXCLUDED_CAR_BRANDS.includes(b)
                );
            } else {
                // Tüm markalar (filtresiz)
                brands = allBrands;
            }
        }
        
        // Frontend { brand: string } bekliyor
        const formattedBrands = brands.map((b: string) => ({ brand: b }));
        
        return NextResponse.json({ success: true, data: formattedBrands });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Markalar yüklenemedi' },
            { status: 500 }
        );
    }
}
