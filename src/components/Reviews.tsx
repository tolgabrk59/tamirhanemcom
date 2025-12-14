import { getRecentReviews } from '@/data/reviews';
import type { Review } from '@/types';

interface ReviewsProps {
  reviews?: Review[];
  limit?: number;
}

export default function ReviewsSection({ reviews, limit = 3 }: ReviewsProps) {
  const displayReviews = reviews || getRecentReviews(limit);

  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Kullanıcı Yorumları
          </h2>
          <p className="text-secondary-600">
            TamirHanem kullanıcılarının deneyimleri
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-lg">
              {review.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-secondary-900">{review.name}</p>
            {review.vehicleBrand && (
              <p className="text-sm text-secondary-500">
                {review.vehicleBrand} {review.vehicleModel}
              </p>
            )}
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < review.rating ? 'text-yellow-400' : 'text-secondary-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-secondary-600 text-sm leading-relaxed mb-4">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-secondary-400 pt-4 border-t border-secondary-100">
        {review.service && (
          <span className="bg-secondary-100 px-2 py-1 rounded">{review.service}</span>
        )}
        <span>
          {new Date(review.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}
