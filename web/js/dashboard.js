/**
 * TamirHanem Dashboard Logic
 * This file contains all dashboard widget initialization and logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    // Check auth
    if (typeof auth !== 'undefined' && !auth.requireAuth()) return;


    // Load all widgets
    await Promise.allSettled([
        loadActiveAppointment(),
        loadWalletSummary(),
        // Other widgets will be added here
    ]);
}

/**
 * ==========================================
 * WIDGET: ACTIVE APPOINTMENT
 * ==========================================
 */
async function loadActiveAppointment() {
    const widget = document.getElementById('active-appointment-widget');
    const container = document.getElementById('active-appointment-card');


    if (!widget || !container) {
        return;
    }

    try {
        // Fetch appointments from API
        const response = await api.getAppointments();

        // Handle different response formats - sometimes it's response.data, sometimes it's the response itself
        const appointments = Array.isArray(response) ? response : (response.data || []);

        // Get current date (start of today)
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Filter for active appointments (not cancelled/completed) and future/today
        const activeAppointments = appointments.filter(app => {
            const attr = app.attributes || app;

            // Extract date - it's nested in an object
            // Could be: attr.date.date OR attr.matchedDate[0].date
            let appDateStr = null;

            if (attr.date && typeof attr.date === 'object' && attr.date.date) {
                appDateStr = attr.date.date;
            } else if (attr.date && typeof attr.date === 'string') {
                appDateStr = attr.date;
            } else if (attr.matchedDate && attr.matchedDate.length > 0) {
                if (typeof attr.matchedDate[0] === 'object' && attr.matchedDate[0].date) {
                    appDateStr = attr.matchedDate[0].date;
                } else if (typeof attr.matchedDate[0] === 'string') {
                    appDateStr = attr.matchedDate[0];
                }
            }


            if (!appDateStr) {
                return false;
            }

            // Parse date more carefully - YYYY-MM-DD format
            const appDate = new Date(appDateStr + 'T00:00:00');
            const status = attr.status;

            // Check if status is active - support both English and Turkish status names
            const activeStatusesEnglish = ['PENDING', 'CONFIRMED', 'APPROVED', 'IN_PROGRESS'];
            const activeStatusesTurkish = ['Beklemede', 'Onaylandı', 'Onaylı', 'Serviste'];
            const isActiveStatus = activeStatusesEnglish.includes(status) || activeStatusesTurkish.includes(status);

            // Check if date is today or future
            const isFutureOrToday = appDate >= now;

            return isActiveStatus && isFutureOrToday;
        });


        // Sort by date ascending (nearest first)
        activeAppointments.sort((a, b) => {
            const attrA = a.attributes || a;
            const attrB = b.attributes || b;

            // Extract date string from nested objects
            let dateStrA = null;
            if (attrA.date && typeof attrA.date === 'object' && attrA.date.date) {
                dateStrA = attrA.date.date;
            } else if (attrA.date && typeof attrA.date === 'string') {
                dateStrA = attrA.date;
            } else if (attrA.matchedDate && attrA.matchedDate[0]) {
                dateStrA = typeof attrA.matchedDate[0] === 'object' ? attrA.matchedDate[0].date : attrA.matchedDate[0];
            }

            let dateStrB = null;
            if (attrB.date && typeof attrB.date === 'object' && attrB.date.date) {
                dateStrB = attrB.date.date;
            } else if (attrB.date && typeof attrB.date === 'string') {
                dateStrB = attrB.date;
            } else if (attrB.matchedDate && attrB.matchedDate[0]) {
                dateStrB = typeof attrB.matchedDate[0] === 'object' ? attrB.matchedDate[0].date : attrB.matchedDate[0];
            }

            const dateA = new Date(dateStrA + 'T' + (attrA.time || attrA.date?.timeSlot?.split('-')[0] || '00:00'));
            const dateB = new Date(dateStrB + 'T' + (attrB.time || attrB.date?.timeSlot?.split('-')[0] || '00:00'));
            return dateA - dateB;
        });

        // Get the next appointment
        const nextAppointment = activeAppointments[0];

        if (nextAppointment) {
            renderActiveAppointment(nextAppointment, container);
            widget.classList.remove('hidden');
        } else {
            // No active appointments - hide widget
            widget.classList.add('hidden');
        }

    } catch (error) {
        widget.classList.add('hidden');
    }
}

/**
 * Render the active appointment card
 */
function renderActiveAppointment(appointment, container) {
    const attr = appointment.attributes || appointment;

    // Extract service name - handle different response structures
    const serviceName = attr.service?.data?.attributes?.name || attr.service?.name || attr.service || 'Genel Servis';

    // Extract date string from nested objects
    let dateStr = null;
    if (attr.date && typeof attr.date === 'object' && attr.date.date) {
        dateStr = attr.date.date;
    } else if (attr.date && typeof attr.date === 'string') {
        dateStr = attr.date;
    } else if (attr.matchedDate && attr.matchedDate[0]) {
        dateStr = typeof attr.matchedDate[0] === 'object' ? attr.matchedDate[0].date : attr.matchedDate[0];
    }

    // Format date
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const monthShort = dateObj.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase();
    const fullDate = dateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
    });

    // Format time - could be in 'time' field or 'date.timeSlot' or 'matchedDate[0].timeSlot'
    let time = '--:--';
    if (attr.time) {
        time = attr.time.substring(0, 5);
    } else if (attr.date && typeof attr.date === 'object' && attr.date.timeSlot) {
        time = attr.date.timeSlot; // Show full range "12:00-15:00"
    } else if (attr.matchedDate && attr.matchedDate[0] && attr.matchedDate[0].timeSlot) {
        time = attr.matchedDate[0].timeSlot; // Show full range
    }


    // Extract vehicle info
    let vehicleInfo = 'Araç Bilgisi Yok';
    if (attr.vehicle) {
        const vehicle = attr.vehicle.data?.attributes || attr.vehicle;
        const brand = vehicle.brand || vehicle.make || '';
        const model = vehicle.model || '';
        if (brand || model) {
            vehicleInfo = `${brand} ${model} `.trim();
        }
    }

    // Extract service category/type
    let categoryInfo = 'Genel Hizmet';
    if (attr.category) {
        const category = attr.category.data?.attributes || attr.category;
        categoryInfo = category.name || category.title || 'Genel Hizmet';
    }

    // Map status to display text and badge class - support both English and Turkish
    const statusMap = {
        // English statuses
        'PENDING': { text: 'Onay Bekliyor', badgeClass: 'badge-warning' },
        'CONFIRMED': { text: 'Onaylandı', badgeClass: 'badge-success' },
        'APPROVED': { text: 'Onaylandı', badgeClass: 'badge-success' },
        'IN_PROGRESS': { text: 'Serviste', badgeClass: 'badge-info' },
        // Turkish statuses
        'Beklemede': { text: 'Onay Bekliyor', badgeClass: 'badge-warning' },
        'Onaylandı': { text: 'Onaylandı', badgeClass: 'badge-success' },
        'Onaylı': { text: 'Onaylandı', badgeClass: 'badge-success' },
        'Serviste': { text: 'Serviste', badgeClass: 'badge-info' }
    };
    const statusInfo = statusMap[attr.status] || { text: attr.status, badgeClass: 'badge-secondary' };

    // Render HTML structure
    // Render HTML structure
    container.innerHTML = `
        <div class="appt-card" onclick="window.location.href='/pages/appointment-detail.html?id=${appointment.id}'">
            <div class="appt-left">
                <div class="appt-date-box">
                    <span class="appt-day">${day}</span>
                    <span class="appt-month">${monthShort}</span>
                </div>
                <div class="appt-info">
                    <h4 class="appt-service-name">${serviceName}</h4>
                    <div class="appt-pills">
                        <span class="appt-pill appt-pill-time">
                            <i class="ri-time-line"></i> ${time}
                        </span>
                        <span class="appt-pill appt-pill-vehicle">
                            <i class="ri-car-line"></i> ${vehicleInfo}
                        </span>
                        <span class="appt-pill appt-pill-category">
                            <i class="ri-tools-line"></i> ${categoryInfo}
                        </span>
                    </div>
                </div>
            </div>
            <div class="appt-right">
                <span class="appt-status-badge ${statusInfo.badgeClass}">${statusInfo.text}</span>
                <i class="ri-arrow-right-s-line appt-arrow"></i>
            </div>
        </div>
    `;
}

/**
 * ==========================================
 * WIDGET: WALLET SUMMARY
 * ==========================================
 */
async function loadWalletSummary() {
    const balanceElement = document.getElementById('navbar-wallet-balance');


    if (!balanceElement) {
        return;
    }

    try {
        // Fetch wallet data from API
        const response = await api.getWallet();

        // Extract wallet data - handle different response formats
        const wallet = response.data || response;

        if (!wallet) {
            throw new Error('No wallet data found');
        }

        // Get balance (default to 0 if not found)
        const balance = wallet.balance || wallet.attributes?.balance || 0;

        // Format balance as Turkish Lira
        const formattedBalance = formatTurkishLira(balance);


        // Update navbar display
        balanceElement.textContent = formattedBalance;

    } catch (error) {

        // Show error in navbar
        balanceElement.textContent = '₺ 0,00';
        balanceElement.title = 'Cüzdan yüklenemedi';
    }
}

/**
 * Format number as Turkish Lira
 * Example: 1250.50 -> "₺ 1.250,50"
 */
function formatTurkishLira(amount) {
    const number = parseFloat(amount) || 0;

    // Format with Turkish locale
    const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);

    return formatted;
}

/**
 * Handle Roadside Assistance action
 */
function handleRoadsideAssistance() {
    // TODO: Implement roadside assistance flow
    alert('Yol Yardım özelliği yakında aktif olacak!');
}
