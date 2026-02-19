/**
 * TamirHanem Web - Authentication Manager
 * JWT token ve kullanıcı yönetimi
 */

class AuthManager {
  constructor() {
    this.token = this.getToken();
    this.user = this.getUser();
  }

  /**
   * Get Token from LocalStorage
   */
  getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Get User from LocalStorage
   */
  getUser() {
    const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  /**
   * Login
   */
  async login(identifier, password) {
    try {
      const response = await api.login(identifier, password);

      if (response.jwt && response.user) {
        this.setAuth(response.jwt, response.user);
        return { success: true, user: response.user };
      }

      throw new Error('Geçersiz yanıt');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Giriş başarısız'
      };
    }
  }

  /**
   * Register
   */
  async register(userData) {
    try {
      const response = await api.register(userData);

      if (response.jwt && response.user) {
        this.setAuth(response.jwt, response.user);
        return { success: true, user: response.user };
      }

      throw new Error('Geçersiz yanıt');
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Kayıt başarısız'
      };
    }
  }

  /**
   * Set Authentication
   */
  setAuth(token, user) {
    this.token = token;
    this.user = user;

    localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('auth-changed', {
      detail: { user, token }
    }));
  }

  /**
   * Logout
   */
  logout() {
    this.token = null;
    this.user = null;

    localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SERVICE_TYPE);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SELECTED_VEHICLE);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('auth-changed', {
      detail: { user: null, token: null }
    }));

    // Redirect to landing page
    window.location.href = CONFIG.ROUTES.LANDING;
  }

  /**
   * Verify OTP
   */
  async verifyOTP(code) {
    try {
      const response = await api.verifyOTP(code);
      return { success: true, data: response };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message || 'Doğrulama başarısız'
      };
    }
  }

  /**
   * Refresh User Data
   */
  async refreshUser() {
    if (!this.isAuthenticated()) {
      return;
    }

    try {
      // Populate service and avatar relations
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/users/me?populate[0]=service&populate[1]=avatar`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const userData = await response.json();

      // Extract serviceId from the populated service relationship
      if (userData.service) {
        userData.serviceId = userData.service.id;
      }

      this.user = userData;
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Refresh user error:', error);
      // Token invalid, logout
      if (error.message.includes('Unauthorized')) {
        this.logout();
      }
    }
  }

  /**
   * Get User Type
   */
  getUserType() {
    return this.user?.userType || 'guest';
  }

  /**
   * Check if user is customer
   */
  isCustomer() {
    return this.getUserType() === 'customer';
  }

  /**
   * Check if user is technician
   */
  isTechnician() {
    return this.getUserType() === 'technician';
  }

  /**
   * Check if user is guest
   */
  isGuest() {
    return this.getUserType() === 'guest';
  }

  /**
   * Require Authentication (Redirect if not authenticated)
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = CONFIG.ROUTES.LOGIN;
      return false;
    }
    return true;
  }

  /**
   * Redirect if Authenticated
   */
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = CONFIG.ROUTES.DASHBOARD;
      return true;
    }
    return false;
  }
}

// Create singleton instance
const auth = new AuthManager();

// Auto-refresh user on page load
document.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated()) {
    auth.refreshUser();
  }
});
