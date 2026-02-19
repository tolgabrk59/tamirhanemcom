/**
 * Global Footer Component
 * TamirHanem - Modern Footer with FAB Hide on Scroll
 */

class Footer {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHTML();
        this.initFabObserver();
        this.initFullWidth();
    }

    injectStyles() {
        // Check if styles already injected
        if (document.getElementById('global-footer-styles')) return;

        const style = document.createElement('style');
        style.id = 'global-footer-styles';
        style.textContent = `
            /* Body overflow fix for full-width elements */
            body {
              overflow-x: hidden;
            }

            /* --- Footer Design --- */
            .dashboard-footer {
              position: relative;
              background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 50%, #1f1f1f 100%);
              color: #ffffff;
              padding-top: 30px;
              padding-bottom: 0;
              margin-top: 0;
              overflow: visible;
              box-sizing: border-box;
            }

            /* Wave SVG Effect at Top - disabled to prevent spacing issues */
            .dashboard-footer::before {
              display: none;
            }

            /* Animated background pattern */
            .dashboard-footer::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image:
                radial-gradient(circle at 20% 50%, rgba(251, 199, 7, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(251, 199, 7, 0.08) 0%, transparent 50%);
              pointer-events: none;
              animation: pulseGlow 8s ease-in-out infinite;
            }

            @keyframes pulseGlow {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }

            .dashboard-footer .container {
              position: relative;
              z-index: 1;
              max-width: 100%;
              margin: 0;
              padding: 0 60px;
            }

            .footer-grid {
              display: grid;
              grid-template-columns: 2fr 1fr 1fr 1.2fr;
              gap: 30px;
              margin-bottom: 30px;
            }

            .footer-col {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            /* Logo with Glow Effect */
            .footer-logo {
              font-size: 1.8rem;
              font-weight: 900;
              display: flex;
              align-items: center;
              gap: 12px;
              color: var(--white);
              margin-bottom: 15px;
              text-shadow: 0 0 20px rgba(251, 199, 7, 0.3);
              letter-spacing: 0.5px;
            }

            .footer-logo i {
              color: var(--primary);
              font-size: 2rem;
              filter: drop-shadow(0 0 10px rgba(251, 199, 7, 0.6));
              animation: iconPulse 3s ease-in-out infinite;
            }

            @keyframes iconPulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }

            .footer-desc {
              color: rgba(255, 255, 255, 0.7);
              line-height: 1.8;
              margin-bottom: 15px;
              max-width: 320px;
              font-size: 0.95rem;
            }

            /* Modern Social Media Icons */
            .footer-social {
              display: flex;
              gap: 14px;
              margin-top: 10px;
            }

            .social-link {
              width: 44px;
              height: 44px;
              background: linear-gradient(135deg, rgba(251, 199, 7, 0.15) 0%, rgba(251, 199, 7, 0.05) 100%);
              border: 2px solid rgba(251, 199, 7, 0.2);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--primary, #fbc707);
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              font-size: 1.2rem;
              position: relative;
              overflow: hidden;
            }

            .social-link::before {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              border-radius: 50%;
              background: var(--primary, #fbc707);
              transition: all 0.5s ease;
              transform: translate(-50%, -50%);
            }

            .social-link:hover::before {
              width: 100px;
              height: 100px;
            }

            .social-link:hover {
              border-color: var(--primary, #fbc707);
              transform: translateY(-5px) scale(1.05);
              box-shadow: 0 10px 25px rgba(251, 199, 7, 0.3);
            }

            .social-link:hover i {
              color: var(--neutral-900, #1f2937);
              position: relative;
              z-index: 1;
            }

            .social-link i {
              transition: all 0.3s ease;
            }

            /* Footer Titles with Underline */
            .footer-title {
              font-size: 1.15rem;
              font-weight: 700;
              color: var(--white, #ffffff);
              margin-bottom: 12px;
              position: relative;
              padding-bottom: 10px;
            }

            .footer-title::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 40px;
              height: 3px;
              background: linear-gradient(90deg, var(--primary, #fbc707) 0%, transparent 100%);
              border-radius: 2px;
            }

            /* Modern Footer Links */
            .footer-link {
              color: rgba(255, 255, 255, 0.7);
              transition: all 0.3s ease;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 0.95rem;
              position: relative;
              padding-left: 0;
              text-decoration: none;
            }

            .footer-link::before {
              content: '→';
              opacity: 0;
              transform: translateX(-10px);
              transition: all 0.3s ease;
              color: var(--primary, #fbc707);
            }

            .footer-link:hover::before {
              opacity: 1;
              transform: translateX(0);
            }

            .footer-link:hover {
              color: var(--primary, #fbc707);
              padding-left: 20px;
            }

            /* Contact Info with Icons */
            .footer-contact {
              display: flex;
              align-items: flex-start;
              gap: 14px;
              color: rgba(255, 255, 255, 0.7);
              line-height: 1.6;
              font-size: 0.95rem;
              transition: all 0.3s ease;
            }

            .footer-contact:hover {
              color: rgba(255, 255, 255, 0.95);
              transform: translateX(5px);
            }

            .footer-contact i {
              color: var(--primary, #fbc707);
              font-size: 1.2rem;
              margin-top: 3px;
              min-width: 20px;
              filter: drop-shadow(0 0 5px rgba(251, 199, 7, 0.4));
            }

            /* Premium Footer Bottom */
            .footer-bottom {
              border-top: 1px solid rgba(251, 199, 7, 0.15);
              padding: 20px 60px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 20px;
              background: rgba(0, 0, 0, 0.1);
              margin: 0 -60px;
            }

            .footer-copyright {
              color: rgba(255, 255, 255, 0.6);
              font-size: 0.9rem;
            }

            .footer-legal {
              display: flex;
              gap: 28px;
            }

            .footer-legal a {
              color: rgba(255, 255, 255, 0.6);
              transition: all 0.3s ease;
              position: relative;
              font-size: 0.9rem;
              text-decoration: none;
            }

            .footer-legal a::after {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 0;
              width: 0;
              height: 2px;
              background: var(--primary, #fbc707);
              transition: width 0.3s ease;
            }

            .footer-legal a:hover::after {
              width: 100%;
            }

            .footer-legal a:hover {
              color: var(--primary, #fbc707);
            }

            /* FAB gizlenme animasyonu */
            .fab-mega-container.fab-hidden {
              opacity: 0;
              transform: translateY(20px) scale(0.8);
              pointer-events: none;
              transition: all 0.3s ease;
            }

            .fab-mega-container {
              transition: all 0.3s ease;
            }

            /* Mobile Responsive Footer */
            @media (max-width: 768px) {
              .dashboard-footer {
                padding-top: 60px;
                margin-top: 60px;
              }

              .footer-grid {
                grid-template-columns: 1fr;
                gap: 40px;
              }

              .footer-logo {
                font-size: 1.6rem;
              }

              .footer-social {
                justify-content: flex-start;
              }

              .footer-bottom {
                flex-direction: column;
                text-align: center;
                gap: 15px;
              }

              .footer-legal {
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
              }
            }
        `;
        document.head.appendChild(style);
    }

    injectHTML() {
        // Check if footer already exists
        if (document.querySelector('.dashboard-footer')) return;

        const footerHTML = `
          <footer class="dashboard-footer">
            <div class="container">
              <div class="footer-grid">
                <div class="footer-col">
                  <img src="/images/logov2.png" style="width: 400px; margin-bottom: 15px;" alt="TamirHanem">
                  <p class="footer-desc">Otomotiv dünyasının dijital köprüsü. Güven,
                    hız ve kaliteyi tek platformda buluşturuyoruz.</p>
                  <div class="footer-social">
                    <a href="#" class="social-link"><i class="ri-instagram-line"></i></a>
                    <a href="#" class="social-link"><i class="ri-twitter-x-line"></i></a>
                    <a href="#" class="social-link"><i class="ri-linkedin-fill"></i></a>
                    <a href="#" class="social-link"><i class="ri-youtube-fill"></i></a>
                  </div>
                </div>
                <div class="footer-col">
                  <h4 class="footer-title">Hizmetlerimiz</h4>
                  <a href="#" class="footer-link">Periyodik Bakım</a>
                  <a href="#" class="footer-link">Mekanik Tamir</a>
                  <a href="#" class="footer-link">Oto Kuaför</a>
                  <a href="#" class="footer-link">7/24 Yol Yardım</a>
                  <a href="#" class="footer-link">Ekspertiz</a>
                </div>
                <div class="footer-col">
                  <h4 class="footer-title">Kurumsal</h4>
                  <a href="#" class="footer-link">Hakkımızda</a>
                  <a href="#" class="footer-link">Kariyer Fırsatları</a>
                  <a href="#" class="footer-link">İş Ortaklığı (B2B)</a>
                  <a href="#" class="footer-link">Yatırımcı İlişkileri</a>
                  <a href="#" class="footer-link">İletişim</a>
                </div>
                <div class="footer-col">
                  <h4 class="footer-title">İletişim</h4>
                  <div class="footer-contact">
                    <i class="ri-map-pin-line"></i>
                    <span>ESENTEPE MAH. SANCAK CAD. NO: 2 İÇ KAPI NO: 14 ÇORLU / TEKİRDAĞ</span>
                  </div>
                  <div class="footer-contact">
                    <i class="ri-phone-line"></i>
                    <span>0850 XXX XX XX</span>
                  </div>
                  <div class="footer-contact">
                    <i class="ri-mail-line"></i>
                    <span>info@tamirhanem.com</span>
                  </div>
                </div>
              </div>
              <div class="footer-bottom">
                <div class="footer-copyright">&copy; 2025 TamirHanem Teknoloji A.Ş. Tüm hakları saklıdır.</div>
                <div class="footer-legal">
                  <a href="#">Kullanım Şartları</a>
                  <a href="#">Gizlilik Politikası</a>
                  <a href="#">Çerezler</a>
                </div>
              </div>
            </div>
          </footer>
        `;

        // Insert before bottom nav wrapper if it exists, otherwise at end of body
        const bottomNav = document.querySelector('.bottom-nav-wrapper');
        if (bottomNav) {
            bottomNav.insertAdjacentHTML('beforebegin', footerHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }

    initFabObserver() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            const fab = document.querySelector('.fab-mega-container');
            const footer = document.querySelector('.dashboard-footer');

            if (fab && footer) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            fab.classList.add('fab-hidden');
                        } else {
                            fab.classList.remove('fab-hidden');
                        }
                    });
                }, {
                    threshold: 0.1
                });

                observer.observe(footer);
            }
        }, 100);
    }

    initFullWidth() {
        const footer = document.querySelector('.dashboard-footer');
        if (!footer) return;

        const setFullWidth = () => {
            // Get zoom level from body
            const zoom = parseFloat(getComputedStyle(document.body).zoom) || 1;

            // Calculate actual width needed (compensate for zoom)
            const actualWidth = window.innerWidth / zoom;

            const footerRect = footer.getBoundingClientRect();
            const offsetLeft = footerRect.left / zoom;

            footer.style.width = actualWidth + 'px';
            footer.style.marginLeft = -offsetLeft + 'px';
        };

        setFullWidth();
        window.addEventListener('resize', setFullWidth);
    }
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Footer());
} else {
    new Footer();
}
