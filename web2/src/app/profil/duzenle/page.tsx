'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, User, Save, Loader2 } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
  district?: string;
  avatar?: { url?: string } | null;
}

interface FormState {
  name: string;
  city: string;
  district: string;
}

export default function ProfilDuzenlePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState<FormState>({
    name: '',
    city: '',
    district: '',
  });

  useEffect(() => {
    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) {
      router.replace('/giris');
      return;
    }

    fetch('/api/users/me?populate=avatar', {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          localStorage.removeItem('tamirhanem_jwt');
          localStorage.removeItem('tamirhanem_user');
          router.replace('/giris');
          return;
        }
        const u: UserData = data.user || data;
        setUser(u);
        setForm({
          name: u.name || '',
          city: u.city || '',
          district: u.district || '',
        });
        if (u.avatar?.url) {
          const url = u.avatar.url;
          setAvatarUrl(url.startsWith('http') ? url : `https://api.tamirhanem.net${url}`);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) return;

    setAvatarUploading(true);

    try {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('ref', 'plugin::users-permissions.user');
      fd.append('refId', String(user.id));
      fd.append('field', 'avatar');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
        body: fd,
      });

      if (!uploadRes.ok) throw new Error('Yükleme başarısız');

      const uploaded: Array<{ url: string }> = await uploadRes.json();
      const newUrl = uploaded[0]?.url;
      if (!newUrl) throw new Error('URL alınamadı');

      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://api.tamirhanem.net${newUrl}`;
      setAvatarUrl(fullUrl);
      showToast('success', 'Fotoğraf güncellendi');
    } catch {
      showToast('error', 'Fotoğraf yüklenemedi');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
        }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız');

      const updated = await res.json();
      const updatedUser = updated.user || updated;
      localStorage.setItem('tamirhanem_user', JSON.stringify(updatedUser));
      showToast('success', 'Profil güncellendi');
      setTimeout(() => router.back(), 1200);
    } catch {
      showToast('error', 'Profil güncellenemedi. Tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (u: UserData) => {
    if (u.name) return u.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    return u.username.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold">Profili Düzenle</h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center border-4 border-orange-600">
                <span className="text-3xl font-bold text-white">{getInitials(user)}</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-60"
            >
              {avatarUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="mt-3 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {avatarUploading ? 'Yükleniyor...' : 'Fotoğrafı Değiştir'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Ad Soyad
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ad Soyad"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Kullanıcı Adı
              </label>
              <div className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>@{user.username}</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                E-posta
              </label>
              <div className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 rounded-xl px-4 py-3 text-sm">
                {user.email || '-'}
              </div>
              <p className="text-gray-600 text-xs mt-1">E-posta değiştirmek için destek ile iletişime geçin.</p>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Telefon
              </label>
              <div className="w-full bg-gray-800/50 border border-gray-700 text-gray-500 rounded-xl px-4 py-3 text-sm">
                {user.phone || '-'}
              </div>
              <p className="text-gray-600 text-xs mt-1">Telefon değiştirmek için OTP doğrulaması gereklidir.</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold">Konum Bilgileri</h2>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Şehir
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder="Şehir"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
                İlçe
              </label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                placeholder="İlçe"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
