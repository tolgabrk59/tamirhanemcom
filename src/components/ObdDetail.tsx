import Link from 'next/link';
import type { ObdCode } from '@/types';

interface ObdDetailProps {
  obd: ObdCode;
}

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

const severityLabels = {
  low: 'Düşük Öncelik',
  medium: 'Orta Öncelik',
  high: 'Yüksek Öncelik',
  critical: 'Kritik - Acil Müdahale',
};

const severityDescriptions = {
  low: 'Bu arıza genellikle acil değildir. Yakın zamanda kontrol ettirmeniz önerilir.',
  medium: 'Sürüşe devam edilebilir ancak en kısa sürede servis randevusu alınmalıdır.',
  high: 'Aracınızı sınırlı kullanın ve bir hafta içinde mutlaka kontrol ettirin.',
  critical: 'Aracı çalıştırmayın! Hemen yetkili bir servise başvurun.',
};

export default function ObdDetail({ obd }: ObdDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-secondary-500 mb-6">
        <Link href="/" className="hover:text-primary-600">
          Ana Sayfa
        </Link>
        <span>/</span>
        <Link href="/obd" className="hover:text-primary-600">
          OBD Kodları
        </Link>
        <span>/</span>
        <span className="text-secondary-900 font-medium">{obd.code}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold text-primary-600 font-mono">
                {obd.code}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${severityColors[obd.severity]}`}>
                {severityLabels[obd.severity]}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
              {obd.title}
            </h1>
            <span className="inline-block bg-secondary-100 text-secondary-600 px-3 py-1 rounded-lg text-sm">
              {obd.category}
            </span>
          </div>
          {obd.estimatedCostMin != null && obd.estimatedCostMax != null && (
            <div className="bg-secondary-50 rounded-xl p-4 text-center md:text-right">
              <span className="text-sm text-secondary-500 block mb-1">Tahmini Maliyet</span>
              <p className="text-2xl font-bold text-secondary-900">
                {obd.estimatedCostMin.toLocaleString('tr-TR')} - {obd.estimatedCostMax.toLocaleString('tr-TR')} TL
              </p>
              <span className="text-xs text-secondary-400">Parça ve işçilik dahil</span>
            </div>
          )}
        </div>

        {/* Severity Alert */}
        <div className={`rounded-xl p-4 border ${severityColors[obd.severity]} mb-6`}>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold">{severityLabels[obd.severity]}</p>
              <p className="text-sm opacity-90">{severityDescriptions[obd.severity]}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-secondary max-w-none">
          <h2 className="text-xl font-semibold text-secondary-900 mb-3">Bu Kod Ne Anlama Geliyor?</h2>
          <div className="text-secondary-600 whitespace-pre-line">
            {obd.description}
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Belirtiler
        </h2>
        <p className="text-secondary-500 mb-4">Bu arıza koduyla birlikte aşağıdaki belirtilerden birini veya birkaçını fark edebilirsiniz:</p>
        <ul className="space-y-3">
          {obd.symptoms.map((symptom, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-accent-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
              </span>
              <span className="text-secondary-700">{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Causes */}
      <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Olası Nedenler
        </h2>
        <p className="text-secondary-500 mb-4">Bu arıza koduna neden olabilecek yaygın sorunlar (en olası nedenler başta):</p>
        <ul className="space-y-3">
          {obd.causes.map((cause, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-accent-red/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold text-accent-red">
                {index + 1}
              </span>
              <span className="text-secondary-700">{cause}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixes */}
      <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Çözüm Önerileri
        </h2>
        <p className="text-secondary-500 mb-4">Aşağıdaki adımlar genellikle bu sorunu çözmek için uygulanır:</p>
        <ul className="space-y-3">
          {obd.fixes.map((fix, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-secondary-700">{fix}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Bu arızayı tamir ettirmek mi istiyorsunuz?</h3>
            <p className="text-primary-100">
              TamirHanem&apos;de güvenilir servislerden hemen fiyat teklifi alın.
            </p>
          </div>
          <Link
            href={`/fiyat-hesapla?problem=${obd.code}`}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center whitespace-nowrap"
          >
            Fiyat Teklifi Al
          </Link>
        </div>
      </div>
    </div>
  );
}
