'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCodeHistory, removeFromCodeHistory, clearCodeHistory, type CodeHistoryItem } from '@/lib/code-history';

export default function CodeHistory() {
  const [history, setHistory] = useState<CodeHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getCodeHistory());
    setIsLoaded(true);
  }, []);

  const handleRemove = (code: string) => {
    removeFromCodeHistory(code);
    setHistory(getCodeHistory());
  };

  const handleClearAll = () => {
    if (confirm('Tüm geçmişi silmek istediğinize emin misiniz?')) {
      clearCodeHistory();
      setHistory([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl border border-secondary-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-secondary-100 rounded"></div>
            <div className="h-16 bg-secondary-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-secondary-100 p-8 text-center">
        <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-secondary-800 mb-2">Henüz Geçmiş Yok</h3>
        <p className="text-secondary-600 text-sm mb-4">
          OBD kodlarını incelediğinizde burada listelenecekler.
        </p>
        <Link
          href="/obd"
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
        >
          Kod Aramaya Başla
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-secondary-800">Son Baktığınız Kodlar</h3>
          <span className="text-sm text-secondary-500">({history.length})</span>
        </div>
        <button
          onClick={handleClearAll}
          className="text-sm text-secondary-500 hover:text-error-600 transition-colors"
        >
          Temizle
        </button>
      </div>

      {/* History List */}
      <div className="divide-y divide-secondary-100">
        {history.map((item) => (
          <div
            key={item.code}
            className="px-6 py-4 hover:bg-secondary-50 transition-colors flex items-center justify-between group"
          >
            <Link
              href={`/obd/${item.code.toLowerCase()}`}
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              <div className="flex-shrink-0">
                <span className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg font-mono font-bold text-sm">
                  {item.code}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary-800 truncate">{item.title}</p>
                <p className="text-sm text-secondary-500">{formatDate(item.viewedAt)}</p>
              </div>
              {item.severity && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                  item.severity === 'high' || item.severity === 'critical' ? 'bg-error-100 text-error-700' :
                  item.severity === 'medium' ? 'bg-warning-100 text-warning-700' :
                  'bg-success-100 text-success-700'
                }`}>
                  {item.severity === 'high' || item.severity === 'critical' ? 'Yüksek' :
                   item.severity === 'medium' ? 'Orta' : 'Düşük'}
                </span>
              )}
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemove(item.code);
              }}
              className="ml-4 p-2 text-secondary-400 hover:text-error-600 opacity-0 group-hover:opacity-100 transition-all"
              title="Geçmişten kaldır"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-secondary-50 border-t border-secondary-100 text-center">
        <p className="text-xs text-secondary-500">
          Geçmiş bu cihazda saklanır ve otomatik olarak 20 kodla sınırlandırılır.
        </p>
      </div>
    </div>
  );
}

// Compact version for sidebar/widgets
export function CodeHistoryCompact() {
  const [history, setHistory] = useState<CodeHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getCodeHistory().slice(0, 5));
    setIsLoaded(true);
  }, []);

  if (!isLoaded || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-secondary-700">Son Baktıklarınız</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <Link
            key={item.code}
            href={`/obd/${item.code.toLowerCase()}`}
            className="px-2.5 py-1 bg-white hover:bg-primary-50 border border-secondary-200 hover:border-primary-300 rounded-lg text-sm font-mono text-secondary-700 hover:text-primary-700 transition-colors"
          >
            {item.code}
          </Link>
        ))}
      </div>
    </div>
  );
}
