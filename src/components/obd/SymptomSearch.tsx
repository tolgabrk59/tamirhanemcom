'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { symptomObdMappings, symptomCategories, searchSymptoms, type SymptomObdMapping } from '@/data/symptom-obd-mapping';

const categoryColors: Record<string, string> = {
  'Motor': 'bg-red-100 text-red-700 border-red-200',
  'Yakıt': 'bg-green-100 text-green-700 border-green-200',
  'Emisyon': 'bg-gray-100 text-gray-700 border-gray-200',
  'Şanzıman': 'bg-purple-100 text-purple-700 border-purple-200',
  'Fren': 'bg-orange-100 text-orange-700 border-orange-200',
  'Elektrik': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Sensör': 'bg-blue-100 text-blue-700 border-blue-200'
};

const severityConfig = {
  low: { label: 'Düşük', color: 'bg-success-100 text-success-700', icon: '●' },
  medium: { label: 'Orta', color: 'bg-warning-100 text-warning-700', icon: '●●' },
  high: { label: 'Yüksek', color: 'bg-error-100 text-error-700', icon: '●●●' }
};

export default function SymptomSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSymptoms = useMemo(() => {
    let results = symptomObdMappings;

    if (searchQuery.trim()) {
      results = searchSymptoms(searchQuery);
    }

    if (selectedCategory) {
      results = results.filter(s => s.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const popularSymptoms = [
    'Motor Titreşimi',
    'Check Engine Lambası',
    'Güç Kaybı',
    'Yakıt Tüketimi',
    'Vites Kayması',
    'ABS Lambası'
  ];

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Belirtinizi yazın... (örn: motor titriyor, yakıt tüketimi arttı)"
            className="w-full px-5 py-4 pr-12 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-lg placeholder-secondary-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Popular Symptoms */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-secondary-500">Popüler:</span>
          {popularSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => setSearchQuery(symptom)}
              className="px-3 py-1 text-sm bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-full transition-colors"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === null
              ? 'bg-primary-500 text-secondary-900 shadow-lg'
              : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
          }`}
        >
          Tümü
        </button>
        {symptomCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === cat.name
                ? 'bg-primary-500 text-secondary-900 shadow-lg'
                : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-secondary-600">
          <span className="font-semibold text-secondary-800">{filteredSymptoms.length}</span> belirti bulundu
        </p>
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Symptom Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSymptoms.map((symptom) => (
          <SymptomCard key={symptom.symptomId} symptom={symptom} />
        ))}
      </div>

      {filteredSymptoms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">Belirti Bulunamadı</h3>
          <p className="text-secondary-600">Farklı bir arama terimi deneyin</p>
        </div>
      )}
    </div>
  );
}

function SymptomCard({ symptom }: { symptom: SymptomObdMapping }) {
  const severity = severityConfig[symptom.severity];

  return (
    <div className="bg-white rounded-xl border border-secondary-100 hover:border-primary-300 hover:shadow-lg transition-all overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[symptom.category]}`}>
                {symptom.category}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${severity.color}`}>
                {severity.icon} {severity.label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-secondary-800">
              {symptom.symptomNameTr}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary-600 text-sm mb-4">
          {symptom.description}
        </p>

        {/* Related OBD Codes */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-secondary-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            İlişkili OBD Kodları
          </h4>
          <div className="flex flex-wrap gap-2">
            {symptom.obdCodes.slice(0, 6).map((code) => (
              <Link
                key={code}
                href={`/obd/${code.toLowerCase()}`}
                className="px-2.5 py-1 bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded font-mono text-sm transition-colors"
              >
                {code}
              </Link>
            ))}
            {symptom.obdCodes.length > 6 && (
              <span className="px-2.5 py-1 bg-secondary-50 text-secondary-500 rounded text-sm">
                +{symptom.obdCodes.length - 6} kod
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-secondary-100">
          <Link
            href={`/obd/${symptom.obdCodes[0]?.toLowerCase()}`}
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            En Olası Kodu İncele
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
