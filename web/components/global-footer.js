// Global Footer Component
// Dashboard'dan birebir kopyalandı

function injectGlobalFooter() {
  // Add CSS to prevent white space below footer and fix alignment
  const footerCSS = document.createElement('style');
  footerCSS.textContent = `
    html {
      height: 100%;
    }
    body {
      min-height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .dashboard-main {
      flex: 1 0 auto;
    }
    .dashboard-footer {
      flex-shrink: 0;
      margin-bottom: 0 !important;
    }
    /* Footer grid - reduce bottom margin */
    .dashboard-footer .footer-grid {
      margin-bottom: 30px !important;
    }
    /* First column alignment - logo, desc, social */
    .dashboard-footer .footer-col:first-child {
      align-items: flex-start !important;
    }
    .dashboard-footer .footer-col:first-child .footer-logo {
      margin-bottom: -30px;
    }
    .dashboard-footer .footer-col:first-child .footer-desc {
      text-align: left;
      max-width: 320px;
      margin-bottom: 15px;
      margin-left: 60px;
      margin-top: -20px;
    }
    .dashboard-footer .footer-col:first-child .footer-social {
      justify-content: flex-start !important;
      margin-left: 60px;
      margin-top: -10px;
    }
    .footer-bottom {
      margin-bottom: 0 !important;
      padding-bottom: 20px !important;
      padding-top: 20px !important;
    }
  `;
  document.head.appendChild(footerCSS);

  const footerHTML = `
  <footer class="dashboard-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-logo">
            <img src="/images/logov2.png" alt="TamirHanem" style="height: 200px; width: auto; object-fit: contain;">
          </div>
          <p class="footer-desc">Otomotiv dünyasının dijital köprüsü. Güven,
            hız ve kaliteyi tek platformda buluşturuyoruz.</p>
          <div class="footer-social"><a href="#" class="social-link"><i class="ri-instagram-line"></i></a><a href="#"
              class="social-link"><i class="ri-twitter-x-line"></i></a><a href="#" class="social-link"><i
                class="ri-linkedin-fill"></i></a><a href="#" class="social-link"><i class="ri-youtube-fill"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4 class="footer-title">Hizmetlerimiz</h4><a href="#" class="footer-link">Periyodik Bakım</a><a href="#"
            class="footer-link">Mekanik Tamir</a><a href="#" class="footer-link">Oto Kuaför</a><a href="#"
            class="footer-link">7/24 Yol Yardım</a><a href="#" class="footer-link">Ekspertiz</a>
        </div>
        <div class="footer-col">
          <h4 class="footer-title">Kurumsal</h4><a href="#" class="footer-link">Hakkımızda</a><a href="#"
            class="footer-link">Kariyer Fırsatları</a><a href="#" class="footer-link">İş Ortaklığı (B2B)</a><a href="#"
            class="footer-link">Yatırımcı İlişkileri</a><a href="#" class="footer-link">İletişim</a>
        </div>
        <div class="footer-col">
          <h4 class="footer-title">İletişim</h4>
          <div class="footer-contact"><i class="ri-map-pin-line"></i><span>ESENTEPE MAH. SANCAK CAD. NO: 2 İÇ KAPI NO:
              14 ÇORLU / TEKİRDAĞ</span></div>
          <div class="footer-contact"><i class="ri-phone-line"></i><span>0850 XXX XX XX</span></div>
          <div class="footer-contact"><i class="ri-mail-line"></i><span>info@tamirhanem.com</span></div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copyright">&copy;
          2025 TamirHanem Teknoloji A.Ş. Tüm hakları saklıdır.</div>
        <div class="footer-legal"><a href="#">Kullanım Şartları</a><a href="#">Gizlilik Politikası</a><a
            href="#">Çerezler</a></div>
      </div>
    </div>
  </footer>
  `;

  // Append footer before closing body tag
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}
