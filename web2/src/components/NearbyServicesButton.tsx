'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin } from 'lucide-react';

export function NearbyServicesButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('Tarayıcınız konum özelliğini desteklemiyor');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        router.push(
          `/servisler/sonuclar?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&nearby=true`
        );
        setLoading(false);
      },
      () => {
        setError('Konumunuza erişim izni verilmedi');
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4 text-orange-400" />
        )}
        {loading ? 'Konum alınıyor...' : 'Yakınımdaki Servisler'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
