import { NextResponse } from 'next/server';

const STRAPI_API = 'https://api.tamirhanem.net/api';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');
        const model = searchParams.get('model');
        const yearStr = searchParams.get('year');
        const year = yearStr ? parseInt(yearStr) : undefined;
        const problem = searchParams.get('problem');

        // Strapi query params oluştur
        let filters: string[] = [];
        
        if (brand) {
            filters.push(`filters[brand][$eq]=${encodeURIComponent(brand)}`);
        }
        
        if (model) {
            filters.push(`filters[model][$eq]=${encodeURIComponent(model)}`);
        }
        
        if (year) {
            // year_start <= year AND year_end >= year
            filters.push(`filters[year_start][$lte]=${year}`);
            filters.push(`filters[year_end][$gte]=${year}`);
        }
        
        if (problem && problem.trim()) {
            // Strapi'de $contains kullan
            filters.push(`filters[$or][0][title][$containsi]=${encodeURIComponent(problem)}`);
            filters.push(`filters[$or][1][component][$containsi]=${encodeURIComponent(problem)}`);
            filters.push(`filters[$or][2][sample_complaints][$containsi]=${encodeURIComponent(problem)}`);
        }

        const queryString = filters.length > 0 ? `${filters.join('&')}&` : '';
        const url = `${STRAPI_API}/chronic-problems?${queryString}pagination[pageSize]=100&sort=brand:asc,model:asc,year_start:asc`;

        const response = await fetch(url, {
            next: { revalidate: 300 } // 5 dakika cache
        });

        if (!response.ok) {
            throw new Error('Strapi API erişim hatası');
        }

        const json = await response.json();
        const items = json.data || [];

        // Strapi formatından düz formata çevir
        const results = items.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.id,
                brand: attrs.brand,
                model: attrs.model,
                year_start: attrs.year_start,
                year_end: attrs.year_end,
                title: attrs.title,
                component: attrs.component,
                description: attrs.description,
                risk_level: attrs.risk_level,
                estimated_cost_min: attrs.estimated_cost_min,
                estimated_cost_max: attrs.estimated_cost_max,
                sample_complaints: attrs.sample_complaints,
                affected_count: attrs.affected_count,
                severity_score: attrs.severity_score
            };
        });

        return NextResponse.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        console.error('Kronik Sorunlar API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Kronik sorunlar araması başarısız oldu', data: [] },
            { status: 500 }
        );
    }
}
