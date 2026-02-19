// Global Header + Loyalty Bar Component
// Dashboard'dan birebir kopyalandı - DEĞİŞTİRME!

function injectGlobalHeader() {
  const headerHTML = `
  <nav class="dashboard-navbar">
    <div class="container dashboard-navbar-container"><a href="/dashboard.html" class="dashboard-logo"><img
          src="/images/logo.png" alt="TamirHanem" style="height: 200px; width: auto; object-fit: contain;"></a>
      <div class="dashboard-search">
        <div class="search-input-wrapper">
          <input type="text" class="search-input" placeholder="Servis, kategori veya kampanya ara..." id="search-input" autocomplete="off">
          <i class="ri-search-line search-icon"></i>
        </div>
        <div class="search-dropdown" id="search-dropdown" style="display: none;">
          <div class="search-dropdown-body" id="search-dropdown-body">
            <div class="search-empty"><i class="ri-search-line"></i> Aramak için yazın...</div>
          </div>
        </div>
      </div>
      <div class="dashboard-actions">
        <div style="position: relative;"><button class="action-btn" id="notifications-btn"><i
              class="ri-notification-3-line"></i><span class="notification-badge" id="notifications-badge"
              style="display:none;">0</span></button>
          <div class="notification-dropdown" id="notification-dropdown">
            <div class="notification-dropdown-header"><span class="notification-dropdown-title">Bildirimler</span><a
                href="/pages/notifications.html"
                style="font-size: 0.85rem; color: var(--primary-dark); font-weight: 600;">Tümü</a></div>
            <div class="notification-dropdown-body" id="notification-dropdown-body">
              <div class="notification-empty"><i class="ri-notification-off-line"
                  style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>Yükleniyor...
              </div>
            </div>
          </div>
        </div>
        <div style="position: relative;"><button class="action-btn" id="favourites-btn"><i
              class="ri-heart-3-line"></i></button>
          <div class="favourite-dropdown" id="favourite-dropdown">
            <div class="favourite-dropdown-header"><span class="favourite-dropdown-title">Favorilerim</span></div>
            <div class="favourite-dropdown-body" id="favourite-dropdown-body">
              <div class="favourite-empty"><i class="ri-heart-line"
                  style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>Yükleniyor...
              </div>
            </div>
          </div>
        </div>
        <!-- Wallet Balance Display -->
        <div id="navbar-wallet" class="navbar-wallet" onclick="window.location.href='/pages/wallet.html'"><i
            class="ri-wallet-3-fill"></i><span id="navbar-wallet-balance"
            class="wallet-balance-text">Yükleniyor...</span><button class="wallet-add-btn"
            onclick="event.stopPropagation(); window.location.href='/pages/wallet-topup.html'"><i
              class="ri-add-fill"></i></button></div>
        <div class="user-profile-mini" id="user-menu-toggle" onclick="window.location.href='/dashboard.html#profile'">
          <div class="user-avatar" id="user-avatar">K</div>
          <div class="user-info"><span class="user-name" id="user-name">Kullanıcı</span><span class="user-role"
              id="user-role">Müşteri</span></div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Loyalty Bar Container (sticky below navbar, aligned with dashboard) -->
  <div class="loyalty-bar-wrapper">
    <div class="container">
      <div class="loyalty-bar-layout">
        <!-- Sidebar Spacer (matches dashboard sidebar width) -->
        <div class="loyalty-sidebar-spacer"></div>

        <!-- Loyalty Bar (aligned with main content) -->
        <div class="loyalty-sticky-widget" id="loyalty-widget" style="display: flex;">
          <div class="loyalty-container">
            <div class="loyalty-progress-track">
              <div class="progress-segments">
                <div class="segment" data-index="0">
                  <div class="segment-fill"></div>
                </div>
                <div class="segment" data-index="1">
                  <div class="segment-fill"></div>
                </div>
                <div class="segment" data-index="2">
                  <div class="segment-fill"></div>
                </div>
                <div class="segment" data-index="3">
                  <div class="segment-fill"></div>
                </div>
                <div class="segment" data-index="4">
                  <div class="segment-fill"></div>
                </div>
              </div>
              <div class="milestone-markers">
                <div class="milestone start-point" data-step="0"></div>
                <div class="milestone" data-step="1"><i class="ri-tools-fill"></i><span class="milestone-label">1.
                    Randevu</span></div>
                <div class="milestone" data-step="2"><i class="ri-tools-fill"></i><span class="milestone-label">2.
                    Randevu</span></div>
                <div class="milestone" data-step="3"><i class="ri-tools-fill"></i><span class="milestone-label">3.
                    Randevu</span></div>
                <div class="milestone" data-step="4"><i class="ri-tools-fill"></i><span class="milestone-label">4.
                    Randevu</span></div>
                <div class="progress-car" id="loyalty-car" style="left: 0%;">
                  <div class="car-wrapper"><img src="/images/goalcar.png" alt="Car"></div>
                </div>
              </div>
              <button id="loyalty-reward-btn" class="milestone final-step" disabled>
                <img src="/images/goalwash.png" alt="Goal"><span class="reward-text">Ücretsiz Yıkama</span>
                <div class="pulse-ring"></div>
              </button>
            </div>
            <div class="info-btn-wrapper">
              <div class="info-btn" id="loyalty-info-btn"><i class="ri-information-line"></i></div>
              <div class="info-tooltip" id="loyalty-info-tooltip">
                <div class="info-tooltip-header">
                  <div class="info-tooltip-title"><i class="ri-shield-check-line"></i>Hizmet Şartları</div>
                </div>
                <div class="info-tooltip-body">
                  <p><strong>Program Kapsamı:</strong> TamirHanem üzerinden alınan belirli hizmetler için geçerlidir.
                  </p>
                  <p><strong>Puan Kazanımı:</strong> Her tamamlanan randevu 1 sadakat puanı kazandırır.</p>
                  <p><strong>Ödül:</strong> 5 puan toplandığında "Ücretsiz İç-Dış Yıkama" kazanılır.</p>
                  <p style="margin-bottom: 0; font-size: 0.8rem; color: #64748b; margin-top: 8px;">Detaylar için
                    tıklayın...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Terms of Service Modal (Dashboard'dan kopyalandı) -->
  <div id="terms-modal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Sadakat Programı Şartları</h3>
        <button class="close-modal-btn"><i class="ri-close-line"></i></button>
      </div>
      <div class="modal-body">
        <p><strong>1. Program Kapsamı:</strong> Bu sadakat programı, TamirHanem üzerinden alınan belirli hizmetler için geçerlidir.</p>
        <p><strong>2. Puan Kazanımı:</strong> Her tamamlanan randevu (minimum 500 TL tutarında) 1 sadakat puanı kazandırır.</p>
        <p><strong>3. Ödül:</strong> 5 puan toplandığında "Ücretsiz İç-Dış Yıkama" hakkı kazanılır.</p>
        <p><strong>4. Geçerlilik:</strong> Kazanılan ödül 30 gün içinde kullanılmalıdır.</p>
        <p><strong>5. İptal:</strong> TamirHanem program koşullarını değiştirme hakkını saklı tutar.</p>
      </div>
    </div>
  </div>
  `;

  // Insert at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Initialize header functionality
  initHeaderFunctionality();

  // Initialize Loyalty System
  GlobalLoyaltySystem.init();
}

// Flag to prevent immediate close after button click
let headerDropdownJustOpened = false;

function initHeaderFunctionality() {
  // Notifications dropdown
  const notifBtn = document.getElementById('notifications-btn');
  const notifDropdown = document.getElementById('notification-dropdown');

  if (notifBtn) {
    notifBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      headerDropdownJustOpened = true;
      setTimeout(() => { headerDropdownJustOpened = false; }, 100);

      if (notifDropdown) {
        notifDropdown.classList.toggle('show');
      }
      document.getElementById('favourite-dropdown')?.classList.remove('show');
      document.getElementById('search-dropdown')?.style.setProperty('display', 'none');
      loadNotificationsDropdown();

      return false;
    }, true); // Use capture phase
  }

  // Favourites dropdown
  const favBtn = document.getElementById('favourites-btn');
  const favDropdown = document.getElementById('favourite-dropdown');

  if (favBtn) {
    favBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      headerDropdownJustOpened = true;
      setTimeout(() => { headerDropdownJustOpened = false; }, 100);

      if (favDropdown) {
        favDropdown.classList.toggle('show');
      }
      notifDropdown?.classList.remove('show');
      document.getElementById('search-dropdown')?.style.setProperty('display', 'none');
      loadFavouritesDropdown();

      return false;
    }, true); // Use capture phase
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    // Skip if dropdown was just opened
    if (headerDropdownJustOpened) {
      return;
    }

    const clickedNotifBtn = e.target.closest('#notifications-btn');
    const clickedFavBtn = e.target.closest('#favourites-btn');

    if (!notifDropdown?.contains(e.target) && !clickedNotifBtn) {
      notifDropdown?.classList.remove('show');
    }
    if (!favDropdown?.contains(e.target) && !clickedFavBtn) {
      favDropdown?.classList.remove('show');
    }
  });

  // Load user data and wallet
  loadHeaderUserData();
  loadHeaderWalletBalance();

  // Initial load of notifications (for badge count)
  loadNotificationsDropdown();

  // Initialize search functionality
  initHeaderSearch();
}

// ============================================================================
// NOTIFICATIONS LOADING (Dashboard'dan kopyalandı)
// ============================================================================
async function loadNotificationsDropdown() {
  const body = document.getElementById('notification-dropdown-body');
  const badge = document.getElementById('notifications-badge');

  try {
    const token = localStorage.getItem('tamirhanem_token');
    if (!token) return;

    const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
    const response = await fetch(`${apiBase}/notifications?sort=createdAt:desc&pagination[limit]=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load notifications');

    const result = await response.json();
    const notifications = result.data || [];

    // Count unread notifications
    const unreadCount = notifications.filter(n => {
      const attrs = n.attributes || n;
      return !attrs.read;
    }).length;

    // Update badge
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    // Update dropdown body
    if (notifications.length === 0) {
      body.innerHTML = `<div class="notification-empty"><i class="ri-notification-off-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>Bildiriminiz yok</div>`;
    } else {
      body.innerHTML = notifications.slice(0, 5).map(notif => {
        const attrs = notif.attributes || notif;
        const isUnread = !attrs.read;
        let timeStr = 'Bilinmiyor';

        try {
          if (attrs.createdAt) {
            timeStr = formatRelativeTime(attrs.createdAt);
          }
        } catch (e) {}

        return `<div class="notification-item ${isUnread ? 'unread' : ''}" onclick="window.location.href='/pages/notifications.html'">
          <div class="notification-item-title">${attrs.title || 'Bildirim'}</div>
          <div class="notification-item-message">${attrs.message || ''}</div>
          <div class="notification-item-time">${timeStr}</div>
        </div>`;
      }).join('');
    }
  } catch (error) {
    body.innerHTML = `<div class="notification-empty"><i class="ri-notification-off-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>Bildiriminiz yok</div>`;
    if (badge) badge.style.display = 'none';
  }
}

// ============================================================================
// FAVOURITES LOADING (Dashboard'dan kopyalandı)
// ============================================================================
async function loadFavouritesDropdown() {
  const body = document.getElementById('favourite-dropdown-body');

  // Load from localStorage
  const favourites = JSON.parse(localStorage.getItem('favouriteServices') || '[]');

  if (favourites.length === 0) {
    body.innerHTML = `
      <div class="favourite-empty">
        <div class="favourite-empty-icon">
          <i class="ri-heart-3-line"></i>
        </div>
        <div class="favourite-empty-title">Henüz favoriniz yok</div>
        <div class="favourite-empty-text">Beğendiğiniz servisleri favorilere ekleyerek kolayca ulaşabilirsiniz</div>
        <a href="/pages/oto-sanayi.html" class="favourite-empty-btn">
          <i class="ri-search-line"></i>
          Servis Keşfet
        </a>
      </div>`;
  } else {
    body.innerHTML = favourites.slice(0, 5).map(fav => `
      <div class="favourite-item" onclick="window.location.href='/pages/service-detail.html?id=${fav.id}'">
        <img src="${fav.image || 'https://via.placeholder.com/40'}" class="favourite-item-img" alt="${fav.name}" onerror="this.src='https://via.placeholder.com/40'">
        <div class="favourite-item-info">
          <div class="favourite-item-name">${fav.name}</div>
          <div class="favourite-item-location"><i class="ri-map-pin-line"></i> ${fav.location || 'İstanbul'}</div>
        </div>
      </div>
    `).join('');
  }
}

// ============================================================================
// LOYALTY SYSTEM (Dashboard'dan birebir kopyalandı)
// ============================================================================
const GlobalLoyaltySystem = {
  widget: null,
  currentStatus: null,

  async init() {
    this.widget = document.getElementById('loyalty-widget');
    if (!this.widget) {
      return;
    }

    await this.loadStatus();
    this.setupButton();
    this.setupScrollEffect();
    this.setupModal();
  },

  setupScrollEffect() {
    const maxScroll = 100; // Maximum scroll distance for full effect (in pixels)

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Calculate progress from 0 to 1 based on scroll amount
      const progress = Math.min(scrollY / maxScroll, 1);
      // Update CSS custom property for smooth, progressive scaling
      this.widget.style.setProperty('--scroll-progress', progress);
    });
  },

  setupModal() {
    setTimeout(() => {
      const infoBtn = document.getElementById('loyalty-info-btn');
      const modal = document.getElementById('terms-modal');

      if (!infoBtn || !modal) return;

      const closeBtn = modal.querySelector('.close-modal-btn');

      // Click to open modal
      infoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add('active');
      });

      // Close modal
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          modal.classList.remove('active');
        });
      }

      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }, 200);
  },

  async loadStatus() {
    try {
      // Default status
      this.currentStatus = {
        currentAppointments: 0,
        goalTarget: 5,
        goalMet: false,
        rewardAvailable: false,
        rewardClaimed: false,
        progress: 0
      };

      const token = localStorage.getItem('tamirhanem_token');
      if (!token) return;

      const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';

      // Correct endpoint: /api/users/me/loyalty-status
      const loyaltyResponse = await fetch(`${apiBase}/users/me/loyalty-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (loyaltyResponse.ok) {
        const loyaltyData = await loyaltyResponse.json();
        const loyalty = loyaltyData.data?.attributes || loyaltyData.data || loyaltyData || {};

        // Map loyalty data to expected format
        const completedAppointments = loyalty.completedAppointments || 0;
        const goalTarget = 5;
        const progress = Math.min((completedAppointments / goalTarget) * 100, 100);

        this.currentStatus = {
          currentAppointments: completedAppointments,
          goalTarget: goalTarget,
          goalMet: completedAppointments >= goalTarget,
          rewardAvailable: completedAppointments >= goalTarget && (loyalty.availableRewards || 0) > 0,
          rewardClaimed: (loyalty.totalRewardsUsed || 0) > 0,
          progress: progress
        };
      }
    } catch (error) {
      // Keep defaults
    } finally {
      this.updateUI();
    }
  },

  updateUI() {
    if (!this.currentStatus) return;
    if (!this.widget) return;

    const {
      currentAppointments,
      goalTarget,
      goalMet,
      rewardAvailable,
      rewardClaimed,
      progress,
    } = this.currentStatus;

    // Show widget
    this.widget.style.display = 'flex';

    // Update segments - SADECE widget içindeki segment'leri seç
    const segments = this.widget.querySelectorAll('.segment');
    const progressPerSegment = 100 / 5; // 20% per segment
    const safeProgress = Number(progress) || 0; // Ensure progress is a number

    segments.forEach((segment, index) => {
      const segmentFill = segment.querySelector('.segment-fill');

      const segmentStart = index * progressPerSegment;
      const segmentEnd = (index + 1) * progressPerSegment;

      let fillPercentage = 0;

      // Reset classes
      segment.classList.remove('filled', 'active-target');

      if (safeProgress >= segmentEnd) {
        fillPercentage = 100;
        segment.classList.add('filled');
      } else if (safeProgress > segmentStart) {
        fillPercentage = ((safeProgress - segmentStart) / progressPerSegment) * 100;
        segment.classList.add('active-target');
      } else if (index === Math.floor(safeProgress / 20) || (safeProgress === 0 && index === 0)) {
        // First segment gets active-target when progress is 0
        segment.classList.add('active-target');
      } else {
        fillPercentage = 0;
      }

      if (segmentFill) segmentFill.style.width = `${fillPercentage}%`;
    });

    // Animate car position
    const car = this.widget.querySelector('.progress-car');
    if (car) {
      car.style.left = `${safeProgress}%`;
    }

    // Update milestones - SADECE widget içindeki milestone'ları seç
    const allMilestones = this.widget.querySelectorAll('.milestone-markers .milestone');
    allMilestones.forEach((milestone, index) => {
      if (milestone.classList.contains('start-point')) return;

      if (index <= currentAppointments) {
        if (index < currentAppointments) {
          milestone.classList.add('completed');
          if (!milestone.classList.contains('final-step')) {
            const icon = milestone.querySelector('i');
            if (icon) icon.className = 'ri-check-line';
          }
        } else {
          milestone.classList.add('active');
          if (!milestone.classList.contains('final-step')) {
            const icon = milestone.querySelector('i');
            if (icon) icon.className = 'ri-calendar-check-line';
          }
        }
      } else {
        milestone.classList.remove('completed', 'active');
        if (!milestone.classList.contains('final-step')) {
          const icon = milestone.querySelector('i');
          if (icon) icon.className = 'ri-tools-fill';
        }
      }
    });

    // Update Reward Button
    const btn = document.getElementById('loyalty-reward-btn');
    if (btn) {
      if (rewardClaimed) {
        btn.disabled = true;
        btn.classList.add('completed');
      } else if (rewardAvailable) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    }
  },

  setupButton() {
    const btn = document.getElementById('loyalty-reward-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      if (btn.disabled) return;

      try {
        const token = localStorage.getItem('tamirhanem_token');
        const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';

        const tokenResponse = await fetch(`${apiBase}/users/me/generate-reward-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to generate token');
        }

        const { token: rewardToken } = await tokenResponse.json();
        sessionStorage.setItem('reward_access_token', rewardToken);
        window.location.href = '/pages/reward-car-wash.html';
      } catch (error) {
        alert('Ödül talep edilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Az önce';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saat önce`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} gün önce`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} hafta önce`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} ay önce`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yıl önce`;
}

// ============================================================================
// USER DATA LOADING
// ============================================================================
async function loadHeaderUserData() {
  try {
    const token = localStorage.getItem('tamirhanem_token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    // First try to get from localStorage cache
    const cachedUser = localStorage.getItem('tamirhanem_user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      await updateUserUI(user);
    }

    // Then fetch fresh data from API
    const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
    const response = await fetch(`${apiBase}/users/me?populate[0]=avatar`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const user = await response.json();
      await updateUserUI(user);
      // Update cache
      localStorage.setItem('tamirhanem_user', JSON.stringify(user));
    }
  } catch (error) {
    // User data loading failed silently
  }
}

async function updateUserUI(user) {
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const userAvatarEl = document.getElementById('user-avatar');
  const token = localStorage.getItem('tamirhanem_token');
  const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';

  // Check user's service relationship from API (like service-panel.html does)
  try {
    const meUrl = `${apiBase}/users/me?populate[service][populate]=ProfilePicture`;

    const meResponse = await fetch(meUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (meResponse.ok) {
      const meData = await meResponse.json();

      // Check if user has a service
      if (meData.service && meData.service.id) {
        const serviceName = meData.service.name || 'Servis';
        const serviceProfilePic = meData.service.ProfilePicture;

        // Update localStorage
        localStorage.setItem('selectedServiceId', meData.service.id.toString());
        localStorage.setItem('selectedServiceName', serviceName);
        localStorage.setItem('isServiceOwner', 'true');

        // Update name and role
        if (userNameEl) userNameEl.textContent = serviceName;
        if (userRoleEl) userRoleEl.textContent = 'Servis Sahibi';

        // Update avatar with service ProfilePicture (handle Strapi v4 format)
        let avatarUrl = null;
        if (serviceProfilePic) {
          if (serviceProfilePic.data?.attributes?.url) {
            avatarUrl = serviceProfilePic.data.attributes.url;
          } else if (serviceProfilePic.url) {
            avatarUrl = serviceProfilePic.url;
          }
        }

        if (userAvatarEl && avatarUrl) {
          if (!avatarUrl.startsWith('http')) {
            // Remove trailing /api from base URL to construct image URL
            const imageBaseUrl = apiBase.replace(/\/api$/, '');
            avatarUrl = imageBaseUrl + avatarUrl;
          }
          // Ensure container has overflow hidden for proper circular display
          userAvatarEl.style.cssText = 'overflow: hidden !important;';
          userAvatarEl.innerHTML = `<img src="${avatarUrl}" style="width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; display: block !important;" onerror="this.onerror=null; this.parentElement.textContent='${serviceName.charAt(0).toUpperCase()}'; this.remove();">`;
        } else if (userAvatarEl) {
          userAvatarEl.textContent = serviceName.charAt(0).toUpperCase();
        }

        return; // Done - exit function
      }
    }
  } catch (e) {
    // Service check failed, continue with regular user
  }

  // REGULAR USER (no service relationship)

  // REGULAR USER - name + surname birleştir
  const fullName = `${user.name || ''} ${user.surname || ''}`.trim() || user.username || 'Kullanıcı';
  if (userNameEl) userNameEl.textContent = fullName;
  if (userRoleEl) userRoleEl.textContent = user.userType === 'technician' ? 'Mekanikçi' : 'Müşteri';

  // Handle user avatar
  if (userAvatarEl) {
    const avatarData = user.avatar || user.profilePicture || user.ProfilePicture;
    if (avatarData) {
      const imageUrl = getHeaderImageUrl(avatarData);
      // Ensure container has overflow hidden for proper circular display
      userAvatarEl.style.cssText = 'overflow: hidden !important;';
      userAvatarEl.innerHTML = `<img src="${imageUrl}" style="width: 100% !important; height: 100% !important; border-radius: 50% !important; object-fit: cover !important; display: block !important;" onerror="this.onerror=null; this.parentElement.textContent='${(user.name || user.username || 'U').charAt(0).toUpperCase()}'; this.remove();">`;
    } else {
      userAvatarEl.textContent = (user.name || user.username || 'K').charAt(0).toUpperCase();
    }
  }
}

function getHeaderImageUrl(image) {
  if (!image) return '/assets/images/placeholder.jpg';

  const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
  const baseUrl = apiBase.replace(/\/api$/, '');

  // Handle Strapi v4 format
  if (image.data) {
    if (Array.isArray(image.data) && image.data.length > 0) {
      return getHeaderImageUrl(image.data[0]);
    }
    if (image.data.attributes) {
      return getHeaderImageUrl(image.data.attributes);
    }
  }

  if (image.attributes && image.attributes.url) {
    const url = image.attributes.url;
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  }

  if (image.url) {
    return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  }

  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return `${baseUrl}${image}`;
    return image;
  }

  return '/assets/images/placeholder.jpg';
}

async function loadHeaderWalletBalance() {
  try {
    const token = localStorage.getItem('tamirhanem_token');
    if (!token) return;

    const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
    const response = await fetch(`${apiBase}/users/me?populate=wallet`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      const balance = data.wallet?.balance || 0;
      const balanceEl = document.getElementById('navbar-wallet-balance');
      if (balanceEl) balanceEl.textContent = `${balance.toFixed(2)} ₺`;
    }
  } catch (error) {
    const balanceEl = document.getElementById('navbar-wallet-balance');
    if (balanceEl) balanceEl.textContent = '0.00 ₺';
  }
}

// ============================================================================
// HEADER SEARCH FUNCTIONALITY
// ============================================================================
let searchDebounceTimer = null;

function initHeaderSearch() {
  const searchInput = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');

  if (!searchInput || !searchDropdown) return;

  // Input event with debounce
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    clearTimeout(searchDebounceTimer);

    if (query.length < 2) {
      searchDropdown.style.display = 'none';
      return;
    }

    searchDropdown.style.display = 'block';
    document.getElementById('search-dropdown-body').innerHTML = `
      <div class="search-loading"><i class="ri-loader-4-line spin"></i> Aranıyor...</div>
    `;

    searchDebounceTimer = setTimeout(() => {
      performGlobalSearch(query);
    }, 300);
  });

  // Focus event
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      searchDropdown.style.display = 'block';
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.style.display = 'none';
    }
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchDropdown.style.display = 'none';
      searchInput.blur();
    }
  });
}

async function performGlobalSearch(query) {
  const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
  const token = localStorage.getItem('tamirhanem_token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const queryLower = query.toLowerCase();

  try {
    // Parallel search for services, categories, campaigns
    const servicesUrl = `${apiBase}/services?filters[name][$containsi]=${encodeURIComponent(query)}&pagination[limit]=5&populate=ProfilePicture`;
    const categoriesUrl = `${apiBase}/categories?filters[name][$containsi]=${encodeURIComponent(query)}&pagination[limit]=5`;
    // Get all campaigns without filter - will filter client-side (Strapi filter doesn't work)
    const campaignsUrl = `${apiBase}/campaigns?pagination[limit]=20&populate=campaign_image`;

    const [servicesRes, categoriesRes, campaignsRes] = await Promise.all([
      fetch(servicesUrl, { headers }),
      fetch(categoriesUrl, { headers }),
      fetch(campaignsUrl, { headers })
    ]);

    const [services, categories, campaigns] = await Promise.all([
      servicesRes.json(),
      categoriesRes.json(),
      campaignsRes.json()
    ]);

    // Client-side filtering for campaigns (Strapi filter doesn't work)
    let filteredCampaigns = (campaigns.data || []).filter(camp => {
      const attrs = camp.attributes || camp;
      const title = (attrs.title || '').toLowerCase();
      const description = (attrs.description || '').toLowerCase();
      return title.includes(queryLower) || description.includes(queryLower);
    }).slice(0, 5);

    renderSearchResults({
      services: services.data || [],
      categories: categories.data || [],
      campaigns: filteredCampaigns
    }, query);
  } catch (error) {
    // Search failed - show error UI
    document.getElementById('search-dropdown-body').innerHTML = `
      <div class="search-empty"><i class="ri-error-warning-line"></i> Arama yapılamadı</div>
    `;
  }
}

function renderSearchResults(results, query) {
  const body = document.getElementById('search-dropdown-body');
  const { services, categories, campaigns } = results;

  const totalResults = services.length + categories.length + campaigns.length;

  if (totalResults === 0) {
    body.innerHTML = `
      <div class="search-empty"><i class="ri-search-line"></i> "${query}" için sonuç bulunamadı</div>
    `;
    return;
  }

  let html = '';

  // Categories Section
  if (categories.length > 0) {
    html += `<div class="search-section">
      <div class="search-section-title"><i class="ri-list-check"></i> Hizmetler</div>`;
    categories.forEach(cat => {
      const attrs = cat.attributes || cat;
      html += `
        <a href="/pages/kategori.html?id=${cat.id}" class="search-result-item">
          <div class="search-result-icon category"><i class="ri-tools-line"></i></div>
          <div class="search-result-info">
            <div class="search-result-title">${attrs.name || 'Kategori'}</div>
            <div class="search-result-subtitle">Hizmet Kategorisi</div>
          </div>
        </a>`;
    });
    html += `</div>`;
  }

  // Services Section
  if (services.length > 0) {
    html += `<div class="search-section">
      <div class="search-section-title"><i class="ri-building-2-line"></i> Servisler</div>`;
    services.forEach(svc => {
      const attrs = svc.attributes || svc;
      const imgUrl = getSearchImageUrl(attrs.ProfilePicture);
      html += `
        <a href="/pages/service-detail.html?id=${svc.id}" class="search-result-item">
          <div class="search-result-img" style="background-image: url('${imgUrl}')"></div>
          <div class="search-result-info">
            <div class="search-result-title">${attrs.name || 'Servis'}</div>
            <div class="search-result-subtitle">${attrs.location || attrs.city || 'Konum belirtilmemiş'}</div>
          </div>
          ${attrs.rating ? `<div class="search-result-badge"><i class="ri-star-fill"></i> ${parseFloat(attrs.rating).toFixed(1)}</div>` : ''}
        </a>`;
    });
    html += `</div>`;
  }

  // Campaigns Section
  if (campaigns.length > 0) {
    html += `<div class="search-section">
      <div class="search-section-title"><i class="ri-gift-line"></i> Kampanyalar</div>`;
    campaigns.forEach(camp => {
      const attrs = camp.attributes || camp;
      const imgUrl = getSearchImageUrl(attrs.campaign_image);
      html += `
        <a href="/pages/campaigns.html?id=${camp.id}" class="search-result-item">
          <div class="search-result-img campaign" style="background-image: url('${imgUrl}')"></div>
          <div class="search-result-info">
            <div class="search-result-title">${attrs.title || 'Kampanya'}</div>
            <div class="search-result-subtitle">${attrs.discount_percentage ? `%${attrs.discount_percentage} İndirim` : 'Fırsat'}</div>
          </div>
          <div class="search-result-badge campaign"><i class="ri-percent-line"></i></div>
        </a>`;
    });
    html += `</div>`;
  }

  // View All Results
  html += `
    <a href="/pages/search-results.html?q=${encodeURIComponent(query)}" class="search-view-all">
      <i class="ri-search-line"></i> Tüm sonuçları gör
    </a>`;

  body.innerHTML = html;
}

function getSearchImageUrl(image) {
  if (!image) return '/assets/images/placeholder-service.jpg';

  const apiBase = window.CONFIG?.API_BASE_URL || 'https://api.tamirhanem.net/api';
  const baseUrl = apiBase.replace(/\/api$/, '');

  // Handle various Strapi formats
  if (image.data?.attributes?.url) {
    const url = image.data.attributes.url;
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  }
  if (image.url) {
    return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  }
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${baseUrl}${image}`;
  }

  return '/assets/images/placeholder-service.jpg';
}

// Check if page has sidebar and adjust loyalty bar accordingly
function checkSidebarAndAdjust() {
  // Check if there's a sidebar on the page (exclude the loyalty spacer itself)
  const hasSidebar = document.querySelector('.dashboard-sidebar, .sidebar, aside.sidebar, nav.sidebar');
  const spacer = document.querySelector('.loyalty-sidebar-spacer');

  if (!hasSidebar && spacer) {
    // No sidebar found - hide the spacer to center the loyalty bar
    spacer.style.display = 'none';
  } else if (hasSidebar && spacer) {
    // Sidebar exists - show the spacer
    spacer.style.display = '';
  }
}

// Auto-inject on DOM ready (only if header doesn't already exist)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if header already exists (e.g., dashboard.html has inline header)
    const existingHeader = document.querySelector('.dashboard-navbar');
    if (existingHeader) {
      // Header exists, just initialize functionality
      initHeaderFunctionality();
    } else {
      // No header, inject it
      injectGlobalHeader();
    }
    // Check after a small delay to ensure DOM is fully rendered
    setTimeout(checkSidebarAndAdjust, 100);
  });
} else {
  // Check if header already exists
  const existingHeader = document.querySelector('.dashboard-navbar');
  if (existingHeader) {
    initHeaderFunctionality();
  } else {
    injectGlobalHeader();
  }
  setTimeout(checkSidebarAndAdjust, 100);
}
