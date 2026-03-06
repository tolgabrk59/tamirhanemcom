'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ObdCode } from '@/types';
import { CodeHistoryCompact } from '@/components/obd/CodeHistory';

export default function ObdPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ObdCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [popularCodes, setPopularCodes] = useState<ObdCode[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  // Fetch popular codes on mount
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch('/api/obd/popular');
        const data = await response.json();
        if (data.success && data.data) {
          setPopularCodes(data.data);
        }
      } catch (error) {
        console.error('Error fetching popular codes:', error);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchObd(searchQuery);
      } else {
        setResults([]);
        setTotal(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchObd = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/obd/search?q=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
        setTotal(data.count || data.data.length);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section - Modern Dark Theme */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(/hero_service_background.png)',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-primary-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-white">OBD Kodları</span>
          </nav>
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Arıza Kod Rehberi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              OBD-II Arıza Kodları
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Check Engine lambanız mı yandı? Arıza kodunuzu girin, sorunun ne olduğunu,
              olası nedenlerini ve tahmini tamir maliyetini öğrenin.
            </p>

            {/* Modern Search Box */}
            <div className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Arıza kodu girin (örn: P0300, P0420, P0171)"
                  className="w-full px-6 py-4 pr-12 rounded-xl text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-xl text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>

              {searchQuery && (
                <p className="mt-3 text-sm text-primary-200">
                  {total > 0 ? `${total} sonuç bulundu` : loading ? 'Aranıyor...' : 'Sonuç bulunamadı'}
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
                {/* Bluetooth OBD Cihaz Bağlantı Butonu */}
                <Link
                  href="/obd-cihaz"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#0082FC] hover:bg-[#006DD9] text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 border border-blue-400/30"
                >
                  {/* Bluetooth Logo */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                  </svg>
                  <span>Bluetooth OBD Cihazı Bağla</span>
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded text-xs">BETA</span>
                </Link>

                {/* Semptom Bazlı Arama Butonu */}
                <Link
                  href="/obd/semptom-ara"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/30 border border-red-400/30"
                >
                  {/* Stethoscope Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Semptom Bazlı Ara</span>
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded text-xs">YENİ</span>
                </Link>

                {/* Canlı Veri Dashboard Butonu */}
                <Link
                  href="/obd/canli-veri"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 border border-emerald-400/30"
                >
                  {/* Activity/Pulse Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Canlı Veri Rehberi</span>
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    141 PID
                  </span>
                </Link>
              </div>

              {/* Son Baktığınız Kodlar (LocalStorage) */}
              <div className="mt-6">
                <CodeHistoryCompact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBD Araçları Grid */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-secondary-800 mb-2">OBD Teşhis Araçları</h2>
            <p className="text-secondary-600">Arıza kodları ile ilgili tüm araçlarımız</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {/* Araç Bazlı Kod Geçmişi */}
            <Link
              href="/obd/arac-gecmisi"
              className="group bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-500 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-secondary-800 mb-1">Araç Bazlı Arızalar</h3>
              <p className="text-sm text-secondary-600">Marka ve modele göre sık görülen kodlar</p>
            </Link>

            {/* Kod Karşılaştırma */}
            <Link
              href="/obd/karsilastir"
              className="group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-500 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-secondary-800 mb-1">Kod Karşılaştır</h3>
              <p className="text-sm text-secondary-600">2-3 kodu yan yana incele</p>
            </Link>

            {/* Maliyet Hesaplama */}
            <Link
              href="/obd/maliyet-hesapla"
              className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 hover:shadow-lg hover:border-green-300 transition-all"
            >
              <div className="w-12 h-12 bg-green-100 group-hover:bg-green-500 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-secondary-800 mb-1">Maliyet Hesapla</h3>
              <p className="text-sm text-secondary-600">Şehir bazlı tamir maliyeti</p>
            </Link>

            {/* Teşhis Rehberi */}
            <Link
              href="/obd/teshis"
              className="group bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all"
            >
              <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-500 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <svg className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-secondary-800 mb-1">Teşhis Rehberi</h3>
              <p className="text-sm text-secondary-600">Adım adım arıza tespiti</p>
            </Link>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#454545' }}>OBD-II Nedir?</h3>
                <p className="text-secondary-600 text-sm">
                  1996'dan beri tüm araçlarda bulunan standart teşhis sistemidir. Motor ve emisyon sistemlerini izler.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#454545' }}>Kod Formatı</h3>
                <p className="text-secondary-600 text-sm">
                  Kodlar P, B, C veya U harfi ile başlar. P: Powertrain (motor), B: Body, C: Chassis, U: Network.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#454545' }}>Ne Zaman Servise?</h3>
                <p className="text-secondary-600 text-sm">
                  Yanıp sönen lamba acil durum, sabit yanan lamba yakın zamanda kontrol gerektirir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery && results.length > 0 ? (
            <div className="space-y-6">
              {results.map((obd) => (
                <ObdResultCard key={obd.id} obd={obd} />
              ))}
            </div>
          ) : searchQuery && !loading ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-secondary-600">
                "{searchQuery}" için sonuç bulunamadı. Lütfen farklı bir kod deneyin.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-secondary-900 mb-2">Popüler OBD Arıza Kodları</h3>
                <p className="text-secondary-600">
                  En sık karşılaşılan arıza kodlarını inceleyin veya yukarıdan arama yapın
                </p>
              </div>

              {loadingPopular ? (
                <div className="text-center py-8">
                  <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {popularCodes.map((obd) => (
                    <ObdResultCard key={obd.id} obd={obd} compact />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Arıza Kodunuzu Buldunuz mu?
          </h2>
          <p className="text-primary-100 mb-6">
            Uygun bir servise yönlendirelim mi? Hemen randevu alın ve aracınızı tamir ettirin.
          </p>
          <Link
            href="/randevu-al"
            className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Randevu Al
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ObdResultCard({ obd, compact = false }: { obd: ObdCode; compact?: boolean }) {
  const avgCost = obd.estimatedCostMin && obd.estimatedCostMax
    ? Math.round((obd.estimatedCostMin + obd.estimatedCostMax) / 2)
    : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-secondary-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-mono font-semibold text-lg">
              {obd.code}
            </span>
            {obd.severity && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${obd.severity === 'high' ? 'bg-red-100 text-red-700' :
                obd.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                {obd.severity === 'high' ? 'Yüksek' : obd.severity === 'medium' ? 'Orta' : 'Düşük'} Öncelik
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#454545' }}>
            {obd.title}
          </h3>
          {obd.category && (
            <span className="text-sm text-secondary-500">
              Kategori: {obd.category}
            </span>
          )}
        </div>

        {avgCost && (
          <div className="text-right">
            <div className="text-sm text-secondary-500 mb-1">Ortalama Maliyet</div>
            <div className="text-2xl font-bold text-primary-600">
              {avgCost.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-xs text-secondary-500">
              {obd.estimatedCostMin?.toLocaleString('tr-TR')} - {obd.estimatedCostMax?.toLocaleString('tr-TR')} ₺
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-secondary-700 mb-6 leading-relaxed">
        {obd.description}
      </p>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Symptoms */}
        {obd.symptoms && obd.symptoms.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#454545' }}>
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Belirtiler
            </h4>
            <ul className="space-y-2">
              {obd.symptoms.slice(0, 5).map((symptom, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-secondary-600">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Causes */}
        {obd.causes && obd.causes.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#454545' }}>
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Olası Nedenler
            </h4>
            <ul className="space-y-2">
              {obd.causes.slice(0, 5).map((cause, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-secondary-600">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Solutions */}
      {obd.fixes && obd.fixes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-secondary-100">
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#454545' }}>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Çözüm Önerileri
          </h4>
          <ul className="grid md:grid-cols-2 gap-2">
            {obd.fixes.map((fix, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-secondary-600">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {fix}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 pt-6 border-t border-secondary-100 flex justify-end">
        <Link
          href={`/obd/${obd.code.toLowerCase()}`}
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Detaylı Bilgi
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
