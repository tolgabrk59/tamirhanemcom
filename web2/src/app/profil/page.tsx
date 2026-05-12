'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Car,
    CalendarDays,
    Bell,
    Heart,
    Wallet,
    Shield,
    HelpCircle,
    FileText,
    LogOut,
    ChevronRight,
    User,
    Phone,
    Mail,
    Lock,
} from 'lucide-react';

interface UserData {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    name?: string;
    avatar?: { url?: string } | null;
}

const menuItems = [
    { icon: Car, label: 'Araçlarım', href: '/araclarim', color: 'text-info-500' },
    { icon: CalendarDays, label: 'Randevularım', href: '/randevularim', color: 'text-success-500' },
    { icon: Bell, label: 'Bildirimler', href: '/bildirimler', color: 'text-warning-500' },
    { icon: Heart, label: 'Favorilerim', href: '/favoriler', color: 'text-error-500' },
    { icon: Wallet, label: 'Cüzdan', href: '/cuzdan', color: 'text-primary-600' },
    { icon: Shield, label: 'Gizlilik Ayarları', href: '/gizlilik', color: 'text-secondary-500' },
    { icon: HelpCircle, label: 'Yardım', href: '/yardim', color: 'text-info-400' },
    { icon: FileText, label: 'Sözleşmeler', href: '/sartlar', color: 'text-secondary-400' },
];

export default function ProfilPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const jwt = localStorage.getItem('tamirhanem_jwt');
        const storedUser = localStorage.getItem('tamirhanem_user');

        if (!jwt) {
            router.replace('/giris');
            return;
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                // hatalı veri, yeniden çek
            }
        }

        // Güncel profil verisi çek
        fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${jwt}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === false) {
                    // Token geçersiz
                    localStorage.removeItem('tamirhanem_jwt');
                    localStorage.removeItem('tamirhanem_user');
                    router.replace('/giris');
                } else {
                    const userData = data.user || data;
                    setUser(userData);
                    localStorage.setItem('tamirhanem_user', JSON.stringify(userData));
                }
            })
            .catch(() => {
                // ağ hatası — önbellekteki veriyle devam et
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('tamirhanem_jwt');
        localStorage.removeItem('tamirhanem_user');
        router.push('/');
    };

    const getInitials = (u: UserData) => {
        if (u.name) {
            return u.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return u.username.slice(0, 2).toUpperCase();
    };

    const getAvatarUrl = (u: UserData) => {
        if (!u.avatar?.url) return null;
        const url = u.avatar.url;
        if (url.startsWith('http')) return url;
        return `https://api.tamirhanem.net${url}`;
    };

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-secondary-500 text-sm">Profil yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const avatarUrl = getAvatarUrl(user);
    const displayName = user.name || user.username;

    return (
        <div className="min-h-screen bg-secondary-50">
            {/* Header — gradient arka plan */}
            <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pb-16 pt-10 px-4">
                <div className="max-w-lg mx-auto text-center">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-glow"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center border-4 border-primary-600 shadow-glow">
                                <span className="text-3xl font-bold text-secondary-900">{getInitials(user)}</span>
                            </div>
                        )}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-secondary-900" title="Aktif" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>
                    <p className="text-secondary-400 text-sm">@{user.username}</p>

                    {/* İletişim bilgileri */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {user.phone && (
                            <div className="flex items-center gap-1.5 text-secondary-300 text-sm">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        {user.email && (
                            <div className="flex items-center gap-1.5 text-secondary-300 text-sm">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{user.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* İçerik — yukarı taşan kart */}
            <div className="max-w-lg mx-auto px-4 -mt-8">
                {/* Menü kartı */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary-50 transition-colors group ${
                                index < menuItems.length - 1 ? 'border-b border-secondary-100' : ''
                            }`}
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 group-hover:bg-secondary-100 transition-colors ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="flex-1 text-secondary-800 font-medium">{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* Profili Düzenle & Şifre Değiştir */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
                    <Link
                        href="/profil/duzenle"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-secondary-50 transition-colors group border-b border-secondary-100"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 group-hover:bg-secondary-100 transition-colors text-secondary-600">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-secondary-800 font-medium">Profili Düzenle</span>
                        <ChevronRight className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors" />
                    </Link>
                    <Link
                        href="/sifre-degistir"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-secondary-50 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 group-hover:bg-secondary-100 transition-colors text-secondary-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-secondary-800 font-medium">Şifre Değiştir</span>
                        <ChevronRight className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors" />
                    </Link>
                </div>

                {/* Çıkış Yap */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-8">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-error-50 transition-colors group text-left"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-error-50 group-hover:bg-error-100 transition-colors text-error-500">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-error-600 font-medium">Çıkış Yap</span>
                        <ChevronRight className="w-4 h-4 text-error-300 group-hover:text-error-500 transition-colors" />
                    </button>
                </div>

                {/* Versiyon */}
                <p className="text-center text-secondary-400 text-xs pb-6">TamirHanem v2.0</p>
            </div>
        </div>
    );
}
