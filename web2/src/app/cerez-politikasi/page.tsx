'use client';

import { useState } from 'react';
import { Cookie, Shield, Settings, BarChart, Target, User, ChevronDown, ChevronUp } from 'lucide-react';
import { CONSENT_CATEGORIES, DATA_RETENTION_INFO } from '@/lib/consent';
import ConsentManager from '@/components/consent/ConsentManager';

export default function CerezPolitikasiPage() {
  const [showConsentManager, setShowConsentManager] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Cookie className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Çerez Politikası
              </h1>
              <p className="text-white/80 mt-1">
                Çerezler ve gizlilik hakkında bilmeniz gerekenler
              </p>
            </div>
          </div>
          <p className="text-white/90 text-lg">
            TamirHanem olarak, sitemizi kullanırken en iyi deneyimi sunmak için çerezler kullanıyoruz.
            Bu sayfa, hangi çerezleri kullandığımızı ve bunları nasıl yönetebileceğinizi açıklar.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowConsentManager(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5" />
            Çerez Tercihlerimi Yönet
          </button>
          <a
            href="/kvkk"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-secondary-300 hover:border-primary-500 text-secondary-700 hover:text-primary-600 font-semibold rounded-xl transition-colors"
          >
            <Shield className="w-5 h-5" />
            KVKK Aydınlatma Metni
          </a>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">

          {/* Çerez Nedir */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('nedir')}
              className="w-full px-6 py-4 flex items-center justify-between bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Cookie className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold text-secondary-800">Çerez Nedir?</h2>
              </div>
              {expandedSection === 'nedir' ? (
                <ChevronUp className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            {expandedSection === 'nedir' && (
              <div className="px-6 py-4">
                <p className="text-secondary-600 leading-relaxed mb-4">
                  Çerezler (cookies), web sitelerinin cihazınıza (bilgisayar, tablet veya telefon)
                  yerleştirdiği küçük metin dosyalarıdır. Bu dosyalar, siteyi ziyaret ettiğinizde
                  tercihlerinizi hatırlamak, size kişiselleştirilmiş deneyim sunmak ve site
                  performansını analiz etmek için kullanılır.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-2">Birinci Taraf Çerezler</h3>
                    <p className="text-green-700 text-sm">
                      Doğrudan TamirHanem tarafından oluşturulan ve yönetilen çerezlerdir.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-800 mb-2">Üçüncü Taraf Çerezler</h3>
                    <p className="text-blue-700 text-sm">
                      Google Analytics gibi hizmet sağlayıcıları tarafından oluşturulan çerezlerdir.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Çerez Kategorileri */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('kategoriler')}
              className="w-full px-6 py-4 flex items-center justify-between bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold text-secondary-800">Çerez Kategorileri</h2>
              </div>
              {expandedSection === 'kategoriler' ? (
                <ChevronUp className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            {expandedSection === 'kategoriler' && (
              <div className="px-6 py-4 space-y-4">
                {CONSENT_CATEGORIES.map((category, index) => {
                  const icons = [Shield, BarChart, Target, User];
                  const colors = ['green', 'blue', 'purple', 'orange'];
                  const Icon = icons[index];
                  const color = colors[index];

                  return (
                    <div
                      key={category.id}
                      className={`p-4 bg-${color}-50 rounded-xl border-2 border-${color}-100`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                        <h3 className={`font-semibold text-${color}-800`}>
                          {category.name}
                          {category.required && (
                            <span className="ml-2 text-xs bg-secondary-200 text-secondary-600 px-2 py-0.5 rounded-full">
                              Zorunlu
                            </span>
                          )}
                        </h3>
                      </div>
                      <p className={`text-${color}-700 text-sm mb-3`}>{category.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.cookies.map((cookie) => (
                          <code
                            key={cookie}
                            className="text-xs bg-white/80 px-2 py-1 rounded border border-secondary-200"
                          >
                            {cookie}
                          </code>
                        ))}
                      </div>
                      <p className={`text-${color}-600 text-xs mt-2`}>
                        Saklama süresi: {category.retentionPeriod}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Çerezleri Nasıl Yönetirim */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('yonetim')}
              className="w-full px-6 py-4 flex items-center justify-between bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-secondary-500" />
                <h2 className="text-xl font-bold text-secondary-800">Çerezleri Nasıl Yönetirim?</h2>
              </div>
              {expandedSection === 'yonetim' ? (
                <ChevronUp className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            {expandedSection === 'yonetim' && (
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-xl">
                    <h3 className="font-semibold text-primary-800 mb-2">1. TamirHanem Tercih Paneli</h3>
                    <p className="text-primary-700 text-sm mb-3">
                      Sayfanın üst kısmındaki &quot;Çerez Tercihlerimi Yönet&quot; butonuna tıklayarak
                      tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
                    </p>
                    <button
                      onClick={() => setShowConsentManager(true)}
                      className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Tercihleri Aç
                    </button>
                  </div>

                  <div className="p-4 bg-secondary-50 rounded-xl">
                    <h3 className="font-semibold text-secondary-800 mb-2">2. Tarayıcı Ayarları</h3>
                    <p className="text-secondary-600 text-sm mb-3">
                      Tarayıcınızın ayarlarından çerezleri yönetebilirsiniz:
                    </p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        → Chrome çerez ayarları
                      </a>
                      <a href="https://support.mozilla.org/tr/kb/cerezler" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        → Firefox çerez ayarları
                      </a>
                      <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        → Safari çerez ayarları
                      </a>
                      <a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-tanımlama-bilgilerini-silme" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        → Edge çerez ayarları
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl">
                    <h3 className="font-semibold text-amber-800 mb-2">Uyarı</h3>
                    <p className="text-amber-700 text-sm">
                      Zorunlu çerezleri devre dışı bırakırsanız, sitemizin bazı özellikleri
                      düzgün çalışmayabilir. Örneğin, oturum bilgileriniz kaydedilemez veya
                      tercihleriniz hatırlanmaz.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saklama Süreleri */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('sureler')}
              className="w-full px-6 py-4 flex items-center justify-between bg-secondary-50 hover:bg-secondary-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-secondary-800">Veri Saklama Süreleri</h2>
              </div>
              {expandedSection === 'sureler' ? (
                <ChevronUp className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            {expandedSection === 'sureler' && (
              <div className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary-100">
                        <th className="px-4 py-3 text-left font-semibold text-secondary-700">Veri Türü</th>
                        <th className="px-4 py-3 text-left font-semibold text-secondary-700">Saklama Süresi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                      {Object.entries(DATA_RETENTION_INFO).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-4 py-3 text-secondary-600">
                            {key === 'personalData' && 'Kişisel Veriler'}
                            {key === 'analyticsData' && 'Analitik Veriler'}
                            {key === 'marketingData' && 'Pazarlama Verileri'}
                            {key === 'vehicleData' && 'Araç Verileri'}
                            {key === 'communicationLogs' && 'İletişim Kayıtları'}
                          </td>
                          <td className="px-4 py-3 text-secondary-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* İletişim */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-secondary-800 mb-4">İletişim</h2>
            <p className="text-secondary-600 mb-4">
              Çerez politikamız veya kişisel verilerinizin işlenmesi hakkında sorularınız için
              bizimle iletişime geçebilirsiniz:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:kvkk@tamirhanem.com"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <Shield className="w-5 h-5" />
                kvkk@tamirhanem.com
              </a>
            </div>
          </div>

          {/* Son Güncelleme */}
          <p className="text-sm text-secondary-500 text-center">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Consent Manager Modal */}
      {showConsentManager && (
        <ConsentManager onClose={() => setShowConsentManager(false)} />
      )}
    </div>
  );
}
