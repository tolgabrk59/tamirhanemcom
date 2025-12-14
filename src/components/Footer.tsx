import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    hizmetler: [
      { href: '/servisler', label: 'Tüm Servisler' },
      { href: '/fiyat-hesapla', label: 'Fiyat Hesapla' },
      { href: '/ariza-bul', label: 'Arıza Teşhis' },
      { href: '/obd', label: 'OBD Kodları' },
    ],
    kategoriler: [
      { href: '/servisler?cat=motor-bakim', label: 'Motor Bakım' },
      { href: '/servisler?cat=fren-sistemi', label: 'Fren Sistemi' },
      { href: '/servisler?cat=sanziman', label: 'Şanzıman' },
      { href: '/servisler?cat=elektrik', label: 'Elektrik' },
    ],
    kurumsal: [
      { href: '/hakkimizda', label: 'Hakkımızda' },
      { href: '/iletisim', label: 'İletişim' },
      { href: '/gizlilik', label: 'Gizlilik Politikası' },
      { href: '/sartlar', label: 'Kullanım Şartları' },
    ],
    destek: [
      { href: '/sss', label: 'Sık Sorulan Sorular' },
      { href: '/yardim', label: 'Yardım Merkezi' },
      { href: '/blog', label: 'Blog' },
    ],
  };

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Tamir<span className="text-primary-400">Hanem</span>
              </span>
            </Link>
            <p className="text-sm mb-4">
              Aracınız için güvenilir hizmeti birkaç adımda bulun. Şeffaf fiyatlandırma ve kalite güvencesi.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hizmetler</h3>
            <ul className="space-y-2">
              {footerLinks.hizmetler.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {footerLinks.kategoriler.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Destek</h3>
            <ul className="space-y-2">
              {footerLinks.destek.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {currentYear} TamirHanem. Tüm hakları saklıdır.
          </p>
          <p className="text-sm mt-2 md:mt-0">
            Türkiye&apos;nin güvenilir araç bakım platformu
          </p>
        </div>
      </div>
    </footer>
  );
}
