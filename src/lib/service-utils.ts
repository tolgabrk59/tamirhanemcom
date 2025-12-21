'use client';

// =====================
// DISTANCE CALCULATION
// =====================

/**
 * Haversine formülü ile iki koordinat arası mesafe hesaplama
 * @returns Mesafe (kilometre)
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Mesafeyi okunabilir formata çevir
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
}

// =====================
// WORKING HOURS
// =====================

interface DayHours {
    open: string;  // "09:00"
    close: string; // "18:00"
    closed?: boolean;
}

interface WorkingHours {
    monday?: DayHours;
    tuesday?: DayHours;
    wednesday?: DayHours;
    thursday?: DayHours;
    friday?: DayHours;
    saturday?: DayHours;
    sunday?: DayHours;
    [key: string]: DayHours | undefined;
}

const DAY_NAMES_TR: { [key: number]: string } = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
};

const DAY_NAMES_TR_SHORT: { [key: string]: string } = {
    'sunday': 'Paz',
    'monday': 'Pzt',
    'tuesday': 'Sal',
    'wednesday': 'Çar',
    'thursday': 'Per',
    'friday': 'Cum',
    'saturday': 'Cmt'
};

/**
 * Çalışma saatlerini parse et (JSON string veya object)
 */
export function parseWorkingHours(workingHours: any): WorkingHours | null {
    if (!workingHours) return null;
    
    let parsed: any = workingHours;
    
    if (typeof workingHours === 'string') {
        try {
            parsed = JSON.parse(workingHours);
        } catch {
            return null;
        }
    }
    
    // Geçerli gün anahtarlarını kontrol et (sadece id varsa, geçersiz)
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasValidDays = validDays.some(day => day in parsed && parsed[day]);
    
    if (!hasValidDays) {
        return null; // {id: 15} gibi geçersiz formatlar için null döndür
    }
    
    // Strapi'den gelen saat formatını (09:00:00.000) HH:MM formatına çevir
    const normalizedHours: WorkingHours = {};
    for (const day of validDays) {
        if (parsed[day]) {
            const dayData = parsed[day];
            normalizedHours[day] = {
                open: normalizeTimeFormat(dayData.open),
                close: normalizeTimeFormat(dayData.close),
                closed: dayData.closed ?? false
            };
        }
    }
    
    return normalizedHours;
}

/**
 * Saat formatını normalleştir (09:00:00.000 -> 09:00)
 */
function normalizeTimeFormat(time: string | null | undefined): string {
    if (!time) return '09:00';
    
    // Zaten HH:MM formatındaysa
    if (/^\d{2}:\d{2}$/.test(time)) {
        return time;
    }
    
    // HH:MM:SS veya HH:MM:SS.mmm formatındaysa
    const match = time.match(/^(\d{2}):(\d{2})/);
    if (match) {
        return `${match[1]}:${match[2]}`;
    }
    
    return '09:00';
}

/**
 * Servisin şu an açık olup olmadığını kontrol et
 */
export function isServiceOpen(workingHours: any): { isOpen: boolean; nextTime: string | null; closingTime: string | null } {
    const hours = parseWorkingHours(workingHours);
    
    // Veri yoksa veya sadece ID referansıysa (örn: {id: 15}) varsayılan olarak açık göster
    if (!hours || (hours && Object.keys(hours).length <= 1 && 'id' in hours)) {
        // Hafta içi 08:30-18:00 varsayımı
        const now = new Date();
        const currentHour = now.getHours();
        const dayOfWeek = now.getDay(); // 0 = Pazar, 6 = Cumartesi
        
        // Hafta sonu kapalı varsay
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { isOpen: false, nextTime: '08:30 Pzt', closingTime: null };
        }
        
        // Hafta içi 08:30-18:00 arası açık varsay
        if (currentHour >= 8 && currentHour < 18) {
            return { isOpen: true, nextTime: null, closingTime: '18:00' };
        } else if (currentHour < 8) {
            return { isOpen: false, nextTime: '08:30', closingTime: null };
        } else {
            return { isOpen: false, nextTime: '08:30', closingTime: null };
        }
    }
    
    const now = new Date();
    const currentDay = DAY_NAMES_TR[now.getDay()];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const todayHours = hours[currentDay];
    
    if (!todayHours || todayHours.closed) {
        // Bugün kapalı, sonraki açılış gününü bul
        const nextOpen = findNextOpenDay(hours, now.getDay());
        return { 
            isOpen: false, 
            nextTime: nextOpen,
            closingTime: null 
        };
    }
    
    const { open, close } = todayHours;
    
    if (currentTime >= open && currentTime < close) {
        return { isOpen: true, nextTime: null, closingTime: close };
    } else if (currentTime < open) {
        return { isOpen: false, nextTime: `${open}`, closingTime: null };
    } else {
        // Bugün kapandı, yarın açılış
        const nextOpen = findNextOpenDay(hours, now.getDay());
        return { isOpen: false, nextTime: nextOpen, closingTime: null };
    }
}

function findNextOpenDay(hours: WorkingHours, currentDayIndex: number): string {
    for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const dayName = DAY_NAMES_TR[nextDayIndex];
        const dayHours = hours[dayName];
        
        if (dayHours && !dayHours.closed && dayHours.open) {
            const dayShort = DAY_NAMES_TR_SHORT[dayName];
            return `${dayHours.open} ${dayShort}`;
        }
    }
    return '09:00 Pzt'; // Varsayılan açılış saati
}

// =====================
// FAVORITES
// =====================

const FAVORITES_KEY = 'tamirhanem_favorite_services';

/**
 * Favori servisleri localStorage'dan al
 */
export function getFavorites(): number[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const saved = localStorage.getItem(FAVORITES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

/**
 * Servisin favori olup olmadığını kontrol et
 */
export function isFavorite(serviceId: number): boolean {
    return getFavorites().includes(serviceId);
}

/**
 * Favori ekle/çıkar
 */
export function toggleFavorite(serviceId: number): boolean {
    const favorites = getFavorites();
    const index = favorites.indexOf(serviceId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(serviceId);
    }
    
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
        console.error('Favori kaydetme hatası');
    }
    
    return index === -1; // true = eklendi, false = çıkarıldı
}

/**
 * Tüm favorileri temizle
 */
export function clearFavorites(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_KEY);
}
