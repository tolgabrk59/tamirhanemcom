/**
 * TamirHanem Web - Utility Functions
 * Yardımcı fonksiyonlar
 */

const Utils = {
  /**
   * Format Date
   */
  formatDate(dateString, format = 'DD.MM.YYYY') {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('HH', hours)
      .replace('mm', minutes);
  },

  /**
   * Format Time
   */
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get full Strapi image URL
   * @param {string} url - Relative image URL from Strapi
   * @returns {string} Full URL
   */
  getStrapiImageUrl(url) {
    if (!url) return '/assets/img/placeholder.png'; // Fallback image
    if (url.startsWith('http')) return url;

    try {
      // Use URL object to safely get origin (protocol + host)
      // This handles https://api.tamirhanem.net/api -> https://api.tamirhanem.net
      const urlObj = new URL(CONFIG.API_BASE_URL);
      return `${urlObj.origin}${url}`;
    } catch (e) {
      console.error('Error parsing API URL:', e);
      // Fallback to simple concatenation if URL parsing fails
      return `https://api.tamirhanem.net${url}`;
    }
  },

  /**
   * Format Currency
   */
  formatCurrency(amount, currency = 'TRY') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  /**
   * Format Phone Number
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as (5XX) XXX XX XX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
  },

  /**
   * Calculate Distance (Haversine)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  /**
   * Truncate Text
   */
  truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Get Image URL - Handles Strapi v4 format
   */
  getImageUrl(image) {
    if (!image) return '/assets/images/placeholder.jpg';

    // Handle Strapi v4 format: { data: { attributes: { url: '...' } } }
    if (image.data) {
      // If data is an array, get first item
      if (Array.isArray(image.data) && image.data.length > 0) {
        return this.getImageUrl(image.data[0]);
      }
      // If data is an object, recurse
      if (image.data.attributes) {
        return this.getImageUrl(image.data.attributes);
      }
    }

    // Direct URL in attributes
    if (image.attributes && image.attributes.url) {
      const url = image.attributes.url;
      if (url.startsWith('http')) {
        return url;
      }
      return `https://api.tamirhanem.net${url}`;
    }

    // Direct URL property
    if (image.url) {
      if (image.url.startsWith('http')) {
        return image.url;
      }
      return `https://api.tamirhanem.net${image.url}`;
    }

    // If it's a string (direct URL)
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        return image;
      }
      if (image.startsWith('/')) {
        return `https://api.tamirhanem.net${image}`;
      }
      return image;
    }

    // If it's an array, get first image
    if (Array.isArray(image) && image.length > 0) {
      return this.getImageUrl(image[0]);
    }

    return '/assets/images/placeholder.jpg';
  },

  /**
   * Get Service Type Info
   */
  getServiceTypeInfo(type) {
    return CONFIG.SERVICE_TYPES[type.toUpperCase()] || CONFIG.SERVICE_TYPES.ALL;
  },

  /**
   * Debounce Function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Show Toast Notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to DOM
    const container = document.getElementById('toast-container') || this.createToastContainer();
    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  },

  /**
   * Show Loading
   */
  showLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
      loading.classList.add('show');
    }
  },

  /**
   * Hide Loading
   */
  hideLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
      loading.classList.remove('show');
    }
  },

  /**
   * Validate Email
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  /**
   * Validate Phone
   */
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('5');
  },

  /**
   * Validate Turkish Plate
   */
  validatePlate(plate) {
    // Turkish plate format: 34 ABC 1234 or 34 AB 12345
    const re = /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,5}$/;
    return re.test(plate.toUpperCase());
  },

  /**
   * Get Query Params
   */
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  },

  /**
   * Set Query Params
   */
  setQueryParams(params) {
    const searchParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        searchParams.set(key, params[key]);
      } else {
        searchParams.delete(key);
      }
    });
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  },

  /**
   * Get Rating Stars HTML
   */
  getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';
    for (let i = 0; i < fullStars; i++) {
      html += '<span class="star star-full">★</span>';
    }
    if (hasHalfStar) {
      html += '<span class="star star-half">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      html += '<span class="star star-empty">☆</span>';
    }
    return html;
  },

  /**
   * Escape HTML to prevent XSS attacks
   */
  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Copy to Clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Panoya kopyalandı', 'success');
    } catch (error) {
      console.error('Copy failed:', error);
      this.showToast('Kopyalama başarısız', 'error');
    }
  },

  /**
   * Scroll to Element
   */
  scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  },

  /**
   * Local Storage Helper
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('LocalStorage set error:', error);
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        try {
          return JSON.parse(item);
        } catch (e) {
          return item; // Return raw string if not valid JSON
        }
      } catch (error) {
        console.error('LocalStorage get error:', error);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('LocalStorage remove error:', error);
      }
    }
  },

  /**
   * Format Relative Time (e.g., "2 hours ago", "3 days ago")
   */
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Az önce';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} hafta önce`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ay önce`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} yıl önce`;
  }
};
