import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Şartları - TamirHanem',
  description: 'TamirHanem web sitesi kullanım şartları ve koşulları.',
};

export default function SartlarPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kullanım Şartları
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
            
            <h2>1. Kabul</h2>
            <p>
              tamirhanem.net web sitesini ("Site") kullanarak, bu Kullanım Şartlarını 
              okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. 
              Bu şartları kabul etmiyorsanız, Siteyi kullanmayınız.
            </p>

            <h2>2. Hizmet Tanımı</h2>
            <p>
              TamirHanem, araç sahiplerini oto servis ve bakım hizmeti sağlayıcılarıyla 
              buluşturan bir platformdur. Platformumuz aracılığıyla:
            </p>
            <ul>
              <li>Araç bakım ve tamir fiyatlarını karşılaştırabilir</li>
              <li>Servisleri değerlendirebilir ve yorum yapabilir</li>
              <li>OBD arıza kodlarını sorgulayabilir</li>
              <li>Araç sorunlarını teşhis edebilirsiniz</li>
            </ul>

            <h2>3. Kullanıcı Sorumlulukları</h2>
            <p>Site kullanıcıları olarak:</p>
            <ul>
              <li>Doğru ve güncel bilgi sağlamakla</li>
              <li>Hesap güvenliğinizi korumakla</li>
              <li>Yasalara ve bu şartlara uymakla</li>
              <li>Diğer kullanıcılara saygılı davranmakla</li>
              <li>Fikri mülkiyet haklarına saygı göstermekle</li>
            </ul>
            <p>yükümlüsünüz.</p>

            <h2>4. Yasaklanmış Kullanımlar</h2>
            <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
            <ul>
              <li>Sahte veya yanıltıcı bilgi paylaşma</li>
              <li>Zararlı yazılım veya virüs yayma</li>
              <li>Diğer kullanıcıları taciz etme</li>
              <li>Siteyi ticari amaçlarla izinsiz kullanma</li>
              <li>Sistemi hackleme veya güvenlik önlemlerini aşma</li>
            </ul>

            <h2>5. Fiyat Bilgileri</h2>
            <p>
              Sitede gösterilen fiyatlar tahmini değerlerdir ve yalnızca bilgilendirme 
              amaçlıdır. Gerçek fiyatlar:
            </p>
            <ul>
              <li>Araç markası ve modeline</li>
              <li>İşin kapsamına</li>
              <li>Kullanılan parçaların kalitesine</li>
              <li>Servisin konumuna</li>
            </ul>
            <p>göre farklılık gösterebilir. Kesin fiyat için mutlaka servislerden teklif alınız.</p>

            <h2>6. Sorumluluk Reddi</h2>
            <p>
              TamirHanem, platformda listelenen servislerin kalitesi, güvenilirliği veya 
              hizmetleri konusunda garanti vermez. Servislerle yapacağınız anlaşmalar 
              sizinle ilgili servis arasındadır.
            </p>
            <p>
              Site içeriğinin doğruluğu için çaba gösterilmekle birlikte, bilgilerin 
              eksiksiz veya güncel olduğu garanti edilmez.
            </p>

            <h2>7. Fikri Mülkiyet</h2>
            <p>
              Sitedeki tüm içerik, tasarım, logo, grafik ve yazılımlar TamirHanem'e 
              veya lisans sağlayıcılarına aittir. İzinsiz kullanım yasaktır.
            </p>

            <h2>8. Üçüncü Taraf Bağlantıları</h2>
            <p>
              Site, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin 
              içeriğinden veya gizlilik politikalarından sorumlu değiliz.
            </p>

            <h2>9. Değişiklikler</h2>
            <p>
              Bu Kullanım Şartlarını herhangi bir zamanda değiştirme hakkını saklı 
              tutarız. Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
            </p>

            <h2>10. Uygulanacak Hukuk</h2>
            <p>
              Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda 
              İstanbul Mahkemeleri yetkilidir.
            </p>

            <h2>11. İletişim</h2>
            <p>
              Kullanım şartları hakkında sorularınız için:
            </p>
            <ul>
              <li>E-posta: info@tamirhanem.com</li>
            </ul>

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
