'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RandevuTalebi {
    id: number;
    phone: string;
    name?: string;
    city: string;
    district?: string;
    brand: string;
    model: string;
    year?: string;
    fuel_type?: string;
    category: string;
    notes?: string;
    status: string;
    createdAt: string;
}

interface WaitlistItem {
    id: number;
    phone: string;
    email?: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'randevu' | 'waitlist'>('randevu');
    const [randevuTalepleri, setRandevuTalepleri] = useState<RandevuTalebi[]>([]);
    const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // Auth kontrolü
    useEffect(() => {
        fetch('/api/admin/auth')
            .then(res => res.json())
            .then(data => {
                if (!data.authenticated) {
                    router.push('/admin');
                } else {
                    setAuthenticated(true);
                    fetchData();
                }
            })
            .catch(() => router.push('/admin'));
    }, [router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [randevuRes, waitlistRes] = await Promise.all([
                fetch('/api/admin/randevu-talepleri'),
                fetch('/api/admin/waitlist')
            ]);

            const randevuData = await randevuRes.json();
            const waitlistData = await waitlistRes.json();

            setRandevuTalepleri(randevuData.data || []);
            setWaitlist(waitlistData.data || []);
        } catch (error) {
            console.error('Veri çekme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin');
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch('/api/admin/randevu-talepleri', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            fetchData();
        } catch (error) {
            console.error('Güncelleme hatası:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            contacted: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        const labels: Record<string, string> = {
            pending: 'Bekliyor',
            contacted: 'İletişime Geçildi',
            completed: 'Tamamlandı',
            cancelled: 'İptal'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-xl font-bold text-primary-600">
                            TamirHanem
                        </Link>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 font-medium">Admin Paneli</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-primary-600">{randevuTalepleri.length}</div>
                        <div className="text-gray-600 text-sm">Toplam Randevu Talebi</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-yellow-600">
                            {randevuTalepleri.filter(r => r.status === 'pending').length}
                        </div>
                        <div className="text-gray-600 text-sm">Bekleyen Talepler</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-green-600">
                            {randevuTalepleri.filter(r => r.status === 'completed').length}
                        </div>
                        <div className="text-gray-600 text-sm">Tamamlanan</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">{waitlist.length}</div>
                        <div className="text-gray-600 text-sm">Waitlist Kayıtları</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b flex">
                        <button
                            onClick={() => setActiveTab('randevu')}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'randevu'
                                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Randevu Talepleri ({randevuTalepleri.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('waitlist')}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'waitlist'
                                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Waitlist ({waitlist.length})
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Yükleniyor...</p>
                        </div>
                    ) : activeTab === 'randevu' ? (
                        <div className="overflow-x-auto">
                            {randevuTalepleri.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    Henüz randevu talebi yok
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Araç</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Konum</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hizmet</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {randevuTalepleri.map((talep) => (
                                            <tr key={talep.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatDate(talep.createdAt)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{talep.name || '-'}</div>
                                                    <a href={`tel:${talep.phone}`} className="text-sm text-primary-600 hover:underline">
                                                        {talep.phone}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium text-gray-900">{talep.brand} {talep.model}</div>
                                                    <div className="text-xs text-gray-500">{talep.year} • {talep.fuel_type}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {talep.city}{talep.district ? `, ${talep.district}` : ''}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{talep.category}</td>
                                                <td className="px-4 py-3">{getStatusBadge(talep.status)}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={talep.status}
                                                        onChange={(e) => updateStatus(talep.id, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="pending">Bekliyor</option>
                                                        <option value="contacted">İletişime Geçildi</option>
                                                        <option value="completed">Tamamlandı</option>
                                                        <option value="cancelled">İptal</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {waitlist.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    Henüz waitlist kaydı yok
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {waitlist.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-600">#{item.id}</td>
                                                <td className="px-4 py-3">
                                                    <a href={`tel:${item.phone}`} className="text-sm text-primary-600 hover:underline">
                                                        {item.phone || '-'}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <a href={`mailto:${item.email}`} className="text-sm text-primary-600 hover:underline">
                                                        {item.email || '-'}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={fetchData}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Verileri Yenile
                    </button>
                </div>
            </main>
        </div>
    );
}
