'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

type PaymentStatus = 'loading' | 'success' | 'failure' | 'pending';

interface PaymentStatusResponse {
  status?: string;
  paymentStatus?: string;
  success?: boolean;
  error?: string;
}

export default function OdemeCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get('status');
  const paymentId = searchParams.get('paymentId');
  const appointmentId = searchParams.get('appointmentId');

  const [jwt, setJwt] = useState<string | null>(null);
  const [pageStatus, setPageStatus] = useState<PaymentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('tamirhanem_jwt');
    setJwt(token);
  }, []);

  useEffect(() => {
    if (jwt === null) return; // still loading from localStorage

    // If no JWT, redirect to login
    if (!jwt) {
      router.replace('/giris');
      return;
    }

    // If query param already signals failure, skip API call
    if (status === 'fail' || status === 'failure' || status === 'cancel') {
      setPageStatus('failure');
      return;
    }

    // Determine which ID to query
    const idToQuery = paymentId || appointmentId;

    if (!idToQuery) {
      // No ID to query — if status param says success accept it, otherwise show pending
      if (status === 'success' || status === 'ok') {
        setPageStatus('success');
      } else {
        setPageStatus('pending');
      }
      return;
    }

    async function checkStatus() {
      setPageStatus('loading');
      try {
        const res = await fetch(`/api/payment/status/${idToQuery}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        const data: PaymentStatusResponse = await res.json();

        if (!res.ok) {
          setErrorMessage(data?.error || 'Ödeme durumu alınamadı.');
          setPageStatus('failure');
          return;
        }

        const normalizedStatus = (
          data.status || data.paymentStatus || ''
        ).toLowerCase();

        if (
          normalizedStatus === 'success' ||
          normalizedStatus === 'completed' ||
          normalizedStatus === 'paid' ||
          data.success === true
        ) {
          setPageStatus('success');
        } else if (
          normalizedStatus === 'pending' ||
          normalizedStatus === 'processing' ||
          normalizedStatus === 'waiting'
        ) {
          setPageStatus('pending');
        } else {
          setErrorMessage('Ödeme işlemi tamamlanamadı.');
          setPageStatus('failure');
        }
      } catch {
        setErrorMessage('Bağlantı hatası. Lütfen tekrar deneyin.');
        setPageStatus('failure');
      }
    }

    checkStatus();
  }, [jwt, status, paymentId, appointmentId, router]);

  if (jwt === null || pageStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
          <p className="text-gray-400 text-sm">Ödeme durumu kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (pageStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-8">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Ödeme Başarılı!</h2>
        <p className="text-gray-400 text-center mb-8 max-w-xs">
          Randevunuz onaylandı. Servis sizi en kısa sürede arayacak.
        </p>
        <Link
          href="/randevularim"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-8 font-semibold transition-colors"
        >
          Randevularıma Git
        </Link>
      </div>
    );
  }

  if (pageStatus === 'failure') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-8">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Ödeme Başarısız</h2>
        <p className="text-gray-400 text-center mb-2 max-w-xs">
          {errorMessage || 'Lütfen tekrar deneyin.'}
        </p>
        <p className="text-gray-600 text-sm text-center mb-8 max-w-xs">
          Sorun devam ederse farklı bir ödeme yöntemi seçebilirsiniz.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {appointmentId && (
            <Link
              href={`/odeme?appointmentId=${appointmentId}`}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-8 font-semibold transition-colors text-center"
            >
              Tekrar Dene
            </Link>
          )}
          <Link
            href="/randevularim"
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-3 px-8 font-medium transition-colors text-center"
          >
            Randevularıma Git
          </Link>
        </div>
      </div>
    );
  }

  // pending
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-8">
      <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Ödemeniz İşleniyor</h2>
      <p className="text-gray-400 text-center mb-8 max-w-xs">
        Ödemeniz bankamız tarafından işleme alındı. Onay geldikten sonra randevunuz aktif olacak.
      </p>
      <Link
        href="/"
        className="text-gray-400 hover:text-white font-medium transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
