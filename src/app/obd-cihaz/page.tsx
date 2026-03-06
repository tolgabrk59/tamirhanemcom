import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Bluetooth, Search, Activity, ArrowRight, AlertTriangle, CheckCircle, Smartphone, Monitor, Globe, Gauge, Thermometer, Fuel, Zap, TrendingUp, Filter, Clock, Eye, Wifi } from 'lucide-react';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'OBD-II Cihaz Bağlantısı | Arıza Kodu Okuma ve Canlı Veri',
  description: 'OBD-II Bluetooth cihazınızı bağlayın, arıza kodlarını okuyun ve canlı motor verilerini izleyin. Referans aralığı dışındaki değerleri anında görün.',
  keywords: [
    'OBD-II bağlantı',
    'Bluetooth OBD',
    'arıza kodu okuma',
    'ELM327',
    'araç teşhis',
    'canlı veri',
    'motor verileri',
  ],
  openGraph: {
    title: 'OBD-II Cihaz Bağlantısı | TamirHanem',
    description: 'Aracınızdaki arıza kodlarını okuyun, canlı verileri izleyin ve anormal değerleri tespit edin.',
    url: 'https://tamirhanem.com/obd-cihaz',
  },
  alternates: {
    canonical: 'https://tamirhanem.com/obd-cihaz',
  },
};

// Client component for Bluetooth connection
const BluetoothConnector = dynamic(
  () => import('@/components/obd-device/BluetoothConnector'),
  { ssr: false }
);

// Client component for manual code search
const ManualCodeSearch = dynamic(
  () => import('@/components/obd-device/ManualCodeSearch'),
  { ssr: false }
);

// Client component for live data dashboard
const LiveDataDashboard = dynamic(
  () => import('@/components/obd-device/LiveDataDashboard'),
  { ssr: false }
);

// Client component for WiFi connection
const WifiConnector = dynamic(
  () => import('@/components/obd-device/WifiConnector'),
  { ssr: false }
);

export default function OBDDevicePage() {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tamirhanem.com' },
    { name: 'OBD Kodları', url: 'https://tamirhanem.com/obd' },
    { name: 'Cihaz Bağlantısı', url: 'https://tamirhanem.com/obd-cihaz' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(/hero_service_background.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/obd" className="hover:text-white transition-colors">OBD Kodları</Link>
            <span>/</span>
            <span className="text-white font-medium">Cihaz Bağlantısı</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-glow">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                OBD-II Cihaz Bağlantısı
              </h1>
              <p className="text-primary-200 text-sm mt-1">
                Aracınızdaki arıza kodlarını okuyun ve canlı verileri izleyin
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Bluetooth className="w-4 h-4" />
              Bluetooth Bağlantı
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-purple-400/30">
              <Wifi className="w-4 h-4" />
              WiFi Bağlantı
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-[10px]">YENİ</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <Gauge className="w-4 h-4" />
              Canlı Veri İzleme
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <AlertTriangle className="w-4 h-4" />
              Anormal Değer Uyarısı
            </span>
          </div>
        </div>
      </section>

      {/* Connection Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Type Tabs */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bluetooth Connection */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bluetooth className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-800">
                  Bluetooth Bağlantısı
                </h2>
                <p className="text-secondary-500 text-sm">
                  OBD-II cihazınızı bağlayın
                </p>
              </div>
            </div>

            <BluetoothConnector />

            {/* Browser Support Info */}
            <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
              <h3 className="font-semibold text-secondary-700 text-sm mb-2">
                Tarayıcı Desteği
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Monitor className="w-4 h-4 text-green-600" />
                  <span className="text-secondary-600">Chrome</span>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>
                <div className="flex items-center gap-1">
                  <Monitor className="w-4 h-4 text-green-600" />
                  <span className="text-secondary-600">Edge</span>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-red-600" />
                  <span className="text-secondary-600">Firefox</span>
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span className="text-secondary-600">Safari</span>
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                </div>
              </div>
            </div>

            {/* iPhone/iPad Users Info Box */}
            <div className="mt-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-start gap-3">
                {/* Apple Logo SVG */}
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-googletag61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    iPhone / iPad Kullanıcıları
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Çözüm</span>
                  </h3>
                  <p className="text-slate-300 text-xs mb-3">
                    Apple, Safari tarayıcısında Web Bluetooth API&apos;yi güvenlik gerekçesiyle desteklemiyor.
                    Ancak <strong className="text-white">Bluefy</strong> tarayıcısı ile bu kısıtlamayı aşabilirsiniz.
                  </p>

                  <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
                    <p className="text-slate-200 text-xs font-medium mb-2">Nasıl yapılır?</p>
                    <ol className="text-slate-300 text-xs space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                        <span>App Store&apos;dan <strong className="text-white">&quot;Bluefy&quot;</strong> uygulamasını indirin (ücretsiz)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                        <span>Bluefy tarayıcısı ile <strong className="text-white">tamirhanem.com/obd-cihaz</strong> adresini açın</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                        <span>Artık Bluetooth ile OBD cihazınıza bağlanabilirsiniz!</span>
                      </li>
                    </ol>
                  </div>

                  <a
                    href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    App Store&apos;da Aç
                  </a>

                  <p className="text-slate-500 text-[10px] mt-3">
                    * Bluefy, Web Bluetooth API destekleyen üçüncü parti bir iOS tarayıcısıdır.
                    TamirHanem ile bağlantısı yoktur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Search */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-800">
                  Manuel Kod Arama
                </h2>
                <p className="text-secondary-500 text-sm">
                  Arıza kodunu yazarak arayın
                </p>
              </div>
            </div>

            <ManualCodeSearch />
          </div>

          {/* WiFi Connection */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-secondary-800">
                    WiFi Bağlantısı
                  </h2>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">YENİ</span>
                </div>
                <p className="text-secondary-500 text-sm">
                  iPhone/iPad ile tam uyumlu
                </p>
              </div>
            </div>

            <WifiConnector />

            {/* iOS Highlight */}
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 text-sm">Neden WiFi OBD?</h4>
                  <ul className="mt-2 space-y-1 text-xs text-purple-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>iPhone/iPad&apos;de Safari ile çalışır</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Özel tarayıcı indirmeye gerek yok</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Daha stabil bağlantı</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Data Dashboard Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-secondary-800 via-secondary-900 to-secondary-800 rounded-2xl p-6 mb-6 border border-secondary-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow">
              <Activity className="w-6 h-6 text-secondary-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Canlı Veri Dashboard
              </h2>
              <p className="text-secondary-400 text-sm">
                Motor parametrelerini gerçek zamanlı izleyin
              </p>
            </div>
          </div>

          <p className="text-secondary-300 mb-6">
            OBD cihazınızdan veya demo modunda anlık motor verilerini izleyin.
            Referans aralığı dışındaki değerler otomatik olarak renk kodlarıyla uyarı verir.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-secondary-700/50 border border-secondary-600 rounded-xl p-4 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white text-sm">Gerçek Zamanlı</span>
              </div>
              <p className="text-secondary-400 text-xs">
                12 kritik motor parametresini anlık izleme
              </p>
            </div>
            <div className="bg-secondary-700/50 border border-secondary-600 rounded-xl p-4 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white text-sm">Akıllı Uyarılar</span>
              </div>
              <p className="text-secondary-400 text-xs">
                Normal, uyarı ve kritik değerler için renk kodlaması
              </p>
            </div>
            <div className="bg-secondary-700/50 border border-secondary-600 rounded-xl p-4 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white text-sm">Trend Analizi</span>
              </div>
              <p className="text-secondary-400 text-xs">
                Değerlerin artış/azalış yönünü gösterir
              </p>
            </div>
            <div className="bg-secondary-700/50 border border-secondary-600 rounded-xl p-4 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white text-sm">Filtreleme</span>
              </div>
              <p className="text-secondary-400 text-xs">
                Sadece anormal değerleri gösterme seçeneği
              </p>
            </div>
          </div>

          {/* Monitored Parameters */}
          <div className="bg-secondary-700/50 border border-secondary-600 rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary-400" />
              İzlenen Parametreler
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2 text-secondary-300">
                <Zap className="w-3 h-3 text-primary-500" />
                <span>Motor Yükü</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Thermometer className="w-3 h-3 text-primary-500" />
                <span>Soğutma Suyu Sıcaklığı</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Fuel className="w-3 h-3 text-primary-500" />
                <span>Yakıt Düzeltme (STFT/LTFT)</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Gauge className="w-3 h-3 text-primary-500" />
                <span>MAP/MAF Sensörleri</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Activity className="w-3 h-3 text-primary-500" />
                <span>Motor Devri (RPM)</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <TrendingUp className="w-3 h-3 text-primary-500" />
                <span>Araç Hızı</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Thermometer className="w-3 h-3 text-primary-500" />
                <span>Emme Havası Sıcaklığı</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-300">
                <Zap className="w-3 h-3 text-primary-500" />
                <span>Akü Voltajı</span>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-secondary-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-success-500 rounded-full"></span>
              <span className="text-secondary-300 text-xs">Normal Aralık</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-warning-500 rounded-full"></span>
              <span className="text-secondary-300 text-xs">Uyarı Aralığı</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-error-500 rounded-full"></span>
              <span className="text-secondary-300 text-xs">Kritik Aralık</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Clock className="w-3 h-3 text-primary-400" />
              <span className="text-secondary-300 text-xs">0.5s - 5s güncelleme aralığı</span>
            </div>
          </div>
        </div>

        {/* Live Data Dashboard Component */}
        <LiveDataDashboard />
      </section>

      {/* How It Works */}
      <section className="bg-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">
            Nasıl Çalışır?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bluetooth Method */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-blue-600" />
                Bluetooth Yöntemi
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span className="text-secondary-600 text-sm">OBD-II cihazını araca takın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span className="text-secondary-600 text-sm">Aracın kontağını açın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span className="text-secondary-600 text-sm">&quot;Cihaz Bağla&quot; butonuna tıklayın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <span className="text-secondary-600 text-sm">Arıza kodlarını okuyun</span>
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-xs text-secondary-500">
                  <strong>Uyumlu:</strong> Chrome, Edge (Android Chrome)
                </p>
              </div>
            </div>

            {/* WiFi Method */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-purple-600" />
                WiFi Yöntemi
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded">iOS</span>
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span className="text-secondary-600 text-sm">WiFi OBD cihazını araca takın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span className="text-secondary-600 text-sm">Telefon ayarlarından OBD WiFi ağına bağlanın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span className="text-secondary-600 text-sm">&quot;WiFi ile Bağlan&quot; butonuna tıklayın</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <span className="text-secondary-600 text-sm">Arıza kodlarını okuyun</span>
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-purple-700">
                  <strong>Uyumlu:</strong> Tüm tarayıcılar (iPhone/iPad dahil)
                </p>
              </div>
            </div>

            {/* Manual Method */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600" />
                Manuel Arama
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span className="text-secondary-600 text-sm">Arıza kodunu başka bir cihazla okuyun</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span className="text-secondary-600 text-sm">Kodu arama kutusuna yazın (P0420)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span className="text-secondary-600 text-sm">Detaylı bilgi ve çözümleri görün</span>
                </li>
              </ol>
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-xs text-secondary-500">
                  <strong>Uyumlu:</strong> Tüm cihaz ve tarayıcılar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible Devices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-secondary-800 mb-6">
          Uyumlu Cihazlar
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bluetooth Devices */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-secondary-800">Bluetooth Adaptörler</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">ELM327</p>
                <p className="text-xs text-secondary-500">Bluetooth v1.5/2.1</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">OBDLink</p>
                <p className="text-xs text-secondary-500">MX/LX/SX</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">Vgate</p>
                <p className="text-xs text-secondary-500">iCar Pro/2</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">Veepeak</p>
                <p className="text-xs text-secondary-500">OBDCheck BLE+</p>
              </div>
            </div>
          </div>

          {/* WiFi Devices */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-card p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-secondary-800">WiFi Adaptörler</h3>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded">iOS Uyumlu</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">ELM327 WiFi</p>
                <p className="text-xs text-secondary-500">192.168.0.10</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">OBDLink MX</p>
                <p className="text-xs text-secondary-500">WiFi Edition</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">Vgate iCar</p>
                <p className="text-xs text-secondary-500">WiFi Pro</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="font-semibold text-secondary-800 text-sm">Konnwei</p>
                <p className="text-xs text-secondary-500">KW902 WiFi</p>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-3">
              * WiFi adaptörler iPhone, iPad ve tüm tarayıcılarda çalışır.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Arıza Kodu Veritabanı
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Tüm OBD-II arıza kodlarının detaylı açıklamalarını, olası nedenlerini
            ve çözümlerini içeren kapsamlı veritabanımızı inceleyin.
          </p>
          <Link
            href="/obd"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
          >
            Arıza Kodlarını İncele
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
