'use client';

import { useState, useEffect, useCallback } from 'react';
import CikmaParcaCard from '@/components/CikmaParcaCard';
import CikmaParcaCardSkeleton from '@/components/CikmaParcaCardSkeleton';
import CikmaParcaFilters, { FilterState } from '@/components/CikmaParcaFilters';
import type { CikmaParca } from '@/types';
import Link from 'next/link';

export default function CikmaParcaListClient() {
  const [parcalar, setParcalar] = useState<CikmaParca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    pageCount: 1,
    total: 0,
  });

  const fetchParcalar = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', '20');

      if (filters.category) params.set('category', filters.category);
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.model) params.set('model', filters.model);
      if (filters.year) params.set('year', String(filters.year));
      if (filters.fuelType) params.set('fuelType', filters.fuelType);
      if (filters.transmissionType) params.set('transmissionType', filters.transmissionType);

      const response = await fetch(`/api/2-el-parca?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Parçalar yüklenemedi');
      }

      setParcalar(data.data || []);
      setPagination(data.pagination || { page: 1, pageSize: 20, pageCount: 1, total: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchParcalar();
  }, [fetchParcalar]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">2.El Parça Pazaryeri</h1>
              <p className="text-gray-300">
                Güvenilir satıcılardan uygun fiyatlı 2.el parçalar
              </p>
            </div>
            <Link
              href="/arac/2-el-parca/ilan-ver"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-500 text-gray-900 rounded-xl font-semibold hover:bg-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              İlan Ver
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <CikmaParcaFilters onFilterChange={handleFilterChange} initialFilters={filters} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {pagination.total > 0 ? (
                  <>
                    <span className="font-semibold text-gray-900">{pagination.total}</span> ilan bulundu
                  </>
                ) : (
                  'İlan bulunamadı'
                )}
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
                <p>{error}</p>
                <button
                  onClick={fetchParcalar}
                  className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CikmaParcaCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && parcalar.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">İlan Bulunamadı</h3>
                <p className="text-gray-600 mb-4">Seçtiğiniz kriterlere uygun ilan bulunamadı.</p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && parcalar.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parcalar.map((parca) => (
                    <CikmaParcaCard key={parca.id} parca={parca} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pageCount > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      Sayfa {page} / {pagination.pageCount}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pageCount, p + 1))}
                      disabled={page === pagination.pageCount}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/arac/2-el-parca/ilan-ver"
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-400 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
