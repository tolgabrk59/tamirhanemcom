'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

// Common code suggestions
const commonCodes = [
  { code: 'P0420', description: 'Katalitik Konvertör Verimi' },
  { code: 'P0171', description: 'Sistem Çok Fakir (Bank 1)' },
  { code: 'P0300', description: 'Rastgele Ateşleme Hatası' },
  { code: 'P0442', description: 'Evap Sistemi Küçük Kaçak' },
  { code: 'P0401', description: 'EGR Akışı Yetersiz' },
];

export default function ManualCodeSearch() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const validateCode = useCallback((input: string): boolean => {
    // OBD-II code format: P/B/C/U followed by 4 hex digits
    const pattern = /^[PBCU][0-9A-F]{4}$/i;
    return pattern.test(input.trim());
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmedCode = code.trim().toUpperCase();
    setError(null);

    if (!trimmedCode) {
      setError('Lütfen bir arıza kodu girin');
      return;
    }

    if (!validateCode(trimmedCode)) {
      setError('Geçersiz kod formatı. Örnek: P0420, B0100, C0035, U0100');
      return;
    }

    setIsSearching(true);

    // Navigate to OBD code detail page
    router.push(`/obd/${trimmedCode.toLowerCase()}`);
  }, [code, router, validateCode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (quickCode: string) => {
    setCode(quickCode);
    router.push(`/obd/${quickCode.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Arıza kodunu girin (örn: P0420)"
          className="w-full px-4 py-3 pl-11 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-lg uppercase"
          maxLength={5}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-secondary-300 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
      >
        {isSearching ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Aranıyor...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Kodu Ara
          </>
        )}
      </button>

      {/* Code format help */}
      <div className="text-sm text-secondary-500">
        <p className="font-medium mb-1">Kod Formatları:</p>
        <ul className="space-y-1 text-xs">
          <li><span className="font-mono font-bold">P</span> - Motor ve Şanzıman (Powertrain)</li>
          <li><span className="font-mono font-bold">B</span> - Gövde (Body)</li>
          <li><span className="font-mono font-bold">C</span> - Şasi (Chassis)</li>
          <li><span className="font-mono font-bold">U</span> - Ağ/İletişim (Network)</li>
        </ul>
      </div>

      {/* Quick search suggestions */}
      <div className="pt-2 border-t border-secondary-100">
        <p className="text-secondary-500 text-sm mb-2">Sık Aranan Kodlar:</p>
        <div className="flex flex-wrap gap-2">
          {commonCodes.map((item) => (
            <button
              key={item.code}
              onClick={() => handleQuickSearch(item.code)}
              className="px-3 py-1.5 bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded-lg text-sm font-mono transition-colors flex items-center gap-1"
            >
              {item.code}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
