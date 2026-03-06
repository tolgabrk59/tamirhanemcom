import { Metadata } from 'next'
import {
  Shield,
  Eye,
  Database,
  Share2,
  Cookie,
  Lock,
  Scale,
  Mail,
  RefreshCw,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gizlilik Politikasi',
  description:
    'TamirHanem gizlilik politikasi. Kisisel verilerinizin nasil toplandigi, kullanildigi ve korundugu hakkinda bilgi.',
  alternates: {
    canonical: 'https://tamirhanem.com/gizlilik',
  },
}

const sections = [
  {
    icon: Eye,
    number: '1',
    title: 'Giris',
    content:
      'TamirHanem ("biz", "bize" veya "bizim") olarak, gizliliginize saygi duyuyor ve kisisel verilerinizi korumayi taahhut ediyoruz. Bu Gizlilik Politikasi, tamirhanem.com web sitesini ("Site") kullanirken hangi bilgileri topladigimizi, nasil kullandigimizi ve korudugumuzun aciklanmaktadir.',
  },
  {
    icon: Database,
    number: '2',
    title: 'Topladigimiz Bilgiler',
    subsections: [
      {
        subtitle: '2.1 Otomatik Olarak Toplanan Bilgiler',
        items: [
          'IP adresi',
          'Tarayici turu ve surumu',
          'Cihaz bilgileri',
          'Erisim zamani ve tarihi',
          'Ziyaret edilen sayfalar',
        ],
      },
      {
        subtitle: '2.2 Sizin Tarafinizdan Saglanan Bilgiler',
        items: [
          'Iletisim formlarinda girilen ad, e-posta adresi',
          'Arac bilgileri (marka, model, yil)',
          'Servis randevu talepleri',
          'Yorum ve degerlendirmeler',
        ],
      },
    ],
  },
  {
    icon: Shield,
    number: '3',
    title: 'Bilgilerin Kullanimi',
    content: 'Topladigimiz bilgileri su amaclarla kullaniyoruz:',
    items: [
      'Hizmetlerimizi sunmak ve gelistirmek',
      'Kullanici deneyimini iyilestirmek',
      'Iletisim taleplerinize yanit vermek',
      'Guvenlik ve dolandiricilik onleme',
      'Yasal yukumluluklerimizi yerine getirmek',
    ],
  },
  {
    icon: Share2,
    number: '4',
    title: 'Bilgi Paylasimi',
    content:
      'Kisisel bilgilerinizi ucuncu taraflarla satmiyoruz. Bilgilerinizi yalnizca su durumlarda paylasabiliriz:',
    items: [
      'Yasal zorunluluk durumlarinda',
      'Servis saglayicilarla (hizmet sunumu icin)',
      'Acik onayiniz ile',
    ],
  },
  {
    icon: Cookie,
    number: '5',
    title: 'Cerezler (Cookies)',
    content:
      'Sitemiz, kullanici deneyimini iyilestirmek icin cerezler kullanmaktadir. Tarayici ayarlarinizdan cerezleri devre disi birakabilirsiniz; ancak bu, bazi site ozelliklerinin calismamisina neden olabilir.',
  },
  {
    icon: Lock,
    number: '6',
    title: 'Veri Guvenligi',
    content:
      'Verilerinizi korumak icin endustri standardi guvenlik onlemleri kullaniyoruz. Ancak, internet uzerinden hicbir veri iletiminin %100 guvenli olmadigini hatirlatmak isteriz.',
  },
  {
    icon: Scale,
    number: '7',
    title: 'Haklariniz',
    content: 'KVKK kapsaminda su haklara sahipsiniz:',
    items: [
      'Kisisel verilerinizin islenip islenmedigini ogrenme',
      'Islenmisse ilgili bilgileri talep etme',
      'Islenme amacini ve amaca uygun kullanilip kullanilmadigini ogrenme',
      'Yurt ici veya yurt disinda aktarildigi ucuncu kisileri bilme',
      'Eksik veya yanlis islenmis verilerin duzeltilmesini isteme',
      'Silinmesini veya yok edilmesini isteme',
    ],
  },
  {
    icon: Mail,
    number: '8',
    title: 'Iletisim',
    content:
      'Gizlilik politikamiz hakkinda sorulariniz varsa, bizimle iletisime gecebilirsiniz:',
    contactItems: [
      { label: 'E-posta', value: 'info@tamirhanem.com' },
      { label: 'Adres', value: 'Tekirdag, Turkiye' },
    ],
  },
  {
    icon: RefreshCw,
    number: '9',
    title: 'Degisiklikler',
    content:
      'Bu gizlilik politikasini zaman zaman guncelleyebiliriz. Onemli degisiklikler olmasi durumunda sizi bilgilendirecegiz.',
  },
]

export default function GizlilikPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
            Gizlilik <span className="text-brand-500">Politikasi</span>
          </h1>
          <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
            Kisisel verilerinizin nasil toplandigi, kullanildigi ve korundugu
            hakkinda detayli bilgi.
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

              {section.subsections &&
                section.subsections.map((sub) => (
                  <div key={sub.subtitle} className="mb-4">
                    <h3 className="text-sm font-semibold text-th-fg mb-2">
                      {sub.subtitle}
                    </h3>
                    <ul className="space-y-1.5">
                      {sub.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-th-fg-sub"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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
