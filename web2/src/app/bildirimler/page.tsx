'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell,
    BellOff,
    CheckCheck,
    Circle,
    Loader2,
    Clock,
} from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
    type?: string;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' });
}

function SkeletonRow() {
    return (
        <div className="flex gap-3 p-4 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-gray-800 mt-2 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/4 bg-gray-800 rounded" />
                <div className="h-3 w-full bg-gray-800 rounded" />
                <div className="h-3 w-1/3 bg-gray-800 rounded" />
            </div>
        </div>
    );
}

export default function BildirimlerPage() {
    const router = useRouter();
    const [jwt, setJwt] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [error, setError] = useState('');

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const fetchNotifications = useCallback(async (token: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/notifications?sort=createdAt:desc&pagination[pageSize]=50', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data?.data) {
                setNotifications(data.data);
            } else if (!data.success) {
                setError('Bildirimler yüklenemedi.');
            }
        } catch {
            setError('Bildirimler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('tamirhanem_jwt');
        if (!token) {
            router.push('/giris');
            return;
        }
        setJwt(token);
        fetchNotifications(token);
    }, [router, fetchNotifications]);

    const markNotificationRead = async (id: number) => {
        if (!jwt) return;
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        try {
            await fetch(`/api/notifications?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ data: { isRead: true } }),
            });
        } catch {
            // Silently fail — optimistic update stays
        }
    };

    const markAllRead = async () => {
        if (!jwt || unreadCount === 0) return;
        setMarkingAll(true);
        try {
            await fetch('/api/notifications/mark-as-read', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch {
            setError('Tümü okundu işaretlenemedi.');
        } finally {
            setMarkingAll(false);
        }
    };

    if (!jwt) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        Bildirimler
                        {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            disabled={markingAll}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {markingAll ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCheck className="w-3.5 h-3.5" />
                            )}
                            Tümünü Okundu İşaretle
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                {error && (
                    <div className="mx-4 mt-4 bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="divide-y divide-gray-800/60">
                        {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                        <BellOff className="w-14 h-14 text-gray-700 mb-4" />
                        <p className="text-gray-400 font-medium mb-1">Bildirim yok</p>
                        <p className="text-gray-600 text-sm">Yeni bildirimler burada görünecek.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800/60">
                        {notifications.map(notif => (
                            <button
                                key={notif.id}
                                onClick={() => {
                                    if (!notif.isRead) {
                                        markNotificationRead(notif.id);
                                    }
                                }}
                                className={`w-full flex gap-3 p-4 text-left transition-colors hover:bg-gray-900/80 ${
                                    !notif.isRead ? 'bg-blue-500/5' : ''
                                }`}
                            >
                                <div className="flex-shrink-0 mt-1.5">
                                    {notif.isRead ? (
                                        <Circle className="w-2 h-2 text-gray-700 fill-gray-700" />
                                    ) : (
                                        <Circle className="w-2 h-2 text-blue-500 fill-blue-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium leading-snug mb-0.5 ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                                        {notif.title}
                                    </p>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {notif.body}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {timeAgo(notif.createdAt)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
