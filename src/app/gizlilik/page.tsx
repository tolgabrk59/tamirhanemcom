import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - TamirHanem',
  description: 'TamirHanem gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.',
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-gray-300">
            Son güncelleme: 15 Aralık 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl prose prose-lg max-w-none">
            
            <h2>1. Giriş</h2>
            <p>
              TamirHanem ("biz", "bize" veya "bizim") olarak, gizliliğinize saygı duyuyor ve 
              kişisel verilerinizi korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, 
              tamirhanem.net web sitesini ("Site") kullanırken hangi bilgileri topladığımızı, 
              nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
            </p>

            <h2>2. Topladığımız Bilgiler</h2>
            <h3>2.1 Otomatik Olarak Toplanan Bilgiler</h3>
            <ul>
              <li>IP adresi</li>
              <li>Tarayıcı türü ve sürümü</li>
              <li>Cihaz bilgileri</li>
              <li>Erişim zamanı ve tarihi</li>
              <li>Ziyaret edilen sayfalar</li>
            </ul>

            <h3>2.2 Sizin Tarafınızdan Sağlanan Bilgiler</h3>
            <ul>
              <li>İletişim formlarında girilen ad, e-posta adresi</li>
              <li>Araç bilgileri (marka, model, yıl)</li>
              <li>Servis randevu talepleri</li>
              <li>Yorum ve değerlendirmeler</li>
            </ul>

            <h2>3. Bilgilerin Kullanımı</h2>
            <p>Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
            <ul>
              <li>Hizmetlerimizi sunmak ve geliştirmek</li>
              <li>Kullanıcı deneyimini iyileştirmek</li>
              <li>İletişim taleplerinize yanıt vermek</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>

            <h2>4. Bilgi Paylaşımı</h2>
            <p>
              Kişisel bilgilerinizi üçüncü taraflarla satmıyoruz. Bilgilerinizi yalnızca 
              şu durumlarda paylaşabiliriz:
            </p>
            <ul>
              <li>Yasal zorunluluk durumlarında</li>
              <li>Servis sağlayıcılarla (hizmet sunumu için)</li>
              <li>Açık onayınız ile</li>
            </ul>

            <h2>5. Çerezler (Cookies)</h2>
            <p>
              Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
              Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu, 
              bazı site özelliklerinin çalışmamasına neden olabilir.
            </p>

            <h2>6. Veri Güvenliği</h2>
            <p>
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. 
              Ancak, internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını 
              hatırlatmak isteriz.
            </p>

            <h2>7. Haklarınız</h2>
            <p>KVKK kapsamında şu haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse ilgili bilgileri talep etme</li>
              <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içi veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
            </ul>

            <h2>8. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız varsa, bizimle iletişime geçebilirsiniz:
            </p>
            <ul>
              <li>E-posta: info@tamirhanem.com</li>
              <li>Adres: Tekirdağ, Türkiye</li>
            </ul>

            <h2>9. Değişiklikler</h2>
            <p>
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
              olması durumunda sizi bilgilendireceğiz.
            </p>

            <div className="mt-12 p-6 bg-secondary-50 rounded-xl">
              <p className="text-secondary-600 text-sm mb-0">
                <strong>Next AI Teknoloji Yazılım San. ve Tic.Ltd.Şti</strong><br />
                TamirHanem markası sahibidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
