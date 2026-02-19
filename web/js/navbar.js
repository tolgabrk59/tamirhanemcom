/**
 * TamirHANEm - Ortak Navbar Komponenti
 * Tüm sayfalarda kullanılabilir ortak navbar yönetimi
 */

const Navbar = {
  // Navbar HTML'ini oluştur ve inject et
  init: function () {
    const navbarHTML = `
      <nav class="dashboard-navbar">
        <div class="container dashboard-navbar-container">
          <a href="/dashboard.html" class="dashboard-logo" style="height: 60px; display: flex; align-items: center; overflow: visible;">
            <img src="/images/logo.png" alt="TamirHanem" style="width: 200px; height: auto; pointer-events: none;">
          </a>

          <div class="dashboard-search">
            <div class="search-input-wrapper">
              <input type="text" class="search-input" placeholder="Servis veya kategori ara..." id="navbar-search-input">
              <i class="ri-search-line search-icon"></i>
            </div>
          </div>

          <div class="dashboard-actions">
            <!-- Bildirimler -->
            <div style="position: relative;">
              <button class="action-btn" id="navbar-notifications-btn">
                <i class="ri-notification-3-line"></i>
                <span class="notification-badge" id="navbar-notifications-badge" style="display:none;">0</span>
              </button>
              <div class="notification-dropdown" id="navbar-notification-dropdown">
                <div class="notification-dropdown-header">
                  <span class="notification-dropdown-title">Bildirimler</span>
                  <a href="/pages/notifications.html" style="font-size: 0.85rem; color: var(--primary-dark); font-weight: 600;">Tümü</a>
                </div>
                <div class="notification-dropdown-body" id="navbar-notification-dropdown-body">
                  <div class="notification-empty">
                    <i class="ri-notification-off-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>
                    Bildiriminiz yok
                  </div>
                </div>
              </div>
            </div>

            <!-- Favoriler -->
            <div style="position: relative;">
              <button class="action-btn" id="navbar-favourites-btn">
                <i class="ri-heart-3-line"></i>
              </button>
              <div class="favourite-dropdown" id="navbar-favourite-dropdown">
                <div class="favourite-dropdown-header">
                  <span class="favourite-dropdown-title">Favorilerim</span>
                </div>
                <div class="favourite-dropdown-body" id="navbar-favourite-dropdown-body">
                  <div class="favourite-empty">
                    <i class="ri-heart-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>
                    Henüz favori eklemediniz
                  </div>
                </div>
              </div>
            </div>

            <!-- User Profile -->
            <div class="user-profile-mini" id="navbar-user-menu-toggle" onclick="window.location.href='/dashboard.html#profile'">
              <div class="user-avatar" id="navbar-user-avatar">K</div>
              <div class="user-info">
                <span class="user-name" id="navbar-user-name">Kullanıcı</span>
                <span class="user-role" id="navbar-user-role">Müşteri</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;

    // Navbar'ı sayfaya ekle
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Event listener'ları ekle
    this.attachEventListeners();

    // User bilgilerini yükle
    this.loadUserInfo();

    // Bildirimleri yükle
    this.loadNotifications();

    // Favorileri yükle
    this.loadFavourites();
  },

  // Event listener'ları ekle
  attachEventListeners: function () {
    const notificationBtn = document.getElementById('navbar-notifications-btn');
    const notificationDropdown = document.getElementById('navbar-notification-dropdown');
    const favouriteBtn = document.getElementById('navbar-favourites-btn');
    const favouriteDropdown = document.getElementById('navbar-favourite-dropdown');

    // Toggle Notification Dropdown
    if (notificationBtn) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
        favouriteDropdown.classList.remove('show');
        this.loadNotifications();
      });
    }

    // Toggle Favourite Dropdown
    if (favouriteBtn) {
      favouriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        favouriteDropdown.classList.toggle('show');
        notificationDropdown.classList.remove('show');
        this.loadFavourites();
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
        notificationDropdown.classList.remove('show');
      }
      if (!favouriteDropdown.contains(e.target) && e.target !== favouriteBtn) {
        favouriteDropdown.classList.remove('show');
      }
    });
  },

  // User bilgilerini yükle
  loadUserInfo: function () {
    if (typeof auth === 'undefined' || !auth.getUser) {
      console.warn('Auth module not loaded');
      return;
    }

    const user = auth.getUser();
    if (!user) return;

    const nameEl = document.getElementById('navbar-user-name');
    const roleEl = document.getElementById('navbar-user-role');
    const avatarEl = document.getElementById('navbar-user-avatar');

    if (nameEl) nameEl.textContent = user.name || user.username || 'Kullanıcı';
    if (roleEl) roleEl.textContent = user.userType === 'technician' ? 'Mekanikçi' : 'Müşteri';

    // Profile picture
    if (avatarEl) {
      if (user.avatar || user.profilePicture || user.ProfilePicture) {
        const profilePic = user.avatar || user.profilePicture || user.ProfilePicture;
        const imageUrl = Utils.getImageUrl(profilePic);
        avatarEl.innerHTML = `<img src="${imageUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.onerror=null; this.parentElement.textContent='${(user.name || user.username || 'U').charAt(0).toUpperCase()}'; this.remove();">`;
      } else {
        const initial = (user.name || user.username || 'U').charAt(0).toUpperCase();
        avatarEl.textContent = initial;
      }
    }
  },

  // Bildirimleri yükle
  loadNotifications: async function () {
    if (typeof api === 'undefined' || !api.getNotifications) {
      console.warn('API module not loaded');
      return;
    }

    try {
      const response = await api.getNotifications();
      const notifications = response.data || [];

      // Count unread notifications
      const unreadCount = notifications.filter(n => {
        const attrs = n.attributes || n;
        return !attrs.read;
      }).length;

      // Update badge
      const badge = document.getElementById('navbar-notifications-badge');
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }

      // Update dropdown body
      const body = document.getElementById('navbar-notification-dropdown-body');
      if (!body) return;

      if (notifications.length === 0) {
        body.innerHTML = `
          <div class="notification-empty">
            <i class="ri-notification-off-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>
            Bildiriminiz yok
          </div>
        `;
      } else {
        body.innerHTML = notifications.slice(0, 5).map(notif => {
          const attrs = notif.attributes || notif;
          const isUnread = !attrs.read;

          // Format time
          let timeStr = 'Bilinmiyor';
          try {
            if (attrs.createdAt) {
              timeStr = Utils.formatRelativeTime ? Utils.formatRelativeTime(attrs.createdAt) : Utils.formatDate(new Date(attrs.createdAt), 'DD.MM.YYYY HH:mm');
            }
          } catch (e) {
            console.error('Time format error:', e);
          }

          return `
            <div class="notification-item ${isUnread ? 'unread' : ''}" onclick="window.location.href='/pages/notifications.html'">
              <div class="notification-item-title">${attrs.title || 'Bildirim'}</div>
              <div class="notification-item-message">${attrs.message || ''}</div>
              <div class="notification-item-time">${timeStr}</div>
            </div>
          `;
        }).join('');
      }
    } catch (error) {
      console.error('Notifications load error:', error);
      const body = document.getElementById('navbar-notification-dropdown-body');
      if (body) {
        body.innerHTML = `
          <div class="notification-empty">
            <i class="ri-notification-off-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>
            Bildirimler yüklenemedi
          </div>
        `;
      }
    }
  },

  // Favorileri yükle
  loadFavourites: async function () {
    const body = document.getElementById('navbar-favourite-dropdown-body');
    if (!body) return;

    // LocalStorage'dan favorileri al
    const favourites = JSON.parse(localStorage.getItem('favouriteServices') || '[]');

    if (favourites.length === 0) {
      body.innerHTML = `
        <div class="favourite-empty">
          <i class="ri-heart-line" style="font-size: 2rem; opacity: 0.3; display: block; margin-bottom: 10px;"></i>
          Henüz favori eklemediniz
        </div>
      `;
    } else {
      body.innerHTML = favourites.slice(0, 5).map(fav => `
        <div class="favourite-item" onclick="window.location.href='/pages/service-detail.html?id=${fav.id}'">
          <img src="${fav.image || 'https://via.placeholder.com/40'}" class="favourite-item-img" alt="${fav.name}">
          <div class="favourite-item-info">
            <div class="favourite-item-name">${fav.name}</div>
            <div class="favourite-item-location"><i class="ri-map-pin-line"></i> ${fav.location || 'İstanbul'}</div>
          </div>
        </div>
      `).join('');
    }
  }
};

// Sayfa yüklendiğinde navbar'ı init et
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Navbar.init());
} else {
  Navbar.init();
}
