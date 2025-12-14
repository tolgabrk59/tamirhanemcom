import Link from 'next/link';
import type { ObdCode } from '@/types';

interface ObdListItemProps {
  obd: ObdCode;
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const severityLabels = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  critical: 'Kritik',
};

export default function ObdListItem({ obd }: ObdListItemProps) {
  return (
    <Link
      href={`/obd/${obd.code.toLowerCase()}`}
      className="block bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-secondary-100 hover:border-primary-200"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-primary-600 font-mono">
              {obd.code}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[obd.severity]}`}>
              {severityLabels[obd.severity]}
            </span>
            <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
              {obd.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {obd.title}
          </h3>
          <p className="text-secondary-600 text-sm line-clamp-2">
            {obd.description.substring(0, 200)}...
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {obd.estimatedCostMin && obd.estimatedCostMax && (
            <div className="text-right">
              <span className="text-xs text-secondary-500">Tahmini Maliyet</span>
              <p className="text-lg font-semibold text-secondary-900">
                {obd.estimatedCostMin.toLocaleString('tr-TR')} - {obd.estimatedCostMax.toLocaleString('tr-TR')} TL
              </p>
            </div>
          )}
          <span className="text-primary-600 text-sm font-medium flex items-center">
            Detayları Gör
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
