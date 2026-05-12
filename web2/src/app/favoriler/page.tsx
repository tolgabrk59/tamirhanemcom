'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Phone, Star, Car, Trash2, Calendar, Store, X, Loader2 } from 'lucide-react';

interface Favorite {
    id: number;
    attributes: {
        createdAt: string;
        service?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    address?: string;
                    city?: string;
                    district?: string;
                    phone?: string;
                    rating?: number;
                    reviewCount?: number;
                    category?: string;
                    ProfilePicture?: {
                        data?: { attributes: { url: string } };
                    };
                };
            };
        };
    };
}

function SkeletonCard() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-44 bg-gray-800" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-800 rounded w-2/5" />
                <div className="flex gap-2 mt-4">
                    <div className="h-9 bg-gray-800 rounded-xl flex-1" />
                    <div className="h-9 bg-gray-800 rounded-xl w-28" />
                </div>
            </div>
        </div>
    );
}

interface ConfirmDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function ConfirmDialog({ onConfirm, onCancel, loading }: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-base">Favoriden Kaldır</p>
                        <p className="text-gray-400 text-sm mt-0.5">Bu servisi favorilerden kaldırmak istiyor musunuz?</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Kaldır
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FavorilerPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingRemove, setPendingRemove] = useState<number | null>(null);
    const [removing, setRemoving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('tamirhanem_jwt');
        setIsAuthenticated(!!token);
    }, []);

    const fetchFavorites = useCallback(async () => {
        const token = localStorage.getItem('tamirhanem_jwt');
        if (!token) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/favorites?populate=service,service.ProfilePicture', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Favoriler yüklenemedi');
            const data = await res.json();
            setFavorites(data?.data ?? []);
        } catch {
            setError('Favoriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, fetchFavorites]);

    const handleRemoveConfirm = async () => {
        if (pendingRemove === null) return;
        const token = localStorage.getItem('tamirhanem_jwt');
        if (!token) return;

        setRemoving(true);
        try {
            const res = await fetch(`/api/favorites/${pendingRemove}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setFavorites((prev) => prev.filter((f) => f.id !== pendingRemove));
        } catch {
            // Hata sessizce geçilir, liste korunur
        } finally {
            setRemoving(false);
            setPendingRemove(null);
        }
    };

    if (!isAuthenticated && !loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-orange-400" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Giriş Yapmalısınız</h2>
                    <p className="text-gray-400 text-sm mb-6">Favori servislerinizi görmek için lütfen hesabınıza giriş yapın.</p>
                    <Link
                        href="/giris"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
                    >
                        Giriş Yap
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {pendingRemove !== null && (
                <ConfirmDialog
                    onConfirm={handleRemoveConfirm}
                    onCancel={() => setPendingRemove(null)}
                    loading={removing}
                />
            )}

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-orange-400 fill-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Favori Servislerim</h1>
                        {!loading && favorites.length > 0 && (
                            <p className="text-gray-400 text-sm">{favorites.length} servis kayıtlı</p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
                            <Heart className="w-9 h-9 text-gray-600" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">Henüz Favori Servis Eklemediniz</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">Beğendiğiniz servisleri favorilerinize ekleyerek hızlıca erişebilirsiniz.</p>
                        <Link
                            href="/servisler"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-colors inline-flex items-center gap-2"
                        >
                            <Store className="w-4 h-4" />
                            Servisleri Keşfet
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((fav) => {
                            const service = fav.attributes.service?.data;
                            if (!service) return null;
                            const attrs = service.attributes;
                            const pictureUrl = attrs.ProfilePicture?.data?.attributes?.url;
                            const locationParts = [attrs.district, attrs.city].filter(Boolean);

                            return (
                                <div
                                    key={fav.id}
                                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
                                >
                                    <div className="relative h-44 flex-shrink-0">
                                        {pictureUrl ? (
                                            <img
                                                src={pictureUrl}
                                                alt={attrs.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                                                <Car className="w-12 h-12 text-white/60" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setPendingRemove(fav.id)}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                                            title="Favoriden kaldır"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-base mb-1 leading-tight line-clamp-1">
                                            {attrs.name}
                                        </h3>

                                        {locationParts.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-1">
                                                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-orange-400" />
                                                <span className="line-clamp-1">{locationParts.join(', ')}</span>
                                            </div>
                                        )}

                                        {attrs.phone && (
                                            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-1">
                                                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>{attrs.phone}</span>
                                            </div>
                                        )}

                                        {(attrs.rating !== undefined || attrs.reviewCount !== undefined) && (
                                            <div className="flex items-center gap-1.5 text-sm mb-2">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                <span className="text-yellow-400 font-medium">
                                                    {attrs.rating?.toFixed(1) ?? '—'}
                                                </span>
                                                {attrs.reviewCount !== undefined && (
                                                    <span className="text-gray-500">({attrs.reviewCount} yorum)</span>
                                                )}
                                            </div>
                                        )}

                                        {attrs.category && (
                                            <div className="mb-3">
                                                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                                                    {attrs.category}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-auto pt-2">
                                            <Link
                                                href={`/randevu-al?service=${service.id}`}
                                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-3 text-sm font-medium flex-1 flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <Calendar className="w-4 h-4" />
                                                Randevu Al
                                            </Link>
                                            <Link
                                                href={`/servisler/${service.id}`}
                                                className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2 px-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <Store className="w-4 h-4" />
                                                Servisi Gör
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
