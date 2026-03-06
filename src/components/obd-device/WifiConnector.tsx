'use client';

import { useState } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Loader2, Settings, Smartphone } from 'lucide-react';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WifiSettings {
  ipAddress: string;
  port: string;
}

export default function WifiConnector() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<WifiSettings>({
    ipAddress: '192.168.0.10',
    port: '35000'
  });

  const handleConnect = async () => {
    setStatus('connecting');
    setError(null);

    try {
      // WiFi OBD cihazları genellikle kendi WiFi ağını oluşturur
      // Kullanıcı önce bu ağa bağlanmalı, sonra WebSocket veya HTTP ile iletişim kurulur

      // Simüle edilen bağlantı kontrolü
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Gerçek implementasyonda:
      // const ws = new WebSocket(`ws://${settings.ipAddress}:${settings.port}`);
      // veya
      // const response = await fetch(`http://${settings.ipAddress}:${settings.port}/connect`);

      // Şimdilik demo amaçlı hata gösteriyoruz
      setError('WiFi OBD bağlantısı için önce cihazınızın WiFi ağına bağlanın. Detaylar aşağıda.');
      setStatus('error');
    } catch (err) {
      setError('Bağlantı başarısız. Cihazın WiFi ağına bağlı olduğunuzdan emin olun.');
      setStatus('error');
    }
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Connection Button */}
      <div className="flex gap-3">
        {status === 'disconnected' || status === 'error' ? (
          <button
            onClick={handleConnect}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
          >
            <Wifi className="w-5 h-5" />
            WiFi ile Bağlan
          </button>
        ) : status === 'connecting' ? (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-400 text-white px-4 py-3 rounded-xl font-semibold cursor-not-allowed"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Bağlanıyor...
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
          >
            <WifiOff className="w-5 h-5" />
            Bağlantıyı Kes
          </button>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-xl transition-colors"
          title="Ayarlar"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-secondary-50 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-secondary-700 text-sm">Bağlantı Ayarları</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-secondary-600 mb-1">IP Adresi</label>
              <input
                type="text"
                value={settings.ipAddress}
                onChange={(e) => setSettings({ ...settings, ipAddress: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="192.168.0.10"
              />
            </div>
            <div>
              <label className="block text-xs text-secondary-600 mb-1">Port</label>
              <input
                type="text"
                value={settings.port}
                onChange={(e) => setSettings({ ...settings, port: e.target.value })}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="35000"
              />
            </div>
          </div>
          <p className="text-xs text-secondary-500">
            Çoğu WiFi OBD cihazı varsayılan olarak 192.168.0.10:35000 kullanır.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {/* How to Connect Guide */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
        <h4 className="font-semibold text-purple-800 text-sm mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          WiFi OBD Nasıl Bağlanır?
        </h4>
        <ol className="space-y-2 text-sm text-purple-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <span>OBD cihazını aracın OBD portuna takın</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <span>Telefonunuzun <strong>WiFi Ayarları</strong>&apos;na gidin</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <span>
              <strong>&quot;OBD&quot;</strong>, <strong>&quot;ELM327&quot;</strong> veya <strong>&quot;WiFi_OBD&quot;</strong>
              adlı ağa bağlanın
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <span>Bu sayfaya dönün ve &quot;WiFi ile Bağlan&quot; butonuna tıklayın</span>
          </li>
        </ol>

        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <p className="text-xs text-purple-600">
            <strong>Not:</strong> WiFi OBD kullanırken internet bağlantınız kesilecektir çünkü
            telefonunuz OBD cihazının WiFi ağına bağlı olacaktır.
          </p>
        </div>
      </div>

      {/* iOS Advantage */}
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800">
          <strong>iPhone/iPad uyumlu:</strong> WiFi OBD, iOS&apos;ta özel tarayıcı gerektirmeden çalışır!
        </p>
      </div>
    </div>
  );
}
