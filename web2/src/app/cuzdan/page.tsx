'use client';

import { useState, useEffect } from 'react';
import {
  Wallet, ArrowUpCircle, ArrowDownCircle, CreditCard, Plus,
  Trash2, Lock, Loader2, AlertCircle, CheckCircle, X,
  Trophy, Gift, Copy, Check,
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: number;
  type?: string;
  direction?: string;
  amount: number;
  description?: string;
  note?: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
}

interface WalletData {
  id: number;
  balance?: number;
  amount?: number;
  currency?: string;
}

interface CreditCardData {
  id: number;
  cardNumber?: string;
  card_number?: string;
  maskedNumber?: string;
  masked_number?: string;
  cardHolderName?: string;
  card_holder_name?: string;
  expiryMonth?: number | string;
  expiryYear?: number | string;
  expiry_month?: number | string;
  expiry_year?: number | string;
  brand?: string;
}

interface AddCardForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
  cvv: string;
}

interface LoyaltyData {
  totalWashes: number;
  rewardsEarned: number;
  rewardsUsed: number;
  availableRewards: number;
  currentCycleWashes: number;
  targetWashes: number;
  washesUntilNextReward: number;
  progress: number;
  hasAvailableReward: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from({ length: 15 }, (_, i) => String(CURRENT_YEAR + i));

function maskCardNumber(card: CreditCardData): string {
  const raw = card.maskedNumber || card.masked_number || card.cardNumber || card.card_number || '';
  if (!raw) return '**** **** **** ****';
  const cleaned = raw.replace(/\s/g, '');
  if (cleaned.length >= 16) {
    return `**** **** **** ${cleaned.slice(-4)}`;
  }
  return raw;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function isIncome(tx: Transaction): boolean {
  const dir = (tx.direction || tx.type || '').toLowerCase();
  return dir === 'income' || dir === 'credit' || dir === 'deposit' || dir === 'in' || tx.amount > 0;
}

export default function CuzdanPage() {
  const [jwt, setJwt] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CreditCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [addCardForm, setAddCardForm] = useState<AddCardForm>({
    cardNumber: '', expiryMonth: '', expiryYear: '', cardHolderName: '', cvv: '',
  });
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [addCardError, setAddCardError] = useState<string | null>(null);
  const [addCardSuccess, setAddCardSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tamirhanem_jwt');
    setJwt(token);
  }, []);

  useEffect(() => {
    if (jwt === null) return; // still initializing
    if (!jwt) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' };

    async function fetchData() {
      setLoading(true);
      setWalletError(null);

      const [walletRes, txRes, cardsRes, loyaltyRes, referralRes] = await Promise.allSettled([
        fetch('/api/wallets/me', { headers }),
        fetch('/api/transactions', { headers }),
        fetch('/api/credit-cards', { headers }),
        fetch('/api/platform-loyalty/my-status', { headers }),
        fetch('/api/referrals/my-code', { headers }),
      ]);

      if (walletRes.status === 'fulfilled' && walletRes.value.ok) {
        const data = await walletRes.value.json();
        setWallet(data.data || data.wallet || data);
      } else if (walletRes.status === 'fulfilled') {
        const data = await walletRes.value.json().catch(() => ({}));
        setWalletError(data?.error || 'Cüzdan bilgileri alınamadı');
      } else {
        setWalletError('Cüzdan bağlantı hatası');
      }

      if (txRes.status === 'fulfilled' && txRes.value.ok) {
        const data = await txRes.value.json();
        setTransactions(data.data || data.transactions || []);
      }

      if (cardsRes.status === 'fulfilled' && cardsRes.value.ok) {
        const data = await cardsRes.value.json();
        setCards(data.data || data.cards || []);
      }

      if (loyaltyRes.status === 'fulfilled' && loyaltyRes.value.ok) {
        const data = await loyaltyRes.value.json();
        setLoyalty(data.data || data);
      }

      if (referralRes.status === 'fulfilled' && referralRes.value.ok) {
        const data = await referralRes.value.json();
        setReferralCode(data.code || data.referralCode || data.data?.code || null);
      }

      setLoading(false);
    }

    fetchData();
  }, [jwt]);

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    if (!jwt) return;
    setAddCardLoading(true);
    setAddCardError(null);
    setAddCardSuccess(false);
    try {
      const res = await fetch('/api/credit-cards', {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: addCardForm.cardNumber.replace(/\s/g, ''),
          expiryMonth: Number(addCardForm.expiryMonth),
          expiryYear: Number(addCardForm.expiryYear),
          cardHolderName: addCardForm.cardHolderName,
          cvv: addCardForm.cvv,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setAddCardSuccess(true);
        setAddCardForm({ cardNumber: '', expiryMonth: '', expiryYear: '', cardHolderName: '', cvv: '' });
        setShowAddCard(false);
        // refresh cards
        const cardsRes = await fetch('/api/credit-cards', {
          headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        });
        if (cardsRes.ok) {
          const cData = await cardsRes.json();
          setCards(cData.data || cData.cards || []);
        }
      } else {
        setAddCardError(data?.error || 'Kart eklenemedi');
      }
    } catch {
      setAddCardError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setAddCardLoading(false);
    }
  }

  async function handleDeleteCard(id: number) {
    if (!jwt) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/credit-cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  function handleCopy() {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Not logged in
  if (jwt === null) return null; // loading JWT from localStorage

  if (!jwt) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Giriş Gerekli</h1>
          <p className="text-gray-400 mb-6">Cüzdanınıza erişmek için giriş yapmanız gerekiyor.</p>
          <Link
            href="/giris"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const balance = wallet?.balance ?? wallet?.amount ?? 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary-400" />
            Cüzdanım
          </h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 rounded-2xl p-6 shadow-xl">
              <p className="text-teal-100 text-sm font-medium mb-1">Mevcut Bakiye</p>
              {walletError ? (
                <div className="flex items-center gap-2 text-yellow-200">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">Cüzdan henüz aktif değil</span>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white mb-4">
                    ₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-teal-200 text-xs">{wallet?.currency || 'TRY'}</p>
                </>
              )}
            </div>

            {/* Platform Loyalty */}
            {loyalty && (
              <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-white font-semibold text-base">Sadakat Programı</h2>
                  {loyalty.hasAvailableReward && (
                    <span className="ml-auto bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {loyalty.availableRewards} Ücretsiz Yıkama
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Bu dönem: {loyalty.currentCycleWashes}/{loyalty.targetWashes} yıkama</span>
                    <span>{loyalty.washesUntilNextReward} yıkama kaldı</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(loyalty.progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Toplam Yıkama', value: loyalty.totalWashes },
                    { label: 'Kazanılan Ödül', value: loyalty.rewardsEarned },
                    { label: 'Kullanılan', value: loyalty.rewardsUsed },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-800/60 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {loyalty.hasAvailableReward && (
                  <div className="mt-4 flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <Gift className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-green-300 text-sm">
                      <span className="font-semibold">{loyalty.availableRewards} ücretsiz yıkama</span> hakkınız var! Randevu alırken otomatik uygulanır.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Referral Code */}
            {referralCode && (
              <section className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h2 className="text-white font-semibold text-base mb-1">Arkadaşını Davet Et</h2>
                <p className="text-gray-400 text-sm mb-4">Referans kodunu paylaş, her iki taraf da kazansın.</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 font-mono text-white text-sm tracking-widest select-all">
                    {referralCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      copied
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" />Kopyalandı</> : <><Copy className="w-4 h-4" />Kopyala</>}
                  </button>
                </div>
              </section>
            )}

            {/* Transactions */}
            <section>
              <h2 className="text-white font-semibold text-lg mb-3">İşlem Geçmişi</h2>
              {transactions.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-500">Henüz işlem bulunmuyor.</p>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
                  {transactions.map((tx) => {
                    const income = isIncome(tx);
                    const dateStr = tx.createdAt || tx.created_at || tx.date;
                    return (
                      <div key={tx.id} className="flex items-center gap-4 px-4 py-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${income ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                          {income
                            ? <ArrowUpCircle className="w-5 h-5 text-green-400" />
                            : <ArrowDownCircle className="w-5 h-5 text-red-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {tx.description || tx.note || (income ? 'Gelir' : 'Gider')}
                          </p>
                          {dateStr && (
                            <p className="text-gray-500 text-xs mt-0.5">{formatDate(dateStr)}</p>
                          )}
                        </div>
                        <span className={`text-sm font-semibold shrink-0 ${income ? 'text-green-400' : 'text-red-400'}`}>
                          {income ? '+' : '-'}₺{Math.abs(tx.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Credit Cards */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-lg">Kayıtlı Kartlar</h2>
                <button
                  onClick={() => { setShowAddCard(true); setAddCardError(null); setAddCardSuccess(false); }}
                  className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Kart Ekle
                </button>
              </div>

              {addCardSuccess && (
                <div className="flex items-center gap-2 bg-green-900/30 border border-green-800 text-green-400 rounded-xl px-4 py-3 mb-3 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Kart başarıyla eklendi.
                </div>
              )}

              {cards.length === 0 && !showAddCard ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                  <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Kayıtlı kart bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium font-mono">{maskCardNumber(card)}</p>
                        {(card.cardHolderName || card.card_holder_name) && (
                          <p className="text-gray-500 text-xs mt-0.5 truncate">
                            {card.cardHolderName || card.card_holder_name}
                          </p>
                        )}
                        {(card.expiryMonth || card.expiry_month) && (
                          <p className="text-gray-600 text-xs">
                            Son: {String(card.expiryMonth || card.expiry_month).padStart(2, '0')}/{card.expiryYear || card.expiry_year}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        disabled={deletingId === card.id}
                        className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-900/20 disabled:opacity-50"
                        aria-label="Kartı sil"
                      >
                        {deletingId === card.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Card Form */}
              {showAddCard && (
                <div className="mt-3 bg-gray-900 border border-gray-700 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Yeni Kart Ekle</h3>
                    <button onClick={() => setShowAddCard(false)} className="text-gray-500 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddCard} className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Kart Numarası</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={addCardForm.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                          setAddCardForm((f) => ({ ...f, cardNumber: formatted }));
                        }}
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Kart Üzerindeki İsim</label>
                      <input
                        type="text"
                        placeholder="AD SOYAD"
                        value={addCardForm.cardHolderName}
                        onChange={(e) => setAddCardForm((f) => ({ ...f, cardHolderName: e.target.value.toUpperCase() }))}
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Ay</label>
                        <select
                          value={addCardForm.expiryMonth}
                          onChange={(e) => setAddCardForm((f) => ({ ...f, expiryMonth: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          <option value="">Ay</option>
                          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Yıl</label>
                        <select
                          value={addCardForm.expiryYear}
                          onChange={(e) => setAddCardForm((f) => ({ ...f, expiryYear: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          <option value="">Yıl</option>
                          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">CVV</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="•••"
                          value={addCardForm.cvv}
                          onChange={(e) => setAddCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>

                    {addCardError && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-3 py-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {addCardError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={addCardLoading}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {addCardLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Ekleniyor...</> : 'Kartı Ekle'}
                    </button>
                  </form>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
