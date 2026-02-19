/**
 * TamirHanem Web - API Service Layer
 * Tüm API çağrıları buradan yapılır
 */

class APIService {
  constructor() {
    this.baseURL = CONFIG.API_BASE_URL;
  }

  /**
   * Get Authorization Header
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Generic Fetch Wrapper
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API isteği başarısız');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET Request Wrapper
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // ============================================
  // AUTH API
  // ============================================

  /**
   * Login
   */
  async login(identifier, password) {
    return this.request('/auth/local', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ identifier, password }),
    });
  }

  /**
   * Register
   */
  async register(userData) {
    return this.request('/auth/local/register', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(userData),
    });
  }

  /**
   * Get Current User
   */
  async getMe() {
    return this.request('/users/me?populate=*');
  }

  /**
   * Verify OTP
   */
  async verifyOTP(code) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // ============================================
  // SERVICES API
  // ============================================

  /**
   * Get All Services
   */
  async getServices(filters = {}) {
    const queryParams = new URLSearchParams();

    // Service type filter (legacy support)
    if (filters.serviceType && filters.serviceType !== 'all') {
      queryParams.append('filters[service_type][$eq]', filters.serviceType);
    }

    // Search query (legacy support)
    if (filters.search) {
      queryParams.append('filters[name][$containsi]', filters.search);
    }

    // Pagination (with proper defaults)
    queryParams.append('pagination[page]', filters.page || filters['pagination[page]'] || 1);
    queryParams.append('pagination[pageSize]', filters.pageSize || filters['pagination[pageSize]'] || filters['_limit'] || CONFIG.ITEMS_PER_PAGE);

    // Populate (default or custom)
    queryParams.append('populate', filters.populate || '*');

    // Allow any other filter parameters to pass through
    Object.keys(filters).forEach(key => {
      // Skip already handled params
      if (['serviceType', 'search', 'page', 'pageSize', 'populate', 'pagination[page]', 'pagination[pageSize]', '_limit'].includes(key)) {
        return;
      }

      queryParams.append(key, filters[key]);
    });

    const queryString = queryParams.toString();
    return this.request(`/services${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Get Service by ID
   */
  async getServiceById(id) {
    return this.request(`/services/${id}?populate[ProfilePicture]=*&populate[gallery]=*&populate[Gallery]=*&populate[images]=*&populate[categories][populate]=icon&populate[unique-brands]=*&populate[unique_brands]=*&populate[supported_vehicles]=*&populate[reviews][populate]=user`);
  }

  /**
   * Get Services by Location
   */
  async getServicesByLocation(lat, lng, radius = 10) {
    // Bu endpoint'i backend'de oluşturmanız gerekebilir
    return this.request(`/services/nearby?lat=${lat}&lng=${lng}&radius=${radius}&populate=*`);
  }

  // ============================================
  // CATEGORIES API
  // ============================================

  /**
   * Get Categories
   */
  async getCategories(serviceType = null) {
    let endpoint = '/categories?populate=*';

    if (serviceType && serviceType !== 'all') {
      endpoint += `&filters[category_type][$eq]=${serviceType}`;
    }

    return this.request(endpoint);
  }

  // ============================================
  // CAMPAIGNS API
  // ============================================

  /**
   * Get Campaigns
   */
  async getCampaigns(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.serviceType && filters.serviceType !== 'all') {
      queryParams.append('filters[service_type_filter][$eq]', filters.serviceType);
    }

    queryParams.append('populate', '*');
    queryParams.append('sort', 'display_order:asc');

    const queryString = queryParams.toString();
    return this.request(`/campaigns${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Get Campaign by ID
   */
  async getCampaignById(id) {
    return this.request(`/campaigns/${id}?populate=*`);
  }

  // ============================================
  // APPOINTMENTS API
  // ============================================

  /**
   * Get User Appointments
   */
  async getAppointments(filters = {}) {
    // Use exact populate parameters from React Native app for proper data fetching
    let endpoint = '/appointments?populate[user][populate]=avatar&populate[service][populate]=ProfilePicture&populate[vehicle][populate]=*&populate[category][populate]=*&populate[attachments][populate]=*&sort=createdAt:desc';

    // Servis sahibi ise seçili servisin randevularını getir
    const selectedServiceId = localStorage.getItem('selectedServiceId');
    if (selectedServiceId) {
      endpoint += `&serviceId=${selectedServiceId}`;
    }

    // Add status filter if provided
    if (filters.status) {
      endpoint += `&filters[status][$eq]=${filters.status}`;
    }

    return this.request(endpoint);
  }

  /**
   * Create Appointment
   */
  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify({ data: appointmentData }),
    });
  }

  /**
   * Update Appointment
   */
  async updateAppointment(id, appointmentData) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: appointmentData }),
    });
  }

  /**
   * Cancel Appointment
   */
  async cancelAppointment(id, data = {}) {
    return this.updateAppointment(id, {
      status: 'CANCELLED',
      cancellationReason: data.reason,
      ...data
    });
  }

  // ============================================
  // VEHICLES API
  // ============================================

  /**
   * Get User Vehicles
   */
  async getVehicles() {
    return this.request('/vehicles?populate=*');
  }

  /**
   * Add Vehicle
   */
  async addVehicle(vehicleData) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify({ data: vehicleData }),
    });
  }

  // ============================================
  // WALLET API
  // ============================================

  /**
   * Get Wallet (User's wallet)
   */
  async getWallet() {
    return this.request('/wallets/me');
  }

  /**
   * Get Transactions
   */
  async getTransactions(page = 1, pageSize = 20) {
    return this.request(`/transactions?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&populate=user,appointment`);
  }

  // ============================================
  // NOTIFICATIONS API
  // ============================================

  /**
   * Get Notifications
   */
  async getNotifications() {
    return this.request('/notifications?populate=*&sort=createdAt:desc');
  }

  /**
   * Mark Notification as Read
   */
  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { read: true } }),
    });
  }

  // ============================================
  // RATINGS API
  // ============================================

  /**
   * Submit Rating
   */
  async submitRating(ratingData) {
    return this.request('/ratings', {
      method: 'POST',
      body: JSON.stringify({ data: ratingData }),
    });
  }

  /**
   * Get Service Ratings
   */
  async getServiceRatings(serviceId) {
    return this.request(`/ratings?filters[service][id][$eq]=${serviceId}&populate=*`);
  }

  /**
   * Create Review (alias for submitRating)
   */
  async createReview(reviewData) {
    return this.submitRating(reviewData);
  }
}

// Create singleton instance
const api = new APIService();
