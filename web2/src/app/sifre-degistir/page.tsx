'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Lock, Loader2 } from 'lucide-react';

interface FieldErrors {
  currentPassword?: string;
  password?: string;
  passwordConfirmation?: string;
}

export default function SifreDegistirPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  });
  const [show, setShow] = useState({
    currentPassword: false,
    password: false,
    passwordConfirmation: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) {
      router.replace('/giris');
    }
  }, [router]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.currentPassword) e.currentPassword = 'Mevcut şifre boş bırakılamaz.';
    if (!form.password) e.password = 'Yeni şifre boş bırakılamaz.';
    else if (form.password.length < 6) e.password = 'Şifre en az 6 karakter olmalıdır.';
    if (!form.passwordConfirmation) e.passwordConfirmation = 'Şifre tekrarı boş bırakılamaz.';
    else if (form.password !== form.passwordConfirmation) e.passwordConfirmation = 'Şifreler eşleşmiyor.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const jwt = localStorage.getItem('tamirhanem_jwt');
    if (!jwt) return;

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          password: form.password,
          passwordConfirmation: form.passwordConfirmation,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error?.message || data?.message || 'Şifre değiştirilemedi.';
        if (msg.toLowerCase().includes('current') || msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('wrong')) {
          setErrors({ currentPassword: 'Mevcut şifre hatalı.' });
        } else {
          showToast('error', msg);
        }
        return;
      }

      showToast('success', 'Şifreniz başarıyla güncellendi.');
      setForm({ currentPassword: '', password: '', passwordConfirmation: '' });
      setTimeout(() => router.push('/profil'), 1400);
    } catch {
      showToast('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const toggleShow = (field: keyof typeof show) => {
    setShow((p) => ({ ...p, [field]: !p[field] }));
  };

  const PasswordField = ({
    label,
    field,
    placeholder,
  }: {
    label: string;
    field: keyof typeof form;
    placeholder: string;
  }) => (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={show[field] ? 'text' : 'password'}
          value={form[field]}
          onChange={(e) => {
            setForm((p) => ({ ...p, [field]: e.target.value }));
            if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
          }}
          placeholder={placeholder}
          className={`w-full bg-gray-800 border text-white rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none transition-colors placeholder:text-gray-500 ${
            errors[field] ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-orange-500'
          }`}
        />
        <button
          type="button"
          onClick={() => toggleShow(field)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
          <h1 className="text-xl font-bold">Şifre Değiştir</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <p className="text-gray-400 text-sm mb-6">
            Güvenliğiniz için şifrenizi düzenli olarak değiştirmenizi öneririz. Yeni şifreniz en az 6 karakter olmalıdır.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField
              label="Mevcut Şifre"
              field="currentPassword"
              placeholder="Mevcut şifrenizi girin"
            />
            <PasswordField
              label="Yeni Şifre"
              field="password"
              placeholder="En az 6 karakter"
            />
            <PasswordField
              label="Yeni Şifre Tekrar"
              field="passwordConfirmation"
              placeholder="Yeni şifrenizi tekrar girin"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                'Şifremi Güncelle'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
