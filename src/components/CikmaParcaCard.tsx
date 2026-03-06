'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CikmaParca, CikmaParcaCondition } from '@/types';

interface CikmaParcaCardProps {
  parca: CikmaParca;
}

const conditionLabels: Record<CikmaParcaCondition, string> = {
  'cok-iyi': 'Çok İyi',
  'iyi': 'İyi',
  'orta': 'Orta',
  'onarima-ihtiyaci-var': 'Onarıma İhtiyacı Var',
};

const conditionColors: Record<CikmaParcaCondition, string> = {
  'cok-iyi': 'bg-green-100 text-green-800',
  'iyi': 'bg-blue-100 text-blue-800',
  'orta': 'bg-yellow-100 text-yellow-800',
  'onarima-ihtiyaci-var': 'bg-red-100 text-red-800',
};

const categoryLabels: Record<string, string> = {
  motor: 'Motor',
  fren: 'Fren',
  suspansiyon: 'Süspansiyon',
  elektrik: 'Elektrik',
  sogutma: 'Soğutma',
  sanziman: 'Şanzıman',
  egzoz: 'Egzoz',
  yakit: 'Yakıt',
  kaporta: 'Kaporta',
  'ic-aksesuar': 'İç Aksesuar',
  diger: 'Diğer',
};

export default function CikmaParcaCard({ parca }: CikmaParcaCardProps) {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(parca.price);

  const yearRange = parca.yearFrom && parca.yearTo
    ? `${parca.yearFrom}-${parca.yearTo}`
    : parca.yearFrom || parca.yearTo || '';

  return (
    <Link
      href={`/arac/2-el-parca/${parca.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {parca.images[0]?.url ? (
          <Image
            src={parca.images[0].url}
            alt={parca.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-gray-900/80 text-white rounded-md">
          {categoryLabels[parca.category] || parca.category}
        </span>
        {/* Condition Badge */}
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-md ${conditionColors[parca.condition]}`}>
          {conditionLabels[parca.condition]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {parca.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span>{parca.brand}</span>
          <span>&bull;</span>
          <span>{parca.model}</span>
          {yearRange && (
            <>
              <span>&bull;</span>
              <span>{yearRange}</span>
            </>
          )}
        </div>

        {parca.oemCode && (
          <p className="mt-1 text-xs text-gray-400">OEM: {parca.oemCode}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">{formattedPrice}</span>
          <span className="text-sm text-gray-500">{parca.location}</span>
        </div>

        {/* Seller Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
            {parca.seller.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{parca.seller.name}</p>
            {parca.seller.rating && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-500">{parca.seller.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
