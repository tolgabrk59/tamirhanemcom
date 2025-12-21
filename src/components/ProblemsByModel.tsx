'use client';

import { useState } from 'react';
import Link from 'next/link';
import { commonProblemsData, getUniqueBrands, getProblemsByBrand } from '@/data/common-problems';
import type { CommonProblem } from '@/types';

export default function ProblemsByModel() {
  const brands = getUniqueBrands();
  const [activeBrand, setActiveBrand] = useState(brands[0]);
  const problems = getProblemsByBrand(activeBrand);

  return (
    <section id="yaygin-problemler" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Sık Görülen Araç Sorunları
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Marka bazında en yaygın arızalar ve tahmini tamir maliyetleri
          </p>
        </div>

        {/* Brand Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${activeBrand === brand
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100'
                }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/ariza-bul"
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
          >
            Tüm arızaları gör
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ problem }: { problem: CommonProblem }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-primary-600 font-medium">{problem.brand}</span>
          {problem.model && (
            <span className="text-sm text-secondary-500"> / {problem.model}</span>
          )}
        </div>
        <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded">
          {problem.frequency}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {problem.title}
      </h3>

      <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
        {problem.description}
      </p>

      {/* Symptoms */}
      <div className="mb-4">
        <span className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Belirtiler:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {problem.symptoms.slice(0, 3).map((symptom, index) => (
            <span
              key={index}
              className="text-xs bg-accent-orange/10 text-accent-orange px-2 py-1 rounded"
            >
              {symptom}
            </span>
          ))}
          {problem.symptoms.length > 3 && (
            <span className="text-xs text-secondary-400">+{problem.symptoms.length - 3}</span>
          )}
        </div>
      </div>

      {/* Cost */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
        <div>
          <span className="text-xs text-secondary-500">Tahmini Maliyet</span>
          <p className="text-lg font-semibold text-secondary-900">{problem.estimatedCost}</p>
        </div>
        <Link
          href={`/ariza-bul?brand=${problem.brand}&problem=${encodeURIComponent(problem.title)}`}
          className="text-primary-600 text-sm font-medium hover:text-primary-700"
        >
          Detay
        </Link>
      </div>
    </div>
  );
}
