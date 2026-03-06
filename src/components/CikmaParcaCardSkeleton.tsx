'use client';

export default function CikmaParcaCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />

        <div className="mt-3 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
