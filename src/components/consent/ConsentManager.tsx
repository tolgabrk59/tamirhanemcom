'use client';

import { useState, useEffect } from 'react';
import { X, Shield, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import {
  CONSENT_CATEGORIES,
  DATA_RETENTION_INFO,
  getStoredConsent,
  saveConsent,
  getDefaultConsent,
} from '@/lib/consent';
import { ConsentPreferences } from '@/types';

interface ConsentManagerProps {
  onClose: () => void;
}

export default function ConsentManager({ onClose }: ConsentManagerProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(getDefaultConsent());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showRetentionInfo, setShowRetentionInfo] = useState(false);

  useEffect(() => {
    // Mevcut tercihleri yükle
    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored);
    }
  }, []);

  const handleToggle = (categoryId: 'analytics' | 'marketing' | 'personalization') => {
    setPreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSave = () => {
    saveConsent(preferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted = saveConsent({
      analytics: true,
      marketing: true,
      personalization: true,
    });
    setPreferences(allAccepted);
    onClose();
  };

  const handleRejectAll = () => {
    const rejected = saveConsent({
      analytics: false,
      marketing: false,
      personalization: false,
    });
    setPreferences(rejected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Çerez Tercihleri</h2>
              <p className="text-white/80 text-sm">Gizlilik ayarlarınızı yönetin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-secondary-600 mb-6">
            Aşağıdaki çerez kategorilerini etkinleştirerek veya devre dışı bırakarak tercihlerinizi belirleyin.
            Zorunlu çerezler sitenin çalışması için gereklidir ve devre dışı bırakılamaz.
          </p>

          {/* Categories */}
          <div className="space-y-4">
            {CONSENT_CATEGORIES.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const isEnabled = category.required || preferences[category.id as keyof ConsentPreferences];

              return (
                <div
                  key={category.id}
                  className={`border-2 rounded-xl overflow-hidden transition-colors ${
                    isEnabled ? 'border-primary-200 bg-primary-50/50' : 'border-secondary-200'
                  }`}
                >
                  {/* Category Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-secondary-800">{category.name}</h3>
                        {category.required && (
                          <span className="px-2 py-0.5 text-xs bg-secondary-200 text-secondary-600 rounded-full">
                            Zorunlu
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-500 mt-1">{category.description}</p>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => !category.required && handleToggle(category.id as 'analytics' | 'marketing' | 'personalization')}
                        disabled={category.required}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isEnabled
                            ? 'bg-primary-500'
                            : 'bg-secondary-300'
                        } ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                            isEnabled ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="text-secondary-400 hover:text-secondary-600 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-secondary-200 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-secondary-700 mb-2">Bu kategorideki çerezler:</h4>
                          <ul className="space-y-1">
                            {category.cookies.map((cookie) => (
                              <li key={cookie} className="flex items-center gap-2 text-secondary-600">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                <code className="text-xs bg-secondary-100 px-1.5 py-0.5 rounded">{cookie}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-secondary-700 mb-2">Saklama süresi:</h4>
                          <p className="text-secondary-600">{category.retentionPeriod}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Data Retention Info */}
          <div className="mt-6">
            <button
              onClick={() => setShowRetentionInfo(!showRetentionInfo)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">Veri Saklama Süreleri</span>
              {showRetentionInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRetentionInfo && (
              <div className="mt-4 p-4 bg-secondary-50 rounded-xl">
                <h4 className="font-semibold text-secondary-800 mb-3">KVKK Kapsamında Veri Saklama Süreleri</h4>
                <ul className="space-y-2 text-sm">
                  {Object.entries(DATA_RETENTION_INFO).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-secondary-700">
                          {key === 'personalData' && 'Kişisel Veriler: '}
                          {key === 'analyticsData' && 'Analitik Veriler: '}
                          {key === 'marketingData' && 'Pazarlama Verileri: '}
                          {key === 'vehicleData' && 'Araç Verileri: '}
                          {key === 'communicationLogs' && 'İletişim Kayıtları: '}
                        </span>
                        <span className="text-secondary-600">{value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 p-4 bg-secondary-50 flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <button
            onClick={handleRejectAll}
            className="flex-1 px-4 py-2.5 text-secondary-600 hover:text-secondary-800 font-medium rounded-xl transition-colors"
          >
            Tümünü Reddet
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 font-semibold rounded-xl transition-colors"
          >
            Seçilenleri Kaydet
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
