'use client';

// Shimmer effect ile skeleton loader
export default function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Image Skeleton with shimmer */}
            <div className="h-36 sm:h-40 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                {/* Index Badge */}
                <div className="absolute top-2 left-2 w-7 h-7 bg-gray-300 rounded-full" />
                {/* Favorite Button */}
                <div className="absolute top-2 right-2 w-10 h-10 sm:w-9 sm:h-9 bg-gray-300 rounded-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-10" />
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm" />
                        ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>

                {/* Address */}
                <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded mt-0.5" />
                    <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-full relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
            </div>
        </div>
    );
}

export function ServiceCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
            ))}
        </>
    );
}

// Horizontal card skeleton for ServiceSearchModal
export function ServiceCardSkeletonHorizontal() {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-200 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                </div>

                {/* Address */}
                <div className="h-3 bg-gray-200 rounded w-1/2" />

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                </div>
            </div>
        </div>
    );
}

export function ServiceCardSkeletonHorizontalList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <ServiceCardSkeletonHorizontal key={index} />
            ))}
        </div>
    );
}

// Generic content skeleton for pages
export function ContentSkeleton({ lines = 4 }: { lines?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`h-4 bg-gray-200 rounded relative overflow-hidden ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
                >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
            ))}
        </div>
    );
}

// Card skeleton for generic cards
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <ContentSkeleton lines={3} />
        </div>
    );
}
