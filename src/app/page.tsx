import Link from 'next/link';
import Image from 'next/image';
import FixedSearchBar from '@/components/FixedSearchBar';
import ServiceTimeline from '@/components/ServiceTimeline';
import AiIssueAnalyzer from '@/components/AiIssueAnalyzer';
import HeroImage from '@/components/HeroImage';
import RotatingText from '@/components/RotatingText';
import CategoryCard from '@/components/CategoryCard';
import ProblemsByModel from '@/components/ProblemsByModel';
import ObdInfoSection from '@/components/ObdInfoSection';
import CostEstimator from '@/components/CostEstimator';
import ReviewsSection from '@/components/Reviews';
import FAQSection from '@/components/FAQ';
import WaitlistModal from '@/components/WaitlistModal';
import SmartAppBanner from '@/components/SmartAppBanner';
import BusinessDashboard from '@/components/BusinessDashboard';
import CarBrandLogosWrapper from '@/components/CarBrandLogosWrapper';
import ScrollCarCategories from '@/components/ScrollCarCategories';
import ServiceCategoriesMarquee from '@/components/hero/ServiceCategoriesMarquee';
import { categoriesData } from '@/data/categories';
import type { Category } from '@/types';




const STRAPI_API = 'https://api.tamirhanem.net/api';

// Türkçe karakterleri slug'a çevir
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Dynamic data fetching from Strapi
async function getCategoriesData(): Promise<Category[]> {
  try {
    const response = await fetch(`${STRAPI_API}/categories?pagination[pageSize]=50&sort=name:asc`, {
      next: { revalidate: 3600 } // 1 saat cache
    });

    if (response.ok) {
      const json = await response.json();
      const items = json.data || [];
      
      if (items.length > 0) {
        return items.map((item: any) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            name: attrs.name,
            title: attrs.name,
            description: attrs.description || '',
            slug: slugify(attrs.name)
          };
        }) as Category[];
      }
    }
  } catch (error) {
    console.error('Failed to fetch categories from Strapi:', error);
  }
  // Fallback to local data
  return categoriesData;
}


export default async function HomePage() {
  const categories = await getCategoriesData();

  return (
    <>
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center bg-secondary-900 overflow-hidden">
        {/* Service Timeline - Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <ServiceTimeline />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl"></div>

        {/* Mobile Hero Background Image */}
        <div
          className="lg:hidden absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/hero-mechanic-final.png)',
            backgroundPosition: 'right 20%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '85%',
          }}
        />

        {/* Car Brand Logos Animation */}
        <CarBrandLogosWrapper />

        {/* Vertical CTA Text - Next to sidebar */}
        <div className="hidden lg:flex fixed left-20 top-0 pt-4 z-30">
          <span 
            className="text-primary-400 text-xs tracking-widest font-medium"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Hemen İhtiyacınıza Uygun Servisi Aramaya Başlayın
          </span>
        </div>

        <div className="relative w-full max-w-7xl ml-0 lg:ml-8 xl:ml-16 mr-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-40 pb-8 md:pb-12">

          <div className="lg:max-w-[45%]">
            {/* Left Side - Content & Features */}
            <div>
              {/* Typewriter Kategori Yazısı - Badge'in üstünde */}
              <div className="-mt-24 mb-6">
                <ServiceCategoriesMarquee />
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                Aracınız İçin
                <br />
                <RotatingText />
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Servis bul, fiyat karşılaştır, arıza tespit et, bakım takibi yap.
                Tüm araç ihtiyaçlarınız için <strong className="text-white">TamirHanem</strong>.
              </p>

              {/* AI Issue Analyzer */}
              <AiIssueAnalyzer />

              {/* App Store Badges - Desktop */}
              <div className="hidden lg:block mt-6">
                <p className="text-primary-400 text-xs font-semibold mb-2 tracking-wider">YAKINDA</p>
                <div className="flex items-center gap-3">
                  {/* App Store */}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] text-white/60 leading-none">Download on the</p>
                      <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                    </div>
                  </div>

                  {/* Google Play */}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] text-white/60 leading-none">GET IT ON</p>
                      <p className="text-sm font-semibold text-white leading-tight">Google Play</p>
                    </div>
                  </div>

                  {/* AppGallery */}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] text-white/60 leading-none">EXPLORE IT ON</p>
                      <p className="text-sm font-semibold text-white leading-tight">AppGallery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Hero Image - Ekranın sağ alt köşesinde */}
        <HeroImage />

      </section>

      {/* Scroll Animated Categories Section */}
      <ScrollCarCategories />

      {/* Features Section - Light Theme */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1 w-8 bg-primary-500 rounded-full"></span>
              <span className="text-primary-600 font-bold tracking-widest uppercase text-xs">Araç Rehberi</span>
              <span className="h-1 w-8 bg-primary-500 rounded-full"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">
              Tüm araç ihtiyaçlarınız için tek yer.
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Aracınızı bakımda tutma, sorunları giderme ve daha fazlası için yardım alın.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Geri Çağırmalar */}
            <Link href="/geri-cagrima" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Geri Çağırmalar</h3>
                  <p className="text-sm text-secondary-600">Aracınızın geri çağırma durumunu kontrol edin</p>
                </div>
              </div>
            </Link>

            {/* Yaygın Problemler */}
            <Link href="/#yaygin-problemler" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Yaygın Problemler</h3>
                  <p className="text-sm text-secondary-600">Araç modelinize özel sorunları keşfedin</p>
                </div>
              </div>
            </Link>

            {/* Lastikler */}
            <Link href="/lastikler" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <circle cx="12" cy="12" r="5" strokeWidth={2} />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Lastikler</h3>
                  <p className="text-sm text-secondary-600">Lastik seçimi ve bakım rehberi</p>
                </div>
              </div>
            </Link>

            {/* Güvenilirlik */}
            <Link href="/guvenilirlik" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Güvenilirlik</h3>
                  <p className="text-sm text-secondary-600">Araç modellerinin güvenilirlik puanları</p>
                </div>
              </div>
            </Link>

            {/* Belirti Rehberi */}
            <Link href="/belirtiler" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Belirti Rehberi</h3>
                  <p className="text-sm text-secondary-600">Araç sorunlarını belirtilerden tanıyın</p>
                </div>
              </div>
            </Link>

            {/* Bakım Takvimi */}
            <Link href="/bakim-takvimi" className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">Bakım Takvimi</h3>
                  <p className="text-sm text-secondary-600">Periyodik bakım zamanlarını takip edin</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Araç Bakımını Kolaylaştıran Özellikler
            </h2>
            <p className="text-secondary-800 max-w-2xl mx-auto">
              TamirHanem ile araç bakımı artık çok daha kolay, güvenli ve şeffaf
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Güvenli Ödeme Sistemi */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Güvenli Ödeme Sistemi</h3>
              <p className="text-secondary-600">
                Ödemeniz işlem tamamlanana kadar havuzda tutulur. Siz onaylamadan servis ücretini alamaz.
              </p>
            </div>

            {/* Dijital Bakım Karnesi */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Dijital Bakım Karnesi</h3>
              <p className="text-secondary-600">
                Tüm servis işlemleri otomatik kaydedilir. Aracınızı satarken geçmişi belgeleyebilirsiniz.
              </p>
            </div>

            {/* Vale Hizmeti */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Vale Hizmeti</h3>
              <p className="text-secondary-600">
                Aracınızı bulunduğunuz adresten teslim alır, bakım sonrası geri getiririz.
              </p>
            </div>

            {/* Acil Yol Yardım */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Acil Yol Yardım</h3>
              <p className="text-secondary-600">
                Yolda kaldığınızda konum paylaşın, en yakın çekici veya mobil tamirci size ulaşsın.
              </p>
            </div>

            {/* Özel Kampanyalar */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Özel Kampanyalar</h3>
              <p className="text-secondary-600">
                Bakım, lastik ve temizlik hizmetlerinde platforma özel indirimlerden yararlanın.
              </p>
            </div>

            {/* Misafir Erişimi */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-secondary-100 group hover:border-primary-300">
              <div className="w-14 h-14 bg-secondary-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Misafir Erişimi</h3>
              <p className="text-secondary-600">
                Kayıt olmadan servisleri inceleyin, fiyatları karşılaştırın, sonra karar verin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Problems Section */}
      <div className="bg-secondary-50">
        <ProblemsByModel />
      </div>

      {/* OBD Info Section */}
      <ObdInfoSection />

      {/* Trust Badges Section */}
      <section className="py-12 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* KVKK Uyumlu */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">KVKK Uyumlu</h4>
                <p className="text-sm text-secondary-400">Verileriniz güvende</p>
              </div>
            </div>

            {/* Güvenli Ödeme */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Güvenli Ödeme</h4>
                <p className="text-sm text-secondary-400">256-bit SSL şifreleme</p>
              </div>
            </div>

            {/* Şeffaf Takip */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-secondary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Şeffaf Takip</h4>
                <p className="text-sm text-secondary-400">Her adımda bilgilendirilirsiniz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Estimator CTA Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Tamir Maliyetini Önceden Öğrenin
              </h2>
              <p className="text-secondary-300 mb-6 leading-relaxed">
                Aracınızın markası, modeli ve yapılacak işleme göre tahmini maliyet hesaplayın.
                Servis fiyatlarını karşılaştırın ve bütçenize en uygun seçeneği bulun.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>İşçilik ve parça maliyeti ayrı ayrı</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Marka bazlı fiyat karşılaştırma</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tahmini işlem süresi</span>
                </li>
              </ul>

              <Link
                href="/fiyat-hesapla"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Fiyat Hesapla
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="space-y-4">
                {/* Sample cost breakdown */}
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Fren Balata Değişimi</span>
                    <span className="text-primary-300">600 - 1.800 TL</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-primary-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Yağ + Filtre Değişimi</span>
                    <span className="text-primary-300">800 - 2.500 TL</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-primary-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Triger Kayışı</span>
                    <span className="text-primary-300">2.500 - 6.000 TL</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-primary-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Debriyaj Seti</span>
                    <span className="text-primary-300">3.000 - 8.000 TL</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-primary-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TamirHanem Onaylı Section */}
      <section className="py-16 bg-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-100 rounded-full px-6 py-2 mb-4">
              <span className="text-primary-700 font-bold text-sm">✓ TamirHanem Onaylı</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-800">
              Herkes İçin Avantajlı
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              TamirHanem, hem araç sahiplerine hem de servis işletmelerine değer katıyor. Platformumuza katılın, avantajlardan yararlanın.
            </p>
          </div>

          {/* Two Column Benefits */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Araç Sahipleri İçin */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-800">Araç Sahipleri</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Güvenli Ödeme Sistemi</p>
                    <p className="text-sm text-secondary-600">Paranız işlem tamamlanana kadar güvende</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Fiyat Karşılaştırma</p>
                    <p className="text-sm text-secondary-600">Birden fazla servisten teklif alın</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Dijital Bakım Karnesi</p>
                    <p className="text-sm text-secondary-600">Tüm servis geçmişiniz kayıt altında</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">7/24 Yol Yardım</p>
                    <p className="text-sm text-secondary-600">Acil durumlarda anında destek</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-secondary-100">
                <a href="https://tamirhanem.net/register.html" className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-xl font-bold transition-colors">
                  Ücretsiz Kayıt Ol
                </a>
              </div>
            </div>

            {/* Servis İşletmeleri İçin */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-800">Servis İşletmeleri</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Yeni Müşteriler</p>
                    <p className="text-sm text-secondary-600">Binlerce araç sahibine ulaşın</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Dijital Randevu Sistemi</p>
                    <p className="text-sm text-secondary-600">Online randevu yönetimi</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Hızlı Tahsilat</p>
                    <p className="text-sm text-secondary-600">Güvenli ödeme altyapısı</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-secondary-900">Ücretsiz Kayıt</p>
                    <p className="text-sm text-secondary-600">Başlangıç ücreti yok</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-secondary-100">
                <a href="https://tamirhanem.net/register.html" className="block w-full bg-secondary-800 hover:bg-secondary-900 text-white text-center py-3 rounded-xl font-bold transition-colors">
                  İşletme Başvurusu
                </a>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-3 text-secondary-800">
              TamirHanem Ailesine Katılın
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              İster araç sahibi olun ister servis işletmesi, TamirHanem ile otomotiv dünyasını daha kolay ve güvenilir hale getiriyoruz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://tamirhanem.net/register.html" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Araç Sahibi Olarak Başla
              </a>
              <a href="https://tamirhanem.net/register.html" className="inline-flex items-center gap-2 bg-secondary-800 hover:bg-secondary-900 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Servis Olarak Katıl
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Business Panel Section */}
      <section className="py-20 bg-secondary-900 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold">Servis İşletmeleri İçin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Dijital İşletme Paneli
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Müşteri bulma, randevu yönetimi ve tahsilat süreçlerinizi tek panelden yönetin.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[2fr_3fr] gap-12 items-start">
            {/* Left Side - Informative Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">İşletmenizi Dijitalleştirin</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  TamirHanem İşletme Paneli ile servis işletmenizi dijital dünyaya taşıyın.
                  Müşteri yönetiminden finansal raporlamaya kadar tüm süreçlerinizi tek platformdan yönetin.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Online Randevu Yönetimi</h4>
                    <p className="text-sm text-white/60">Dijital takvim ile randevuları planlayın, müşterilerinize otomatik hatırlatma gönderin</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Müşteri İlişkileri Yönetimi</h4>
                    <p className="text-sm text-white/60">Müşteri geçmişini takip edin, özel kampanyalar oluşturun, sadakat programları yönetin</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Finansal Raporlama</h4>
                    <p className="text-sm text-white/60">Gelir-gider takibi, detaylı raporlar, karlılık analizi ve tahsilat yönetimi</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stok ve Parça Yönetimi</h4>
                    <p className="text-sm text-white/60">Yedek parça stoklarını takip edin, otomatik sipariş bildirimleri alın</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Dashboard */}
            <div>
              <BusinessDashboard />
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a
              href="https://tamirhanem.net/register.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              İşletme Başvurusu Yap
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Waitlist Modal */}
      <WaitlistModal />

      {/* Smart App Banner - Shows based on device */}
      <SmartAppBanner />

      {/* Fixed Bottom Search Bar */}
      <FixedSearchBar />

      {/* Bottom padding for fixed search bar and app banner */}
      <div className="h-20 md:h-16"></div>
    </>
  );
}
