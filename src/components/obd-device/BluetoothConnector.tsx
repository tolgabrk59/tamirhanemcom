'use client';

import { useState, useCallback } from 'react';
import { Bluetooth, BluetoothOff, Loader2, AlertCircle, CheckCircle, Zap, Car, List } from 'lucide-react';
import { obdBluetooth, type OBDConnectionState, type DTCCode } from '@/lib/obd-bluetooth';
import Link from 'next/link';

export default function BluetoothConnector() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [connectionState, setConnectionState] = useState<OBDConnectionState | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [dtcCodes, setDtcCodes] = useState<DTCCode[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check browser support on first interaction
  const checkSupport = useCallback(() => {
    if (isSupported === null) {
      setIsSupported(obdBluetooth.isSupported());
    }
  }, [isSupported]);

  const handleConnect = async (acceptAll: boolean = false) => {
    checkSupport();
    setError(null);
    setIsConnecting(true);

    try {
      const state = await obdBluetooth.connect(acceptAll);
      setConnectionState(state);

      if (!state.connected && state.error) {
        // Provide more helpful error messages
        let errorMessage = state.error;
        if (state.error.includes('denied') || state.error.includes('cancelled')) {
          errorMessage = 'Bluetooth cihaz seçimi iptal edildi. Lütfen listeden OBD cihazınızı seçin.';
        } else if (state.error.includes('no devices')) {
          errorMessage = 'Bluetooth cihaz bulunamadı. OBD cihazınızın açık ve eşleştirilmiş olduğundan emin olun.';
        }
        setError(errorMessage);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Bağlantı hatası';
      if (errorMsg.includes('denied') || errorMsg.includes('cancelled')) {
        setError('Bluetooth cihaz seçimi iptal edildi. Lütfen tekrar deneyin ve listeden OBD cihazınızı seçin.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await obdBluetooth.disconnect();
    setConnectionState(null);
    setDtcCodes([]);
  };

  const handleReadCodes = async () => {
    setIsReading(true);
    setError(null);

    try {
      const codes = await obdBluetooth.readDTCs();
      setDtcCodes(codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kod okuma hatası');
    } finally {
      setIsReading(false);
    }
  };

  const handleClearCodes = async () => {
    if (!confirm('Tüm arıza kodlarını silmek istediğinize emin misiniz?')) {
      return;
    }

    const success = await obdBluetooth.clearDTCs();
    if (success) {
      setDtcCodes([]);
      alert('Arıza kodları silindi');
    } else {
      setError('Kodlar silinemedi');
    }
  };

  // Not connected state
  if (!connectionState?.connected) {
    return (
      <div className="space-y-4">
        {/* Browser support check */}
        {isSupported === false && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Tarayıcı Desteklenmiyor</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Web Bluetooth bu tarayıcıda desteklenmiyor. Lütfen Chrome veya Edge kullanın.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Bağlantı Hatası</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Connect buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleConnect(false)}
            disabled={isConnecting || isSupported === false}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-secondary-300 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Bağlanıyor...
              </>
            ) : (
              <>
                <Bluetooth className="w-5 h-5" />
                OBD Cihazı Bağla
              </>
            )}
          </button>

          <button
            onClick={() => handleConnect(true)}
            disabled={isConnecting || isSupported === false}
            className="w-full flex items-center justify-center gap-2 bg-secondary-100 hover:bg-secondary-200 disabled:bg-secondary-50 text-secondary-700 py-2.5 px-4 rounded-xl font-medium transition-colors text-sm"
          >
            <List className="w-4 h-4" />
            Tüm Bluetooth Cihazlarını Göster
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-blue-800 text-xs">
            <strong>İpucu:</strong> OBD cihazınız listede görünmüyorsa, önce telefon ayarlarından Bluetooth ile eşleştirin, ardından &quot;Tüm Cihazları Göster&quot; seçeneğini kullanın.
          </p>
        </div>

        <p className="text-secondary-500 text-xs text-center">
          OBD-II cihazınızı araca takıp kontağı açın
        </p>
      </div>
    );
  }

  // Connected state
  return (
    <div className="space-y-4">
      {/* Connection info */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Bağlandı</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-secondary-500">Cihaz:</span>
            <span className="ml-1 text-secondary-800">{connectionState.deviceName}</span>
          </div>
          {connectionState.voltage && (
            <div>
              <span className="text-secondary-500">Voltaj:</span>
              <span className="ml-1 text-secondary-800">{connectionState.voltage}V</span>
            </div>
          )}
          {connectionState.protocol && (
            <div className="col-span-2">
              <span className="text-secondary-500">Protokol:</span>
              <span className="ml-1 text-secondary-800">{connectionState.protocol}</span>
            </div>
          )}
          {connectionState.vin && (
            <div className="col-span-2">
              <span className="text-secondary-500">VIN:</span>
              <span className="ml-1 font-mono text-secondary-800">{connectionState.vin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleReadCodes}
          disabled={isReading}
          className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          {isReading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Okunuyor...
            </>
          ) : (
            <>
              <Car className="w-4 h-4" />
              Kodları Oku
            </>
          )}
        </button>
        <button
          onClick={handleDisconnect}
          className="flex items-center justify-center gap-2 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          <BluetoothOff className="w-4 h-4" />
          Bağlantıyı Kes
        </button>
      </div>

      {/* DTC Codes Display */}
      {dtcCodes.length > 0 && (
        <div className="border border-secondary-200 rounded-xl overflow-hidden">
          <div className="bg-secondary-50 px-4 py-2 flex items-center justify-between">
            <h3 className="font-semibold text-secondary-800">
              Bulunan Kodlar ({dtcCodes.length})
            </h3>
            <button
              onClick={handleClearCodes}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Kodları Sil
            </button>
          </div>
          <div className="divide-y divide-secondary-100">
            {dtcCodes.map((dtc, index) => (
              <Link
                key={index}
                href={`/obd/${dtc.code.toLowerCase()}`}
                className="flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg text-secondary-800">
                    {dtc.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      dtc.status === 'active'
                        ? 'bg-red-100 text-red-700'
                        : dtc.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-secondary-100 text-secondary-700'
                    }`}
                  >
                    {dtc.status === 'active' ? 'Aktif' : dtc.status === 'pending' ? 'Beklemede' : 'Kalıcı'}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-secondary-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No codes found */}
      {dtcCodes.length === 0 && !isReading && connectionState.connected && (
        <div className="p-4 bg-secondary-50 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-secondary-600">
            Arıza kodu bulunamadı
          </p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
