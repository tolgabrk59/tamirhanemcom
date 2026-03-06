import { Metadata } from 'next';
import { Shield, FileText, Clock, User, Database, Lock, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'TamirHanem 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  alternates: {
    canonical: 'https://tamirhanem.com/kvkk',
  },
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                KVKK Aydınlatma Metni
              </h1>
              <p className="text-white/80 mt-1">
                Kişisel Verilerin Korunması Hakkında Bilgilendirme
              </p>
            </div>
          </div>
          <p className="text-white/90 text-lg">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
            TamirHanem olarak kişisel verilerinizin güvenliğine önem veriyoruz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

          {/* Veri Sorumlusu */}
          <div className="border-b border-secondary-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">1. Veri Sorumlusu</h2>
            </div>
            <p className="text-secondary-600 leading-relaxed">
              TamirHanem Teknoloji A.Ş. (&quot;TamirHanem&quot; veya &quot;Şirket&quot;) olarak, 6698 sayılı
              Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla
              kişisel verilerinizi aşağıda açıklanan amaçlar doğrultusunda işlemekteyiz.
            </p>
            <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
              <p className="text-secondary-700 font-medium">İletişim Bilgileri:</p>
              <div className="mt-2 space-y-1 text-secondary-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  kvkk@tamirhanem.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  0850 XXX XX XX
                </p>
              </div>
            </div>
          </div>

          {/* İşlenen Kişisel Veriler */}
          <div className="border-b border-secondary-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">2. İşlenen Kişisel Veriler</h2>
            </div>
            <p className="text-secondary-600 mb-4">
              Platformumuzda aşağıdaki kişisel veriler işlenmektedir:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">Kimlik Bilgileri</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Ad, soyad</li>
                  <li>• T.C. kimlik numarası (opsiyonel)</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">İletişim Bilgileri</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Telefon numarası</li>
                  <li>• E-posta adresi</li>
                  <li>• Adres bilgileri</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h3 className="font-semibold text-purple-800 mb-2">Araç Bilgileri</h3>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Araç marka ve modeli</li>
                  <li>• Plaka numarası</li>
                  <li>• Şasi numarası</li>
                  <li>• Kilometre bilgisi</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <h3 className="font-semibold text-orange-800 mb-2">İşlem Bilgileri</h3>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Servis geçmişi</li>
                  <li>• OBD teşhis verileri</li>
                  <li>• Ödeme bilgileri</li>
                </ul>
              </div>
            </div>
          </div>

          {/* İşleme Amaçları */}
          <div className="border-b border-secondary-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">3. Kişisel Verilerin İşlenme Amaçları</h2>
            </div>
            <ul className="space-y-3 text-secondary-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Platformumuz üzerinden sunulan hizmetlerin sağlanması ve iyileştirilmesi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Servis sağlayıcıları ile iletişimin kurulması ve randevu yönetimi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Araç bakım ve onarım önerilerinin sunulması</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>Yasal yükümlülüklerin yerine getirilmesi</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                <span>İstatistiksel analizler ve hizmet kalitesinin artırılması</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                <span>Açık rızanız olması halinde pazarlama faaliyetleri</span>
              </li>
            </ul>
          </div>

          {/* Saklama Süreleri */}
          <div className="border-b border-secondary-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">4. Veri Saklama Süreleri</h2>
            </div>
            <p className="text-secondary-600 mb-4">
              Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca saklanmaktadır:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary-100">
                    <th className="px-4 py-3 text-left font-semibold text-secondary-700">Veri Türü</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary-700">Saklama Süresi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  <tr>
                    <td className="px-4 py-3 text-secondary-600">Kimlik ve İletişim Bilgileri</td>
                    <td className="px-4 py-3 text-secondary-600">Son işlem tarihinden itibaren 3 yıl</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-secondary-600">Araç ve Servis Bilgileri</td>
                    <td className="px-4 py-3 text-secondary-600">5 yıl (garanti ve servis takibi)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-secondary-600">Ödeme Bilgileri</td>
                    <td className="px-4 py-3 text-secondary-600">10 yıl (yasal zorunluluk)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-secondary-600">Analitik Veriler</td>
                    <td className="px-4 py-3 text-secondary-600">26 ay</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-secondary-600">Pazarlama Verileri</td>
                    <td className="px-4 py-3 text-secondary-600">Rızanın geri alınmasına kadar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Haklar */}
          <div className="border-b border-secondary-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">5. KVKK Kapsamındaki Haklarınız</h2>
            </div>
            <p className="text-secondary-600 mb-4">
              KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
                'İşlenmişse buna ilişkin bilgi talep etme',
                'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
                'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
                'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
                'KVKK 7. maddesindeki şartlar çerçevesinde silinmesini isteme',
                'Düzeltme ve silme işlemlerinin bildirilmesini isteme',
                'Otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
                'Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
              ].map((right, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-secondary-50 rounded-lg">
                  <span className="text-primary-500 font-bold">{index + 1}.</span>
                  <span className="text-secondary-600 text-sm">{right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Başvuru */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-secondary-800">6. Başvuru Yöntemi</h2>
            </div>
            <p className="text-secondary-600 mb-4">
              Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-primary-200 rounded-xl">
                <h3 className="font-semibold text-primary-700 mb-2">E-posta ile Başvuru</h3>
                <p className="text-secondary-600 text-sm">
                  &quot;Kişisel Verilerin Korunması Kanunu Kapsamında Bilgi Talebi&quot; konulu e-postayı
                  <strong> kvkk@tamirhanem.com </strong> adresine gönderebilirsiniz.
                </p>
              </div>
              <div className="p-4 border-2 border-secondary-200 rounded-xl">
                <h3 className="font-semibold text-secondary-700 mb-2">Yazılı Başvuru</h3>
                <p className="text-secondary-600 text-sm">
                  Kimlik teyidi yapılarak şirket adresimize yazılı olarak başvurabilirsiniz.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-secondary-500">
              Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
              İşlemin ayrıca bir maliyet gerektirmesi halinde Kurul tarafından belirlenen
              tarife uygulanabilir.
            </p>
          </div>

          {/* Son Güncelleme */}
          <div className="pt-6 border-t border-secondary-100">
            <p className="text-sm text-secondary-500 text-center">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
