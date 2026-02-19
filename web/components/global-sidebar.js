// Global Sidebar Component
// Dashboard'dan birebir kopyalandı - DEĞİŞTİRME!

function injectGlobalSidebar(targetSelector = '.dashboard-layout') {
  const sidebarHTML = `
          <!-- Left Sidebar Panel -->
          <aside class="dashboard-sidebar">

            <!-- Sıradaki Randevu -->
            <div class="sidebar-section">
              <div id="active-appointment-widget" class="dashboard-widget hidden" data-widget-id="active-appointment">
                <div id="active-appointment-card"></div>
              </div>
            </div>

            <!-- Hızlı İşlemler -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="hizli-islemler">
                <div class="sidebar-menu-header active">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                      <i class="ri-flashlight-fill"></i>
                    </div>
                    <span class="sidebar-menu-title">Hızlı İşlemler</span>
                  </div>
                </div>
                <div class="sidebar-menu-items expanded" id="menu-hizli-islemler">
                  <a href="/pages/create-appointment.html?quickService=true" class="sidebar-menu-item quick-action-highlight">
                    <i class="ri-calendar-check-line"></i>
                    <span>Hızlı Randevu Al</span>
                  </a>
                  <a href="/pages/create-appointment.html?quickService=true&mode=quote" class="sidebar-menu-item quick-action-highlight">
                    <i class="ri-price-tag-3-line"></i>
                    <span>Hızlı Teklif Al</span>
                  </a>
                  <button onclick="handleRoadsideAssistance()" class="sidebar-menu-item quick-action-highlight">
                    <i class="ri-alarm-warning-line"></i>
                    <span>Acil Yol Yardım</span>
                  </button>
                  <a href="/pages/my-vehicles.html" class="sidebar-menu-item quick-action-highlight">
                    <i class="ri-roadster-line"></i>
                    <span>Araç Ekle</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Oto Sanayi -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="oto-sanayi">
                <a href="/pages/oto-sanayi.html" class="sidebar-menu-header active" style="text-decoration:none;">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon">
                      <i class="ri-tools-fill"></i>
                    </div>
                    <span class="sidebar-menu-title">Oto Sanayi</span>
                  </div>
                </a>
                <div class="sidebar-menu-items expanded" id="menu-oto-sanayi">
                  <div class="sidebar-submenu-item">
                    <button class="sidebar-submenu-toggle" onclick="toggleSidebarSubmenu(this, event)">
                      <div class="sidebar-submenu-toggle-left">
                        <i class="ri-list-check menu-icon"></i>
                        <span>Hizmetler</span>
                      </div>
                      <i class="ri-arrow-down-s-line expand-icon"></i>
                    </button>
                    <div class="sidebar-sub-items">
                      <a href="/pages/kategori.html?id=3133&type=industrial" class="sidebar-sub-item">Motor Onarımı</a>
                      <a href="/pages/kategori.html?id=3130&type=industrial" class="sidebar-sub-item">Elektrik Sistemi</a>
                      <a href="/pages/kategori.html?id=3136&type=industrial" class="sidebar-sub-item">Kaporta & Boya</a>
                      <a href="/pages/kategori.html?id=3128&type=industrial" class="sidebar-sub-item">Lastik Servisi</a>
                      <a href="/pages/kategori.html?id=3127&type=industrial" class="sidebar-sub-item">Fren Sistemi</a>
                      <a href="/pages/kategori.html?id=3125&type=industrial" class="sidebar-sub-item">Periyodik Bakım</a>
                      <a href="/pages/oto-sanayi.html" class="sidebar-sub-item sidebar-sub-item-all">Tümü →</a>
                    </div>
                  </div>
                  <a href="/pages/oto-sanayi.html" class="sidebar-menu-item">
                    <i class="ri-building-2-line"></i>
                    <span>Servisler</span>
                  </a>
                  <a href="/pages/weekly-services.html" class="sidebar-menu-item">
                    <i class="ri-trophy-line"></i>
                    <span>Haftanın Servisleri</span>
                  </a>
                  <a href="/pages/campaign-services.html" class="sidebar-menu-item">
                    <i class="ri-percent-line"></i>
                    <span>Kampanyalı Servisler</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Oto Yıkama -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="oto-yikama">
                <a href="/pages/oto-yikama.html" class="sidebar-menu-header active" style="text-decoration:none;">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon">
                      <i class="ri-drop-fill"></i>
                    </div>
                    <span class="sidebar-menu-title">Oto Yıkama</span>
                  </div>
                </a>
                <div class="sidebar-menu-items expanded" id="menu-oto-yikama">
                  <div class="sidebar-submenu-item">
                    <button class="sidebar-submenu-toggle" onclick="toggleSidebarSubmenu(this, event)">
                      <div class="sidebar-submenu-toggle-left">
                        <i class="ri-list-check menu-icon"></i>
                        <span>Hizmetler</span>
                      </div>
                      <i class="ri-arrow-down-s-line expand-icon"></i>
                    </button>
                    <div class="sidebar-sub-items">
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">İç Dış Yıkama</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">Detaylandırma</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">Pasta Cila</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">Seramik Kaplama</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">Motor Yıkama</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item">Araç Kaplama</a>
                      <a href="/pages/oto-yikama.html" class="sidebar-sub-item sidebar-sub-item-all">Tümü →</a>
                    </div>
                  </div>
                  <a href="/pages/oto-yikama.html" class="sidebar-menu-item">
                    <i class="ri-building-2-line"></i>
                    <span>Servisler</span>
                  </a>
                  <a href="/pages/weekly-services.html?type=carwash" class="sidebar-menu-item">
                    <i class="ri-trophy-line"></i>
                    <span>Haftanın Servisleri</span>
                  </a>
                  <a href="/pages/campaign-services.html?type=carwash" class="sidebar-menu-item">
                    <i class="ri-percent-line"></i>
                    <span>Kampanyalı Servisler</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Çekici -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="cekici">
                <a href="/pages/cekici-acil.html" class="sidebar-menu-header active" style="text-decoration:none;">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon">
                      <i class="mdi mdi-tow-truck"></i>
                    </div>
                    <span class="sidebar-menu-title">Çekici</span>
                  </div>
                </a>
                <div class="sidebar-menu-items expanded" id="menu-cekici">
                  <button onclick="handleRoadsideAssistance()" class="sidebar-menu-item">
                    <i class="ri-alarm-warning-line"></i>
                    <span>Acil Çekici Çağır</span>
                  </button>
                  <a href="/pages/cekici-sehir-ici.html" class="sidebar-menu-item">
                    <i class="ri-map-pin-line"></i>
                    <span>Şehir İçi Çekici</span>
                  </a>
                  <a href="/pages/cekici-sehir-ici.html" class="sidebar-menu-item">
                    <i class="ri-road-map-line"></i>
                    <span>Şehir Dışı Çekici</span>
                  </a>
                  <a href="/pages/cekici-sehir-ici.html" class="sidebar-menu-item">
                    <i class="ri-time-line"></i>
                    <span>7/24 Çekici</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Araç Kiralama -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="arac-kiralama">
                <div class="sidebar-menu-header active">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon">
                      <i class="ri-roadster-line"></i>
                    </div>
                    <span class="sidebar-menu-title">Araç Kiralama</span>
                  </div>
                </div>
                <div class="sidebar-menu-items expanded" id="menu-arac-kiralama">
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-price-tag-3-line"></i>
                    <span>En Uygun Fiyatlı</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-car-line"></i>
                    <span>Filo Kiralama</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-scales-3-line"></i>
                    <span>Karşılaştırma</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-vip-crown-line"></i>
                    <span>VIP Kiralama</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sigortalar -->
            <div class="sidebar-section">
              <div class="sidebar-menu-section" data-menu="sigortalar">
                <div class="sidebar-menu-header active">
                  <div class="sidebar-menu-header-left">
                    <div class="sidebar-menu-icon">
                      <i class="ri-shield-check-fill"></i>
                    </div>
                    <span class="sidebar-menu-title">Sigortalar</span>
                  </div>
                </div>
                <div class="sidebar-menu-items expanded" id="menu-sigortalar">
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-file-list-3-line"></i>
                    <span>Kasko Sigorta Teklifi Al</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-scales-3-line"></i>
                    <span>Teklifleri Karşılaştır</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                  <button onclick="showComingSoonModal()" class="sidebar-menu-item">
                    <i class="ri-history-line"></i>
                    <span>Geçmişte Alınan Teklifler</span>
                    <span class="coming-soon-badge">Yakında</span>
                  </button>
                </div>
              </div>
            </div>

          </aside>
  `;

  // Insert sidebar as first child of target container
  const target = document.querySelector(targetSelector);
  if (target) {
    // Check if we are on mobile, if so, we might want to skip injection or ensure it's hidden.
    // CSS handle hiding, but let's be safe. 
    target.insertAdjacentHTML('afterbegin', sidebarHTML);
  }
}
// Run on load and resize to ensure correct visibility state if needed via JS
window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebar) sidebar.style.display = 'none';
    }
});
window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.style.display = window.innerWidth <= 768 ? 'none' : '';
    }
});

// Sidebar submenu toggle function
function toggleSidebarSubmenu(btn, event) {
  if (event) event.stopPropagation();

  const subItems = btn.parentElement.querySelector('.sidebar-sub-items');
  const expandIcon = btn.querySelector('.expand-icon');

  if (subItems) {
    subItems.classList.toggle('expanded');
  }
  if (expandIcon) {
    expandIcon.style.transform = subItems?.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0)';
  }
}

// Coming Soon Modal
function showComingSoonModal() {
  let modal = document.getElementById('coming-soon-modal');
  if (!modal) {
    const modalHTML = `
      <div id="coming-soon-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div class="modal-content" style="background:white; padding:32px; border-radius:16px; text-align:center; max-width:400px; margin:20px;">
          <div style="width:64px; height:64px; background:rgba(251,199,7,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
            <i class="ri-time-line" style="font-size:32px; color:#fbc707;"></i>
          </div>
          <h3 style="margin-bottom:12px; color:#2d2d2d;">Yakında Geliyor!</h3>
          <p style="color:#888; margin-bottom:24px;">Bu özellik yakında eklenecektir. Takipte kalın!</p>
          <button onclick="closeComingSoonModal()" style="background:#fbc707; color:#5a5a5a; border:none; padding:12px 32px; border-radius:8px; font-weight:600; cursor:pointer;">Tamam</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('coming-soon-modal');
  }
  modal.style.display = 'flex';
}

function closeComingSoonModal() {
  const modal = document.getElementById('coming-soon-modal');
  if (modal) modal.style.display = 'none';
}

// Roadside Assistance Handler
function handleRoadsideAssistance() {
  window.location.href = '/pages/cekici-acil.html';
}

// Make functions globally available
window.toggleSidebarSubmenu = toggleSidebarSubmenu;
window.showComingSoonModal = showComingSoonModal;
window.closeComingSoonModal = closeComingSoonModal;
window.handleRoadsideAssistance = handleRoadsideAssistance;
