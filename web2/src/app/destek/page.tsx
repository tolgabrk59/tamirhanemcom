'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, CreditCard, User, Calendar, Smartphone, ThumbsUp, HelpCircle, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

interface Conversation {
  id: number;
  subject: string;
  status: string;
  category: string;
  last_message?: string;
  updatedAt: string;
  unread_count?: number;
}

const SUPPORT_CATEGORIES: Category[] = [
  { id: 'payment', title: 'Ödeme Sorunları', subtitle: 'Ödeme, iade ve fatura işlemleri', icon: <CreditCard size={24} />, color: '#FF6B6B' },
  { id: 'account', title: 'Hesap İşlemleri', subtitle: 'Giriş, kayıt ve profil ayarları', icon: <User size={24} />, color: '#4ECDC4' },
  { id: 'appointment', title: 'Randevu Sorunları', subtitle: 'Randevu iptali, değişiklik', icon: <Calendar size={24} />, color: '#45B7D1' },
  { id: 'app', title: 'Uygulama Kullanımı', subtitle: 'Site hataları ve sorular', icon: <Smartphone size={24} />, color: '#96CEB4' },
  { id: 'feedback', title: 'Öneri ve Şikayetler', subtitle: 'Görüş, öneri ve şikayetleriniz', icon: <ThumbsUp size={24} />, color: '#FFEAA7' },
  { id: 'other', title: 'Diğer Konular', subtitle: 'Yukarıdakiler dışındaki konular', icon: <HelpCircle size={24} />, color: '#DDA0DD' },
];

export default function DestekPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const jwt = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;

  useEffect(() => {
    if (jwt) fetchConversations();
  }, [jwt]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support-conversations/my', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedCategory || !subject.trim() || !message.trim()) {
      setError('Lütfen kategori, konu ve mesaj alanlarını doldurun.');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/support-conversations/start', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedCategory.id, subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Destek talebiniz oluşturuldu. En kısa sürede yanıt verilecektir.');
        setSelectedCategory(null);
        setSubject('');
        setMessage('');
        fetchConversations();
      } else {
        setError(data.error?.message || 'Talep oluşturulamadı');
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setCreating(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'resolved' || status === 'closed') return 'text-green-400';
    if (status === 'open' || status === 'pending') return 'text-orange-400';
    return 'text-gray-400';
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      open: 'Açık',
      pending: 'Beklemede',
      resolved: 'Çözüldü',
      closed: 'Kapatıldı',
      in_progress: 'İşlemde',
    };
    return map[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Destek Merkezi</h1>
          <p className="text-gray-400 text-sm">Size nasıl yardımcı olabiliriz?</p>
        </div>

        {/* Mevcut Konuşmalar */}
        {jwt && conversations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Destek Taleplerim</h2>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/destek/${conv.id}`}
                  className="block bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-orange-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{conv.subject}</p>
                      {conv.last_message && (
                        <p className="text-gray-400 text-sm mt-1 truncate">{conv.last_message}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} className="text-gray-500" />
                        <span className="text-gray-500 text-xs">
                          {new Date(conv.updatedAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium ${statusColor(conv.status)}`}>
                        {statusLabel(conv.status)}
                      </span>
                      {conv.unread_count ? (
                        <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unread_count}
                        </span>
                      ) : null}
                      <ChevronRight size={16} className="text-gray-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Yeni Talep Oluştur */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Yeni Destek Talebi</h2>

          {/* Kategori Seçimi */}
          <div className="mb-5">
            <p className="text-sm text-gray-400 mb-3">Konu kategorisi seçin</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUPPORT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCategory?.id === cat.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div style={{ color: cat.color }} className="mb-2">{cat.icon}</div>
                  <p className="text-white text-sm font-medium leading-tight">{cat.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-tight">{cat.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Konu */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-2">Konu</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sorununuzu kısaca belirtin"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          {/* Mesaj */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 block mb-2">Mesajınız</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sorununuzu detaylı açıklayın..."
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-lg p-3 mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 text-green-400 text-sm rounded-lg p-3 mb-4">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {jwt ? (
            <button
              onClick={handleCreate}
              disabled={creating || !selectedCategory || !subject.trim() || !message.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {creating ? 'Gönderiliyor...' : 'Destek Talebi Gönder'}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-3">Destek talebi oluşturmak için giriş yapmalısınız.</p>
              <Link
                href="/giris"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* Alternatif İletişim */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="tel:+902129999999"
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-orange-500/40 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">SSS</p>
              <p className="text-gray-400 text-xs">Sık sorulan sorular</p>
            </div>
          </a>
          <Link
            href="/yardim-destek"
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-orange-500/40 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <HelpCircle size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Yardım Merkezi</p>
              <p className="text-gray-400 text-xs">Sık sorulan sorular</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
