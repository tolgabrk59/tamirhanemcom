import { Metadata } from 'next'
import {
  FileText,
  CheckCircle,
  Shield,
  Ban,
  DollarSign,
  AlertTriangle,
  Copyright,
  ExternalLink,
  RefreshCw,
  Gavel,
  Mail,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kullanim Sartlari',
  description:
    'TamirHanem web sitesi kullanim sartlari ve kosullari.',
  alternates: {
    canonical: 'https://tamirhanem.com/kullanim-sartlari',
  },
}

const sections = [
  {
    icon: CheckCircle,
    number: '1',
    title: 'Kabul',
    content:
      'tamirhanem.com web sitesini ("Site") kullanarak, bu Kullanim Sartlarini okudugunuzu, anladiginizi ve kabul ettiginizi beyan etmis olursunuz. Bu sartlari kabul etmiyorsaniz, Siteyi kullanmayiniz.',
  },
  {
    icon: FileText,
    number: '2',
    title: 'Hizmet Tanimi',
    content:
      'TamirHanem, arac sahiplerini oto servis ve bakim hizmeti saglayicilariyla bulusturan bir platformdur. Platformumuz araciligiyla:',
    items: [
      'Arac bakim ve tamir fiyatlarini karsilastirabilir',
      'Servisleri degerlendirebilir ve yorum yapabilir',
      'OBD ariza kodlarini sorgulayabilir',
      'Arac sorunlarini teshis edebilirsiniz',
    ],
  },
  {
    icon: Shield,
    number: '3',
    title: 'Kullanici Sorumluluklari',
    content: 'Site kullanicilari olarak:',
    items: [
      'Dogru ve guncel bilgi saglamakla',
      'Hesap guvenliginizi korumakla',
      'Yasalara ve bu sartlara uymakla',
      'Diger kullanicilara saygili davranmakla',
      'Fikri mulkiyet haklarina saygi gostermekle',
    ],
    footer: 'yukumlusunuz.',
  },
  {
    icon: Ban,
    number: '4',
    title: 'Yasaklanmis Kullanimlar',
    content: 'Asagidaki davranislar kesinlikle yasaktir:',
    items: [
      'Sahte veya yaniltici bilgi paylasma',
      'Zararli yazilim veya virus yayma',
      'Diger kullanicilari taciz etme',
      'Siteyi ticari amaclarla izinsiz kullanma',
      'Sistemi hackleme veya guvenlik onlemlerini asma',
    ],
  },
  {
    icon: DollarSign,
    number: '5',
    title: 'Fiyat Bilgileri',
    content:
      'Sitede gosterilen fiyatlar tahmini degerlerdir ve yalnizca bilgilendirme amaclidir. Gercek fiyatlar:',
    items: [
      'Arac markasi ve modeline',
      'Isin kapsamina',
      'Kullanilan parcalarin kalitesine',
      'Servisin konumuna',
    ],
    footer:
      'gore farklilik gosterebilir. Kesin fiyat icin mutlaka servislerden teklif aliniz.',
  },
  {
    icon: AlertTriangle,
    number: '6',
    title: 'Sorumluluk Reddi',
    paragraphs: [
      'TamirHanem, platformda listelenen servislerin kalitesi, guvenilirligi veya hizmetleri konusunda garanti vermez. Servislerle yapacaginiz anlasmalar sizinle ilgili servis arasindadir.',
      'Site iceriginin dogrulugu icin caba gosterilmekle birlikte, bilgilerin eksisiz veya guncel oldugu garanti edilmez.',
    ],
  },
  {
    icon: Copyright,
    number: '7',
    title: 'Fikri Mulkiyet',
    content:
      'Sitedeki tum icerik, tasarim, logo, grafik ve yazilimlar TamirHanem\'e veya lisans saglayicilarina aittir. Izinsiz kullanim yasaktir.',
  },
  {
    icon: ExternalLink,
    number: '8',
    title: 'Ucuncu Taraf Baglantilari',
    content:
      'Site, ucuncu taraf web sitelerine baglantilar icerebilir. Bu sitelerin iceriginden veya gizlilik politikalarindan sorumlu degiliz.',
  },
  {
    icon: RefreshCw,
    number: '9',
    title: 'Degisiklikler',
    content:
      'Bu Kullanim Sartlarini herhangi bir zamanda degistirme hakkini sakli tutariz. Degisiklikler sitede yayinlandigi anda yururluge girer.',
  },
  {
    icon: Gavel,
    number: '10',
    title: 'Uygulanacak Hukuk',
    content:
      'Bu sartlar Turkiye Cumhuriyeti yasalarina tabidir. Uyusmazliklarda Istanbul Mahkemeleri yetkilidir.',
  },
  {
    icon: Mail,
    number: '11',
    title: 'Iletisim',
    content: 'Kullanim sartlari hakkinda sorulariniz icin:',
    contactItems: [{ label: 'E-posta', value: 'info@tamirhanem.com' }],
  },
]

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
            Kullanim <span className="text-brand-500">Sartlari</span>
          </h1>
          <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
            TamirHanem web sitesi kullanim kosullari ve sartlari.
          </p>
          <p className="text-th-fg-muted text-sm mt-3">
            Son guncelleme: 15 Aralik 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.number} className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-brand-500" />
                <h2 className="text-xl font-display font-bold text-th-fg">
                  {section.number}. {section.title}
                </h2>
              </div>

              {section.content && (
                <p className="text-th-fg-sub leading-relaxed text-sm mb-4">
                  {section.content}
                </p>
              )}

              {section.paragraphs &&
                section.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-th-fg-sub leading-relaxed text-sm mb-3"
                  >
                    {p}
                  </p>
                ))}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-th-fg-sub">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-th-fg-sub text-sm mt-3">{section.footer}</p>
              )}

              {section.contactItems && (
                <div className="mt-2 p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08]">
                  <div className="space-y-1.5 text-sm text-th-fg-sub">
                    {section.contactItems.map((ci) => (
                      <p key={ci.label} className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-500" />
                        <span className="font-medium text-th-fg">
                          {ci.label}:
                        </span>{' '}
                        {ci.value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Company Footer */}
        <div className="glass-card p-6 md:p-8">
          <p className="text-th-fg-muted text-sm">
            <strong className="text-th-fg">
              Next AI Teknoloji Yazilim San. ve Tic.Ltd.Sti
            </strong>
            <br />
            TamirHanem markasi sahibidir.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center py-4">
          <p className="text-xs text-th-fg-muted">
            Son guncelleme:{' '}
            {new Date().toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </section>
    </div>
  )
}
