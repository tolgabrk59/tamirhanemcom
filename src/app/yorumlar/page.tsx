import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Araç Yorumları - Kullanıcı Deneyimleri',
  description: 'Araç sahiplerinin deneyimlerini ve yorumlarını okuyun. Gerçek kullanıcı görüşleri ile doğru karar verin.',
};

const reviews = [
  { brand: 'Toyota', model: 'Corolla', year: 2022, rating: 4.5, comment: 'Güvenilir ve yakıt tüketimi düşük bir araç.' },
  { brand: 'Honda', model: 'Civic', year: 2021, rating: 4.3, comment: 'Konforlu ve performansı iyi.' },
  { brand: 'Volkswagen', model: 'Golf', year: 2022, rating: 4.2, comment: 'Sağlam yapısı ve iyi yol tutuşu var.' },
  { brand: 'Ford', model: 'Focus', year: 2021, rating: 4.0, comment: 'Fiyat/performans oranı iyi.' },
  { brand: 'BMW', model: '3 Serisi', year: 2022, rating: 4.6, comment: 'Sürüş keyfi mükemmel.' },
  { brand: 'Mercedes', model: 'C-Class', year: 2022, rating: 4.5, comment: 'Konfor ve kalite bir arada.' },
];

export default function YorumlarPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Araç Yorumları
          </h1>
          <p className="text-lg text-secondary-600">
            Gerçek kullanıcı deneyimlerini keşfedin
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-secondary-900">
                    {review.brand} {review.model}
                  </h3>
                  <p className="text-sm text-secondary-500">{review.year} Model</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold text-secondary-900">{review.rating}</span>
                </div>
              </div>
              <p className="text-secondary-600">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-primary-800 mb-2">Yorum Eklemek İster misiniz?</h2>
          <p className="text-primary-700 mb-4">Aracınızla ilgili deneyimlerinizi paylaşın</p>
          <Link href="/iletisim" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            İletişime Geçin
          </Link>
        </div>
      </div>
    </div>
  );
}
