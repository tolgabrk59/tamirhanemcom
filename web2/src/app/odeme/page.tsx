'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Wallet,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Car,
  Wrench,
  X,
} from 'lucide-react';

interface AppointmentData {
  id: number;
  attributes?: {
    totalPrice?: number;
    total_price?: number;
    price?: number;
    notes?: string;
    status?: string;
    service?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          category?: string;
        };
      };
    };
    services?: {
      data?: Array<{
        id: number;
        attributes: { name: string; price?: number };
      }>;
    };
    vehicle?: {
      data?: {
        id: number;
        attributes: {
          brand: string;
          model: string;
          plate?: string;
          year?: number;
        };
      };
    };
  };
  // Strapi v4 flat response fallback
  totalPrice?: number;
  total_price?: number;
  price?: number;
  notes?: string;
  status?: string;
  service?: { id: number; name: string; category?: string } | null;
  services?: Array<{ id: number; name: string; price?: number }>;
  vehicle?: { id: number; brand: string; model: string; plate?: string; year?: number } | null;
}

interface WalletData {
  balance?: number;
  amount?: number;
  currency?: string;
}

type PaymentMethod = 'card' | 'wallet' | 'door';

type PaymentResponse =
  | { isLeadGen: true; message: string; appointmentId: number }
  | { provider: 'iyzico'; html: string }
  | { provider: 'paytr'; iframeUrl: string }
  | { provider: 'nomu'; redirectUrl: string }
  | { success: true; message: string }
  | { success: false; message: string }
  | { success: false; error: string };

function SuccessScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-8">
      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
      <p className="text-gray-400 text-center mb-8 max-w-xs">{message}</p>
      <Link
        href="/randevularim"
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-8 font-semibold transition-colors"
      >
        Randevularıma Git
      </Link>
    </div>
  );
}

export default function OdemePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('appointmentId');
  const iframeModalRef = useRef<HTMLDivElement>(null);
  const iyzicoFormRef = useRef<HTMLDivElement>(null);

  const [jwt, setJwt] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Result states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paytrIframeUrl, setPaytrIframeUrl] = useState<string | null>(null);
  const [iyzicoHtml, setIyzicoHtml] = useState<string | null>(null);

  // Read JWT from localStorage
  useEffect(() => {
    const token = localStorage.getItem('tamirhanem_jwt');
    if (!token) {
      router.replace(`/giris?redirect=/odeme${appointmentId ? `?appointmentId=${appointmentId}` : ''}`);
      return;
    }
    setJwt(token);
  }, [router, appointmentId]);

  // Fetch appointment + wallet
  useEffect(() => {
    if (!jwt || !appointmentId) {
      if (jwt && !appointmentId) {
        setError('Randevu ID bulunamadı.');
        setLoading(false);
      }
      return;
    }

    const headers = { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' };

    async function fetchData() {
      setLoading(true);
      setError(null);

      const [apptRes, walletRes] = await Promise.allSettled([
        fetch(`/api/appointments/${appointmentId}?populate=vehicle,service,services`, { headers }),
        fetch('/api/wallets/me', { headers }),
      ]);

      if (apptRes.status === 'fulfilled' && apptRes.value.ok) {
        const data = await apptRes.value.json();
        setAppointment(data.data || data);
      } else {
        setError('Randevu bilgileri alınamadı. Lütfen tekrar deneyin.');
      }

      if (walletRes.status === 'fulfilled' && walletRes.value.ok) {
        const data = await walletRes.value.json();
        setWallet(data.data || data.wallet || data);
      }

      setLoading(false);
    }

    fetchData();
  }, [jwt, appointmentId]);

  // Auto-submit iyzico 3DS form after injection
  useEffect(() => {
    if (!iyzicoHtml || !iyzicoFormRef.current) return;
    const form = iyzicoFormRef.current.querySelector('form');
    if (form) {
      form.submit();
    }
  }, [iyzicoHtml]);

  async function handlePayment() {
    if (!jwt || !appointmentId) return;
    setSubmitting(true);
    setPaymentError(null);

    try {
      const body: Record<string, unknown> = {
        appointmentId: Number(appointmentId),
        paymentMethod,
      };

      if (paymentMethod === 'wallet') {
        body.amount = appointment?.attributes?.totalPrice || 0;
      }

      let endpoint = '/api/payment/initialize';
      if (paymentMethod === 'wallet') endpoint = '/api/payment/wallet';
      if (paymentMethod === 'card') endpoint = '/api/payment/initialize-card';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result: PaymentResponse = await res.json();

      if (!res.ok && !('isLeadGen' in result) && !('provider' in result) && !('success' in result)) {
        setPaymentError((result as { error?: string }).error || 'Ödeme başlatılamadı. Lütfen tekrar deneyin.');
        return;
      }

      // Ödeme kapalı mesajı — lead-gen gibi davran
      if (result.success === false && 'message' in result && result.message) {
        setSuccessTitle('Randevunuz Alındı!');
        setSuccessMessage(result.message);
        setShowSuccess(true);
        return;
      }

      if ('isLeadGen' in result && result.isLeadGen) {
        setSuccessTitle('Randevunuz Alındı!');
        setSuccessMessage('Servis sizi en kısa sürede arayacak.');
        setShowSuccess(true);
        return;
      }

      if ('provider' in result) {
        if (result.provider === 'iyzico') {
          setIyzicoHtml(result.html);
          return;
        }
        if (result.provider === 'paytr') {
          setPaytrIframeUrl(result.iframeUrl);
          return;
        }
        if (result.provider === 'nomu') {
          window.location.href = result.redirectUrl;
          return;
        }
      }

      if ('success' in result && result.success) {
        setSuccessTitle('Ödeme Başarılı!');
        setSuccessMessage(result.message || 'Randevunuz onaylandı.');
        setShowSuccess(true);
        return;
      }

      if ('error' in result) {
        setPaymentError((result as { error: string }).error || 'Ödeme başarısız oldu.');
      }
    } catch {
      setPaymentError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  }

  // Derive appointment display data
  function getApptInfo() {
    if (!appointment) return null;
    const attrs = appointment.attributes;
    const workshopName =
      attrs?.service?.data?.attributes?.name || appointment.service?.name || null;
    const vehicle = attrs?.vehicle?.data?.attributes || appointment.vehicle || null;
    const services: Array<{ id: number; name: string; price?: number }> =
      attrs?.services?.data?.map((s) => ({ id: s.id, ...s.attributes })) ||
      appointment.services ||
      [];
    const totalPrice =
      attrs?.totalPrice ?? attrs?.total_price ?? attrs?.price ??
      appointment.totalPrice ?? appointment.total_price ?? appointment.price ?? null;

    return { workshopName, vehicle, services, totalPrice };
  }

  const walletBalance = wallet?.balance ?? wallet?.amount ?? 0;

  if (showSuccess) {
    return <SuccessScreen title={successTitle} message={successMessage} />;
  }

  // iyzico 3DS form injection
  if (iyzicoHtml) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin mr-2" />
            <p className="text-white text-sm">3D Secure sayfasına yönlendiriliyorsunuz...</p>
          </div>
          <div
            ref={iyzicoFormRef}
            dangerouslySetInnerHTML={{ __html: iyzicoHtml }}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // PayTR iframe modal
  if (paytrIframeUrl) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div ref={iframeModalRef} className="bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-white font-semibold">Güvenli Ödeme</span>
            <button
              onClick={() => setPaytrIframeUrl(null)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <iframe
            src={paytrIframeUrl}
            width="100%"
            height="600"
            className="block border-0"
            title="PayTR Ödeme"
          />
        </div>
      </div>
    );
  }

  if (loading || jwt === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Bir sorun oluştu</h2>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  const apptInfo = getApptInfo();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors p-1 -ml-1"
            aria-label="Geri"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-white font-bold text-lg">Ödeme</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Appointment Summary */}
        {apptInfo && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Randevu Özeti
            </h2>

            {apptInfo.workshopName && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{apptInfo.workshopName}</p>
                  <p className="text-gray-500 text-xs">Servis</p>
                </div>
              </div>
            )}

            {apptInfo.vehicle && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {apptInfo.vehicle.brand} {apptInfo.vehicle.model}
                    {apptInfo.vehicle.year ? ` (${apptInfo.vehicle.year})` : ''}
                  </p>
                  {apptInfo.vehicle.plate && (
                    <p className="text-gray-500 text-xs font-mono">{apptInfo.vehicle.plate}</p>
                  )}
                </div>
              </div>
            )}

            {apptInfo.services.length > 0 && (
              <div className="border-t border-gray-800 pt-3 mt-3 space-y-1.5">
                {apptInfo.services.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{svc.name}</span>
                    {svc.price != null && (
                      <span className="text-white text-sm font-medium">
                        ₺{svc.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {apptInfo.totalPrice != null && (
              <div className="border-t border-gray-800 pt-3 mt-3 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Toplam</span>
                <span className="text-white text-lg font-bold">
                  ₺{apptInfo.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Ödeme Yöntemi
          </h2>

          <div className="space-y-2">
            {/* Credit/Debit Card */}
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                paymentMethod === 'card'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                paymentMethod === 'card' ? 'bg-orange-500/20' : 'bg-gray-800'
              }`}>
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-orange-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${paymentMethod === 'card' ? 'text-white' : 'text-gray-300'}`}>
                  Kredi / Banka Kartı
                </p>
                <p className="text-gray-500 text-xs">Tüm kartlar destekleniyor</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                paymentMethod === 'card' ? 'border-orange-500 bg-orange-500' : 'border-gray-600'
              }`} />
            </button>

            {/* Wallet */}
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                paymentMethod === 'wallet'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                paymentMethod === 'wallet' ? 'bg-orange-500/20' : 'bg-gray-800'
              }`}>
                <Wallet className={`w-5 h-5 ${paymentMethod === 'wallet' ? 'text-orange-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${paymentMethod === 'wallet' ? 'text-white' : 'text-gray-300'}`}>
                  Cüzdan
                </p>
                <p className="text-gray-500 text-xs">
                  Bakiye:{' '}
                  <span className={walletBalance > 0 ? 'text-emerald-400' : 'text-gray-500'}>
                    ₺{walletBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                paymentMethod === 'wallet' ? 'border-orange-500 bg-orange-500' : 'border-gray-600'
              }`} />
            </button>

            {/* Door Payment */}
            <button
              onClick={() => setPaymentMethod('door')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                paymentMethod === 'door'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                paymentMethod === 'door' ? 'bg-orange-500/20' : 'bg-gray-800'
              }`}>
                {/* Banknote icon inline SVG */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-5 h-5 ${paymentMethod === 'door' ? 'text-orange-400' : 'text-gray-400'}`}
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${paymentMethod === 'door' ? 'text-white' : 'text-gray-300'}`}>
                  Kapıda Ödeme
                </p>
                <p className="text-gray-500 text-xs">Servis noktasında nakit veya kart</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                paymentMethod === 'door' ? 'border-orange-500 bg-orange-500' : 'border-gray-600'
              }`} />
            </button>
          </div>
        </div>

        {/* Error */}
        {paymentError && (
          <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePayment}
          disabled={submitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              İşleniyor...
            </>
          ) : (
            'Ödemeyi Başlat'
          )}
        </button>

        {/* Security note */}
        <p className="text-gray-600 text-xs text-center pb-4">
          Tüm ödemeler SSL ile şifrelenir ve güvenli altyapımızda işlenir.
        </p>
      </main>
    </div>
  );
}
