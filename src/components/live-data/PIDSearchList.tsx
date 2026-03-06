'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Fuel, Wind, Gauge, Cog, X } from 'lucide-react';
import type { LiveDataPID } from '@/types';

interface PIDCategory {
  key: string;
  name: string;
  nameTr: string;
  description: string;
}

interface PIDSearchListProps {
  pids: LiveDataPID[];
  categories: Record<string, Omit<PIDCategory, 'key'>>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  fuel: <Fuel className="w-6 h-6" />,
  emissions: <Wind className="w-6 h-6" />,
  sensors: <Gauge className="w-6 h-6" />,
  engine: <Cog className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  fuel: 'bg-orange-100 text-orange-600',
  emissions: 'bg-green-100 text-green-600',
  sensors: 'bg-blue-100 text-blue-600',
  engine: 'bg-purple-100 text-purple-600',
};

export default function PIDSearchList({ pids, categories }: PIDSearchListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter PIDs based on search query
  const filteredPIDs = useMemo(() => {
    if (!searchQuery.trim()) {
      return pids;
    }

    const query = searchQuery.toLowerCase().trim();
    return pids.filter((pid) => {
      return (
        pid.pidCode.toLowerCase().includes(query) ||
        pid.name.toLowerCase().includes(query) ||
        pid.nameTr.toLowerCase().includes(query) ||
        pid.description.toLowerCase().includes(query) ||
        pid.unit.toLowerCase().includes(query)
      );
    });
  }, [pids, searchQuery]);

  // Group filtered PIDs by category
  const groupedPIDs = useMemo(() => {
    return Object.entries(categories).map(([key, category]) => ({
      key,
      ...category,
      pids: filteredPIDs.filter((pid) => pid.category === key),
    })).filter(category => category.pids.length > 0);
  }, [filteredPIDs, categories]);

  const totalResults = filteredPIDs.length;
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-secondary-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PID kodu, parametre adı veya açıklama ile ara... (örn: fuel, 0104, sıcaklık)"
            className="block w-full pl-12 pr-12 py-4 border-2 border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {hasSearch && (
          <div className="mt-3 text-center">
            <span className="text-secondary-600">
              {totalResults === 0 ? (
                <span className="text-amber-600">
                  &quot;{searchQuery}&quot; için sonuç bulunamadı
                </span>
              ) : (
                <>
                  <span className="font-semibold text-primary-600">{totalResults}</span> sonuç bulundu
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* No Results Message */}
      {hasSearch && totalResults === 0 && (
        <div className="text-center py-12 bg-secondary-50 rounded-xl">
          <Search className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 mb-2">
            Sonuç Bulunamadı
          </h3>
          <p className="text-secondary-500 max-w-md mx-auto">
            &quot;{searchQuery}&quot; araması için eşleşen PID bulunamadı.
            Farklı bir terim deneyin veya PID kodunu (örn: 0104, 0105) girin.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Aramayı Temizle
          </button>
        </div>
      )}

      {/* Category Sections */}
      <div className="space-y-12">
        {groupedPIDs.map((category) => (
          <div key={category.key}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[category.key]}`}>
                {categoryIcons[category.key]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-800">
                  {category.nameTr}
                  {hasSearch && (
                    <span className="ml-2 text-base font-normal text-secondary-500">
                      ({category.pids.length})
                    </span>
                  )}
                </h2>
                <p className="text-secondary-600 text-sm">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.pids.map((pid) => (
                <Link
                  key={pid.pidCode}
                  href={`/obd/canli-veri/${pid.pidCode.toLowerCase()}`}
                  className="group bg-white rounded-xl shadow-card hover:shadow-lg transition-all p-5 border-2 border-transparent hover:border-primary-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-mono rounded">
                      PID {pid.pidCode}
                    </span>
                    <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="font-semibold text-secondary-800 mb-1 group-hover:text-primary-600 transition-colors">
                    {pid.nameTr}
                  </h3>
                  <p className="text-secondary-500 text-sm mb-3 line-clamp-2">
                    {pid.description.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">
                      Normal: {pid.normalRangeMin} - {pid.normalRangeMax} {pid.unit}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
