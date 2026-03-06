import { NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_STATS');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
};

export async function GET() {
    try {
        // Strapi'den verileri paralel çek
        const [servicesRes, usersCountRes, waitlistRes] = await Promise.all([
            fetch(`${STRAPI_API}/services?pagination[pageSize]=1&pagination[withCount]=true`, {
                headers,
                next: { revalidate: 300 }
            }),
            fetch(`${STRAPI_API}/users/count`, {
                headers,
                next: { revalidate: 300 }
            }),
            fetch(`${STRAPI_API}/waitinglists?pagination[pageSize]=1&pagination[withCount]=true`, {
                headers,
                next: { revalidate: 300 }
            })
        ]);

        let serviceCount = 500;
        let cityCount = 81; // Türkiye'deki il sayısı sabit
        let customerCount = 50000;

        if (servicesRes.ok) {
            const servicesJson = await servicesRes.json();
            serviceCount = servicesJson.meta?.pagination?.total || serviceCount;
        }

        // users/count endpoint'inden kullanıcı sayısını al
        if (usersCountRes.ok) {
            const usersCount = await usersCountRes.json();
            // Strapi users/count doğrudan sayı döner
            if (typeof usersCount === 'number') {
                customerCount = usersCount;
            } else if (usersCount?.count) {
                customerCount = usersCount.count;
            }
        }

        // Waitlist'i de kontrol et
        if (waitlistRes.ok) {
            const waitlistJson = await waitlistRes.json();
            const waitlistCount = waitlistJson.meta?.pagination?.total;
            if (waitlistCount && waitlistCount > customerCount) {
                customerCount = waitlistCount;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                serviceCount,
                cityCount,
                customerCount,
                avgRating: '4.8',
                savingsPercent: 30
            }
        });
    } catch (error) {
        logger.error({ error }, 'Stats API Error');
        // Fallback değerler
        return NextResponse.json({
            success: true,
            data: {
                serviceCount: 500,
                cityCount: 81,
                customerCount: 50000,
                avgRating: '4.8',
                savingsPercent: 30
            }
        });
    }
}
