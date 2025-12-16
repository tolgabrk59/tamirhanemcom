import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Build Strapi query filters
        const filters: string[] = [];
        
        const brand = searchParams.get('brand');
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const district = searchParams.get('district');
        
        // Strapi filters
        if (brand) {
            // JSON array search - Strapi uses $containsi for case-insensitive contains
            filters.push(`filters[$or][0][supports_all_vehicles][$eq]=true`);
            filters.push(`filters[$or][1][supported_vehicles][$containsi]=${encodeURIComponent(brand)}`);
        }
        
        if (city) {
            filters.push(`filters[location][$containsi]=${encodeURIComponent(city)}`);
        }
        
        if (district) {
            filters.push(`filters[location][$containsi]=${encodeURIComponent(district)}`);
        }
        
        // Build URL
        let url = `${STRAPI_API}/services?populate=*&pagination[limit]=50&sort=rating:desc`;
        if (filters.length > 0) {
            url += '&' + filters.join('&');
        }
        
        const response = await fetch(url, {
            next: { revalidate: 300 } // 5 dakika cache
        });
        
        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }
        
        const json = await response.json();
        const services = json.data || [];
        
        // Strapi formatından frontend formatına çevir
        const formattedServices = services.map((service: any) => {
            const attrs = service.attributes || service;
            return {
                id: service.id,
                name: attrs.name || '',
                location: attrs.location || '',
                rating: attrs.rating || null,
                rating_count: attrs.rating_count || null,
                latitude: attrs.latitude || null,
                longitude: attrs.longitude || null,
                phone: attrs.phone || null,
                pic: attrs.pic?.data?.attributes?.url || null,
                is_official_service: attrs.is_official_service || false,
                provides_roadside_assistance: attrs.provides_roadside_assistance || false,
                supported_vehicles: attrs.supported_vehicles || [],
                supports_all_vehicles: attrs.supports_all_vehicles || false
            };
        });
        
        // Client-side category filter (Strapi relation filter is complex)
        let filteredServices = formattedServices;
        if (category) {
            // For now, return all services when category is specified
            // TODO: Implement proper category filtering via Strapi relations
        }

        return NextResponse.json({
            success: true,
            data: filteredServices,
            count: filteredServices.length
        });
    } catch (error) {
        console.error('Strapi API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Servisler yüklenemedi' },
            { status: 500 }
        );
    }
}
