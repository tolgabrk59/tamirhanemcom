/**
 * TamirHanem Web - Simple State Management
 * Basit reactive state store
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  /**
   * Get State
   */
  getState() {
    return this.state;
  }

  /**
   * Set State
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// ============================================
// Service Type Store
// ============================================
const serviceTypeStore = new Store({
  selectedType: Utils.storage.get(CONFIG.STORAGE_KEYS.SERVICE_TYPE, 'all'),
  isFirstTimeSelection: !Utils.storage.get(CONFIG.STORAGE_KEYS.SERVICE_TYPE),
});

// Actions
const serviceTypeActions = {
  setServiceType(type) {
    Utils.storage.set(CONFIG.STORAGE_KEYS.SERVICE_TYPE, type);
    serviceTypeStore.setState({
      selectedType: type,
      isFirstTimeSelection: false,
    });
  },

  getServiceType() {
    return serviceTypeStore.getState().selectedType;
  },

  resetSelection() {
    Utils.storage.remove(CONFIG.STORAGE_KEYS.SERVICE_TYPE);
    serviceTypeStore.setState({
      selectedType: 'all',
      isFirstTimeSelection: true,
    });
  }
};

// ============================================
// UI Store
// ============================================
const uiStore = new Store({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  currentTab: 'home',
  isLoading: false,
  notifications: [],
  unreadCount: 0,
});

// Actions
const uiActions = {
  toggleSidebar() {
    const state = uiStore.getState();
    uiStore.setState({ isSidebarOpen: !state.isSidebarOpen });
  },

  openSidebar() {
    uiStore.setState({ isSidebarOpen: true });
  },

  closeSidebar() {
    uiStore.setState({ isSidebarOpen: false });
  },

  openModal(content) {
    uiStore.setState({
      isModalOpen: true,
      modalContent: content,
    });
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    uiStore.setState({
      isModalOpen: false,
      modalContent: null,
    });
    document.body.style.overflow = '';
  },

  setCurrentTab(tab) {
    uiStore.setState({ currentTab: tab });
  },

  setLoading(isLoading) {
    uiStore.setState({ isLoading });
    if (isLoading) {
      Utils.showLoading();
    } else {
      Utils.hideLoading();
    }
  },

  setNotifications(notifications) {
    const unreadCount = notifications.filter(n => !n.read).length;
    uiStore.setState({ notifications, unreadCount });
  },

  addNotification(notification) {
    const state = uiStore.getState();
    const notifications = [notification, ...state.notifications];
    const unreadCount = notifications.filter(n => !n.read).length;
    uiStore.setState({ notifications, unreadCount });
  }
};

// ============================================
// Services Store
// ============================================
const servicesStore = new Store({
  services: [],
  categories: [],
  selectedService: null,
  filters: {
    serviceType: 'all',
    search: '',
    category: null,
    location: null,
    page: 1,
  },
  isLoading: false,
});

// Actions
const servicesActions = {
  async loadServices(filters = {}) {
    servicesStore.setState({ isLoading: true });

    try {
      const response = await api.getServices({
        ...servicesStore.getState().filters,
        ...filters,
      });

      servicesStore.setState({
        services: response.data || [],
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error('Load services error:', error);
      servicesStore.setState({ isLoading: false });
      Utils.showToast('Servisler yüklenemedi', 'error');
      return [];
    }
  },

  async loadCategories(serviceType = null) {
    try {
      const response = await api.getCategories(serviceType);
      servicesStore.setState({
        categories: response.data || [],
      });
      return response.data;
    } catch (error) {
      console.error('Load categories error:', error);
      Utils.showToast('Kategoriler yüklenemedi', 'error');
      return [];
    }
  },

  setFilters(filters) {
    const state = servicesStore.getState();
    servicesStore.setState({
      filters: { ...state.filters, ...filters },
    });
    this.loadServices();
  },

  setSelectedService(service) {
    servicesStore.setState({ selectedService: service });
  }
};

// ============================================
// Appointments Store
// ============================================
const appointmentsStore = new Store({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
});

// Actions
const appointmentsActions = {
  async loadAppointments(filters = {}) {
    if (!auth.isAuthenticated()) return;

    appointmentsStore.setState({ isLoading: true });

    try {
      const response = await api.getAppointments(filters);
      appointmentsStore.setState({
        appointments: response.data || [],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error('Load appointments error:', error);
      appointmentsStore.setState({ isLoading: false });
      Utils.showToast('Randevular yüklenemedi', 'error');
      return [];
    }
  },

  async createAppointment(appointmentData) {
    try {
      const response = await api.createAppointment(appointmentData);
      Utils.showToast('Randevu oluşturuldu', 'success');
      this.loadAppointments(); // Reload
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create appointment error:', error);
      Utils.showToast('Randevu oluşturulamadı', 'error');
      return { success: false, error: error.message };
    }
  },

  async cancelAppointment(id) {
    try {
      await api.cancelAppointment(id);
      Utils.showToast('Randevu iptal edildi', 'success');
      this.loadAppointments(); // Reload
      return { success: true };
    } catch (error) {
      console.error('Cancel appointment error:', error);
      Utils.showToast('Randevu iptal edilemedi', 'error');
      return { success: false, error: error.message };
    }
  },

  setSelectedAppointment(appointment) {
    appointmentsStore.setState({ selectedAppointment: appointment });
  }
};

// ============================================
// Campaigns Store
// ============================================
const campaignsStore = new Store({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
});

// Actions
const campaignsActions = {
  async loadCampaigns(filters = {}) {
    campaignsStore.setState({ isLoading: true });

    try {
      const response = await api.getCampaigns(filters);
      campaignsStore.setState({
        campaigns: response.data || [],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error('Load campaigns error:', error);
      campaignsStore.setState({ isLoading: false });
      Utils.showToast('Kampanyalar yüklenemedi', 'error');
      return [];
    }
  },

  setSelectedCampaign(campaign) {
    campaignsStore.setState({ selectedCampaign: campaign });
  }
};
