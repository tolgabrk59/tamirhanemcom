import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

// Resim URL'ini işleyen fonksiyon (HTML'den alındı)
function getServiceImageUrl(image: any): string | null {
    if (!image) return null;
    
    const baseUrl = STRAPI_API.replace(/\/api$/, '');
    
    // Durum 1: Data wrapper içinde (Strapi v4 standart)
    if (image.data) {
        if (Array.isArray(image.data) && image.data.length > 0) {
            const url = image.data[0]?.attributes?.url;
            if (url) return url.startsWith('http') ? url : `${baseUrl}${url}`;
        }
        if (image.data?.attributes?.url) {
            const url = image.data.attributes.url;
            return url.startsWith('http') ? url : `${baseUrl}${url}`;
        }
    }
    
    // Durum 2: Attributes içinde direkt url
    if (image.attributes && image.attributes.url) {
        const url = image.attributes.url;
        return url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
    
    // Durum 3: Direkt obje içinde url
    if (image.url) {
        return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
    }
    
    // Durum 4: String olarak gelmişse
    if (typeof image === 'string') {
        if (image.startsWith('http')) return image;
        if (image.startsWith('/')) return `${baseUrl}${image}`;
        return image;
    }
    
    return null;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const brand = searchParams.get('brand');
        const model = searchParams.get('model');
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const district = searchParams.get('district');
        
        // Tüm servisleri çek (HTML mantığı: client-side filtering)
        const url = `${STRAPI_API}/services?populate=*&pagination[pageSize]=100&sort=rating:desc`;
        
        const response = await fetch(url, {
            next: { revalidate: 300 } // 5 dakika cache
        });
        
        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }
        
        const json = await response.json();
        let services = json.data || [];
        
        // --- CLIENT-SIDE FİLTRELEME (HTML mantığı) ---
        services = services.filter((service: any) => {
            const attr = service.attributes || service;
            
            // 1. Lokasyon filtresi
            if (city && attr.location !== city) {
                // Case-insensitive contains kontrolü
                if (!attr.location?.toLowerCase().includes(city.toLowerCase())) {
                    return false;
                }
            }
            
            if (district && !attr.location?.toLowerCase().includes(district.toLowerCase())) {
                return false;
            }
            
            // 2. Kategori filtresi (Relation ID kontrolü)
            if (category) {
                const cats = attr.categories?.data || attr.categories || [];
                const hasCat = cats.some((c: any) => 
                    String(c.id || c.data?.id) === String(category) ||
                    (c.attributes?.name || c.name || '').toLowerCase().includes(category.toLowerCase())
                );
                if (!hasCat) return false;
            }
            
            // 3. Marka/Model filtresi (Supported Vehicles kontrolü)
            if (brand) {
                // supports_all_vehicles true ise kabul et
                if (attr.supports_all_vehicles === true) {
                    // Marka kontrolü bypass
                } else {
                    const supportedData = attr.supported_vehicles || attr.supportedVehicles;
                    const strData = JSON.stringify(supportedData || "").toLowerCase();
                    
                    if (!strData.includes(brand.toLowerCase())) return false;
                    if (model && !strData.includes(model.toLowerCase())) return false;
                }
            }
            
            return true;
        });
        
        // Strapi formatından frontend formatına çevir
        const formattedServices = services.map((service: any) => {
            const attrs = service.attributes || service;
            
            // Kategori isimlerini çek
            const categoryNames = (attrs.categories?.data || attrs.categories || [])
                .map((c: any) => c.attributes?.name || c.name || '')
                .filter(Boolean);
            
            return {
                id: service.id,
                name: attrs.name || '',
                location: attrs.location || '',
                rating: attrs.rating || null,
                rating_count: attrs.rating_count || attrs.ratingCount || null,
                latitude: attrs.latitude ? parseFloat(attrs.latitude) : null,
                longitude: attrs.longitude ? parseFloat(attrs.longitude) : null,
                phone: attrs.phone || null,
                pic: getServiceImageUrl(attrs.ProfilePicture || attrs.pic || attrs.image),
                is_official_service: attrs.is_official_service || attrs.isOfficialService || false,
                provides_roadside_assistance: attrs.provides_roadside_assistance || attrs.providesRoadsideAssistance || false,
                supported_vehicles: attrs.supported_vehicles || attrs.supportedVehicles || [],
                supports_all_vehicles: attrs.supports_all_vehicles || attrs.supportsAllVehicles || false,
                categories: categoryNames,
                // Harita popup için ek alanlar
                description: attrs.description || '',
                address: attrs.address || attrs.location || '',
                working_hours: attrs.working_hours || attrs.workingHours || null
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedServices,
            count: formattedServices.length
        });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Servisler yüklenemedi' },
            { status: 500 }
        );
    }
}
