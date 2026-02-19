/**
 * TamirHanem Web - Configuration
 * Tüm uygulama ayarları ve sabitleri
 */

const CONFIG = {
  // API Configuration
  API_BASE_URL: 'https://api.tamirhanem.com/api',

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'tamirhanem_token',
    USER_DATA: 'tamirhanem_user',
    SERVICE_TYPE: 'tamirhanem_service_type',
    SELECTED_VEHICLE: 'tamirhanem_selected_vehicle',
  },

  // Servis Tipleri
  SERVICE_TYPES: {
    ALL: {
      id: 'all',
      name: 'Tümü',
      color: '#8B5CF6',
      icon: '⭐',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    },
    INDUSTRIAL: {
      id: 'industrial',
      name: 'Oto Tamir',
      color: '#3B82F6',
      icon: '🔧',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
    },
    CAR_WASH: {
      id: 'car_wash',
      name: 'Oto Yıkama',
      color: '#10B981',
      icon: '🚿',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    ROADSIDE: {
      id: 'roadside',
      name: 'Çekici Hizmeti',
      color: '#EF4444',
      icon: '🚛',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    },
    CAR_RENTAL: {
      id: 'car_rental',
      name: 'Araç Kiralama',
      color: '#F59E0B',
      icon: '🚗',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    }
  },

  // Tema Renkleri
  COLORS: {
    primary: '#ffc507',
    primaryLight: '#ffd740',
    primaryDark: '#ff8f00',
    primaryAccent: '#ffab00',
    primarySoft: '#fff9c4',

    background: '#F7F8FA',
    backgroundSecondary: '#F8F8F8',

    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textTertiary: '#6B7280',
    textMuted: '#9CA3AF',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Animasyon Ayarları
  ANIMATIONS: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Pagination
  ITEMS_PER_PAGE: 12,

  // Harita Ayarları
  DEFAULT_LOCATION: {
    lat: 41.0082,
    lng: 28.9784, // İstanbul
  },

  // Routes
  ROUTES: {
    HOME: '/',
    LANDING: '/index.html',
    DASHBOARD: '/dashboard.html',
    LOGIN: '/login.html',
    REGISTER: '/register.html',
    SERVICES: '/pages/services.html',
    SERVICE_DETAIL: '/pages/service-detail.html',
    APPOINTMENTS: '/pages/appointments.html',
    CAMPAIGNS: '/pages/campaigns.html',
    PROFILE: '/pages/profile.html',
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
