'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ObdCode } from '@/types';

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
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#454545' }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-white">OBD Kodları</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            OBD-II Arıza Kodları
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
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
                  <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>

            {searchQuery && (
              <p className="mt-3 text-sm text-gray-300">
                {total > 0 ? `${total} sonuç bulundu` : loading ? 'Aranıyor...' : 'Sonuç bulunamadı'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="text-xs text-secondary-400">
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
