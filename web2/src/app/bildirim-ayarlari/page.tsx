'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, BellOff, Loader2 } from 'lucide-react';

interface NotifSettings {
  appointment_notifications: boolean;
  message_notifications: boolean;
  campaign_notifications: boolean;
  service_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

type SettingKey = keyof NotifSettings;

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-600'} disabled:opacity-50`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  );
}

type PushPermission = 'default' | 'granted' | 'denied';

export default function BildirimAyarlariPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<NotifSettings>({
    appointment_notifications: false,
    message_notifications: false,
    campaign_notifications: false,
    service_notifications: false,
    email_notifications: false,
    sms_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SettingKey | null>(null);
  const [pushPermission, setPushPermission] = useState<PushPermission>('default');
  const [requestingPush, setRequestingPush] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) {
      router.replace('/giris');
      return;
    }

    if (typeof Notification !== 'undefined') {
      setPushPermission(Notification.permission as PushPermission);
    }

    fetch('/api/user-consents', {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setSettings({
          appointment_notifications: !!data.appointment_notifications,
          message_notifications: !!data.message_notifications,
          campaign_notifications: !!data.campaign_notifications,
          service_notifications: !!data.service_notifications,
          email_notifications: !!data.email_notifications,
          sms_notifications: !!data.sms_notifications,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleToggle = async (key: SettingKey, value: boolean) => {
    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) return;

    setSettings((p) => ({ ...p, [key]: value }));
    setSaving(key);

    try {
      const res = await fetch('/api/user-consents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) {
        setSettings((p) => ({ ...p, [key]: !value }));
      }
    } catch {
      setSettings((p) => ({ ...p, [key]: !value }));
    } finally {
      setSaving(null);
    }
  };

  const handlePushPermission = async () => {
    if (typeof Notification === 'undefined') return;
    setRequestingPush(true);
    try {
      const result = await Notification.requestPermission();
      setPushPermission(result as PushPermission);
    } catch {
      // tarayıcı desteklemiyor
    } finally {
      setRequestingPush(false);
    }
  };

  const toggleItems: { key: SettingKey; label: string; description: string }[] = [
    { key: 'appointment_notifications', label: 'Randevu Bildirimleri', description: 'Randevu oluşturma, iptal ve hatırlatma bildirimleri' },
    { key: 'message_notifications', label: 'Mesaj Bildirimleri', description: 'Servis ve müşteri mesajları' },
    { key: 'campaign_notifications', label: 'Kampanya Bildirimleri', description: 'Özel indirimler ve kampanyalar' },
    { key: 'service_notifications', label: 'Servis Güncellemeleri', description: 'Araç servis durumu ve ilerleme' },
    { key: 'email_notifications', label: 'E-posta Bildirimleri', description: 'Önemli bilgileri e-postayla al' },
    { key: 'sms_notifications', label: 'SMS Bildirimleri', description: 'Acil durum ve doğrulama SMS\'leri' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold">Bildirim Ayarları</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <h2 className="text-white font-semibold text-lg mb-4">Bildirim Tercihleri</h2>
          {toggleItems.map((item, idx) => (
            <div
              key={item.key}
              className={`flex items-center justify-between py-4 ${idx < toggleItems.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <div className="flex-1 mr-4">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {saving === item.key && (
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                )}
                <ToggleSwitch
                  checked={settings[item.key]}
                  onChange={(v) => handleToggle(item.key, v)}
                  disabled={saving !== null}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Tarayıcı Bildirimleri</h2>
              <p className="text-gray-400 text-sm mt-0.5">Web push bildirimleri ile anlık haberdar olun.</p>
            </div>
          </div>

          {pushPermission === 'granted' && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-950/30 border border-green-800 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              Bildirimler Açık — Tarayıcı bildirimleri etkin.
            </div>
          )}

          {pushPermission === 'denied' && (
            <div className="flex items-start gap-2 text-amber-400 text-sm bg-amber-950/20 border border-amber-800 rounded-xl px-4 py-3">
              <BellOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Bildirimler engellendi. Tarayıcı ayarlarından bu site için bildirimlere izin verin.</span>
            </div>
          )}

          {pushPermission === 'default' && (
            <button
              onClick={handlePushPermission}
              disabled={requestingPush}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {requestingPush ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  İzin İsteniyor...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Bildirimlere İzin Ver
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
