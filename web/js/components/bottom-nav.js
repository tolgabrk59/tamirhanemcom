/**
 * Global Bottom Navigation Component
 * Design: Floating Island (Glassmorphism) - Premium & Wide
 */

class BottomNav {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHTML();
        this.setActiveState();
        this.bindEvents();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* --- Premium Floating Island Bottom Nav --- */
            :root {
            .bottom-nav-wrapper {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                justify-content: space-between;
                align-items: center;
                background: var(--nav-glass-bg);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--nav-glass-border);
                border-radius: 30px;
                padding: 12px 24px;
                box-shadow: var(--nav-shadow);
                transition: all 0.3s ease;
            }

            .bottom-nav-wrapper:hover .bottom-nav-container {
                background: rgba(255, 255, 255, 0.95);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);
            }

            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: var(--nav-inactive-color);
                gap: 6px;
                position: relative;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 8px 12px;
                border-radius: 20px;
                min-width: 64px;
            }

            /* Icon Wrapper for Glow Effect */
            .nav-icon-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                transition: all 0.3s ease;
            }

            .nav-item i {
                font-size: 1.6rem;
                z-index: 2;
                transition: all 0.3s ease;
            }

            .nav-item span {
                font-size: 0.75rem;
                font-weight: 600;
                opacity: 0.7;
                transition: all 0.3s ease;
                letter-spacing: 0.3px;
            }

            /* --- Active State --- */
            .nav-item.active {
                color: var(--nav-text-color);
            }

            .nav-item.active .nav-icon-wrapper {
                transform: translateY(-2px);
            }

            .nav-item.active i {
                color: #d97706; /* Darker yellow/orange for better contrast */
                filter: drop-shadow(0 4px 8px rgba(251, 199, 7, 0.5));
                transform: scale(1.1);
            }

            /* Glowing Background for Active Icon */
            .nav-item.active .nav-icon-wrapper::before {
                content: '';
                position: absolute;
                width: 44px;
                height: 44px;
                background: var(--nav-active-bg);
                border-radius: 50%;
                z-index: 1;
                animation: pulseGlow 2s infinite;
            }

            .nav-item.active span {
                opacity: 1;
                font-weight: 800;
                color: #111;
            }

            @keyframes pulseGlow {
                0% { transform: scale(0.8); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(0.8); opacity: 0.5; }
            }

            /* Hover Effects */
            @media (hover: hover) {
                .nav-item:hover:not(.active) {
                    color: var(--nav-text-color);
                    background: rgba(0,0,0,0.04);
                }
                .nav-item:hover:not(.active) i {
                    transform: scale(1.1);
                }
            }

            /* Mobile Adjustments */
            @media (max-width: 380px) {
                .bottom-nav-container {
                    padding: 10px 16px;
                }
                .nav-item {
                    min-width: auto;
                    padding: 6px 8px;
                }
                .nav-item span {
                    font-size: 0.65rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Helper to determine if a link is active based on current path
    isActive(pathSegment) {
        const currentPath = window.location.pathname;
        // Check if the current path ends with the pathSegment
        // Or if it's the root and pathSegment is 'dashboard.html'
        if (pathSegment === 'dashboard.html' && (currentPath === '/' || currentPath.endsWith('/dashboard.html'))) {
            return true;
        }
        return currentPath.endsWith('/' + pathSegment);
    }

    injectHTML() {
        const wrapper = document.createElement('div');
        wrapper.className = 'bottom-nav-wrapper';

        // Using "line" icons for inactive, logic will switch to "fill" for active
        const menuItems = [
            { id: 'home', icon: 'ri-home-5-line', activeIcon: 'ri-home-5-fill', label: 'Anasayfa', href: '/dashboard.html' },
            { id: 'appointments', icon: 'ri-calendar-event-line', activeIcon: 'ri-calendar-event-fill', label: 'Randevular', href: '/pages/my-appointments.html' },
            { id: 'campaigns', icon: 'ri-fire-line', activeIcon: 'ri-fire-fill', label: 'Fırsatlar', href: '/pages/campaigns.html' },
            { id: 'assistant', icon: 'ri-openai-line', activeIcon: 'ri-openai-fill', label: 'Asistan', href: '/dashboard.html#assistant' },
            { id: 'profile', icon: 'ri-user-3-line', activeIcon: 'ri-user-3-fill', label: 'Profil', href: '/dashboard.html#profile' }
        ];

        let itemsHTML = menuItems.map(item => `
            <a href="${item.href}" class="nav-item" data-id="${item.id}" data-icon="${item.icon}" data-active-icon="${item.activeIcon}">
                <div class="nav-icon-wrapper">
                    <i class="${item.icon}"></i>
                </div>
                <span>${item.label}</span>
            </a>
        `).join('');

        wrapper.innerHTML = `
            <nav class="bottom-nav-container">
                ${itemsHTML}
            </nav>
        `;

        document.body.appendChild(wrapper);
    }

    setActiveState() {
        const currentPath = window.location.pathname;
        const hash = window.location.hash.replace('#', '');
        const items = document.querySelectorAll('.nav-item');

        items.forEach(item => {
            const id = item.getAttribute('data-id');
            const iconEl = item.querySelector('i');
            const defaultIcon = item.getAttribute('data-icon');
            const activeIcon = item.getAttribute('data-active-icon');
            const href = item.getAttribute('href');

            // Determine if active based on path OR hash
            let isActive = false;

            // 1. Path Check (Priority)
            if (href && href !== '#' && !href.includes('#')) {
                if (href === '/dashboard.html' && (currentPath === '/' || currentPath === '/dashboard.html')) {
                    isActive = !hash || hash === 'home'; // Only active if no hash or home hash
                } else if (currentPath.endsWith(href)) {
                    isActive = true;
                } else if (href === '/pages/campaigns.html' && currentPath.includes('campaign')) {
                    isActive = true;
                }
            }

            // 2. Hash Check (Fallback for dashboard sections)
            if (!isActive && hash && id === hash) {
                isActive = true;
            }

            // 3. Special case for 'home' default on dashboard
            if (!isActive && id === 'home' && (currentPath === '/' || currentPath === '/dashboard.html') && !hash) {
                isActive = true;
            }

            if (isActive) {
                item.classList.add('active');
                iconEl.className = activeIcon;
            } else {
                item.classList.remove('active');
                iconEl.className = defaultIcon;
            }
        });
    }

    bindEvents() {
        window.addEventListener('hashchange', () => {
            this.setActiveState();
        });

        const items = document.querySelectorAll('.nav-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                items.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('i').className = i.getAttribute('data-icon');
                });

                item.classList.add('active');
                item.querySelector('i').className = item.getAttribute('data-active-icon');
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BottomNav());
} else {
    new BottomNav();
}
