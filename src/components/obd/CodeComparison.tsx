'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ObdCode } from '@/types';

interface ComparisonSlot {
  code: string;
  data: ObdCode | null;
  loading: boolean;
  error: string | null;
}

export default function CodeComparison() {
  const [slots, setSlots] = useState<ComparisonSlot[]>([
    { code: '', data: null, loading: false, error: null },
    { code: '', data: null, loading: false, error: null }
  ]);

  const [showThird, setShowThird] = useState(false);

  const fetchCode = async (index: number, code: string) => {
    if (!code.trim()) {
      setSlots(prev => prev.map((slot, i) =>
        i === index ? { ...slot, code, data: null, loading: false, error: null } : slot
      ));
      return;
    }

    setSlots(prev => prev.map((slot, i) =>
      i === index ? { ...slot, code, loading: true, error: null } : slot
    ));

    try {
      const response = await fetch(`/api/obd/search?q=${encodeURIComponent(code.toUpperCase())}&limit=1`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const foundCode = result.data.find((c: ObdCode) =>
          c.code.toUpperCase() === code.toUpperCase()
        ) || result.data[0];

        setSlots(prev => prev.map((slot, i) =>
          i === index ? { ...slot, data: foundCode, loading: false } : slot
        ));
      } else {
        setSlots(prev => prev.map((slot, i) =>
          i === index ? { ...slot, data: null, loading: false, error: 'Kod bulunamadı' } : slot
        ));
      }
    } catch {
      setSlots(prev => prev.map((slot, i) =>
        i === index ? { ...slot, data: null, loading: false, error: 'Arama hatası' } : slot
      ));
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const timer = setTimeout(() => {
      fetchCode(index, value);
    }, 500);

    setSlots(prev => prev.map((slot, i) =>
      i === index ? { ...slot, code: value } : slot
    ));

    return () => clearTimeout(timer);
  };

  const addThirdSlot = () => {
    if (!showThird) {
      setSlots([...slots, { code: '', data: null, loading: false, error: null }]);
      setShowThird(true);
    }
  };

  const removeThirdSlot = () => {
    setSlots(slots.slice(0, 2));
    setShowThird(false);
  };

  const popularComparisons = [
    { codes: ['P0171', 'P0174'], label: 'Bank 1 vs Bank 2 Fakir' },
    { codes: ['P0300', 'P0301'], label: 'Çoklu vs Tek Silindir Misfire' },
    { codes: ['P0420', 'P0430'], label: 'Bank 1 vs Bank 2 Katalitik' },
    { codes: ['P0171', 'P0172'], label: 'Fakir vs Zengin Karışım' }
  ];

  const loadComparison = (codes: string[]) => {
    codes.forEach((code, index) => {
      if (index < slots.length) {
        handleCodeChange(index, code);
      }
    });
  };

  const hasData = slots.some(s => s.data);

  // Find common and different items
  const findCommonItems = (arrays: (string[] | undefined)[]) => {
    const validArrays = arrays.filter(arr => arr && arr.length > 0) as string[][];
    if (validArrays.length === 0) return [];
    return validArrays[0].filter(item =>
      validArrays.every(arr => arr.includes(item))
    );
  };

  const codesWithData = slots.filter(s => s.data);
  const commonCauses = findCommonItems(codesWithData.map(s => s.data?.causes));
  const commonSymptoms = findCommonItems(codesWithData.map(s => s.data?.symptoms));

  return (
    <div className="space-y-8">
      {/* Code Input Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-800 mb-4">Karşılaştırılacak Kodları Girin</h2>

        <div className={`grid gap-4 ${showThird ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {slots.map((slot, index) => (
            <div key={index} className="relative">
              <label className="block text-sm font-medium text-secondary-600 mb-2">
                Kod {index + 1}
                {index === 2 && (
                  <button
                    onClick={removeThirdSlot}
                    className="ml-2 text-error-500 hover:text-error-600 text-xs"
                  >
                    (Kaldır)
                  </button>
                )}
              </label>
              <input
                type="text"
                value={slot.code}
                onChange={(e) => handleCodeChange(index, e.target.value.toUpperCase())}
                placeholder="örn: P0420"
                className="w-full px-4 py-3 rounded-xl border-2 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all font-mono text-lg uppercase"
              />
              {slot.loading && (
                <div className="absolute right-3 top-10 mt-1">
                  <svg className="animate-spin h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {slot.data && (
                <div className="mt-2 p-2 bg-success-50 rounded-lg">
                  <p className="text-sm text-success-700 font-medium">{slot.data.title}</p>
                </div>
              )}
              {slot.error && (
                <div className="mt-2 p-2 bg-error-50 rounded-lg">
                  <p className="text-sm text-error-700">{slot.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showThird && (
          <button
            onClick={addThirdSlot}
            className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Üçüncü Kod Ekle
          </button>
        )}

        {/* Popular Comparisons */}
        <div className="mt-6 pt-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-500 mb-3">Popüler Karşılaştırmalar:</p>
          <div className="flex flex-wrap gap-2">
            {popularComparisons.map((comp, i) => (
              <button
                key={i}
                onClick={() => loadComparison(comp.codes)}
                className="px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg text-sm transition-colors"
              >
                {comp.codes.join(' vs ')} - {comp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {hasData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className={`grid gap-4 ${showThird ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {slots.filter(s => s.data).map((slot, index) => (
              <div key={index} className="bg-white rounded-xl border border-secondary-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-mono font-bold text-lg">
                    {slot.data!.code}
                  </span>
                  {slot.data!.severity && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      slot.data!.severity === 'high' || slot.data!.severity === 'critical' ? 'bg-error-100 text-error-700' :
                      slot.data!.severity === 'medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-success-100 text-success-700'
                    }`}>
                      {slot.data!.severity === 'high' || slot.data!.severity === 'critical' ? 'Yüksek' :
                       slot.data!.severity === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-secondary-800 mb-2">{slot.data!.title}</h3>
                <p className="text-sm text-secondary-600 line-clamp-2">{slot.data!.description}</p>
                {slot.data!.estimatedCostMin && slot.data!.estimatedCostMax && (
                  <div className="mt-3 pt-3 border-t border-secondary-100">
                    <p className="text-sm text-secondary-500">Tahmini Maliyet:</p>
                    <p className="font-bold text-primary-600">
                      {slot.data!.estimatedCostMin.toLocaleString('tr-TR')} - {slot.data!.estimatedCostMax.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                )}
                <Link
                  href={`/obd/${slot.data!.code.toLowerCase()}`}
                  className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Detaylı Bilgi
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {/* Common Items */}
          {codesWithData.length >= 2 && (commonCauses.length > 0 || commonSymptoms.length > 0) && (
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <h3 className="font-bold text-secondary-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Ortak Noktalar
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {commonCauses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-secondary-700 mb-2">Ortak Nedenler</h4>
                    <ul className="space-y-1">
                      {commonCauses.map((cause, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-secondary-600">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {commonSymptoms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-secondary-700 mb-2">Ortak Belirtiler</h4>
                    <ul className="space-y-1">
                      {commonSymptoms.map((symptom, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-secondary-600">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-secondary-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Özellik</th>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                        {slot.data!.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-700">Kategori</td>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-secondary-600">
                        {slot.data!.category || '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-secondary-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-700">Belirtiler</td>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-secondary-600">
                        <ul className="list-disc list-inside space-y-1">
                          {slot.data!.symptoms?.slice(0, 4).map((s, j) => (
                            <li key={j} className={commonSymptoms.includes(s) ? 'text-primary-600 font-medium' : ''}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-700">Nedenler</td>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-secondary-600">
                        <ul className="list-disc list-inside space-y-1">
                          {slot.data!.causes?.slice(0, 4).map((c, j) => (
                            <li key={j} className={commonCauses.includes(c) ? 'text-primary-600 font-medium' : ''}>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-secondary-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-700">Çözümler</td>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-secondary-600">
                        <ul className="list-disc list-inside space-y-1">
                          {slot.data!.fixes?.slice(0, 4).map((f, j) => (
                            <li key={j}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-secondary-700">Maliyet Aralığı</td>
                    {slots.filter(s => s.data).map((slot, i) => (
                      <td key={i} className="px-6 py-4 text-sm font-bold text-primary-600">
                        {slot.data!.estimatedCostMin && slot.data!.estimatedCostMax
                          ? `${slot.data!.estimatedCostMin.toLocaleString('tr-TR')} - ${slot.data!.estimatedCostMax.toLocaleString('tr-TR')} ₺`
                          : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasData && (
        <div className="text-center py-16 bg-white rounded-2xl border border-secondary-100">
          <svg className="w-20 h-20 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">Karşılaştırma Yapmak İçin Kod Girin</h3>
          <p className="text-secondary-600 max-w-md mx-auto">
            İki veya üç OBD kodunu yan yana karşılaştırın. Ortak nedenler, farklı belirtiler ve maliyet farklarını görün.
          </p>
        </div>
      )}
    </div>
  );
}
