'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CikmaParcaTeklifForm from '@/components/CikmaParcaTeklifForm';
import type { CikmaParca, CikmaParcaCondition } from '@/types';

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

export default function CikmaParcaDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [parca, setParca] = useState<CikmaParca | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showTeklifModal, setShowTeklifModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchParca = async () => {
      try {
        const response = await fetch(`/api/2-el-parca/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Parça bulunamadı');
        }

        setParca(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParca();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !parca) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Parça Bulunamadı</h2>
          <p className="text-gray-600 mb-4">{error || 'İlan mevcut değil veya kaldırılmış.'}</p>
          <Link href="/arac/2-el-parca" className="text-primary-600 hover:underline">
            Tüm ilanlara dön
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(parca.price);

  const yearRange = parca.yearFrom && parca.yearTo
    ? `${parca.yearFrom}-${parca.yearTo}`
    : parca.yearFrom || parca.yearTo || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/arac/2-el-parca" className="hover:text-gray-700">2.El Parça</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{parca.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
              {parca.images[selectedImage]?.url ? (
                <Image
                  src={parca.images[selectedImage].url}
                  alt={parca.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {parca.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {parca.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === idx ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${parca.title} ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg">
                {categoryLabels[parca.category] || parca.category}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-lg ${conditionColors[parca.condition]}`}>
                {conditionLabels[parca.condition]}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{parca.title}</h1>

            <p className="text-3xl font-bold text-primary-600 mb-6">{formattedPrice}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Uyumlu Araç: <strong>{parca.brand} {parca.model}</strong> {yearRange && `(${yearRange})`}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Konum: <strong>{parca.location}</strong></span>
              </div>
              {parca.oemCode && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>OEM Kodu: <strong>{parca.oemCode}</strong></span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Açıklama</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{parca.description}</p>
            </div>

            {/* Seller Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Satıcı Bilgileri</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold">
                  {parca.seller.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{parca.seller.name}</p>
                  <p className="text-sm text-gray-500">{parca.seller.location}</p>
                  {parca.seller.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{parca.seller.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowTeklifModal(true)}
              className="w-full py-4 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors text-lg"
            >
              Teklif Gönder
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              İlan Tarihi: {new Date(parca.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {/* Teklif Modal */}
      {showTeklifModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Teklif Gönder</h2>
              <button
                onClick={() => setShowTeklifModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CikmaParcaTeklifForm
              parca={parca}
              onSuccess={() => {}}
              onClose={() => setShowTeklifModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
