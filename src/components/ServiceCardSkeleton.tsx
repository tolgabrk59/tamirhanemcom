'use client';

export default function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-28 sm:h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative">
                {/* Index Badge */}
                <div className="absolute top-2 left-2 w-7 h-7 bg-gray-300 rounded-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-2">
                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="h-3 bg-gray-200 rounded w-8" />
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm" />
                        ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-6" />
                </div>

                {/* Address */}
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>

                {/* Status */}
                <div className="h-3 bg-gray-200 rounded w-1/3" />

                {/* Button */}
                <div className="h-8 bg-gray-200 rounded-lg w-full mt-2" />
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
