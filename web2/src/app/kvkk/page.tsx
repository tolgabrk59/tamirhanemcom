import { Metadata } from 'next'
import {
  Shield,
  FileText,
  Clock,
  User,
  Database,
  Lock,
  Mail,
  Phone,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description:
    'TamirHanem 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.',
  alternates: {
    canonical: 'https://tamirhanem.com/kvkk',
  },
}

const personalDataCards = [
  {
    title: 'Kimlik Bilgileri',
    items: ['Ad, soyad', 'T.C. kimlik numarası (opsiyonel)'],
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    title: 'İletişim Bilgileri',
    items: ['Telefon numarası', 'E-posta adresi', 'Adres bilgileri'],
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Araç Bilgileri',
    items: ['Araç marka ve modeli', 'Plaka numarası', 'Şasi numarası', 'Kilometre bilgisi'],
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    title: 'İşlem Bilgileri',
    items: ['Servis geçmişi', 'OBD teşhis verileri', 'Ödeme bilgileri'],
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

const processingPurposes = [
  'Platformumuz üzerinden sunulan hizmetlerin sağlanması ve iyileştirilmesi',
  'Servis sağlayıcıları ile iletişimin kurulması ve randevu yönetimi',
  'Araç bakım ve onarım önerilerinin sunulması',
  'Yasal yükümlülüklerin yerine getirilmesi',
  'İstatistiksel analizler ve hizmet kalitesinin artırılması',
  'Açık rızanız olması halinde pazarlama faaliyetleri',
]

const retentionData = [
  { type: 'Kimlik ve İletişim Bilgileri', period: 'Son işlem tarihinden itibaren 3 yıl' },
  { type: 'Araç ve Servis Bilgileri', period: '5 yıl (garanti ve servis takibi)' },
  { type: 'Ödeme Bilgileri', period: '10 yıl (yasal zorunluluk)' },
  { type: 'Analitik Veriler', period: '26 ay' },
  { type: 'Pazarlama Verileri', period: 'Rızanın geri alınmasına kadar' },
]

const userRights = [
  'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
  'İşlenmişse buna ilişkin bilgi talep etme',
  'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
  'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
  'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
  'KVKK 7. maddesindeki şartlar çerçevesinde silinmesini isteme',
  'Düzeltme ve silme işlemlerinin bildirilmesini isteme',
  'Otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
  'Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
]

export default function KVKKPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            KVKK <span className="text-gold">Aydınlatma Metni</span>
          </h1>
          <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
            6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca,
            TamirHanem olarak kişisel verilerinizin güvenliğine önem veriyoruz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Veri Sorumlusu */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">1. Veri Sorumlusu</h2>
          </div>
          <p className="text-th-fg-sub leading-relaxed text-sm">
            Next AI Teknoloji Yazılım San. ve Tic. Ltd. Şti. (&quot;TamirHanem&quot; veya &quot;Şirket&quot;) olarak,
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla
            kişisel verilerinizi aşağıda açıklanan amaçlar doğrultusunda işlemekteyiz.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08]">
            <p className="text-th-fg font-medium text-sm mb-2">İletişim Bilgileri:</p>
            <div className="space-y-1.5 text-sm text-th-fg-sub">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                kvkk@tamirhanem.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                0850 302 72 64
              </p>
            </div>
          </div>
        </div>

        {/* 2. İşlenen Kişisel Veriler */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">2. İşlenen Kişisel Veriler</h2>
          </div>
          <p className="text-th-fg-sub text-sm mb-5">
            Platformumuzda aşağıdaki kişisel veriler işlenmektedir:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {personalDataCards.map((card) => (
              <div
                key={card.title}
                className={`p-4 rounded-xl ${card.bg} border ${card.border}`}
              >
                <h3 className={`font-semibold text-sm mb-2 ${card.color}`}>{card.title}</h3>
                <ul className="text-th-fg-sub text-xs space-y-1">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3. İşlenme Amaçları */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">3. Kişisel Verilerin İşlenme Amaçları</h2>
          </div>
          <ul className="space-y-3">
            {processingPurposes.map((purpose, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-th-fg-sub">{purpose}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Veri Saklama Süreleri */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">4. Veri Saklama Süreleri</h2>
          </div>
          <p className="text-th-fg-sub text-sm mb-4">
            Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca saklanmaktadır:
          </p>
          <div className="overflow-x-auto rounded-xl border border-th-border/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-th-overlay/[0.05]">
                  <th className="px-4 py-3 text-left font-semibold text-th-fg">Veri Türü</th>
                  <th className="px-4 py-3 text-left font-semibold text-th-fg">Saklama Süresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-th-border/[0.06]">
                {retentionData.map((row) => (
                  <tr key={row.type}>
                    <td className="px-4 py-3 text-th-fg-sub">{row.type}</td>
                    <td className="px-4 py-3 text-th-fg-sub">{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Haklar */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">5. KVKK Kapsamındaki Haklarınız</h2>
          </div>
          <p className="text-th-fg-sub text-sm mb-4">
            KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {userRights.map((right, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.06]"
              >
                <span className="text-brand-500 font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-th-fg-sub text-xs leading-relaxed">{right}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Başvuru Yöntemi */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-bold text-th-fg">6. Başvuru Yöntemi</h2>
          </div>
          <p className="text-th-fg-sub text-sm mb-4">
            Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border-2 border-brand-500/20 bg-brand-500/[0.03]">
              <h3 className="font-semibold text-brand-500 text-sm mb-2">E-posta ile Başvuru</h3>
              <p className="text-th-fg-sub text-xs leading-relaxed">
                &quot;Kişisel Verilerin Korunması Kanunu Kapsamında Bilgi Talebi&quot; konulu e-postayı
                <strong className="text-th-fg"> kvkk@tamirhanem.com </strong> adresine gönderebilirsiniz.
              </p>
            </div>
            <div className="p-4 rounded-xl border-2 border-th-border/[0.12] bg-th-overlay/[0.02]">
              <h3 className="font-semibold text-th-fg text-sm mb-2">Yazılı Başvuru</h3>
              <p className="text-th-fg-sub text-xs leading-relaxed">
                Kimlik teyidi yapılarak şirket adresimize yazılı olarak başvurabilirsiniz.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-th-fg-muted">
            Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
            İşlemin ayrıca bir maliyet gerektirmesi halinde Kurul tarafından belirlenen
            tarife uygulanabilir.
          </p>
        </div>

        {/* Son Güncelleme */}
        <div className="text-center py-4">
          <p className="text-xs text-th-fg-muted">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
    </div>
  )
}
