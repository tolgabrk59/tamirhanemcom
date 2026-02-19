/**
 * Enhanced Appointment Components - Modern & Animated
 * Mobil App Mantığıyla + Durum Bazlı Stepper + Aksiyon Butonları
 */

// =======================================
// DURUM BAZLI RENK VE YAPILANDIRMA
// =======================================

/**
 * Duruma göre renk döndürür (Mobil App ile uyumlu)
 */
function getStatusColor(appointment) {
  const attrs = appointment.attributes || appointment;
  const status = (attrs.status || '').trim();
  const hasOffer = attrs.offerPrice && attrs.offerPrice > 0;

  // Teklif varsa turuncu renk
  if (hasOffer && ['Tarih Belirlendi', 'Ön Onaylı'].includes(status)) {
    return '#f97316'; // Turuncu (teklif rengi)
  }

  switch (status) {
    case 'Beklemede':
      return '#ff9800'; // Turuncu
    case 'Tarih Belirlendi':
      return '#fbc707'; // Sarı (randevu rengi)
    case 'Ön Onaylı':
      return '#66bb6a'; // Açık yeşil
    case 'Onaylandı':
      return '#22c55e'; // Yeşil
    case 'Tamamlandı':
      return '#10B981'; // Koyu yeşil
    case 'İptal':
    case 'İptal Edildi':
    case 'Reddedildi':
      return '#ef4444'; // Kırmızı
    default:
      return '#e5e7eb'; // Açık gri
  }
}

/**
 * Durum bazlı aksiyon butonları döndürür
 */
function getActionButtons(appointment, isServiceOwner = false) {
  const attrs = appointment.attributes || appointment;
  const status = (attrs.status || 'Beklemede').trim();
  const appointmentId = appointment.id || attrs.id;

  // Pool offers kontrolü
  let poolOffers = [];
  try {
    poolOffers = typeof attrs.poolOffers === 'string' ? JSON.parse(attrs.poolOffers) : (attrs.poolOffers || []);
  } catch(e) { poolOffers = []; }
  const pendingOffers = poolOffers.filter(o => o.status === 'pending');
  const poolOfferCount = pendingOffers.length;

  const buttons = [];

  // İptal/Red durumunda tıklanamaz bilgi butonu göster
  if (['İptal', 'İptal Edildi'].includes(status)) {
    buttons.push({
      type: 'secondary',
      label: isServiceOwner ? 'Kullanıcı Tarafından İptal Edildi' : 'İptal Edildi',
      icon: 'ri-close-circle-line',
      disabled: true
    });
    return buttons;
  }

  if (['Reddedildi'].includes(status)) {
    buttons.push({
      type: 'secondary',
      label: isServiceOwner ? 'Reddettiniz' : 'Servis Tarafından Reddedildi',
      icon: 'ri-close-circle-line',
      disabled: true
    });
    return buttons;
  }

  if (['Tamamlandı'].includes(status)) {
    buttons.push({
      type: 'secondary',
      label: 'Tamamlandı',
      icon: 'ri-check-double-line',
      disabled: true
    });
    return buttons;
  }

  // Teklif kartı mı kontrol et (isQuickService veya havuzdan gelen istek)
  const isQuickService = attrs.isQuickService === true || attrs.isQuickService === 'true';
  const hasService = attrs.service && (attrs.service.id || attrs.service.data?.id || (typeof attrs.service === 'number'));
  const isOfferCard = isQuickService || (!hasService && poolOfferCount >= 0);

  if (isServiceOwner) {
    // SERVİS SAHİBİ BUTONLARI
    switch (status) {
      case 'Beklemede':
        buttons.push({
          type: 'primary',
          label: 'Teklif Ver',
          icon: 'ri-price-tag-3-line',
          action: `openDateProposalModal(${appointmentId})`,
          pulse: true
        });
        buttons.push({
          type: 'danger',
          label: 'Reddet',
          icon: 'ri-close-line',
          action: `rejectAppointment(${appointmentId})`
        });
        break;
      case 'Tarih Belirlendi':
      case 'Ön Onaylı':
        buttons.push({
          type: 'secondary',
          label: 'Kullanıcı Onayı Bekleniyor',
          icon: 'ri-time-line',
          disabled: true
        });
        break;
      case 'Onaylandı':
        buttons.push({
          type: 'success',
          label: 'Tamamla',
          icon: 'ri-check-double-line',
          action: `openCompletionModal(${appointmentId})`,
          pulse: true
        });
        break;
    }
  } else {
    // NORMAL KULLANICI BUTONLARI
    switch (status) {
      case 'Beklemede':
        // Pool offers varsa "Teklifleri Gör" butonu
        if (poolOfferCount > 0) {
          buttons.push({
            type: 'success',
            label: `Teklifleri Gör (${poolOfferCount})`,
            icon: 'ri-mail-check-line',
            action: `openPoolOffersModal(${appointmentId})`,
            pulse: true
          });
        } else {
          buttons.push({
            type: 'secondary',
            label: 'Servis Yanıtı Bekleniyor',
            icon: 'ri-time-line',
            disabled: true
          });
        }
        buttons.push({
          type: 'danger',
          label: 'İptal Et',
          icon: 'ri-close-line',
          action: `cancelAppointment(${appointmentId})`
        });
        break;
      case 'Tarih Belirlendi':
        buttons.push({
          type: 'primary',
          label: 'Tarihi Onayla',
          icon: 'ri-check-line',
          action: `approveDate(${appointmentId})`,
          pulse: true
        });
        buttons.push({
          type: 'danger',
          label: 'Reddet',
          icon: 'ri-close-line',
          action: `rejectAppointment(${appointmentId})`
        });
        break;
      case 'Ön Onaylı':
        buttons.push({
          type: 'primary',
          label: 'Final Onay Ver',
          icon: 'ri-check-double-line',
          action: `giveFinalApproval(${appointmentId})`,
          pulse: true
        });
        buttons.push({
          type: 'danger',
          label: 'İptal Et',
          icon: 'ri-close-line',
          action: `cancelAppointment(${appointmentId})`
        });
        break;
      case 'Onaylandı':
        buttons.push({
          type: 'success',
          label: 'Tamamla',
          icon: 'ri-flag-line',
          action: `openCompletionModal(${appointmentId})`,
          pulse: true
        });
        break;
    }
  }

  return buttons;
}

/**
 * Aksiyon butonlarını HTML olarak render eder
 */
function renderActionButtons(appointment, isServiceOwner = false) {
  const buttons = getActionButtons(appointment, isServiceOwner);

  if (buttons.length === 0) return '';

  let html = '<div class="card-action-buttons">';

  buttons.forEach(btn => {
    const pulseClass = btn.pulse ? 'pulse-animation' : '';
    const disabledAttr = btn.disabled ? 'disabled' : '';
    const onclickAttr = btn.action && !btn.disabled ? `onclick="${btn.action}"` : '';

    let btnClass = 'action-btn';
    switch (btn.type) {
      case 'primary':
        btnClass += ' btn-primary';
        break;
      case 'success':
        btnClass += ' btn-success';
        break;
      case 'danger':
        btnClass += ' btn-danger';
        break;
      case 'secondary':
        btnClass += ' btn-secondary';
        break;
    }

    html += `
      <button class="${btnClass} ${pulseClass}" ${disabledAttr} ${onclickAttr}>
        <i class="${btn.icon}"></i>
        <span>${btn.label}</span>
      </button>
    `;
  });

  html += '</div>';
  return html;
}

// =======================================
// STEPPER YAPILANDIRMASI
// =======================================

const EnhancedAppointmentComponents = {
  /**
   * Durum bazlı stepper yapılandırması (Mobil App mantığı)
   */
  getStepperConfig(appointment, isServiceOwner = false) {
    const attrs = appointment.attributes || appointment;
    const status = (attrs.status || 'Beklemede').trim();
    const steps = [];

    // Tarih formatlayıcı
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    const formatMatchedDate = (matchedDate) => {
      // matchedDate string ise parse et
      let parsed = matchedDate;
      if (typeof matchedDate === 'string') {
        try { parsed = JSON.parse(matchedDate); } catch(e) { return ''; }
      }
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) return '';

      const first = parsed[0];
      // first direkt bir tarih string olabilir veya {date:..., timeSlot:...} objesi olabilir
      const dateValue = first?.date || (typeof first === 'string' ? first : null);
      const dateStr = dateValue ? formatDate(dateValue) : '';
      const timeSlot = first?.timeSlot || '';
      return timeSlot ? `${dateStr} ${timeSlot}` : dateStr;
    };

    const isCancelled = ['İptal', 'İptal Edildi', 'Reddedildi'].includes(status);

    // --- STEP 1: TALEP (Her zaman completed) ---
    steps.push({
      id: 'request',
      label: isServiceOwner ? 'Talep Alındı' : 'Talep',
      subtitle: formatDate(attrs.createdAt),
      icon: 'ri-file-list-3-line',
      status: isCancelled ? 'cancelled' : 'completed',
      requiresAction: false
    });

    // --- STEP 2: ÖNERİ/TARİH ---
    let proposalLabel, proposalSubtitle, proposalStatus, proposalRequiresAction = false;
    let isPoolOffer = false;
    let poolOfferCount = 0;

    // Pool offers kontrolü
    const isQuickService = attrs.isQuickService === true || attrs.isQuickService === 'true';
    let poolOffers = [];
    try {
      poolOffers = typeof attrs.poolOffers === 'string' ? JSON.parse(attrs.poolOffers) : (attrs.poolOffers || []);
    } catch(e) { poolOffers = []; }
    const pendingOffers = poolOffers.filter(o => o.status === 'pending');
    poolOfferCount = pendingOffers.length;

    // Service kontrolü - service objesi dolu mu?
    const hasService = attrs.service && (attrs.service.id || attrs.service.data?.id || (typeof attrs.service === 'number'));

    // Havuzda mı? (service yok ve isQuickService true VEYA poolOffers var)
    const isInPool = !hasService && (isQuickService || poolOfferCount > 0);

    if (status === 'Beklemede') {
      if (isServiceOwner) {
        proposalLabel = 'Teklif Ver';
        proposalSubtitle = 'Teklif vermeniz bekleniyor';
        proposalStatus = 'active';
        proposalRequiresAction = true;
      } else if (isInPool) {
        // Havuzda bekliyor (service yok)
        isPoolOffer = true;
        if (poolOfferCount > 0) {
          proposalLabel = `${poolOfferCount} Teklif Geldi`;
          proposalSubtitle = 'Tıklayın ve inceleyin';
          proposalStatus = 'active';
          proposalRequiresAction = true;
        } else {
          proposalLabel = 'Teklif Bekleniyor';
          proposalSubtitle = 'Servislerden teklif bekleniyor';
          proposalStatus = 'pending';
        }
      } else {
        proposalLabel = 'Yanıt Bekleniyor';
        proposalSubtitle = 'Servisten yanıt bekleniyor';
        proposalStatus = 'pending';
      }
    } else if (status === 'Tarih Belirlendi') {
      const hasOffer = attrs.offerPrice && attrs.offerPrice > 0;
      proposalLabel = isServiceOwner
        ? (hasOffer ? 'Teklif Yapıldı' : 'Tarih Önerildi')
        : (hasOffer ? 'Teklif Alındı' : 'Servis Tarih Önerdi');
      proposalSubtitle = formatMatchedDate(attrs.matchedDate);
      proposalStatus = isServiceOwner ? 'completed' : 'active';
      proposalRequiresAction = !isServiceOwner;
      // Kullanıcı tarafında teklif varsa, modal açılabilir olsun
      if (!isServiceOwner && hasOffer) {
        isPoolOffer = true;
        poolOfferCount = 1;
      }
    } else if (status === 'Ön Onaylı') {
      proposalLabel = isServiceOwner ? 'Ön Onay Verildi' : 'Ön Onay Alındı';
      proposalSubtitle = formatMatchedDate(attrs.matchedDate);
      proposalStatus = isServiceOwner ? 'completed' : 'active';
      proposalRequiresAction = !isServiceOwner;
    } else if (['Onaylandı', 'Tamamlandı'].includes(status)) {
      proposalLabel = 'Tarih Onaylandı';
      proposalSubtitle = formatMatchedDate(attrs.matchedDate);
      proposalStatus = 'completed';
    } else if (isCancelled) {
      proposalLabel = 'Öneri';
      proposalSubtitle = attrs.matchedDate ? formatMatchedDate(attrs.matchedDate) : 'Teklif yapılamadı';
      proposalStatus = 'cancelled';
    } else {
      proposalLabel = 'Öneri';
      proposalSubtitle = '';
      proposalStatus = 'pending';
    }

    steps.push({
      id: 'proposal',
      label: proposalLabel,
      subtitle: proposalSubtitle,
      icon: isPoolOffer && poolOfferCount > 0 ? 'ri-mail-check-line' : 'ri-calendar-check-line',
      status: proposalStatus,
      requiresAction: proposalRequiresAction,
      isPoolOffer: isPoolOffer,
      poolOfferCount: poolOfferCount
    });

    // --- STEP 3: ONAY ---
    let approvalLabel, approvalSubtitle, approvalStatus;

    if (['Onaylandı', 'Tamamlandı'].includes(status)) {
      approvalLabel = 'Onaylandı';
      approvalSubtitle = '';
      approvalStatus = 'completed';
    } else if (isCancelled) {
      if (status === 'İptal' || status === 'İptal Edildi') {
        approvalLabel = isServiceOwner ? 'Kullanıcı İptal Etti' : 'İptal Edildi';
        approvalSubtitle = 'İşlem iptal edildi';
      } else {
        approvalLabel = isServiceOwner ? 'Reddettiniz' : 'Reddedildi';
        approvalSubtitle = 'Teklif reddedildi';
      }
      approvalStatus = 'rejected';
    } else {
      approvalLabel = 'Onay';
      if (status === 'Ön Onaylı') {
        approvalSubtitle = isServiceOwner ? 'Kullanıcı onayı bekleniyor' : 'Onayınız bekleniyor';
      } else if (status === 'Tarih Belirlendi') {
        approvalSubtitle = isServiceOwner ? 'Kullanıcı onayı bekleniyor' : 'Tarih onayınız bekleniyor';
      } else {
        approvalSubtitle = 'Bekleniyor';
      }
      approvalStatus = 'pending';
    }

    steps.push({
      id: 'approval',
      label: approvalLabel,
      subtitle: approvalSubtitle,
      icon: approvalStatus === 'rejected' ? 'ri-close-circle-line' : 'ri-check-double-line',
      status: approvalStatus,
      requiresAction: false
    });

    // --- STEP 4: TAMAMLA (Sadece onaylı randevularda göster) ---
    if (['Onaylandı', 'Tamamlandı'].includes(status)) {
      let completionLabel, completionSubtitle, completionStatus, completionRequiresAction = false;

      if (status === 'Tamamlandı') {
        completionLabel = 'Tamamlandı';
        completionSubtitle = formatDate(attrs.CompletedDate || attrs.updatedAt);
        completionStatus = 'completed';
      } else {
        completionLabel = 'Tamamla';
        completionSubtitle = 'Servis ile buluştuğunuzda';
        completionStatus = 'active';
        completionRequiresAction = true;
      }

      steps.push({
        id: 'completion',
        label: completionLabel,
        subtitle: completionSubtitle,
        icon: completionStatus === 'completed' ? 'ri-flag-fill' : 'ri-flag-line',
        status: completionStatus,
        requiresAction: completionRequiresAction
      });
    }

    return steps;
  },

  /**
   * 4 Aşamalı Stepper Generator (Mobil App ile Birebir)
   */
  generateEnhancedStepper(appointment, isServiceOwner = false) {
    const steps = this.getStepperConfig(appointment, isServiceOwner);
    const statusColor = getStatusColor(appointment);
    return this.renderStepperHTML(steps, statusColor, appointment);
  },

  /**
   * Progress Bar Rendering (Düzeltilmiş - Araç Her Zaman Doğru Yerde)
   */
  renderStepperHTML(steps, statusColor, appointment) {
    const stepCount = steps.length;
    const segmentCount = stepCount - 1;

    const attrs = appointment.attributes || appointment;
    const isCancelled = ['İptal', 'İptal Edildi', 'Reddedildi'].includes((attrs.status || '').trim());

    // Completed ve active step indexlerini bul
    let lastCompletedIndex = -1;
    let activeIndex = -1;
    let cancelledIndex = -1;

    steps.forEach((step, index) => {
      // Sadece gerçek completed olanları say (cancelled/rejected hariç)
      if (step.status === 'completed') {
        lastCompletedIndex = index;
      }
      // İptal/red durumunu ayrı tut
      if (step.status === 'cancelled' || step.status === 'rejected') {
        cancelledIndex = index;
      }
      if (step.status === 'active' && activeIndex === -1) {
        activeIndex = index;
      }
    });

    // Araç pozisyonu: completed ile sonraki step arasının ORTASINDA
    // Eğer active varsa, active'in tam öncesinde (completed ile active arasında)
    let carPositionIndex = 0;

    if (isCancelled) {
      // İptal durumunda: araç iptal edilen step'in ÖNÜNDE kalmalı (3. step'e gitmemeli)
      // cancelledIndex'in bir öncesinde dur
      if (cancelledIndex > 0) {
        carPositionIndex = cancelledIndex - 0.5;
      } else {
        carPositionIndex = 0.5; // En kötü ihtimalde 1. step'in sonrasında
      }
    } else if (activeIndex > 0) {
      // Active step var - araç önceki step ile active arasında
      carPositionIndex = activeIndex - 0.5;
    } else if (lastCompletedIndex >= 0) {
      // Sadece completed var - araç completed ile sonraki arasında
      carPositionIndex = lastCompletedIndex + 0.5;
    }

    // Araç pozisyonunu yüzdeye çevir
    const carProgressPercent = (carPositionIndex / segmentCount) * 100;

    // Progress bar doluluk yüzdesi (segment bazlı)
    let progressPercent = 0;
    if (lastCompletedIndex >= 0) {
      progressPercent = ((lastCompletedIndex + 0.5) / segmentCount) * 100;
    }

    // Dinamik hizalama hesaplaması
    const stepWidthPct = 100 / stepCount;
    const startOffsetPct = stepWidthPct / 2;
    const totalTrackPct = 100 - stepWidthPct;
    const carLeftPct = startOffsetPct + (totalTrackPct * (carProgressPercent / 100));
    const progressPerSegment = 100 / segmentCount;

    // HTML oluşturma
    let html = `<div class="stepper-wrapper" style="--status-color: ${statusColor};">`;

    // Progress segments
    html += `<div class="progress-segments" style="left: ${startOffsetPct}%; width: ${totalTrackPct}%;">`;

    for (let i = 0; i < segmentCount; i++) {
      const segmentStart = i * progressPerSegment;
      const segmentEnd = (i + 1) * progressPerSegment;

      let segmentClass = 'segment';
      if (progressPercent >= segmentEnd) {
        segmentClass += isCancelled ? ' cancelled-filled' : ' filled';
      } else if (progressPercent >= segmentStart && progressPercent < 100) {
        segmentClass += isCancelled ? ' cancelled-active' : ' active-target';
      }

      html += `
        <div class="${segmentClass}" data-index="${i}">
          <div class="segment-fill"></div>
        </div>
      `;
    }
    html += '</div>';

    // Car
    const carColorClass = isCancelled ? 'car-cancelled' : '';
    html += `
      <div class="progress-car ${carColorClass}" style="left: ${carLeftPct}%">
        <img src="/images/goalcar.png" alt="Car">
        <div class="location-pin"><i class="ri-map-pin-fill"></i></div>
      </div>
    `;

    // Steps
    const appointmentId = appointment.id || appointment.attributes?.id || 0;
    html += '<div class="loyalty-steps">';

    steps.forEach((step) => {
      let icon = step.icon;
      if (step.status === 'completed') icon = 'ri-check-line';
      if (step.status === 'rejected') icon = 'ri-close-line';

      const requiresActionClass = step.requiresAction ? 'requires-action' : '';
      const pulseClass = step.status === 'active' && step.requiresAction ? 'pulse' : '';
      const clickableClass = step.requiresAction ? 'clickable' : '';

      // Tıklama işlevi için onclick oluştur
      let onClickHandler = '';
      if (step.requiresAction) {
        if (step.id === 'proposal') {
          // Pool offer kontrolü - teklif varsa modal aç
          if (step.isPoolOffer && step.poolOfferCount > 0) {
            onClickHandler = `onclick="openPoolOffersModal(${appointmentId})"`;
          } else {
            // Servis sahibi için tarih öner, kullanıcı için onay modalı
            const attrs = appointment.attributes || appointment;
            const isServiceOwner = !!localStorage.getItem('selectedServiceId');
            if (isServiceOwner) {
              onClickHandler = `onclick="openDateProposalModal(${appointmentId})"`;
            } else {
              onClickHandler = `onclick="openApprovalModal(${appointmentId})"`;
            }
          }
        } else if (step.id === 'completion') {
          onClickHandler = `onclick="openCompletionModal(${appointmentId})"`;
        }
      }

      html += `
        <div class="loyalty-step ${step.status} ${requiresActionClass} ${clickableClass}" ${onClickHandler}>
          <div class="loyalty-circle ${pulseClass}">
            <i class="${icon}"></i>
            ${step.requiresAction ? '<span class="action-dot"></span>' : ''}
          </div>
          <div class="loyalty-label">${step.label}</div>
          ${step.subtitle ? `<div class="loyalty-subtitle ${step.requiresAction ? 'action-text' : ''}">${step.subtitle}</div>` : ''}
        </div>
      `;
    });

    html += '</div></div>';
    return html;
  }
};

// =======================================
// MODAL FONKSİYONLARI
// =======================================

let currentAppointment = null;

function setCurrentAppointment(appt) {
  currentAppointment = appt;
  window.currentAppointment = appt;
}

// Tarih öneri modalı
function openDateProposalModal(appointmentId) {
  console.log('🔍 openDateProposalModal çağrıldı, appointmentId:', appointmentId);

  // Her iki cache'i de kontrol et (my-appointments.html = appointmentsCache, diğerleri = appointments)
  const appointmentsList = window.appointmentsCache || window.appointments || [];

  if (appointmentsList.length > 0) {
    console.log('🔍 Appointments IDs:', appointmentsList.map(a => a.id || a.attributes?.id));
    currentAppointment = appointmentsList.find(a => {
      const id = a.id || a.attributes?.id;
      return id == appointmentId;
    });
  }
  console.log('🔍 Bulunan randevu ID:', currentAppointment?.id, 'appointmentId param:', appointmentId);

  const modal = document.getElementById('step-modal');
  const titleEl = document.getElementById('step-modal-title-text');
  const bodyEl = document.getElementById('step-modal-body-content');
  const headerEl = document.getElementById('step-modal-header');

  // Turuncu gradient (teklifler için)
  if (headerEl) {
    headerEl.style.background = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
  }

  titleEl.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; color: white;">
      <i class="ri-price-tag-3-line" style="font-size: 1.5rem;"></i>
      <span>Teklif Yanıtla</span>
    </div>
  `;

  // Kullanıcının seçtiği tarihleri al
  const attrs = currentAppointment?.attributes || currentAppointment || {};
  let availableDates = attrs.availableDates || [];

  // String ise parse et
  if (typeof availableDates === 'string') {
    try { availableDates = JSON.parse(availableDates); } catch(e) { availableDates = []; }
  }

  console.log('=== AVAILABLE DATES DEBUG ===');
  console.log('Raw availableDates:', JSON.stringify(availableDates, null, 2));

  // Tercih edilen tarih (preferredDateTime)
  const preferredDateTime = attrs.preferredDateTime ? new Date(attrs.preferredDateTime) : null;
  const preferredDateStr = preferredDateTime ? preferredDateTime.toISOString().split('T')[0] : null;

  // Tarihleri tarihe göre grupla (Tüm Gün tespiti için)
  const grouped = {};
  availableDates.forEach(d => {
    const dateKey = ensureYMD(d.date);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(d.timeSlot);
  });

  // Gruplandırılmış tarihleri listele
  let datesHTML = '';
  const groupedEntries = Object.entries(grouped);
  if (groupedEntries.length > 0) {
    datesHTML = groupedEntries.map(([dateKey, slots], index) => {
      const dateObj = new Date(dateKey + 'T00:00:00');
      const dayName = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
      const dateFormatted = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
      const isPreferred = dateKey === preferredDateStr || index === 0;

      // 3 slot varsa Tüm Gün, değilse slotları göster
      const isFullDay = slots.length === 3;
      const displayText = isFullDay ? 'Tüm Gün' : slots.join(', ');

      // Value: tarih|FULL_DAY veya tarih|slot1,slot2...
      const valueSlots = isFullDay ? 'FULL_DAY' : slots.join(',');

      return `
        <label class="date-option" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 2px solid ${isPreferred ? '#f97316' : '#E5E7EB'}; border-radius: 12px; cursor: pointer; margin-bottom: 10px; background: ${isPreferred ? 'rgba(249, 115, 22, 0.05)' : 'white'}; transition: all 0.2s;">
          <input type="radio" name="selected-date" value="${dateKey}|${valueSlots}" ${index === 0 ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #f97316;">
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #374151;">${dateFormatted}</div>
            <div style="font-size: 0.85rem; color: #6B7280;">${dayName} - ${displayText}</div>
          </div>
          ${isPreferred ? '<span style="background: #f97316; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">Tercih Edilen</span>' : ''}
        </label>
      `;
    }).join('');
  } else {
    datesHTML = `<p style="color: #9CA3AF; text-align: center; padding: 20px;">Müşteri henüz tarih belirtmemiş.</p>`;
  }

  bodyEl.innerHTML = `
    <div style="padding: 8px 0;">
      <p style="color: #6B7280; margin-bottom: 16px;">Müşterinin belirlediği tarihlerden birini seçin ve fiyat teklifi gönderin.</p>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-weight: 600; margin-bottom: 12px; color: #374151;">
          <i class="ri-calendar-check-line" style="color: #f97316;"></i> Müşterinin Uygun Tarihleri
        </label>
        <div id="available-dates-list">
          ${datesHTML}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">
          <i class="ri-money-dollar-circle-line" style="color: #22c55e;"></i> Teklif Fiyatı (₺)
        </label>
        <div style="position: relative;">
          <input type="number" id="proposal-price" placeholder="Örn: 1500" min="0" step="50" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 1rem; font-weight: 600;">
          <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #6B7280; font-weight: 700;">₺</span>
        </div>
        <p style="font-size: 0.75rem; color: #9CA3AF; margin-top: 6px;">İsteğe bağlı - Boş bırakırsanız fiyat sonra belirlenebilir</p>
      </div>

      <div style="display: flex; gap: 10px;">
        <button onclick="submitDateProposal(${appointmentId})" style="flex: 1; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
          <i class="ri-send-plane-fill"></i> Teklif Gönder
        </button>
        <button onclick="closeStepModal()" style="background: #F3F4F6; border: none; color: #374151; padding: 14px 20px; border-radius: 10px; font-weight: 600; cursor: pointer;">
          İptal
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Kullanıcı için randevu teklifi görüntüleme modalı (Sarı tema)
async function openApprovalModal(appointmentId) {
  console.log('🔍 openApprovalModal çağrıldı, appointmentId:', appointmentId);

  // Cache'den randevuyu bul
  const appointmentsList = window.appointmentsCache || window.appointments || [];
  let currentAppointment = null;

  if (appointmentsList.length > 0) {
    currentAppointment = appointmentsList.find(a => {
      const id = a.id || a.attributes?.id;
      return id == appointmentId;
    });
  }

  if (!currentAppointment) {
    showToast('❌ Randevu bulunamadı', 'error');
    return;
  }

  const modal = document.getElementById('step-modal');
  const titleEl = document.getElementById('step-modal-title-text');
  const bodyEl = document.getElementById('step-modal-body-content');
  const headerEl = document.getElementById('step-modal-header');

  // Sarı gradient + baloncuklar (teklif modalı gibi)
  if (headerEl) {
    headerEl.style.cssText = `
      background: linear-gradient(135deg, #fbc707 0%, #f59e0b 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
    `;
    // Baloncukları ve içeriği ekle
    headerEl.innerHTML = `
      <div style="position: absolute; top: -50%; right: -20%; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30%; left: 10%; width: 80px; height: 80px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
      <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
        <i class="ri-calendar-check-line"></i> Randevu Teklifi
      </h3>
      <button class="step-modal-close" onclick="closeStepModal()">
        <i class="ri-close-line"></i>
      </button>
    `;
  }

  const attrs = currentAppointment?.attributes || currentAppointment || {};

  // Servis bilgisi
  const serviceData = attrs.service?.data?.attributes || attrs.service?.attributes || attrs.service || {};
  const serviceName = serviceData.name || 'Servis';
  const serviceId = attrs.service?.data?.id || attrs.service?.id || attrs.serviceId;

  // Servis profil resmini çek - önce cache'deki veriyi kontrol et
  let profilePicUrl = '';
  const baseUrl = CONFIG.API_BASE_URL.replace(/\/api$/, '');

  // Cache'deki servis verisinden profil resmi
  const profilePicData = serviceData.ProfilePicture?.data?.attributes || serviceData.ProfilePicture?.attributes || serviceData.ProfilePicture;
  if (profilePicData?.url) {
    profilePicUrl = profilePicData.url.startsWith('http') ? profilePicData.url : `${baseUrl}${profilePicData.url}`;
  }

  // Cache'de yoksa API'den çek
  if (!profilePicUrl && serviceId) {
    try {
      const token = localStorage.getItem('tamirhanem_token');
      const serviceResponse = await fetch(`${CONFIG.API_BASE_URL}/services/${serviceId}?populate=ProfilePicture`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (serviceResponse.ok) {
        const serviceResult = await serviceResponse.json();
        const sData = serviceResult.data?.attributes || serviceResult.data || serviceResult;
        const profilePic = sData.ProfilePicture?.data?.attributes || sData.ProfilePicture?.attributes || sData.ProfilePicture;
        if (profilePic?.url) {
          profilePicUrl = profilePic.url.startsWith('http') ? profilePic.url : `${baseUrl}${profilePic.url}`;
        }
      }
    } catch (e) {
      console.log('Profil resmi çekilemedi:', e);
    }
  }

  // Tarih bilgisi
  let matchedDate = attrs.matchedDate;
  if (typeof matchedDate === 'string') {
    try { matchedDate = JSON.parse(matchedDate); } catch(e) { matchedDate = []; }
  }

  let dateDisplay = 'Belirtilmedi';
  let timeDisplay = '';
  if (matchedDate && matchedDate.length > 0) {
    const first = matchedDate[0];
    const dateValue = first?.date || (typeof first === 'string' ? first : null);
    if (dateValue) {
      const dateObj = new Date(dateValue + 'T00:00:00');
      dateDisplay = dateObj.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    timeDisplay = first?.timeSlot || '';

    // Tüm gün kontrolü
    if (matchedDate.length === 3) {
      timeDisplay = 'Tüm Gün';
    }
  }

  // Fiyat bilgisi
  const offerPrice = attrs.offerPrice;
  const hasPrice = offerPrice && offerPrice > 0;

  // Profil resmi HTML
  const profileImageHTML = profilePicUrl
    ? `<img src="${profilePicUrl}" alt="${serviceName}" style="width: 100%; height: 100%; object-fit: cover;">`
    : `<i class="ri-store-2-fill" style="font-size: 28px; color: #5a5a5a;"></i>`;

  bodyEl.innerHTML = `
    <div style="padding: 8px 0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #fbc707 0%, #f59e0b 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; overflow: hidden; border: 3px solid #fbc707; box-shadow: 0 4px 12px rgba(251, 199, 7, 0.3);">
          ${profileImageHTML}
        </div>
        <h3 style="margin: 0 0 4px; color: #374151; font-size: 1.1rem;">${serviceName}</h3>
        <p style="color: #6B7280; font-size: 0.9rem; margin: 0;">size bir randevu teklif ediyor</p>
      </div>

      <div style="background: #FFFBEB; border: 2px solid #fbc707; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <i class="ri-calendar-line" style="color: #f59e0b; font-size: 1.2rem;"></i>
          <span style="font-weight: 600; color: #374151;">Önerilen Tarih</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 700; color: #92400E;">${dateDisplay}</div>
        ${timeDisplay ? `<div style="font-size: 0.9rem; color: #B45309; margin-top: 4px;"><i class="ri-time-line"></i> ${timeDisplay}</div>` : ''}
      </div>

      ${hasPrice ? `
      <div style="background: #F0FDF4; border: 2px solid #22c55e; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <i class="ri-money-dollar-circle-line" style="color: #22c55e; font-size: 1.2rem;"></i>
          <span style="font-weight: 600; color: #374151;">Teklif Fiyatı</span>
        </div>
        <div style="font-size: 1.3rem; font-weight: 700; color: #166534;">₺${offerPrice.toLocaleString('tr-TR')}</div>
      </div>
      ` : ''}

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="approveDate(${appointmentId}); closeStepModal();" style="flex: 1; background: linear-gradient(135deg, #fbc707 0%, #f59e0b 100%); color: #5a5a5a; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(251, 199, 7, 0.3);">
          <i class="ri-check-line"></i> Tarihi Onayla
        </button>
        <button onclick="rejectAppointment(${appointmentId}); closeStepModal();" style="flex: 1; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="ri-close-line"></i> Reddet
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Tarih onaylama
async function approveDate(appointmentId) {
  if (!confirm('Önerilen tarihi onaylamak istediğinize emin misiniz?')) return;

  const token = localStorage.getItem('tamirhanem_token');

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showToast('✅ Tarih başarıyla onaylandı!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      showToast('❌ Hata: ' + (data.error?.message || 'İşlem başarısız'), 'error');
    }
  } catch (error) {
    console.error('Approval error:', error);
    showToast('❌ Bir hata oluştu', 'error');
  }
}

// Final onay
async function giveFinalApproval(appointmentId) {
  if (!confirm('Final onay vermek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

  const token = localStorage.getItem('tamirhanem_token');

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showToast('✅ Randevu onaylandı!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      showToast('❌ Hata: ' + (data.error?.message || 'İşlem başarısız'), 'error');
    }
  } catch (error) {
    console.error('Final approval error:', error);
    showToast('❌ Bir hata oluştu', 'error');
  }
}

// Randevu iptali - Modal göster
function cancelAppointment(appointmentId) {
  showCancelConfirmModal(appointmentId);
}

// İptal onay modalı
function showCancelConfirmModal(appointmentId) {
  // Mevcut modal varsa kaldır
  const existing = document.getElementById('cancel-confirm-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'cancel-confirm-modal';
  modal.className = 'cancel-modal-overlay';
  modal.innerHTML = `
    <div class="cancel-modal-content">
      <div class="cancel-modal-icon">
        <i class="ri-error-warning-line"></i>
      </div>
      <h3 class="cancel-modal-title">Teklifi İptal Et</h3>
      <p class="cancel-modal-text">Bu teklifi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
      <div class="cancel-modal-buttons">
        <button class="cancel-modal-btn cancel-modal-btn-secondary" onclick="closeCancelConfirmModal()">
          <i class="ri-arrow-left-line"></i>
          Vazgeç
        </button>
        <button class="cancel-modal-btn cancel-modal-btn-danger" onclick="confirmCancelAppointment(${appointmentId})">
          <i class="ri-close-circle-line"></i>
          Evet, İptal Et
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

// Modal kapat
function closeCancelConfirmModal() {
  const modal = document.getElementById('cancel-confirm-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

// İptal işlemini gerçekleştir
async function confirmCancelAppointment(appointmentId) {
  const token = localStorage.getItem('tamirhanem_token');

  // Butonu disable et
  const btn = document.querySelector('.cancel-modal-btn-danger');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line spin"></i> İptal Ediliyor...';
  }

  try {
    // Status'u İptal olarak güncelle
    const response = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          status: 'İptal'
        }
      })
    });

    if (response.ok) {
      closeCancelConfirmModal();
      showToast('✅ Teklif iptal edildi', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      showToast('❌ Hata: ' + (data.error?.message || 'İşlem başarısız'), 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="ri-close-circle-line"></i> Evet, İptal Et';
      }
    }
  } catch (error) {
    console.error('Cancel error:', error);
    showToast('❌ Bir hata oluştu', 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-close-circle-line"></i> Evet, İptal Et';
    }
  }
}

// Randevu reddi
async function rejectAppointment(appointmentId) {
  if (!confirm('Randevuyu reddetmek istediğinize emin misiniz?')) return;

  const token = localStorage.getItem('tamirhanem_token');

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showToast('✅ Randevu reddedildi', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      showToast('❌ Hata: ' + (data.error?.message || 'İşlem başarısız'), 'error');
    }
  } catch (error) {
    console.error('Reject error:', error);
    showToast('❌ Bir hata oluştu', 'error');
  }
}

// Tarih formatını YYYY-MM-DD'ye normalize et
function ensureYMD(date) {
  if (!date) return null;
  // Zaten YYYY-MM-DD formatındaysa direkt döndür
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  // Date objesi veya ISO string ise dönüştür
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  } catch(e) {
    return date;
  }
}

// Tarih önerisi gönderme
async function submitDateProposal(appointmentId) {
  // Radio button'dan seçilen tarihi al
  const selectedRadio = document.querySelector('input[name="selected-date"]:checked');
  const priceInput = document.getElementById('proposal-price');

  if (!selectedRadio) {
    showToast('❌ Lütfen bir tarih seçin', 'error');
    return;
  }

  // value formatı: "YYYY-MM-DD|FULL_DAY" veya "YYYY-MM-DD|slot1,slot2..."
  const [selectedDate, slotsValue] = selectedRadio.value.split('|');

  const token = localStorage.getItem('tamirhanem_token');
  const offerPrice = priceInput && priceInput.value ? parseFloat(priceInput.value) : null;

  try {
    // matchedDate array formatı - HAM TARİH, HİÇ DÖNÜŞTÜRME YOK
    let matchedDate;

    // selectedDate zaten availableDates'den geliyor, hiç değiştirmeden kullan
    console.log('🔍 DEBUG - selectedDate (ham):', selectedDate);
    console.log('🔍 DEBUG - slotsValue:', slotsValue);

    if (slotsValue === 'FULL_DAY') {
      // Tüm Gün - 3 slot gönder
      matchedDate = [
        { date: selectedDate, timeSlot: '09:00-12:00' },
        { date: selectedDate, timeSlot: '12:00-15:00' },
        { date: selectedDate, timeSlot: '15:00-18:00' }
      ];
    } else {
      // Tek veya birden fazla slot
      const slots = slotsValue.split(',');
      matchedDate = slots.map(slot => ({ date: selectedDate, timeSlot: slot }));
    }

    console.log('🔍 DEBUG - Gönderilen matchedDate:', JSON.stringify(matchedDate, null, 2));

    // /matchDate endpoint kullan (servis kullanıcısı için özel)
    const matchDatePayload = {
      data: {
        matchedDate: matchedDate,
        status: 'Tarih Belirlendi'
      }
    };

    console.log('🔍 DEBUG - Endpoint: /appointments/' + appointmentId + '/matchDate');
    console.log('🔍 DEBUG - Payload:', JSON.stringify(matchDatePayload, null, 2));

    const matchResponse = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}/matchDate`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(matchDatePayload)
    });

    if (!matchResponse.ok) {
      const data = await matchResponse.json();
      console.error('❌ matchDate HATA:', JSON.stringify(data, null, 2));
      console.error('❌ Error details:', data.error);
      console.error('Gönderilen payload:', JSON.stringify(matchDatePayload, null, 2));
      showToast('❌ Hata: ' + (data.error?.message || 'Tarih belirlenemedi'), 'error');
      return;
    }

    // 2. Fiyat varsa /offer endpoint'ine gönder
    if (offerPrice && offerPrice > 0) {
      // offerDate için ilk slot'u kullan (Tüm Gün ise 09:00-12:00)
      const firstSlot = slotsValue === 'FULL_DAY' ? '09:00-12:00' : slotsValue.split(',')[0];
      const offerDateObj = { date: selectedDate, timeSlot: firstSlot };

      const offerPayload = {
        data: {
          offerPrice: offerPrice,
          offerDate: offerDateObj
        }
      };

      const offerResponse = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId}/offer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerPayload)
      });

      if (!offerResponse.ok) {
        const data = await offerResponse.json();
        showToast('❌ Hata: ' + (data.error?.message || 'Teklif gönderilemedi'), 'error');
        return;
      }
    }

    const priceText = offerPrice ? ` (₺${offerPrice.toLocaleString('tr-TR')})` : '';
    showToast(`✅ Teklif gönderildi!${priceText}`, 'success');
    closeStepModal();
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    console.error('Date proposal error:', error);
    showToast('❌ Bir hata oluştu', 'error');
  }
}

// Tamamlama modalı
function openCompletionModal(appointmentId) {
  const appointmentsList = window.appointmentsCache || window.appointments || [];
  if (appointmentsList.length > 0) {
    currentAppointment = appointmentsList.find(a => (a.id || a.attributes?.id) == appointmentId);
  }

  const modal = document.getElementById('step-modal');
  const titleEl = document.getElementById('step-modal-title-text');
  const bodyEl = document.getElementById('step-modal-body-content');
  const headerEl = document.getElementById('step-modal-header');

  // Randevu zamanı kontrolü
  let isTimeReached = true; // Web'de her zaman aktif

  if (headerEl) {
    headerEl.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
  }

  titleEl.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; color: white;">
      <i class="ri-flag-fill" style="font-size: 1.5rem;"></i>
      <span>Randevuyu Tamamla</span>
    </div>
  `;

  bodyEl.innerHTML = `
    <div style="padding: 8px 0;">
      <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="margin: 0; color: #065F46; font-size: 0.9rem;">
          <i class="ri-information-line"></i>
          Servis ile buluştuğunuzda randevunuzu tamamlayabilirsiniz. Her iki tarafın onayı gereklidir.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button onclick="completeAppointment(${appointmentId})" style="background: #10B981; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="ri-check-double-line"></i> Randevuyu Tamamla
        </button>
        <button onclick="closeStepModal()" style="background: #F3F4F6; border: none; color: #374151; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer;">
          Kapat
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Randevu tamamlama
async function completeAppointment(appointmentId) {
  if (!confirm('Randevuyu tamamlamak istediğinize emin misiniz?')) return;

  const token = localStorage.getItem('tamirhanem_token');

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/appointments/${appointmentId || currentAppointment?.id}/complete`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showToast('✅ Randevu tamamlandı!', 'success');
      closeStepModal();
      setTimeout(() => window.location.reload(), 1000);
    } else {
      const data = await response.json();
      showToast('❌ Hata: ' + (data.error?.message || 'İşlem başarısız'), 'error');
    }
  } catch (error) {
    console.error('Completion error:', error);
    showToast('❌ Bir hata oluştu', 'error');
  }
}

function closeStepModal() {
  const modal = document.getElementById('step-modal');
  if (modal) modal.classList.remove('active');

  // Header'ı resetle
  const headerEl = document.getElementById('step-modal-header');
  if (headerEl) {
    headerEl.style.background = '';
  }
}

// Toast mesajı
function showToast(message, type = 'info') {
  // Varolan toast'ı kaldır
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 24px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideUp 0.3s ease;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global erişim
if (typeof window !== 'undefined') {
  window.EnhancedAppointmentComponents = EnhancedAppointmentComponents;
  window.getStatusColor = getStatusColor;
  window.getActionButtons = getActionButtons;
  window.renderActionButtons = renderActionButtons;
  window.openDateProposalModal = openDateProposalModal;
  window.approveDate = approveDate;
  window.giveFinalApproval = giveFinalApproval;
  window.cancelAppointment = cancelAppointment;
  window.rejectAppointment = rejectAppointment;
  window.submitDateProposal = submitDateProposal;
  window.openCompletionModal = openCompletionModal;
  window.completeAppointment = completeAppointment;
  window.closeStepModal = closeStepModal;
  window.showToast = showToast;
  window.setCurrentAppointment = setCurrentAppointment;
}

// Modal oluşturma
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('step-modal')) {
      const modalHTML = `
        <div id="step-modal" class="step-modal">
          <div class="step-modal-content">
            <div class="step-modal-header" id="step-modal-header">
              <h3 class="step-modal-title" id="step-modal-title-text"></h3>
              <button class="step-modal-close" onclick="closeStepModal()">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="step-modal-body" id="step-modal-body-content"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      document.getElementById('step-modal').addEventListener('click', (e) => {
        if (e.target.id === 'step-modal') closeStepModal();
      });
    }
  });
}
