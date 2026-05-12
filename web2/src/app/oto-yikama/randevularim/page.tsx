'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    Car,
    Loader2,
    Star,
    CalendarX,
    MapPin,
    Wrench,
    ChevronRight,
    XCircle,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Droplets,
} from 'lucide-react';

interface ServiceItem {
    id: number;
    attributes: {
        name: string;
        price?: number;
    };
}

interface Appointment {
    id: number;
    attributes: {
        status: string;
        serviceType?: string;
        scheduledDate?: string;
        scheduledTime?: string;
        createdAt: string;
        totalPrice?: number;
        notes?: string;
        offerPrice?: number;
        offerNote?: string;
        progressPercentage?: number;
        cancelReason?: string;
        duration?: number;
        services?: { data: ServiceItem[] };
        vehicle?: {
            data?: {
                id: number;
                attributes: {
                    brand: string;
                    model: string;
                    plate: string;
                    year: number;
                };
            };
        };
        service?: {
            data?: {
                id: number;
                attributes: {
                    name: string;
                    address?: string;
                    city?: string;
                };
            };
        };
    };
}

interface RatingModal {
    open: boolean;
    appointmentId: number | null;
    rating: number;
    comment: string;
    submitting: boolean;
    error: string;
    submitted: boolean;
}

interface CancelModal {
    open: boolean;
    appointmentId: number | null;
    submitting: boolean;
    error: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; text: string }> = {
    Beklemede: { label: 'Beklemede', color: '#3B82F6', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    'Tarih Belirlendi': { label: 'Tarih Belirlendi', color: '#F59E0B', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    Onaylandı: { label: 'Onaylandı', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    'Araç Teslim Alındı': { label: 'Araç Teslim Alındı', color: '#6366F1', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    'İşlem Devam Ediyor': { label: 'İşlem Devam Ediyor', color: '#8B5CF6', bg: 'bg-violet-500/10', text: 'text-violet-400' },
    'Müşteri Onayı Bekleniyor': { label: 'Müşteri Onayı Bekleniyor', color: '#EC4899', bg: 'bg-pink-500/10', text: 'text-pink-400' },
    'Teslimata Hazır': { label: 'Teslimata Hazır', color: '#14B8A6', bg: 'bg-teal-500/10', text: 'text-teal-400' },
    'Araç Teslim Edildi': { label: 'Araç Teslim Edildi', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    Tamamlandı: { label: 'Tamamlandı', color: '#10B981', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    İptal: { label: 'İptal', color: '#EF4444', bg: 'bg-red-500/10', text: 'text-red-400' },
    'Randevu İptal': { label: 'Randevu İptal', color: '#EF4444', bg: 'bg-red-500/10', text: 'text-red-400' },
    'Gecikme Raporu': { label: 'Gecikme Raporu', color: '#F97316', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    'Gelmedi (Müşteri)': { label: 'Gelmedi', color: '#6B7280', bg: 'bg-gray-500/10', text: 'text-gray-400' },
    'Gelmedi (Servis)': { label: 'Servis Gelmedi', color: '#6B7280', bg: 'bg-gray-500/10', text: 'text-gray-400' },
    'Ödeme Bekleniyor': { label: 'Ödeme Bekleniyor', color: '#F59E0B', bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

const PAST_STATUSES = new Set(['Tamamlandı', 'İptal', 'Randevu İptal', 'Gelmedi (Müşteri)', 'Gelmedi (Servis)']);
const CANCELLED_STATUSES = new Set(['İptal', 'Randevu İptal', 'Gelmedi (Müşteri)', 'Gelmedi (Servis)']);

const STEPPER_STEPS = [
    { label: 'Talep', statuses: ['Beklemede'] },
    { label: 'Onay', statuses: ['Tarih Belirlendi', 'Onaylandı'] },
    { label: 'Yıkama', statuses: ['Araç Teslim Alındı', 'İşlem Devam Ediyor', 'Müşteri Onayı Bekleniyor'] },
    { label: 'Hazır', statuses: ['Teslimata Hazır'] },
    { label: 'Tamamlandı', statuses: ['Araç Teslim Edildi', 'Tamamlandı'] },
];

function getStepperState(status: string): { activeStep: number; completed: boolean } {
    for (let i = 0; i < STEPPER_STEPS.length; i++) {
        if (STEPPER_STEPS[i].statuses.includes(status)) {
            return { activeStep: i, completed: i === STEPPER_STEPS.length - 1 };
        }
    }
    return { activeStep: -1, completed: false };
}

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function formatDate(dateStr?: string, timeStr?: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = MONTHS_TR[d.getMonth()];
    const year = d.getFullYear();
    if (timeStr) return `${day} ${month} ${year}, ${timeStr}`;
    return `${day} ${month} ${year}`;
}

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-gray-500/10', text: 'text-gray-400' };
    return (
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
        </span>
    );
}

function ProgressStepper({ status }: { status: string }) {
    if (CANCELLED_STATUSES.has(status) || status === 'Ödeme Bekleniyor' || status === 'Gecikme Raporu') {
        if (CANCELLED_STATUSES.has(status)) {
            return (
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        İptal Edildi
                    </span>
                </div>
            );
        }
        return null;
    }

    const { activeStep } = getStepperState(status);

    return (
        <div className="flex items-center gap-0 mb-4">
            {STEPPER_STEPS.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;

                return (
                    <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    isCompleted
                                        ? 'bg-blue-500 text-white'
                                        : isActive
                                        ? 'border-2 border-blue-500 bg-blue-500/20 text-blue-400'
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
                                    isCompleted || isActive ? 'text-blue-400' : 'text-gray-600'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPPER_STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1 mb-3 ${
                                    isCompleted ? 'bg-blue-500' : 'bg-gray-700'
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
                <div className="space-y-2">
                    <div className="h-4 w-44 bg-gray-800 rounded" />
                    <div className="h-3 w-28 bg-gray-800 rounded" />
                </div>
                <div className="h-6 w-24 bg-gray-800 rounded-full" />
            </div>
            <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-6 bg-gray-800 rounded-full" />
                ))}
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 w-36 bg-gray-800 rounded" />
                <div className="h-3 w-32 bg-gray-800 rounded" />
                <div className="h-3 w-40 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-800 rounded-xl" />
                <div className="h-9 w-20 bg-gray-800 rounded-xl" />
            </div>
        </div>
    );
}

function AppointmentCard({
    apt,
    jwt,
    onCancelClick,
    onRateClick,
    onActionDone,
}: {
    apt: Appointment;
    jwt: string;
    onCancelClick: (id: number) => void;
    onRateClick: (id: number) => void;
    onActionDone: () => void;
}) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const status = apt.attributes.status;
    const vehicle = apt.attributes.vehicle?.data?.attributes;
    const workshop = apt.attributes.service?.data?.attributes;
    const services = apt.attributes.services?.data ?? [];
    const serviceNames = services.map(s => s.attributes.name).join(', ');
    const isCancelled = CANCELLED_STATUSES.has(status);
    const duration = apt.attributes.duration;

    async function handleAction(action: string) {
        setActionLoading(action);
        try {
            await fetch(`/api/appointments/${apt.id}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({}),
            });
            onActionDone();
        } catch {
            // silently fail
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-white text-sm leading-tight truncate">
                            {workshop?.name ?? 'Oto Yıkama Servisi'}
                        </p>
                        {workshop?.city && (
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {workshop.city}
                            </p>
                        )}
                    </div>
                </div>
                <StatusBadge status={status} />
            </div>

            <ProgressStepper status={status} />

            {/* Araç plakası büyük badge */}
            {vehicle?.plate && (
                <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-sm px-3 py-1.5 rounded-lg tracking-widest">
                        <Car className="w-4 h-4" />
                        {vehicle.plate}
                    </span>
                </div>
            )}

            <div className="space-y-2 mb-4">
                {workshop?.address && (
                    <div className="flex items-start gap-2 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{workshop.address}</span>
                    </div>
                )}
                {vehicle && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Car className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span>
                            {vehicle.brand} {vehicle.model}
                            {vehicle.year ? ` (${vehicle.year})` : ''}
                        </span>
                    </div>
                )}
                {serviceNames && (
                    <div className="flex items-start gap-2 text-xs text-gray-400">
                        <Wrench className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{serviceNames}</span>
                    </div>
                )}
                {(apt.attributes.scheduledDate || apt.attributes.createdAt) && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span>
                            {apt.attributes.scheduledDate
                                ? formatDate(apt.attributes.scheduledDate, apt.attributes.scheduledTime)
                                : `Talep: ${formatDate(apt.attributes.createdAt)}`}
                        </span>
                    </div>
                )}
                {duration != null && duration > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span>Tahmini süre: {duration} dk</span>
                    </div>
                )}
            </div>

            {(apt.attributes.totalPrice != null || apt.attributes.offerPrice != null) && (
                <div className="flex items-center gap-3 mb-4 py-3 border-t border-gray-800">
                    {apt.attributes.totalPrice != null && (
                        <span className="text-sm font-bold text-white">
                            {apt.attributes.totalPrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                    {apt.attributes.offerPrice != null && (
                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Teklif: {apt.attributes.offerPrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                </div>
            )}

            {apt.attributes.progressPercentage != null && apt.attributes.progressPercentage > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            İlerleme
                        </span>
                        <span className="text-xs font-medium text-blue-400">
                            {apt.attributes.progressPercentage}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${apt.attributes.progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {isCancelled && apt.attributes.cancelReason && (
                <div className="mb-4 px-3 py-2.5 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-400">
                        <span className="font-medium">İptal sebebi:</span> {apt.attributes.cancelReason}
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800">
                {status === 'Tarih Belirlendi' && (
                    <>
                        <button
                            onClick={() => handleAction('confirm-attendance')}
                            disabled={actionLoading === 'confirm-attendance'}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === 'confirm-attendance' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            Onayla
                        </button>
                        <button
                            onClick={() => onCancelClick(apt.id)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            İptal
                        </button>
                    </>
                )}
                {status === 'Onaylandı' && (
                    <button
                        onClick={() => onCancelClick(apt.id)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        İptal
                    </button>
                )}
                {status === 'Müşteri Onayı Bekleniyor' && (
                    <>
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
                            Onayla
                        </button>
                        <button
                            onClick={() => handleAction('customer-report-progress')}
                            disabled={actionLoading === 'customer-report-progress'}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === 'customer-report-progress' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                            İtiraz Et
                        </button>
                    </>
                )}
                {status === 'Tamamlandı' && (
                    <button
                        onClick={() => onRateClick(apt.id)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                    >
                        <Star className="w-3.5 h-3.5" />
                        Değerlendir
                    </button>
                )}
            </div>
        </div>
    );
}

function RatingModalComponent({
    modal,
    onClose,
    onSubmit,
    onChange,
}: {
    modal: RatingModal;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (updates: Partial<RatingModal>) => void;
}) {
    if (!modal.open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
                <h2 className="text-lg font-bold text-white mb-1">Randevuyu Değerlendir</h2>
                <p className="text-gray-400 text-sm mb-5">Hizmet deneyiminizi paylaşın</p>

                <div className="flex gap-2 mb-5 justify-center">
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

                <div className="text-center mb-5">
                    <span className="text-xs text-gray-500">
                        {modal.rating === 1 && 'Çok Kötü'}
                        {modal.rating === 2 && 'Kötü'}
                        {modal.rating === 3 && 'Orta'}
                        {modal.rating === 4 && 'İyi'}
                        {modal.rating === 5 && 'Mükemmel'}
                    </span>
                </div>

                <textarea
                    value={modal.comment}
                    onChange={e => onChange({ comment: e.target.value })}
                    placeholder="Yorumunuzu yazın (opsiyonel)"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none placeholder-gray-500 mb-4 transition-colors"
                />

                {modal.error && (
                    <p className="text-red-400 text-sm mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{modal.error}</p>
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

function CancelModalComponent({
    modal,
    onClose,
    onConfirm,
}: {
    modal: CancelModal;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!modal.open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="text-base font-bold text-white">Randevuyu İptal Et</h2>
                </div>
                <p className="text-gray-400 text-sm mb-5">
                    Bu oto yıkama randevusunu iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
                {modal.error && (
                    <p className="text-red-400 text-sm mb-4 bg-red-500/10 px-3 py-2 rounded-lg">{modal.error}</p>
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
                        disabled={modal.submitting}
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

export default function OtoYikamaRandevularimPage() {
    const [jwt, setJwt] = useState<string | null>(null);
    const [jwtChecked, setJwtChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<'aktif' | 'gecmis'>('aktif');
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [ratingModal, setRatingModal] = useState<RatingModal>({
        open: false,
        appointmentId: null,
        rating: 5,
        comment: '',
        submitting: false,
        error: '',
        submitted: false,
    });
    const [cancelModal, setCancelModal] = useState<CancelModal>({
        open: false,
        appointmentId: null,
        submitting: false,
        error: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('tamirhanem_jwt');
        setJwt(token);
        setJwtChecked(true);
    }, []);

    const fetchAppointments = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const res = await fetch(
                '/api/appointments?filters[serviceType][$eq]=car_wash&populate=vehicle,service,services&sort=createdAt:desc',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data?.data) {
                // Ek güvenlik filtresi: servis adında "yıkama" geçenler de dahil
                const all: Appointment[] = data.data;
                const filtered = all.filter((apt) => {
                    const stype = apt.attributes.serviceType?.toLowerCase() ?? '';
                    const sname = apt.attributes.service?.data?.attributes?.name?.toLowerCase() ?? '';
                    return stype === 'car_wash' || sname.includes('yıkama') || sname.includes('yikama');
                });
                setAllAppointments(filtered.length > 0 ? filtered : all);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (jwt) fetchAppointments(jwt);
    }, [jwt, fetchAppointments]);

    const activeAppointments = allAppointments.filter(a => !PAST_STATUSES.has(a.attributes.status));
    const pastAppointments = allAppointments.filter(a => PAST_STATUSES.has(a.attributes.status));
    const displayedAppointments = activeTab === 'aktif' ? activeAppointments : pastAppointments;

    function openRateModal(id: number) {
        setRatingModal({ open: true, appointmentId: id, rating: 5, comment: '', submitting: false, error: '', submitted: false });
    }

    function openCancelModal(id: number) {
        setCancelModal({ open: true, appointmentId: id, submitting: false, error: '' });
    }

    async function handleRatingSubmit() {
        if (!jwt || !ratingModal.appointmentId) return;
        setRatingModal(prev => ({ ...prev, submitting: true, error: '' }));
        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    appointment: ratingModal.appointmentId,
                    rating: ratingModal.rating,
                    comment: ratingModal.comment,
                }),
            });
            if (!res.ok) throw new Error();
            setRatingModal(prev => ({ ...prev, submitting: false, submitted: true }));
            setTimeout(() => setRatingModal(prev => ({ ...prev, open: false })), 1500);
        } catch {
            setRatingModal(prev => ({
                ...prev,
                submitting: false,
                error: 'Değerlendirme gönderilemedi. Lütfen tekrar deneyin.',
            }));
        }
    }

    async function handleCancelConfirm() {
        if (!jwt || !cancelModal.appointmentId) return;
        setCancelModal(prev => ({ ...prev, submitting: true, error: '' }));
        try {
            const res = await fetch(`/api/appointments/${cancelModal.appointmentId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ reason: '' }),
            });
            if (!res.ok) throw new Error();
            setCancelModal({ open: false, appointmentId: null, submitting: false, error: '' });
            fetchAppointments(jwt);
        } catch {
            setCancelModal(prev => ({
                ...prev,
                submitting: false,
                error: 'Randevu iptal edilemedi. Lütfen tekrar deneyin.',
            }));
        }
    }

    if (!jwtChecked) return null;

    if (!jwt) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Droplets className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Giriş Yapmalısınız</h2>
                <p className="text-gray-400 text-sm mb-6">Oto yıkama randevularınızı görüntülemek için hesabınıza giriş yapın.</p>
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

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/80 to-blue-800/60 border-b border-blue-800/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <Droplets className="w-5 h-5 text-blue-400" />
                        Oto Yıkama Randevularım
                    </h1>
                    <Link
                        href="/oto-yikama"
                        className="text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-colors"
                    >
                        Servisler
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('aktif')}
                        className={`flex-1 pb-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'aktif'
                                ? 'border-b-2 border-blue-500 text-white'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <Droplets className="w-4 h-4" />
                        Aktif
                        {activeAppointments.length > 0 && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                {activeAppointments.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('gecmis')}
                        className={`flex-1 pb-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'gecmis'
                                ? 'border-b-2 border-blue-500 text-white'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        <CalendarX className="w-4 h-4" />
                        Geçmiş
                        {pastAppointments.length > 0 && (
                            <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">
                                {pastAppointments.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : displayedAppointments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Droplets className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-white font-semibold mb-1">
                            {activeTab === 'aktif' ? 'Aktif randevu yok' : 'Geçmiş randevu yok'}
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            {activeTab === 'aktif'
                                ? 'Henüz aktif oto yıkama randevunuz bulunmuyor.'
                                : 'Tamamlanmış veya iptal edilmiş randevunuz bulunmuyor.'}
                        </p>
                        {activeTab === 'aktif' && (
                            <Link
                                href="/oto-yikama"
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
                            >
                                Randevu Al
                                <ChevronRight className="w-4 h-4" />
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
                            />
                        ))}
                    </div>
                )}
            </div>

            <RatingModalComponent
                modal={ratingModal}
                onClose={() => setRatingModal(prev => ({ ...prev, open: false }))}
                onSubmit={handleRatingSubmit}
                onChange={(updates) => setRatingModal(prev => ({ ...prev, ...updates }))}
            />
            <CancelModalComponent
                modal={cancelModal}
                onClose={() => setCancelModal({ open: false, appointmentId: null, submitting: false, error: '' })}
                onConfirm={handleCancelConfirm}
            />
        </div>
    );
}
