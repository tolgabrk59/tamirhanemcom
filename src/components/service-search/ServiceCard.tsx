'use client';

import { Service } from './types';

interface ServiceCardProps {
    service: Service;
    index: number;
    isHovered: boolean;
    onHover: (id: number | null) => void;
    onClick: () => void;
}

export function ServiceCard({ service, index, isHovered, onHover, onClick }: ServiceCardProps) {
    return (
        <div
            className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group mb-3 ${
                isHovered
                    ? 'border-primary-500 shadow-2xl scale-[1.02] -translate-y-1'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-xl'
            }`}
            onClick={onClick}
            onMouseEnter={() => onHover(service.id)}
            onMouseLeave={() => onHover(null)}
            onTouchStart={() => onHover(service.id)}
            onFocus={() => onHover(service.id)}
            onBlur={() => onHover(null)}
            tabIndex={0}
            role="button"
            aria-label={`${service.name} servisini seç`}
        >
            <div className="flex">
                <ServiceImage pic={service.pic} name={service.name} />
                <ServiceInfo service={service} index={index} />
            </div>
        </div>
    );
}

function ServiceImage({ pic, name }: { pic: string | null; name: string }) {
    if (pic) {
        return (
            <img
                src={pic.startsWith('http') ? pic : `https://api.tamirhanem.com${pic}`}
                alt={name}
                className="w-36 h-36 object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3C/svg%3E';
                }}
            />
        );
    }

    return (
        <div className="w-36 h-36 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12" />
            <svg className="w-16 h-16 text-primary-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        </div>
    );
}

function ServiceInfo({ service, index }: { service: Service; index: number }) {
    return (
        <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                        {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                        {service.name}
                    </h3>
                </div>
            </div>

            <StarRating rating={service.rating} count={service.rating_count} />

            <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {service.location}
            </p>

            <button
                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${service.phone}`; }}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-center py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
                Musaitlik Kontrolu
            </button>
        </div>
    );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-bold text-gray-900">{rating?.toFixed(1)}</span>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 transition-colors ${(rating || 0) >= star ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            {count && <span className="text-xs text-gray-500 ml-1">({count})</span>}
        </div>
    );
}
