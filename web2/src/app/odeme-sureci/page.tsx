import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Lock,
  CheckCircle,
  Clock,
  CreditCard,
  ArrowRight,
  Bell,
  Users,
  Banknote,
  AlertTriangle,
} from 'lucide-react';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Güvenli Ödeme Sistemi | TamirHanem',
  description: 'TamirHanem güvenli ödeme sistemi yakında. Bloke-emanet sistemi ile hem müşteriler hem servisler için güvence. Bekleme listesine katılın.',
  keywords: [
    'güvenli ödeme',
    'emanet sistemi',
    'oto servis ödeme',
    'güvenli işlem',
  ],
  openGraph: {
    title: 'Güvenli Ödeme Sistemi | TamirHanem',
    description: 'Bloke-emanet sistemi ile güvenli araç servisi ödemesi.',
    url: 'https://tamirhanem.com/odeme-sureci',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/odeme-sureci',
  },
};

const paymentSteps = [
  {
    id: 1,
    title: 'Randevu ve Fiyat Onayı',
    description: 'Servis seçimi yapın, fiyat teklifini onaylayın ve randevunuzu oluşturun.',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    title: 'Güvenli Ödeme',
    description: 'Ödemeniz TamirHanem güvencesi altında bloke edilir. Servis ödemeyi görebilir ama çekemez.',
    icon: Lock,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    title: 'Servis İşlemi',
    description: 'Aracınız servise alınır ve işlem yapılır. Süreç boyunca bilgilendirilirsiniz.',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 4,
    title: 'Onay ve Ödeme Aktarımı',
    description: 'İşlemi onayladığınızda ödeme servise aktarılır. Memnun değilseniz itiraz hakkınız var.',
    icon: Banknote,
    color: 'bg-purple-100 text-purple-600',
  },
];

const guarantees = [
  {
    title: 'Para İadesi Garantisi',
    description: 'İş yapılmadıysa veya eksik yapıldıysa paranız iade edilir.',
    icon: Shield,
  },
  {
    title: '48 Saat İtiraz Süresi',
    description: 'İşlem tamamlandıktan sonra 48 saat içinde itiraz edebilirsiniz.',
    icon: Clock,
  },
  {
    title: 'Arabuluculuk Hizmeti',
    description: 'Anlaşmazlıklarda TamirHanem arabulucu olarak devreye girer.',
    icon: Users,
  },
];

export default function PaymentInfoPage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'Ödeme Süreci', url: 'https://tamirhanem.com/odeme-sureci' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white font-medium">Ödeme Süreci</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6">
              <Bell className="w-4 h-4" />
              Yakında
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Güvenli Ödeme Sistemi
            </h1>

            <p className="text-primary-100 text-lg mb-8">
              Bloke-emanet sistemi ile hem müşteriler hem servisler için tam güvence.
              Paranız işlem tamamlanana kadar güvende.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#nasil-calisir"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Nasıl Çalışır?
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white/70 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                <Bell className="w-5 h-5" />
                Bekleme Listesi (Yakında)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Bu özellik geliştirme aşamasındadır.</strong> Güvenli ödeme sistemi yakında
            aktif olacaktır. Şu an için servislerle doğrudan iletişime geçebilirsiniz.
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="nasil-calisir" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-800 text-center mb-4">
          Nasıl Çalışır?
        </h2>
        <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
          Bloke-emanet sistemi, ödemenizi işlem tamamlanana kadar güvende tutar.
          Her iki taraf için de adil bir süreç.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-secondary-200">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
          </div>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {paymentSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="relative">
                  {/* Step number for mobile */}
                  <div className="md:hidden flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.id}
                    </span>
                    <div className="flex-1 h-0.5 bg-secondary-200" />
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-xl shadow-card p-6 relative">
                    {/* Step indicator for desktop */}
                    <div className="hidden md:flex absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full items-center justify-center shadow-md border-4 border-primary-100">
                      <span className="font-bold text-primary-600 text-xl">{step.id}</span>
                    </div>

                    <div className="md:pt-8">
                      <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-secondary-800 mb-2">{step.title}</h3>
                      <p className="text-secondary-600 text-sm">{step.description}</p>
                    </div>
                  </div>

                  {/* Arrow for mobile */}
                  {index < paymentSteps.length - 1 && (
                    <div className="md:hidden flex justify-center my-3">
                      <ArrowRight className="w-5 h-5 text-secondary-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 text-center mb-4">
            Güvencelerimiz
          </h2>
          <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
            Her işlem TamirHanem garantisi altındadır. Memnun kalmazsanız yanınızdayız.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {guarantees.map((guarantee) => {
              const IconComponent = guarantee.icon;
              return (
                <div key={guarantee.title} className="bg-white rounded-xl p-6 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-secondary-800 mb-2">{guarantee.title}</h3>
                  <p className="text-secondary-600 text-sm">{guarantee.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Customers */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-800">Müşteriler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Ödemeniz işlem tamamlanana kadar güvende',
                'Memnun değilseniz itiraz hakkı',
                'Şeffaf fiyatlandırma, sürpriz yok',
                'Tüm işlemler kayıt altında',
                'TamirHanem arabuluculuk desteği',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Services */}
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Banknote className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-800">Servisler İçin</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Müşteri ödemesi garanti altında',
                'İşlem sonrası hızlı ödeme aktarımı',
                'Yeni müşteri kazanımı',
                'Güvenilir servis rozeti',
                'Düşük komisyon oranları',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Payment Methods Preview */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">
            Desteklenen Ödeme Yöntemleri
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Kredi Kartı', 'Banka Kartı', 'Havale/EFT', 'Mobil Ödeme'].map((method) => (
              <div
                key={method}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-secondary-400" />
                <span className="text-secondary-600 text-sm">{method}</span>
              </div>
            ))}
          </div>
          <p className="text-secondary-500 text-sm mt-4">
            Tüm ödemeler SSL ile şifrelenir ve güvenli altyapımızda işlenir.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Şimdilik Servislerle Doğrudan İletişime Geçin
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Güvenli ödeme sistemi hazır olana kadar, size en yakın güvenilir
            servisleri bulabilir ve doğrudan iletişime geçebilirsiniz.
          </p>
          <Link
            href="/servisler"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            Servis Bul
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
