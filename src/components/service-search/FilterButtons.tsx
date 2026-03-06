'use client';

interface FilterButtonsProps {
    filterOfficial: boolean;
    filterRoadside: boolean;
    onToggleOfficial: () => void;
    onToggleRoadside: () => void;
}

export function FilterButtons({ filterOfficial, filterRoadside, onToggleOfficial, onToggleRoadside }: FilterButtonsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Musaitlik</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm">Aktif Teklifler</span>
            </button>
            <button
                onClick={onToggleOfficial}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                    filterOfficial ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
                <span className="text-sm">Yetkili Servis</span>
            </button>
            <button
                onClick={onToggleRoadside}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors ${
                    filterRoadside ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
                <span className="text-sm">Yol Yardim</span>
            </button>
        </div>
    );
}
