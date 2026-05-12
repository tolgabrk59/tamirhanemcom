'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, Car, Loader2, Star, CalendarX, MapPin, Wrench,
  ChevronRight, XCircle, CheckCircle2, AlertTriangle, Shield, Gift,
  MessageSquare, Phone, RotateCcw, Check, X, Hourglass, Flag,
  ChevronDown, ChevronUp, RefreshCw,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Vehicle { id: number; brand: string; model: string; plate: string; year?: number; }
interface Service { id: number; name: string; phone?: string; ProfilePicture?: { url: string }; service_type?: string; }
interface Category { id: number; name: string; }
interface SelectedService { id: number; serviceName: string; price?: number; duration?: number; }
interface MatchedDate { date: string; timeSlot?: string; }

interface Appointment {
  id: number;
  status: string;
  offerStatus?: string;
  isOfferRequest?: boolean;
  offerPrice?: number;
  offerNote?: string;
  offerDate?: string;
  matchedDate?: MatchedDate[];
  preferredDateTime?: string;
  availableDates?: string[];
  notes?: string;
  cancelReason?: string;
  progressPercentage?: number;
  is_guaranteed?: boolean;
  userCompletionConfirmed?: boolean;
  serviceCompletionConfirmed?: boolean;
  noShowMarkedAt?: string;
  katilim_durumu?: string;
  gecikme_suresi_dk?: number;
  CompletedDate?: string;
  autoCompletedAt?: string;
  createdAt: string;
  service?: Service | null;
  vehicle?: Vehicle;
  category?: Category;
  selected_services?: SelectedService[];
  createdFromAppointment?: { id: number } | null;
  replacedByAppointment?: { id: number } | null;
}

// ─── Status Config ──────────────────────────────────────────────────────────
function getStatusConfig(item: Appointment, tab: 'Randevular' | 'Teklifler') {
  const servicePrefix = item.service === null ? 'Tüm servislerden' : 'Servisten';
  const serviceText = item.service === null ? 'Tüm servisler' : 'Servis';

  if (item.offerPrice && tab === 'Teklifler') {
    return { text: 'Teklif onaylandı ve randevuya dönüşerek kesinleşti', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30', dot: 'bg-green-400' };
  }

  if (item.isOfferRequest) {
    switch (item.offerStatus) {
      case 'Teklif Bekliyor': return { text: `${servicePrefix} teklif ve tarih önerisi bekleniyor`, color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-500/30', dot: 'bg-amber-400' };
      case 'Teklif Verildi': return { text: `${serviceText} bir teklif sundu, onayınızı bekliyor`, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30', dot: 'bg-blue-400' };
      case 'Onaylandı': return { text: tab === 'Teklifler' ? 'Teklif onaylandı ve randevuya dönüştürüldü' : 'Tekliften oluşan randevu - Onaylandı', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30', dot: 'bg-green-400' };
      case 'Reddedildi': return { text: 'Teklif reddedildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
      case 'İptal Edildi': return { text: 'Teklif iptal edildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
      default: return { text: 'Durum belirsiz', color: 'text-gray-400', bg: 'bg-gray-800/50', border: 'border-gray-700', dot: 'bg-gray-400' };
    }
  }

  switch (item.status) {
    case 'Beklemede': return { text: `${servicePrefix} tarih önerisi ya da ön onay bekleniyor`, color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30', dot: 'bg-orange-400' };
    case 'Tarih Belirlendi': return { text: `${serviceText} bir tarih önerdi, onayınızı bekliyor`, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30', dot: 'bg-blue-400' };
    case 'Ön Onaylı': return { text: 'Tercih ettiğiniz tarih ön onaydan geçti, final onayınızı bekliyor', color: 'text-lime-400', bg: 'bg-lime-900/20', border: 'border-lime-500/30', dot: 'bg-lime-400' };
    case 'Onaylandı': return { text: item.offerPrice ? 'Tekliften oluşan randevu - Onaylandı' : 'Randevu onaylandı ve kesinleşti', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30', dot: 'bg-green-400' };
    case 'Araç Teslim Alındı': return { text: 'Aracınız servise teslim edildi', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/30', dot: 'bg-cyan-400' };
    case 'İşlem Devam Ediyor': return { text: 'Servis işlemi devam ediyor', color: 'text-violet-400', bg: 'bg-violet-900/20', border: 'border-violet-500/30', dot: 'bg-violet-400' };
    case 'Müşteri Onayı Bekleniyor': return { text: 'Tamamlama için onayınız bekleniyor', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', dot: 'bg-yellow-400' };
    case 'Teslimata Hazır': return { text: 'Aracınız teslimata hazır', color: 'text-teal-400', bg: 'bg-teal-900/20', border: 'border-teal-500/30', dot: 'bg-teal-400' };
    case 'Araç Teslim Edildi': return { text: 'Aracınız teslim edildi', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', dot: 'bg-emerald-400' };
    case 'Tamamlandı': return { text: 'Randevu tamamlandı', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30', dot: 'bg-green-400' };
    case 'İptal': return { text: 'Randevu iptal edildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
    case 'Randevu İptal': return { text: 'Randevu iptal edildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
    case 'Reddedildi': return { text: 'Randevu reddedildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
    case 'Gecikme Raporu': return { text: 'Servis gecikme bildirdi', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30', dot: 'bg-orange-400' };
    case 'Gelmedi (Müşteri)': return { text: 'Servise gelmediniz', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
    case 'Gelmedi (Servis)': return { text: 'Servis açık değildi', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30', dot: 'bg-red-400' };
    case 'Ödeme Bekleniyor': return { text: 'Ödeme bekleniyor', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', dot: 'bg-yellow-400' };
    default: return { text: item.status || 'Bilinmiyor', color: 'text-gray-400', bg: 'bg-gray-800/50', border: 'border-gray-700', dot: 'bg-gray-400' };
  }
}

// ─── Stepper ────────────────────────────────────────────────────────────────
interface Step { id: string; label: string; date: string; status: 'completed' | 'active' | 'pending' | 'rejected'; }

function getSteps(item: Appointment): Step[] {
  const steps: Step[] = [];
  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Belirtilmemiş';
  const fmtMatched = (m?: MatchedDate[]) => m?.[0] ? `${fmt(m[0].date)}${m[0].timeSlot ? ' ' + m[0].timeSlot : ''}` : 'Bekleniyor';

  steps.push({ id: 'request', label: 'Talep', date: fmt(item.preferredDateTime || item.createdAt), status: 'completed' });

  const s = item.status;
  let proposalStatus: Step['status'] = 'pending';
  let proposalLabel = 'Öneri';
  let proposalDate = 'Bekleniyor';

  if (item.isOfferRequest) {
    if (item.offerStatus === 'Teklif Bekliyor') { proposalLabel = 'Teklif Bekleniyor'; proposalDate = 'Servisten teklif bekleniyor'; proposalStatus = 'pending'; }
    else if (item.offerStatus === 'Teklif Verildi') { proposalLabel = 'Teklif Alındı'; proposalDate = item.offerDate ? fmt(item.offerDate) : 'Alındı'; proposalStatus = 'active'; }
    else if (item.offerStatus === 'Onaylandı') { proposalLabel = 'Teklif Kabul Edildi'; proposalDate = item.offerDate ? fmt(item.offerDate) : 'Tamamlandı'; proposalStatus = 'completed'; }
    else if (['Reddedildi', 'İptal Edildi'].includes(item.offerStatus || '')) { proposalLabel = 'Teklif'; proposalDate = 'Reddedildi/İptal'; proposalStatus = 'rejected'; }
  } else {
    if (s === 'Beklemede') { proposalLabel = 'Yanıt Bekleniyor'; proposalDate = 'Servisten yanıt bekleniyor'; proposalStatus = 'pending'; }
    else if (s === 'Tarih Belirlendi') { proposalLabel = 'Servis Tarih Önerdi'; proposalDate = fmtMatched(item.matchedDate); proposalStatus = 'active'; }
    else if (s === 'Ön Onaylı') { proposalLabel = 'Ön Onay Alındı'; proposalDate = fmtMatched(item.matchedDate); proposalStatus = 'active'; }
    else if (['Onaylandı', 'Araç Teslim Alındı', 'İşlem Devam Ediyor', 'Müşteri Onayı Bekleniyor', 'Teslimata Hazır', 'Araç Teslim Edildi', 'Tamamlandı'].includes(s)) { proposalLabel = 'Tarih Onaylandı'; proposalDate = fmtMatched(item.matchedDate); proposalStatus = 'completed'; }
    else if (['İptal', 'Randevu İptal', 'Reddedildi'].includes(s)) {
      if (item.matchedDate?.length) { proposalLabel = 'Tarih Önerildi'; proposalDate = fmtMatched(item.matchedDate); proposalStatus = 'completed'; }
      else { proposalLabel = 'Öneri'; proposalDate = 'Bekleniyor'; proposalStatus = 'rejected'; }
    }
  }
  steps.push({ id: 'proposal', label: proposalLabel, date: proposalDate, status: proposalStatus });

  // Onay step
  const isApproved = ['Onaylandı', 'Araç Teslim Alındı', 'İşlem Devam Ediyor', 'Müşteri Onayı Bekleniyor', 'Teslimata Hazır', 'Araç Teslim Edildi', 'Tamamlandı'].includes(s) || item.offerStatus === 'Onaylandı';
  const isRejected = ['İptal', 'Randevu İptal', 'Reddedildi'].includes(s) || ['İptal Edildi', 'Reddedildi'].includes(item.offerStatus || '');
  const approvalStatus: Step['status'] = isApproved ? 'completed' : isRejected ? 'rejected' : 'pending';
  steps.push({ id: 'approval', label: isRejected ? (s === 'İptal' || s === 'Randevu İptal' ? 'İptal Edildi' : 'Reddedildi') : isApproved ? 'Onaylandı' : 'Onay Bekleniyor', date: isApproved ? fmtMatched(item.matchedDate) : isRejected ? '' : 'Bekleniyor', status: approvalStatus });

  // Tamamlama step (sadece onaylandıysa)
  if (isApproved) {
    const completionStatus: Step['status'] = s === 'Tamamlandı' ? 'completed' : s === 'Müşteri Onayı Bekleniyor' ? 'active' : 'pending';
    steps.push({ id: 'completion', label: s === 'Tamamlandı' ? 'Tamamlandı' : 'Tamamla', date: s === 'Tamamlandı' ? fmt(item.CompletedDate || item.autoCompletedAt) : 'Randevu sonrası', status: completionStatus });
  }

  return steps;
}

function Stepper({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-start gap-0 mt-4">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-start flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              step.status === 'completed' ? 'bg-green-500 text-white' :
              step.status === 'active' ? 'bg-orange-500 text-white ring-2 ring-orange-400/40' :
              step.status === 'rejected' ? 'bg-red-500 text-white' :
              'bg-gray-700 text-gray-400'
            }`}>
              {step.status === 'completed' ? <Check size={12} /> : step.status === 'rejected' ? <X size={12} /> : step.status === 'active' ? <div className="w-2 h-2 bg-white rounded-full" /> : <div className="w-2 h-2 bg-gray-500 rounded-full" />}
            </div>
            <div className={`mt-1 px-1 text-center ${i < steps.length - 1 ? '' : ''}`}>
              <p className={`text-xs font-medium leading-tight ${step.status === 'completed' ? 'text-green-400' : step.status === 'active' ? 'text-orange-400' : step.status === 'rejected' ? 'text-red-400' : 'text-gray-500'}`}>{step.label}</p>
              {step.date && <p className="text-gray-600 text-xs mt-0.5 leading-tight">{step.date}</p>}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mt-3 mx-1 ${
              steps[i + 1].status === 'pending' || (step.status === 'rejected') ? 'bg-gray-700' :
              step.status === 'completed' ? 'bg-green-500/50' : 'bg-orange-500/30'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Rating Modal ───────────────────────────────────────────────────────────
function RatingModal({ appointment, onClose, onSubmit }: { appointment: Appointment; onClose: () => void; onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-800">
        <h3 className="text-white font-bold text-lg mb-1">Servisi Değerlendir</h3>
        <p className="text-gray-400 text-sm mb-5">{appointment.service?.name || 'Servis'}</p>
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setRating(s)}>
              <Star size={32} className={s <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-600'} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Yorumunuzu yazın (isteğe bağlı)..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm">İptal</button>
          <button onClick={() => rating > 0 && onSubmit(rating, comment)} disabled={rating === 0} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white text-sm font-semibold transition-colors">Gönder</button>
        </div>
      </div>
    </div>
  );
}

// ─── Cancel Modal ───────────────────────────────────────────────────────────
function CancelModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-800">
        <h3 className="text-white font-bold text-lg mb-1">Randevuyu İptal Et</h3>
        <p className="text-gray-400 text-sm mb-4">Bu işlem geri alınamaz.</p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="İptal nedeninizi yazın (isteğe bağlı)..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm">Vazgeç</button>
          <button onClick={() => onConfirm(reason)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">İptal Et</button>
        </div>
      </div>
    </div>
  );
}

// ─── Appointment Card ───────────────────────────────────────────────────────
function AppointmentCard({ apt, onAction, tab }: { apt: Appointment; onAction: (action: string, apt: Appointment) => void; tab: 'Randevular' | 'Teklifler' }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = getStatusConfig(apt, tab);
  const steps = getSteps(apt);
  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
  const fmtTime = (d?: string) => d ? new Date(d).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';

  const canCancel = ['Beklemede', 'Tarih Belirlendi', 'Ön Onaylı'].includes(apt.status) && !apt.isOfferRequest;
  const canAccept = apt.status === 'Tarih Belirlendi' || apt.status === 'Ön Onaylı';
  const canAcceptOffer = apt.isOfferRequest && apt.offerStatus === 'Teklif Verildi';
  const canRejectOffer = apt.isOfferRequest && apt.offerStatus === 'Teklif Verildi';
  const canConfirmComplete = apt.status === 'Müşteri Onayı Bekleniyor';
  const isCompleted = apt.status === 'Tamamlandı';
  const isCancelled = ['İptal', 'Randevu İptal', 'Reddedildi'].includes(apt.status);
  const showFreeRebook = isCancelled && apt.createdFromAppointment?.id;

  const matchedDateStr = apt.matchedDate?.[0] ? `${fmt(apt.matchedDate[0].date)}${apt.matchedDate[0].timeSlot ? ' · ' + apt.matchedDate[0].timeSlot : ''}` : '';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Service Image */}
          <div className="w-12 h-12 rounded-xl bg-gray-800 flex-shrink-0 overflow-hidden">
            {apt.service?.ProfilePicture?.url ? (
              <img src={apt.service.ProfilePicture.url.startsWith('http') ? apt.service.ProfilePicture.url : `https://api.tamirhanem.net${apt.service.ProfilePicture.url}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Wrench size={20} className="text-gray-600" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-white font-semibold truncate">{apt.service?.name || (apt.service === null ? 'Tüm Servisler' : 'Servis')}</p>
              <span className="text-gray-500 text-xs flex-shrink-0">#{apt.id}</span>
            </div>
            {apt.vehicle && (
              <div className="flex items-center gap-1 mt-0.5">
                <Car size={12} className="text-gray-500" />
                <span className="text-gray-400 text-xs">{apt.vehicle.brand} {apt.vehicle.model} · {apt.vehicle.plate}</span>
              </div>
            )}
            {apt.category && <p className="text-gray-500 text-xs mt-0.5">{apt.category.name}</p>}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <p className={`text-xs font-medium leading-tight ${cfg.color}`}>{cfg.text}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {apt.is_guaranteed && (
            <div className="flex items-center gap-1 bg-green-900/20 border border-green-500/30 rounded-lg px-2 py-1">
              <Shield size={11} className="text-green-400" />
              <span className="text-green-400 text-xs font-medium">TamirHanem Güvenceli</span>
            </div>
          )}
          {apt.createdFromAppointment?.id && (
            <div className="flex items-center gap-1 bg-orange-900/20 border border-orange-500/30 rounded-lg px-2 py-1">
              <Gift size={11} className="text-orange-400" />
              <span className="text-orange-400 text-xs font-medium">Ücretsiz Randevu</span>
            </div>
          )}
          {apt.offerPrice && (
            <div className="flex items-center gap-1 bg-blue-900/20 border border-blue-500/30 rounded-lg px-2 py-1">
              <span className="text-blue-400 text-xs font-medium">Teklif: ₺{apt.offerPrice}</span>
            </div>
          )}
        </div>

        {/* Date info */}
        {matchedDateStr && (
          <div className="flex items-center gap-1.5 mt-2">
            <Calendar size={13} className="text-orange-400" />
            <span className="text-gray-300 text-sm">{matchedDateStr}</span>
          </div>
        )}
        {!matchedDateStr && apt.preferredDateTime && (
          <div className="flex items-center gap-1.5 mt-2">
            <Clock size={13} className="text-gray-500" />
            <span className="text-gray-400 text-sm">Tercih: {fmt(apt.preferredDateTime)} {fmtTime(apt.preferredDateTime)}</span>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="px-4 pb-3">
        <Stepper steps={steps} />
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {canAccept && (
          <button onClick={() => onAction('accept', apt)} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            <CheckCircle2 size={15} /> Onayla
          </button>
        )}
        {canAcceptOffer && (
          <button onClick={() => onAction('accept-offer', apt)} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            <CheckCircle2 size={15} /> Teklifi Kabul Et
          </button>
        )}
        {canRejectOffer && (
          <button onClick={() => onAction('reject-offer', apt)} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-red-700/80 hover:bg-red-700 text-white text-sm py-2.5 rounded-xl transition-colors">
            <X size={15} /> Reddet
          </button>
        )}
        {canConfirmComplete && (
          <button onClick={() => onAction('confirm-completion', apt)} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            <Flag size={15} /> Tamamlandı Onayla
          </button>
        )}
        {canCancel && (
          <button onClick={() => onAction('cancel', apt)} className="flex items-center justify-center gap-1.5 border border-red-700/50 text-red-400 hover:bg-red-900/20 text-sm py-2.5 px-3 rounded-xl transition-colors">
            <XCircle size={14} /> İptal
          </button>
        )}
        {isCompleted && !apt.replacedByAppointment && (
          <button onClick={() => onAction('rate', apt)} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm py-2.5 rounded-xl transition-colors hover:bg-orange-500/30">
            <Star size={14} /> Değerlendir
          </button>
        )}
        {showFreeRebook && (
          <Link href="/randevu-al" className="flex-1 min-w-0 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
            <RotateCcw size={14} /> Ücretsiz Yeniden Randevu
          </Link>
        )}
      </div>

      {/* Expand/Collapse */}
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-gray-800 text-gray-500 hover:text-gray-300 text-xs transition-colors">
        {expanded ? <><ChevronUp size={14} /> Daha az göster</> : <><ChevronDown size={14} /> Detayları göster</>}
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-3">
          {apt.selected_services && apt.selected_services.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Seçilen Hizmetler</p>
              <div className="space-y-1">
                {apt.selected_services.map(s => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">{s.serviceName}</span>
                    {s.price && <span className="text-orange-400 text-sm">₺{s.price}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {apt.notes && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Notlarım</p>
              <p className="text-gray-300 text-sm">{apt.notes}</p>
            </div>
          )}
          {apt.offerNote && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Teklif Notu</p>
              <p className="text-gray-300 text-sm">{apt.offerNote}</p>
            </div>
          )}
          {apt.cancelReason && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">İptal Nedeni</p>
              <p className="text-gray-300 text-sm">{apt.cancelReason}</p>
            </div>
          )}
          {apt.gecikme_suresi_dk && (
            <div className="flex items-center gap-2 bg-orange-900/20 border border-orange-500/30 rounded-xl p-3">
              <AlertTriangle size={14} className="text-orange-400" />
              <p className="text-orange-400 text-sm">Gecikme: {apt.gecikme_suresi_dk} dakika</p>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gray-600" />
            <span className="text-gray-500 text-xs">Oluşturuldu: {new Date(apt.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
          {apt.service?.phone && (
            <a href={`tel:${apt.service.phone}`} className="flex items-center gap-2 bg-gray-800 rounded-xl p-3 hover:bg-gray-700 transition-colors">
              <Phone size={14} className="text-green-400" />
              <span className="text-gray-300 text-sm">{apt.service.phone}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
const POPULATE = 'populate[user][populate]=avatar&populate[service][populate][0]=ProfilePicture&populate[service][populate][1]=categories&populate[vehicle][populate]=*&populate[category][populate]=*&populate[selected_services]=*&populate[createdFromAppointment][fields][0]=id&populate[replacedByAppointment][fields][0]=id';

type MainTab = 'Randevular' | 'Teklifler';
type SubTab = 'Aktif' | 'Geçmiş' | 'Tümü';

export default function RandevularimPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('Randevular');
  const [subTab, setSubTab] = useState<SubTab>('Aktif');
  const [ratingApt, setRatingApt] = useState<Appointment | null>(null);
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const jwt = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!jwt) { setLoading(false); return; }
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`/api/appointments?${POPULATE}&sort=createdAt:desc&pagination[pageSize]=50`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      const list: Appointment[] = data.data || [];
      setAppointments(list);
    } catch {
      showToast('Randevular yüklenemedi', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [jwt]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAction = async (action: string, apt: Appointment) => {
    if (action === 'rate') { setRatingApt(apt); return; }
    if (action === 'cancel') { setCancelApt(apt); return; }

    setActionLoading(apt.id);
    try {
      const res = await fetch(`/api/appointments/${apt.id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('İşlem başarılı');
        fetchAppointments(true);
      } else {
        showToast(data.error?.message || 'İşlem başarısız', 'error');
      }
    } catch {
      showToast('Bir hata oluştu', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (reason: string) => {
    if (!cancelApt) return;
    setCancelApt(null);
    setActionLoading(cancelApt.id);
    try {
      const res = await fetch(`/api/appointments/${cancelApt.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) { showToast('Randevu iptal edildi'); fetchAppointments(true); }
      else showToast('İptal işlemi başarısız', 'error');
    } catch { showToast('Bir hata oluştu', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleRate = async (rating: number, comment: string) => {
    if (!ratingApt) return;
    setRatingApt(null);
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { rating, comment, service: ratingApt.service?.id, appointment: ratingApt.id } }),
      });
      showToast('Değerlendirmeniz için teşekkürler!');
    } catch { showToast('Değerlendirme gönderilemedi', 'error'); }
  };

  // Filter
  const ACTIVE_STATUSES = ['Beklemede', 'Tarih Belirlendi', 'Ön Onaylı', 'Onaylandı', 'Araç Teslim Alındı', 'İşlem Devam Ediyor', 'Müşteri Onayı Bekleniyor', 'Teslimata Hazır', 'Araç Teslim Edildi', 'Gecikme Raporu', 'Ödeme Bekleniyor'];
  const PAST_STATUSES = ['Tamamlandı', 'İptal', 'Randevu İptal', 'Reddedildi', 'Gelmedi (Müşteri)', 'Gelmedi (Servis)'];

  const filtered = appointments.filter(a => {
    if (mainTab === 'Teklifler') return a.isOfferRequest;
    if (mainTab === 'Randevular' && subTab === 'Aktif') return !a.isOfferRequest && ACTIVE_STATUSES.includes(a.status);
    if (mainTab === 'Randevular' && subTab === 'Geçmiş') return !a.isOfferRequest && PAST_STATUSES.includes(a.status);
    return !a.isOfferRequest;
  });

  const activeCount = appointments.filter(a => !a.isOfferRequest && ACTIVE_STATUSES.includes(a.status)).length;
  const offerCount = appointments.filter(a => a.isOfferRequest && ['Teklif Bekliyor', 'Teklif Verildi'].includes(a.offerStatus || '')).length;

  if (!jwt) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <CalendarX size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-400 text-sm mb-6">Randevularınızı görmek için giriş yapın.</p>
          <Link href="/giris" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">Giriş Yap</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-900/90 text-green-300 border border-green-700' : 'bg-red-900/90 text-red-300 border border-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Randevularım</h1>
            {activeCount > 0 && <p className="text-orange-400 text-sm mt-0.5">{activeCount} aktif randevu</p>}
          </div>
          <button onClick={() => fetchAppointments(true)} disabled={refreshing} className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-2 mb-4">
          {(['Randevular', 'Teklifler'] as MainTab[]).map(t => (
            <button key={t} onClick={() => setMainTab(t)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mainTab === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t}
              {t === 'Teklifler' && offerCount > 0 && <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{offerCount}</span>}
            </button>
          ))}
        </div>

        {/* Sub Tabs (only for Randevular) */}
        {mainTab === 'Randevular' && (
          <div className="flex gap-2 mb-5">
            {(['Aktif', 'Geçmiş', 'Tümü'] as SubTab[]).map(t => (
              <button key={t} onClick={() => setSubTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subTab === t ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
            <p className="text-gray-400 text-sm">Randevularınız yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <CalendarX size={48} className="text-gray-700" />
            <p className="text-gray-400 text-center">
              {mainTab === 'Teklifler' ? 'Teklif talebiniz bulunmuyor.' : subTab === 'Aktif' ? 'Aktif randevunuz bulunmuyor.' : subTab === 'Geçmiş' ? 'Geçmiş randevunuz bulunmuyor.' : 'Randevunuz bulunmuyor.'}
            </p>
            <Link href="/randevu-al" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">Randevu Al</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => (
              <div key={apt.id} className={actionLoading === apt.id ? 'opacity-60 pointer-events-none' : ''}>
                <AppointmentCard apt={apt} onAction={handleAction} tab={mainTab} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {ratingApt && <RatingModal appointment={ratingApt} onClose={() => setRatingApt(null)} onSubmit={handleRate} />}
      {cancelApt && <CancelModal onClose={() => setCancelApt(null)} onConfirm={handleCancel} />}
    </div>
  );
}
