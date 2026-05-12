'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Droplets,
    Calendar,
    Clock,
    Car,
    Star,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    MapPin,
    Shield,
    Gift,
    Loader2,
    RefreshCw,
    Plus,
    ChevronRight,
    Wallet,
    CreditCard,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Cancel reasons
// ---------------------------------------------------------------------------

const CANCEL_REASONS: { key: string; label: string }[] = [
    { key: 'plans_changed', label: 'Planlarım değişti' },
    { key: 'vehicle_issue', label: 'Aracımla ilgili sorun çıktı' },
    { key: 'wrong_datetime', label: 'Yanlış tarih/saat seçtim' },
    { key: 'found_alternative', label: 'Alternatif servis buldum' },
    { key: 'financial', label: 'Maddi sebepler' },
    { key: 'other', label: 'Diğer' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SelectedService {
    id: number;
    name: string;
    price: number;
    duration: number;
}

interface AvailableDate {
    date: string;
    timeSlot: string;
}

interface Appointment {
    id: number;
    status: string;
    total_price: number;
    total_duration: number;
    selected_services: SelectedService[] | null;
    preferredDateTime: string | null;
    availableDates: AvailableDate[] | null;
    matchedDate: AvailableDate[] | null;
    is_guaranteed: boolean;
    paymentMethod: 'card' | 'wallet' | string | null;
    notes: string | null;
    cancelReason: string | null;
    noShowMarkedAt: string | null;
    isNoShowReplacement: boolean;
    serviceCompletionConfirmed: boolean;
    userCompletionConfirmed: boolean;
    refund_status?: string;
    refund_percentage?: number;
    original_price?: number;
    discount_amount?: number;
    createdAt: string;
    updatedAt: string;
    service: {
        id: number;
        name: string;
        address?: string;
        city?: string;
        ProfilePicture?: { url?: string };
    } | null;
    vehicle: {
        id: number;
        brand: string;
        model: string;
        plate: string;
        year: number;
    } | null;
    category: {
        id: number;
        name: string;
        serviceType?: string;
    } | null;
    user: { id: number; username: string } | null;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string; text: string; description: string }
> = {
    Beklemede: {
        label: 'TALEP ALINDI',
        color: '#FFC507',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        description: 'Randevu talebiniz servise iletildi',
    },
    'Tarih Belirlendi': {
        label: 'SERVİS TARİH ÖNERDİ',
        color: '#3B82F6',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        description: 'Servis size tarih önerdi, onayınız bekleniyor',
    },
    Onaylandı: {
        label: 'ONAYLANDI',
        color: '#10B981',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        description: 'Randevunuz onaylandı',
    },
    'İşlem Başladı': {
        label: 'İŞLEM BAŞLADI',
        color: '#F59E0B',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        description: 'Aracınız yıkamada',
    },
    'Araç Hazır': {
        label: 'ARAÇ HAZIR',
        color: '#10B981',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        description: 'Aracınız hazır, teslim alabilirsiniz',
    },
    'Tamamlama Bekleniyor': {
        label: 'TAMAMLAMA BEKLENİYOR',
        color: '#F59E0B',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        description: 'Aracınızı teslim aldınız, tamamlama onayı bekleniyor',
    },
    Tamamlandı: {
        label: 'TAMAMLANDI',
        color: '#6366F1',
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        description: 'Yıkama başarıyla tamamlandı',
    },
    İptal: {
        label: 'İPTAL EDİLDİ',
        color: '#EF4444',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        description: 'Randevu iptal edildi',
    },
    Reddedildi: {
        label: 'REDDEDİLDİ',
        color: '#EF4444',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        description: 'Randevu reddedildi',
    },
    'Kullanıcı Gelmedi': {
        label: 'KATILIM SAĞLANAMADI',
        color: '#EF4444',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        description: 'Randevuya katılım sağlanamadı',
    },
    'Ödeme Bekliyor': {
        label: 'ÖDEME BEKLİYOR',
        color: '#F59E0B',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        description: 'Platformdan ödeme bekleniyor',
    },
    Gecikmeli: {
        label: 'GECİKMELİ',
        color: '#D98A00',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-600',
        description: 'Gecikme bildirimi aktif',
    },
    Yaklaşıyor: {
        label: 'YAKLAŞIYOR',
        color: '#4B83D1',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        description: 'Randevunuz yaklaşıyor',
    },
};

const ACTIVE_STATUSES = new Set([
    'Beklemede',
    'Tarih Belirlendi',
    'Onaylandı',
    'İşlem Başladı',
    'Araç Hazır',
    'Tamamlama Bekleniyor',
    'Yaklaşıyor',
    'Gecikmeli',
]);

const COMPLETED_STATUSES = new Set(['Tamamlandı', 'Kullanıcı Gelmedi', 'Ödeme Bekliyor']);
const CANCELLED_STATUSES = new Set(['İptal', 'Reddedildi']);

// ---------------------------------------------------------------------------
// Stepper helpers
// ---------------------------------------------------------------------------

const VISUAL_STEPS = ['TALEP', 'PLAN', 'ONAY', 'İŞLEM', 'TESLİM'];

function getActiveStepIndex(status: string): number {
    switch (status) {
        case 'Beklemede':
            return 0;
        case 'Tarih Belirlendi':
            return 1;
        case 'Onaylandı':
        case 'Yaklaşıyor':
        case 'Gecikmeli':
            return 2;
        case 'İşlem Başladı':
            return 3;
        case 'Araç Hazır':
        case 'Tamamlama Bekleniyor':
            return 4;
        case 'Tamamlandı':
        case 'Ödeme Bekliyor':
            return 4;
        default:
            return -1;
    }
}

function isCancelledStatus(status: string): boolean {
    return CANCELLED_STATUSES.has(status) || status === 'Kullanıcı Gelmedi';
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function formatDateTime(dateStr: string, timeSlot?: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const month = MONTHS_TR[d.getMonth()];
    const year = d.getFullYear();
    if (timeSlot) return `${day} ${month} ${year}, ${timeSlot}`;
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hh}:${mm}`;
}

function formatDateShort(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const month = MONTHS_TR[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? {
        label: status,
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        description: '',
    };
    return (
        <span
            className={`inline-flex items-center text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}
        >
            {cfg.label}
        </span>
    );
}

function ProgressStepper({ status }: { status: string }) {
    const isCancelled = isCancelledStatus(status);
    const activeIdx = getActiveStepIndex(status);

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    {STATUS_CONFIG[status]?.label ?? status}
                </span>
            </div>
        );
    }

    if (activeIdx < 0) return null;

    const allComplete = activeIdx === VISUAL_STEPS.length - 1 && COMPLETED_STATUSES.has(status);

    return (
        <div className="flex items-center gap-0 mb-4">
            {VISUAL_STEPS.map((step, idx) => {
                const isCompleted = allComplete ? true : idx < activeIdx;
                const isActive = !allComplete && idx === activeIdx;

                return (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                                    isCompleted
                                        ? 'bg-amber-500 text-white'
                                        : isActive
                                        ? 'border-2 border-amber-500 bg-amber-500/20 text-amber-400'
                                        : 'bg-gray-700 text-gray-500'
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                            <span
                                className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                                    isCompleted || isActive ? 'text-amber-400' : 'text-gray-600'
                                }`}
                            >
                                {step}
                            </span>
                        </div>
                        {idx < VISUAL_STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1 mb-3 ${
                                    isCompleted ? 'bg-amber-500' : 'bg-gray-700'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full" />
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-gray-800 rounded" />
                        <div className="h-3 w-24 bg-gray-800 rounded" />
                    </div>
                </div>
                <div className="h-6 w-28 bg-gray-800 rounded-full" />
            </div>
            <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-6 bg-gray-800 rounded-full" />
                ))}
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 w-36 bg-gray-800 rounded" />
                <div className="h-3 w-32 bg-gray-800 rounded" />
                <div className="h-3 w-44 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-800">
                <div className="h-9 w-28 bg-gray-800 rounded-xl" />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-4 ${
                        t.type === 'success'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                    }`}
                    onClick={() => onRemove(t.id)}
                >
                    {t.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {t.message}
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// AppointmentCard
// ---------------------------------------------------------------------------

function AppointmentCard({
    apt,
    jwt,
    onCancelClick,
    onRateClick,
    onActionDone,
    onToast,
}: {
    apt: Appointment;
    jwt: string;
    onCancelClick: (apt: Appointment) => void;
    onRateClick: (id: number, serviceId?: number) => void;
    onActionDone: () => void;
    onToast: (message: string, type: 'success' | 'error') => void;
}) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const status = apt.status;
    const cfg = STATUS_CONFIG[status];
    const vehicle = apt.vehicle;
    const service = apt.service;
    const selectedServices = apt.selected_services ?? [];
    const isCancelled = isCancelledStatus(status);

    const scheduledLabel = (() => {
        if (apt.matchedDate && apt.matchedDate.length > 0) {
            const md = apt.matchedDate[0];
            return formatDateTime(md.date, md.timeSlot);
        }
        if (apt.preferredDateTime) {
            return formatDateTime(apt.preferredDateTime);
        }
        return null;
    })();

    const canCancelByTime = (() => {
        if (status !== 'Onaylandı') return true;
        if (!apt.matchedDate || apt.matchedDate.length === 0) return true;
        const apptDate = new Date(apt.matchedDate[0].date);
        return apptDate.getTime() - Date.now() > 2 * 60 * 60 * 1000;
    })();

    const imageUrl = service?.ProfilePicture?.url ?? null;

    async function handleAction(action: string, body?: Record<string, unknown>) {
        setActionLoading(action);
        try {
            const res = await fetch(`/api/appointments/${apt.id}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(body ?? {}),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.error?.message ?? 'İşlem başarısız');
            }
            onToast('İşlem başarıyla gerçekleştirildi.', 'success');
            onActionDone();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Bir hata oluştu';
            onToast(msg, 'error');
        } finally {
            setActionLoading(null);
        }
    }

    function handleAcceptDate() {
        if (!apt.availableDates || apt.availableDates.length === 0) return;
        handleAction('matchDate', { matchedDate: apt.availableDates[0] });
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
            {/* Card header */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Service avatar */}
                        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={service?.name ?? 'Servis'}
                                    width={44}
                                    height={44}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            ) : (
                                <Droplets className="w-5 h-5 text-amber-400" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight truncate">
                                {service?.name ?? 'Oto Yıkama Servisi'}
                            </p>
                            {service?.city && (
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {service.city}
                                </p>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                {/* Stepper */}
                <ProgressStepper status={status} />

                {/* Status description */}
                {cfg && (
                    <p className="text-xs text-gray-400 mb-4">{cfg.description}</p>
                )}

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle?.plate && (
                        <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-xs px-2.5 py-1 rounded-lg tracking-widest">
                            <Car className="w-3.5 h-3.5" />
                            {vehicle.plate}
                        </span>
                    )}
                    {apt.is_guaranteed && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-lg font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            TamirHanem Güvenceli
                        </span>
                    )}
                    {apt.isNoShowReplacement && (
                        <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-2.5 py-1 rounded-lg font-medium">
                            <Gift className="w-3.5 h-3.5" />
                            Ücretsiz Randevu
                        </span>
                    )}
                    {apt.paymentMethod && (
                        <span className="inline-flex items-center gap-1 bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-lg">
                            {apt.paymentMethod === 'wallet' ? 'Cüzdan' : 'Kart'}
                        </span>
                    )}
                </div>

                {/* Info rows */}
                <div className="space-y-2 mb-4">
                    {vehicle && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Car className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>
                                {vehicle.brand} {vehicle.model}
                                {vehicle.year ? ` (${vehicle.year})` : ''}
                            </span>
                        </div>
                    )}
                    {scheduledLabel && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>{scheduledLabel}</span>
                        </div>
                    )}
                    {!scheduledLabel && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>Talep: {formatDateShort(apt.createdAt)}</span>
                        </div>
                    )}
                    {apt.total_duration > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>Tahmini süre: {apt.total_duration} dk</span>
                        </div>
                    )}
                    {service?.address && (
                        <div className="flex items-start gap-2 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{service.address}</span>
                        </div>
                    )}
                </div>

                {/* Price row */}
                {apt.total_price > 0 && (
                    <div className="flex items-center gap-2 mb-4 py-2.5 px-3 bg-gray-800/60 rounded-xl">
                        <span className="text-xs text-gray-400 flex-1">Toplam</span>
                        <span className="text-sm font-bold text-white">
                            ₺{apt.total_price.toLocaleString('tr-TR')}
                        </span>
                    </div>
                )}

                {/* Cancel reason */}
                {isCancelled && apt.cancelReason && (
                    <div className="mb-4 px-3 py-2.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-400">
                            <span className="font-medium">İptal sebebi: </span>
                            {apt.cancelReason}
                        </p>
                    </div>
                )}

                {/* Offered dates (Tarih Belirlendi) */}
                {status === 'Tarih Belirlendi' && apt.availableDates && apt.availableDates.length > 0 && (
                    <div className="mb-4 px-3 py-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-400 font-medium mb-1">Servisin önerdiği tarih:</p>
                        {apt.availableDates.map((d, i) => (
                            <p key={i} className="text-xs text-blue-300">
                                {formatDateTime(d.date, d.timeSlot)}
                            </p>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800">
                    {status === 'Beklemede' && (
                        <button
                            onClick={() => onCancelClick(apt)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            İptal Et
                        </button>
                    )}

                    {status === 'Tarih Belirlendi' && (
                        <>
                            <button
                                onClick={handleAcceptDate}
                                disabled={actionLoading === 'matchDate'}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                            >
                                {actionLoading === 'matchDate' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                Onayla
                            </button>
                            <button
                                onClick={() => onCancelClick(apt)}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                İptal Et
                            </button>
                        </>
                    )}

                    {status === 'Onaylandı' && canCancelByTime && (
                        <button
                            onClick={() => onCancelClick(apt)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            İptal Et
                        </button>
                    )}

                    {status === 'Araç Hazır' && (
                        <button
                            onClick={() => handleAction('confirm-completion')}
                            disabled={actionLoading === 'confirm-completion'}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === 'confirm-completion' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            Teslim Aldım
                        </button>
                    )}

                    {status === 'Tamamlama Bekleniyor' && (
                        <button
                            onClick={() => handleAction('confirm-completion')}
                            disabled={actionLoading === 'confirm-completion'}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === 'confirm-completion' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            Tamamlandı
                        </button>
                    )}

                    {status === 'Tamamlandı' && (
                        <button
                            onClick={() => onRateClick(apt.id, apt.service?.id)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                        >
                            <Star className="w-3.5 h-3.5" />
                            Değerlendir
                        </button>
                    )}

                    {/* Expand toggle */}
                    {selectedServices.length > 0 && (
                        <button
                            onClick={() => setExpanded(v => !v)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            {expanded ? (
                                <>
                                    Gizle <ChevronUp className="w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    Detaylar <ChevronDown className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded section */}
            {expanded && (
                <div className="border-t border-gray-800 px-5 py-4 bg-gray-900/50">
                    {selectedServices.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs font-medium text-gray-400 mb-2">Seçilen Hizmetler</p>
                            <div className="space-y-1.5">
                                {selectedServices.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-300">{s.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{s.duration} dk</span>
                                            {s.price > 0 && (
                                                <span className="text-xs font-medium text-white">
                                                    ₺{s.price.toLocaleString('tr-TR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {apt.notes && (
                        <div className="mb-3">
                            <p className="text-xs font-medium text-gray-400 mb-1">Notlar</p>
                            <p className="text-xs text-gray-300">{apt.notes}</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-600">
                        Randevu No: #{apt.id} · {formatDateShort(apt.createdAt)}
                    </p>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Rating Modal
// ---------------------------------------------------------------------------

interface RatingModalState {
    open: boolean;
    appointmentId: number | null;
    serviceId: number | undefined;
    rating: number;
    comment: string;
    submitting: boolean;
    error: string;
    submitted: boolean;
}

function RatingModal({
    modal,
    onClose,
    onSubmit,
    onChange,
}: {
    modal: RatingModalState;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (updates: Partial<RatingModalState>) => void;
}) {
    if (!modal.open) return null;

    const ratingLabels: Record<number, string> = {
        1: 'Çok Kötü',
        2: 'Kötü',
        3: 'Orta',
        4: 'İyi',
        5: 'Mükemmel',
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-bold text-white mb-1">Randevuyu Değerlendir</h2>
                <p className="text-gray-400 text-sm mb-5">Hizmet deneyiminizi paylaşın</p>

                <div className="flex gap-2 mb-2 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            onClick={() => onChange({ rating: s })}
                            className="transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                className={`w-9 h-9 transition-colors ${
                                    s <= modal.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-600 hover:text-gray-500'
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <p className="text-center text-xs text-gray-500 mb-5">
                    {ratingLabels[modal.rating] ?? ''}
                </p>

                <textarea
                    value={modal.comment}
                    onChange={e => onChange({ comment: e.target.value })}
                    placeholder="Yorumunuzu yazın (opsiyonel)"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 resize-none placeholder-gray-500 mb-4 transition-colors"
                />

                {modal.error && (
                    <p className="text-red-400 text-sm mb-3 bg-red-500/10 px-3 py-2 rounded-lg">
                        {modal.error}
                    </p>
                )}
                {modal.submitted && (
                    <p className="text-emerald-400 text-sm mb-3 bg-emerald-500/10 px-3 py-2 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Değerlendirmeniz gönderildi!
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={modal.submitting || modal.submitted}
                        className="flex-1 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {modal.submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Gönder
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Cancel Modal
// ---------------------------------------------------------------------------

interface CancelModalState {
    open: boolean;
    appointmentId: number | null;
    appointment: Appointment | null;
    reason: string;
    reasonKey: string;
    cancelChoice: 'wallet_refund' | 'card_refund' | 'free_rebooking' | 'refund' | null;
    submitting: boolean;
    error: string;
}

function calculateCancellationPolicy(appointment: Appointment): {
    refundPercentage: number;
    canChoose: boolean;
    hasRebookingRight: boolean;
} {
    const matchedDate = appointment.matchedDate?.[0];
    if (!matchedDate) {
        return { refundPercentage: 100, canChoose: true, hasRebookingRight: false };
    }

    const apptDateTime = new Date(matchedDate.date);
    if (matchedDate.timeSlot) {
        const [h, m] = matchedDate.timeSlot.split(':').map(Number);
        apptDateTime.setHours(h ?? 0, m ?? 0, 0, 0);
    }
    const hoursUntil = (apptDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil <= 0) {
        return { refundPercentage: 0, canChoose: false, hasRebookingRight: true };
    }
    if (hoursUntil <= 3) {
        return { refundPercentage: 0, canChoose: false, hasRebookingRight: true };
    }
    if (hoursUntil <= 6) {
        return { refundPercentage: 50, canChoose: true, hasRebookingRight: false };
    }
    if (hoursUntil <= 24) {
        return { refundPercentage: 70, canChoose: true, hasRebookingRight: false };
    }
    return { refundPercentage: 100, canChoose: true, hasRebookingRight: false };
}

function CancelModal({
    modal,
    onClose,
    onConfirm,
    onChange,
}: {
    modal: CancelModalState;
    onClose: () => void;
    onConfirm: () => void;
    onChange: (updates: Partial<CancelModalState>) => void;
}) {
    if (!modal.open) return null;

    const apt = modal.appointment;
    const policy = apt
        ? calculateCancellationPolicy(apt)
        : { refundPercentage: 100, canChoose: true, hasRebookingRight: false };

    const { refundPercentage, canChoose, hasRebookingRight } = policy;
    const showCardOption = apt?.paymentMethod !== 'wallet';

    const penaltyBannerColor =
        refundPercentage === 100
            ? { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' }
            : refundPercentage === 70
            ? { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' }
            : refundPercentage === 50
            ? { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' }
            : { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };

    const penaltyLabel =
        refundPercentage === 100
            ? 'Tam iade hakkınız mevcut'
            : refundPercentage > 0
            ? `%${refundPercentage} iade hakkınız var`
            : hasRebookingRight
            ? 'İade yapılamaz — ücretsiz yeniden randevu hakkı'
            : 'İade yapılamaz';

    const selectedReasonKey = modal.reasonKey;
    const isOtherSelected = selectedReasonKey === 'other';

    // Determine if form is submittable
    const hasReason = selectedReasonKey !== '' && (selectedReasonKey !== 'other' || modal.reason.trim() !== '');
    const hasChoice = !canChoose || modal.cancelChoice !== null;
    const canSubmit = hasReason && hasChoice && !modal.submitting;

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="text-base font-bold text-white">Randevuyu İptal Et</h2>
                </div>

                {/* Penalty info banner */}
                <div className={`mb-4 px-3 py-2.5 rounded-xl border ${penaltyBannerColor.bg} ${penaltyBannerColor.border}`}>
                    <p className={`text-xs font-medium ${penaltyBannerColor.text}`}>{penaltyLabel}</p>
                </div>

                {/* Guaranteed notice */}
                {apt?.is_guaranteed && (
                    <div className="mb-4 px-3 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-emerald-400">TamirHanem güvenceli randevunuz koruma altındadır.</p>
                    </div>
                )}

                {/* Cancel choice section */}
                {canChoose && refundPercentage > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-400 mb-2">İptal seçeneği</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onChange({ cancelChoice: 'free_rebooking' })}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors text-left ${
                                    modal.cancelChoice === 'free_rebooking'
                                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Gift className="w-3.5 h-3.5" />
                                    Ücretsiz Randevu
                                </div>
                                <p className="text-gray-500 text-[10px] leading-tight">24 saat içinde yeniden al</p>
                            </button>
                            <button
                                onClick={() => onChange({ cancelChoice: 'refund' })}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors text-left ${
                                    modal.cancelChoice === 'refund' || modal.cancelChoice === 'wallet_refund' || modal.cancelChoice === 'card_refund'
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    {refundPercentage === 100 ? 'Tam İade' : `%${refundPercentage} İade`}
                                </div>
                                <p className="text-gray-500 text-[10px] leading-tight">Ödeme iadesi</p>
                            </button>
                        </div>

                        {/* Refund sub-choice */}
                        {(modal.cancelChoice === 'refund' || modal.cancelChoice === 'wallet_refund' || modal.cancelChoice === 'card_refund') && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => onChange({ cancelChoice: 'wallet_refund' })}
                                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-colors text-left ${
                                        modal.cancelChoice === 'wallet_refund'
                                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Wallet className="w-3 h-3" />
                                        Cüzdan
                                    </div>
                                    <p className="text-gray-500 text-[10px]">+%5 sonraki randevuda</p>
                                </button>
                                {showCardOption && (
                                    <button
                                        onClick={() => onChange({ cancelChoice: 'card_refund' })}
                                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-colors text-left ${
                                            modal.cancelChoice === 'card_refund'
                                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <CreditCard className="w-3 h-3" />
                                            Kart
                                        </div>
                                        <p className="text-gray-500 text-[10px]">3-5 iş günü</p>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* No refund / rebooking only notice */}
                {!canChoose && hasRebookingRight && (
                    <div className="mb-4 px-3 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2">
                        <Gift className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-400">
                            İade yapılamaz ancak 24 saat içinde ücretsiz yeniden randevu alabilirsiniz.
                        </p>
                    </div>
                )}

                {/* Cancel reason grid */}
                <div className="mb-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">İptal sebebi</p>
                    <div className="grid grid-cols-2 gap-2">
                        {CANCEL_REASONS.map(r => (
                            <button
                                key={r.key}
                                onClick={() => {
                                    onChange({ reasonKey: r.key, reason: r.key !== 'other' ? r.label : modal.reason });
                                }}
                                className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                                    selectedReasonKey === r.key
                                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    {isOtherSelected && (
                        <textarea
                            value={modal.reason}
                            onChange={e => onChange({ reason: e.target.value })}
                            placeholder="Lütfen belirtin..."
                            rows={2}
                            className="w-full mt-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 resize-none placeholder-gray-500 transition-colors"
                        />
                    )}
                </div>

                {modal.error && (
                    <p className="text-red-400 text-sm mb-4 bg-red-500/10 px-3 py-2 rounded-lg">
                        {modal.error}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={modal.submitting}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!canSubmit}
                        className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {modal.submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        İptal Et
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Filter tab types
// ---------------------------------------------------------------------------

type FilterTab = 'aktif' | 'tamamlanan' | 'iptal' | 'tumu';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: 'aktif', label: 'Aktif' },
    { id: 'tamamlanan', label: 'Tamamlanan' },
    { id: 'iptal', label: 'İptal' },
    { id: 'tumu', label: 'Tümü' },
];

function filterAppointments(appointments: Appointment[], tab: FilterTab): Appointment[] {
    switch (tab) {
        case 'aktif':
            return appointments.filter(a => ACTIVE_STATUSES.has(a.status));
        case 'tamamlanan':
            return appointments.filter(a => COMPLETED_STATUSES.has(a.status));
        case 'iptal':
            return appointments.filter(a => CANCELLED_STATUSES.has(a.status));
        case 'tumu':
        default:
            return appointments;
    }
}

function tabCount(appointments: Appointment[], tab: FilterTab): number {
    return filterAppointments(appointments, tab).length;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const FETCH_URL =
    '/api/appointments?populate[user][populate]=avatar&populate[service][populate][0]=ProfilePicture&populate[service][populate][1]=categories&populate[vehicle][populate]=*&populate[category][populate]=*&populate[attachments][populate]=*&populate[createdFromAppointment][fields][0]=id&populate[replacedByAppointment][fields][0]=id&filters[category][serviceType][$eq]=car_wash&sort=createdAt:desc';

let toastCounter = 0;

export default function OtoYikamaRandevularimPage() {
    const [jwt, setJwt] = useState<string | null>(null);
    const [jwtChecked, setJwtChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<FilterTab>('aktif');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [ratingModal, setRatingModal] = useState<RatingModalState>({
        open: false,
        appointmentId: null,
        serviceId: undefined,
        rating: 5,
        comment: '',
        submitting: false,
        error: '',
        submitted: false,
    });

    const [cancelModal, setCancelModal] = useState<CancelModalState>({
        open: false,
        appointmentId: null,
        appointment: null,
        reason: '',
        reasonKey: '',
        cancelChoice: null,
        submitting: false,
        error: '',
    });

    // Read JWT from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('tamirhanem_jwt');
        setJwt(token);
        setJwtChecked(true);
    }, []);

    function addToast(message: string, type: 'success' | 'error') {
        const id = ++toastCounter;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }

    function removeToast(id: number) {
        setToasts(prev => prev.filter(t => t.id !== id));
    }

    const fetchAppointments = useCallback(
        async (token: string) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(FETCH_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    if (res.status === 401) {
                        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                        return;
                    }
                    throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                if (data?.data && Array.isArray(data.data)) {
                    setAppointments(data.data as Appointment[]);
                } else {
                    setAppointments([]);
                }
            } catch {
                setError('Randevular yüklenemedi. Lütfen sayfayı yenileyin.');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Initial fetch
    useEffect(() => {
        if (jwt) fetchAppointments(jwt);
    }, [jwt, fetchAppointments]);

    // Auto-refresh every 30 seconds when there are active appointments
    useEffect(() => {
        if (!jwt) return;

        const hasActive = appointments.some(a => ACTIVE_STATUSES.has(a.status));

        if (hasActive) {
            autoRefreshRef.current = setInterval(() => {
                fetchAppointments(jwt);
            }, 30_000);
        }

        return () => {
            if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
        };
    }, [jwt, appointments, fetchAppointments]);

    // Rating handlers
    function openRateModal(id: number, serviceId?: number) {
        setRatingModal({
            open: true,
            appointmentId: id,
            serviceId,
            rating: 5,
            comment: '',
            submitting: false,
            error: '',
            submitted: false,
        });
    }

    async function handleRatingSubmit() {
        if (!jwt || !ratingModal.appointmentId) return;
        setRatingModal(prev => ({ ...prev, submitting: true, error: '' }));
        try {
            const body: Record<string, unknown> = {
                appointment: ratingModal.appointmentId,
                rating: ratingModal.rating,
                comment: ratingModal.comment,
            };
            if (ratingModal.serviceId) body.service = ratingModal.serviceId;

            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error();
            setRatingModal(prev => ({ ...prev, submitting: false, submitted: true }));
            setTimeout(() => {
                setRatingModal(prev => ({ ...prev, open: false }));
                if (jwt) fetchAppointments(jwt);
            }, 1500);
        } catch {
            setRatingModal(prev => ({
                ...prev,
                submitting: false,
                error: 'Değerlendirme gönderilemedi. Lütfen tekrar deneyin.',
            }));
        }
    }

    // Cancel handlers
    function openCancelModal(apt: Appointment) {
        setCancelModal({
            open: true,
            appointmentId: apt.id,
            appointment: apt,
            reason: '',
            reasonKey: '',
            cancelChoice: null,
            submitting: false,
            error: '',
        });
    }

    async function handleCancelConfirm() {
        if (!jwt || !cancelModal.appointmentId) return;
        setCancelModal(prev => ({ ...prev, submitting: true, error: '' }));
        try {
            const reasonLabel = cancelModal.reasonKey === 'other'
                ? cancelModal.reason
                : CANCEL_REASONS.find(r => r.key === cancelModal.reasonKey)?.label ?? cancelModal.reason;

            // Determine final cancelChoice — if user picked 'refund' without sub-choice, default to wallet_refund
            let finalChoice = cancelModal.cancelChoice;
            if (finalChoice === 'refund') finalChoice = 'wallet_refund';

            const res = await fetch(`/api/appointments/${cancelModal.appointmentId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    reason: reasonLabel,
                    cancelReason: reasonLabel,
                    cancelReasonKey: cancelModal.reasonKey,
                    cancelChoice: finalChoice,
                }),
            });
            if (!res.ok) throw new Error();
            setCancelModal({
                open: false,
                appointmentId: null,
                appointment: null,
                reason: '',
                reasonKey: '',
                cancelChoice: null,
                submitting: false,
                error: '',
            });

            const successMessage =
                finalChoice === 'wallet_refund'
                    ? 'Randevu iptal edildi. İade cüzdanınıza aktarıldı.'
                    : finalChoice === 'card_refund'
                    ? 'Randevu iptal edildi. Kart iadesi başlatıldı.'
                    : finalChoice === 'free_rebooking'
                    ? 'Randevu iptal edildi. 24 saat içinde ücretsiz randevu alabilirsiniz.'
                    : 'Randevu başarıyla iptal edildi.';

            addToast(successMessage, 'success');
            fetchAppointments(jwt);
        } catch {
            setCancelModal(prev => ({
                ...prev,
                submitting: false,
                error: 'Randevu iptal edilemedi. Lütfen tekrar deneyin.',
            }));
        }
    }

    // Derived data
    const displayedAppointments = filterAppointments(appointments, activeTab);

    // ---------------------------------------------------------------------------
    // Render — not logged in
    // ---------------------------------------------------------------------------

    if (!jwtChecked) return null;

    if (!jwt) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Droplets className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Giriş Yapmalısınız</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Oto yıkama randevularınızı görüntülemek için hesabınıza giriş yapın.
                </p>
                <Link
                    href="/giris"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                    Giriş Yap
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // Render — main
    // ---------------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2.5">
                        <Droplets className="w-5 h-5 text-amber-400" />
                        Oto Yıkama Randevularım
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchAppointments(jwt)}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                            aria-label="Yenile"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link
                            href="/oto-yikama"
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Yeni Randevu
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
                {/* Filter tabs */}
                <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar">
                    {FILTER_TABS.map(tab => {
                        const count = tabCount(appointments, tab.id);
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 pb-3 px-4 text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                                    isActive
                                        ? 'border-b-2 border-amber-500 text-white'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                                            isActive
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-gray-800 text-gray-500'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Error state */}
                {error && !loading && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400 flex-1">{error}</p>
                        <button
                            onClick={() => fetchAppointments(jwt)}
                            className="text-xs text-red-400 underline hover:no-underline"
                        >
                            Tekrar Dene
                        </button>
                    </div>
                )}

                {/* Content */}
                {loading && appointments.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : displayedAppointments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Droplets className="w-8 h-8 text-amber-400" />
                        </div>
                        <p className="text-white font-semibold mb-1">
                            {activeTab === 'aktif'
                                ? 'Aktif randevu bulunamadı'
                                : activeTab === 'tamamlanan'
                                ? 'Tamamlanan randevu yok'
                                : activeTab === 'iptal'
                                ? 'İptal edilen randevu yok'
                                : 'Oto yıkama randevunuz bulunmuyor'}
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            {activeTab === 'aktif'
                                ? 'Yeni bir oto yıkama randevusu oluşturun.'
                                : 'Geçmiş randevular burada listelenecek.'}
                        </p>
                        {(activeTab === 'aktif' || activeTab === 'tumu') && (
                            <Link
                                href="/oto-yikama"
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Randevu Al
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedAppointments.map(apt => (
                            <AppointmentCard
                                key={apt.id}
                                apt={apt}
                                jwt={jwt}
                                onCancelClick={openCancelModal}
                                onRateClick={openRateModal}
                                onActionDone={() => fetchAppointments(jwt)}
                                onToast={addToast}
                            />
                        ))}
                        {loading && (
                            <div className="flex justify-center py-2">
                                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <RatingModal
                modal={ratingModal}
                onClose={() => setRatingModal(prev => ({ ...prev, open: false }))}
                onSubmit={handleRatingSubmit}
                onChange={updates => setRatingModal(prev => ({ ...prev, ...updates }))}
            />
            <CancelModal
                modal={cancelModal}
                onClose={() =>
                    setCancelModal({
                        open: false,
                        appointmentId: null,
                        appointment: null,
                        reason: '',
                        reasonKey: '',
                        cancelChoice: null,
                        submitting: false,
                        error: '',
                    })
                }
                onConfirm={handleCancelConfirm}
                onChange={updates => setCancelModal(prev => ({ ...prev, ...updates }))}
            />

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}
