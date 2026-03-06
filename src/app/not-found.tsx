import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-secondary-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-secondary-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          Ana sayfaya dönerek devam edebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/obd"
            className="bg-white text-secondary-700 px-6 py-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors font-medium"
          >
            OBD Kodlarına Git
          </Link>
        </div>
      </div>
    </div>
  );
}
