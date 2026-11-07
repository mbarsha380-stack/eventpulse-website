/**
 * EventPulse - Main Application Logic
 * Implements filtering, search, modals, live countdowns, form validation,
 * ticket generation, localStorage persistence, and interactive UI feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        events: StorageManager.getAllEvents(),
        filteredEvents: [],
        activeCategory: 'All',
        searchQuery: '',
        priceFilter: 'all',
        sortBy: 'date-asc',
        selectedEvent: null,
        activeTab: 'all', // 'all' or 'favorites'
        countdownIntervals: []
    };

    // DOM Elements Cache
    const DOM = {
        // Theme & Navigation
        html: document.documentElement,
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        themeIcon: document.getElementById('theme-icon'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        myBookingsBtn: document.getElementById('my-bookings-btn'),
        mobileMyBookingsBtn: document.getElementById('mobile-my-bookings-btn'),
        bookingsBadge: document.getElementById('bookings-badge'),
        mobileBookingsBadge: document.getElementById('mobile-bookings-badge'),

        // Hero Quick Search
        heroSearchInput: document.getElementById('hero-search-input'),
        heroCategorySelect: document.getElementById('hero-category-select'),
        heroSearchBtn: document.getElementById('hero-search-btn'),

        // Featured Section
        featuredContainer: document.getElementById('featured-events-container'),

        // Main Controls & Filters
        eventsGrid: document.getElementById('events-grid'),
        searchInput: document.getElementById('search-input'),
        clearSearchBtn: document.getElementById('clear-search-btn'),
        categoryFiltersContainer: document.getElementById('category-filters'),
        priceFilterSelect: document.getElementById('price-filter'),
        sortSelect: document.getElementById('sort-filter'),
        tabAllEventsBtn: document.getElementById('tab-all-events'),
        tabFavoritesBtn: document.getElementById('tab-favorites'),
        favCountBadge: document.getElementById('fav-count-badge'),
        eventsCountLabel: document.getElementById('events-count-label'),
        emptyState: document.getElementById('empty-state'),
        resetFiltersBtn: document.getElementById('reset-filters-btn'),

        // Event Details Modal
        detailsModal: document.getElementById('event-details-modal'),
        detailsModalContent: document.getElementById('details-modal-content'),
        closeDetailsModalBtn: document.getElementById('close-details-modal'),

        // Registration Modal
        registerModal: document.getElementById('register-modal'),
        registerForm: document.getElementById('registration-form'),
        closeRegisterModalBtn: document.getElementById('close-register-modal'),
        registerEventSummary: document.getElementById('register-event-summary'),
        ticketCountInput: document.getElementById('reg-ticket-count'),
        ticketTierSelect: document.getElementById('reg-ticket-tier'),
        totalPriceSummary: document.getElementById('total-price-summary'),
        submitRegisterBtn: document.getElementById('submit-register-btn'),

        // Ticket Success Modal
        ticketSuccessModal: document.getElementById('ticket-success-modal'),
        ticketDetailsContainer: document.getElementById('ticket-details-container'),
        closeTicketModalBtn: document.getElementById('close-ticket-modal'),
        printTicketBtn: document.getElementById('print-ticket-btn'),
        downloadIcsBtn: document.getElementById('download-ics-btn'),
        viewBookingsFromTicketBtn: document.getElementById('view-bookings-from-ticket'),

        // My Bookings Modal
        bookingsModal: document.getElementById('bookings-modal'),
        closeBookingsModalBtn: document.getElementById('close-bookings-modal'),
        bookingsListContainer: document.getElementById('bookings-list-container'),
        emptyBookingsState: document.getElementById('empty-bookings-state'),

        // Toast Container
        toastContainer: document.getElementById('toast-container')
    };

    // Current ticket stored for download/print
    let currentConfirmedTicket = null;

    /* ==========================================================================
       1. Theme & Startup Initialization
       ========================================================================== */
    function initTheme() {
        const theme = StorageManager.getTheme();
        StorageManager.setTheme(theme);
        updateThemeIcon(theme);

        if (DOM.themeToggleBtn) {
            DOM.themeToggleBtn.addEventListener('click', () => {
                const isDark = DOM.html.classList.contains('dark');
                const nextTheme = isDark ? 'light' : 'dark';
                StorageManager.setTheme(nextTheme);
                updateThemeIcon(nextTheme);
                showToast(`Switched to ${nextTheme} mode`, 'info');
            });
        }
    }

    function updateThemeIcon(theme) {
        if (!DOM.themeIcon) return;
        if (theme === 'dark') {
            DOM.themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            DOM.themeIcon.setAttribute('data-lucide', 'moon');
        }
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function initMobileMenu() {
        if (!DOM.mobileMenuBtn || !DOM.mobileMenu) return;
        DOM.mobileMenuBtn.addEventListener('click', () => {
            DOM.mobileMenu.classList.toggle('hidden');
        });

        // Close on navigation link click
        DOM.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                DOM.mobileMenu.classList.add('hidden');
            });
        });
    }

    /* ==========================================================================
       2. Toast Notification Helper
       ========================================================================== */
    function showToast(message, type = 'info') {
        if (!DOM.toastContainer) return;

        const toast = document.createElement('div');
        const bgColors = {
            success: 'bg-emerald-600 text-white',
            error: 'bg-rose-600 text-white',
            info: 'bg-slate-900 text-white dark:bg-slate-800 dark:border dark:border-slate-700',
            warning: 'bg-amber-600 text-white'
        };

        const icons = {
            success: 'check-circle-2',
            error: 'alert-circle',
            info: 'info',
            warning: 'alert-triangle'
        };

        toast.className = `toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${bgColors[type] || bgColors.info} transition-all duration-300`;
        toast.innerHTML = `
            <i data-lucide="${icons[type] || 'info'}" class="w-5 h-5 flex-shrink-0"></i>
            <span class="flex-1">${message}</span>
            <button class="opacity-70 hover:opacity-100 transition ml-2" aria-label="Close toast">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        DOM.toastContainer.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        const closeBtn = toast.querySelector('button');
        const dismiss = () => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 260);
        };

        closeBtn.addEventListener('click', dismiss);
        setTimeout(dismiss, 3500);
    }

    /* ==========================================================================
       3. Live Countdown Timers Engine
       ========================================================================== */
    function formatTimeRemaining(targetIsoString) {
        const target = new Date(targetIsoString).getTime();
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
            return { isExpired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { isExpired: false, days, hours, minutes, seconds };
    }

    function startCountdowns() {
        // Clear previous intervals
        state.countdownIntervals.forEach(clearInterval);
        state.countdownIntervals = [];

        const updateAllTimers = () => {
            document.querySelectorAll('[data-countdown-target]').forEach(timerEl => {
                const target = timerEl.getAttribute('data-countdown-target');
                const time = formatTimeRemaining(target);

                if (time.isExpired) {
                    timerEl.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 uppercase tracking-wider"><span class="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator"></span>Happening Today</span>`;
                } else {
                    const daysSpan = timerEl.querySelector('.timer-days');
                    const hoursSpan = timerEl.querySelector('.timer-hours');
                    const minsSpan = timerEl.querySelector('.timer-mins');
                    const secsSpan = timerEl.querySelector('.timer-secs');

                    if (daysSpan && hoursSpan && minsSpan && secsSpan) {
                        daysSpan.textContent = String(time.days).padStart(2, '0');
                        hoursSpan.textContent = String(time.hours).padStart(2, '0');
                        minsSpan.textContent = String(time.minutes).padStart(2, '0');
                        secsSpan.textContent = String(time.seconds).padStart(2, '0');
                    }
                }
            });
        };

        updateAllTimers();
        const intervalId = setInterval(updateAllTimers, 1000);
        state.countdownIntervals.push(intervalId);
    }

    /* ==========================================================================
       4. Events Rendering (Featured & Browse Grid)
       ========================================================================== */
    function renderFeaturedEvents() {
        if (!DOM.featuredContainer) return;
        const featured = state.events.filter(e => e.featured);

        if (featured.length === 0) {
            DOM.featuredContainer.innerHTML = '<p class="text-slate-500 text-center col-span-full">No featured events at this moment.</p>';
            return;
        }

        DOM.featuredContainer.innerHTML = featured.map(event => {
            const seatsLeft = event.totalSeats - event.registeredCount;
            const isFull = seatsLeft <= 0;
            const isFav = StorageManager.isFavorite(event.id);
            const dateObj = new Date(event.targetDate);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' });

            return `
                <div class="glass-card rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl flex flex-col group">
                    <!-- Image Banner & Badges -->
                    <div class="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
                        <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                        
                        <!-- Top Badges -->
                        <div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md">
                                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Featured
                            </span>
                            <button class="favorite-toggle-btn w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900 flex items-center justify-center transition border border-white/20" data-event-id="${event.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                                <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}"></i>
                            </button>
                        </div>

                        <!-- Date Badge Overlay -->
                        <div class="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2.5 text-center shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center justify-center min-w-[54px]">
                            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">${monthStr}</span>
                            <span class="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">${dayStr}</span>
                        </div>

                        <!-- Live Countdown Overlay -->
                        <div class="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-white rounded-xl px-3 py-1.5 border border-white/10 text-xs font-mono" data-countdown-target="${event.targetDate}">
                            <div class="flex items-center gap-1 text-[11px] font-sans text-slate-300 mb-0.5">
                                <i data-lucide="clock" class="w-3 h-3 text-indigo-400"></i> Starts in:
                            </div>
                            <div class="flex items-center gap-1 text-xs font-bold text-amber-300">
                                <div><span class="timer-days">--</span>d</div> :
                                <div><span class="timer-hours">--</span>h</div> :
                                <div><span class="timer-mins">--</span>m</div> :
                                <div><span class="timer-secs">--</span>s</div>
                            </div>
                        </div>
                    </div>

                    <!-- Event Content -->
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    ${event.category}
                                </span>
                                <span class="text-sm font-bold ${event.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}">
                                    ${event.price === 0 ? 'FREE' : `$${event.price}`}
                                </span>
                            </div>

                            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                ${event.title}
                            </h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                                ${event.shortDescription}
                            </p>

                            <!-- Location & Time -->
                            <div class="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <div class="flex items-center gap-2">
                                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0"></i>
                                    <span class="truncate">${event.venue.name}, ${event.venue.city}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-indigo-500 flex-shrink-0"></i>
                                    <span>${event.time}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card Footer / Actions -->
                        <div>
                            <!-- Progress Bar for Seats -->
                            <div class="mb-4">
                                <div class="flex items-center justify-between text-xs font-medium mb-1">
                                    <span class="text-slate-500 dark:text-slate-400">Seats Availability</span>
                                    <span class="${seatsLeft < 20 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}">
                                        ${seatsLeft} / ${event.totalSeats} left
                                    </span>
                                </div>
                                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-500 ${seatsLeft < 20 ? 'bg-rose-500' : 'bg-indigo-600'}" style="width: ${(event.registeredCount / event.totalSeats) * 100}%"></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button class="view-details-btn inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition" data-event-id="${event.id}">
                                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> Details
                                </button>
                                <button class="quick-register-btn inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl ${isFull ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/25'} font-semibold text-xs transition" data-event-id="${event.id}" ${isFull ? 'disabled' : ''}>
                                    <i data-lucide="ticket" class="w-3.5 h-3.5"></i> ${isFull ? 'Sold Out' : 'Register'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    function filterAndSortEvents() {
        let list = [...state.events];

        // Filter by Tab (Favorites vs All)
        if (state.activeTab === 'favorites') {
            const favIds = StorageManager.getFavorites();
            list = list.filter(e => favIds.includes(e.id));
        }

        // Filter by Category
        if (state.activeCategory !== 'All') {
            list = list.filter(e => e.category === state.activeCategory);
        }

        // Filter by Search Query
        if (state.searchQuery.trim() !== '') {
            const query = state.searchQuery.toLowerCase().trim();
            list = list.filter(e => {
                return (
                    e.title.toLowerCase().includes(query) ||
                    e.shortDescription.toLowerCase().includes(query) ||
                    e.category.toLowerCase().includes(query) ||
                    e.venue.city.toLowerCase().includes(query) ||
                    e.venue.name.toLowerCase().includes(query) ||
                    (e.tags && e.tags.some(tag => tag.toLowerCase().includes(query)))
                );
            });
        }

        // Filter by Price
        if (state.priceFilter === 'free') {
            list = list.filter(e => e.price === 0);
        } else if (state.priceFilter === 'paid') {
            list = list.filter(e => e.price > 0);
        }

        // Sort events
        list.sort((a, b) => {
            const dateA = new Date(a.targetDate).getTime();
            const dateB = new Date(b.targetDate).getTime();

            if (state.sortBy === 'date-asc') {
                return dateA - dateB;
            } else if (state.sortBy === 'date-desc') {
                return dateB - dateA;
            } else if (state.sortBy === 'price-asc') {
                return a.price - b.price;
            } else if (state.sortBy === 'popularity') {
                return b.registeredCount - a.registeredCount;
            }
            return 0;
        });

        state.filteredEvents = list;
        renderEventsGrid();
        updateFavoritesBadge();
    }

    function renderEventsGrid() {
        if (!DOM.eventsGrid) return;

        // Update count label
        if (DOM.eventsCountLabel) {
            DOM.eventsCountLabel.textContent = `Showing ${state.filteredEvents.length} event${state.filteredEvents.length === 1 ? '' : 's'}`;
        }

        // Handle Empty State
        if (state.filteredEvents.length === 0) {
            DOM.eventsGrid.classList.add('hidden');
            if (DOM.emptyState) DOM.emptyState.classList.remove('hidden');
            return;
        }

        DOM.eventsGrid.classList.remove('hidden');
        if (DOM.emptyState) DOM.emptyState.classList.add('hidden');

        DOM.eventsGrid.innerHTML = state.filteredEvents.map(event => {
            const seatsLeft = event.totalSeats - event.registeredCount;
            const isFull = seatsLeft <= 0;
            const isFav = StorageManager.isFavorite(event.id);
            const dateObj = new Date(event.targetDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            const categoryColors = {
                'Tech & AI': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
                'Music & Festivals': 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                'Business & Startups': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                'Design & Creative': 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                'Health & Fitness': 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                'Workshops & Learning': 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800'
            };

            const catBadgeClass = categoryColors[event.category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

            return `
                <div class="event-card glass-card rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between group">
                    <div>
                        <!-- Image & Floating Badges -->
                        <div class="relative h-48 overflow-hidden bg-slate-900">
                            <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                            <!-- Top Badges -->
                            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border ${catBadgeClass}">
                                    ${event.category}
                                </span>
                                <button class="favorite-toggle-btn w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900 flex items-center justify-center transition border border-white/20" data-event-id="${event.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                                    <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}"></i>
                                </button>
                            </div>

                            <!-- Bottom Left Price -->
                            <div class="absolute bottom-3 left-3">
                                <span class="px-3 py-1 rounded-lg font-bold text-xs backdrop-blur-md shadow ${event.price === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-900/80 text-white border border-white/20'}">
                                    ${event.price === 0 ? 'FREE PASS' : `$${event.price}`}
                                </span>
                            </div>

                            <!-- Countdown Pill on Card -->
                            <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white rounded-lg px-2 py-0.5 text-[11px] font-mono border border-white/10" data-countdown-target="${event.targetDate}">
                                <div class="flex items-center gap-1 font-semibold text-amber-300">
                                    <span class="timer-days">--</span>d :
                                    <span class="timer-hours">--</span>h :
                                    <span class="timer-mins">--</span>m
                                </div>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-5">
                            <div class="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                                <span>${formattedDate} • ${event.time.split('-')[0].trim()}</span>
                            </div>

                            <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                ${event.title}
                            </h4>

                            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                                ${event.shortDescription}
                            </p>

                            <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i>
                                <span class="truncate">${event.venue.name}, ${event.venue.city}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card Footer -->
                    <div class="p-5 pt-0">
                        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span>Capacity</span>
                            <span class="font-semibold ${seatsLeft <= 15 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}">
                                ${seatsLeft} seats left
                            </span>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <button class="view-details-btn inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition" data-event-id="${event.id}">
                                <i data-lucide="info" class="w-3.5 h-3.5"></i> Details
                            </button>
                            <button class="quick-register-btn inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl ${isFull ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} font-semibold text-xs transition" data-event-id="${event.id}" ${isFull ? 'disabled' : ''}>
                                <i data-lucide="user-plus" class="w-3.5 h-3.5"></i> ${isFull ? 'Full' : 'Register'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
        startCountdowns();
    }

    function updateFavoritesBadge() {
        const favs = StorageManager.getFavorites();
        if (DOM.favCountBadge) {
            DOM.favCountBadge.textContent = favs.length;
        }
    }

    function updateBookingsBadge() {
        const bookings = StorageManager.getRegistrations();
        const count = bookings.length;
        [DOM.bookingsBadge, DOM.mobileBookingsBadge].forEach(badge => {
            if (!badge) return;
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    /* ==========================================================================
       5. Event Details Modal Logic
       ========================================================================== */
    function openEventDetails(eventId) {
        const event = StorageManager.getEventById(eventId);
        if (!event || !DOM.detailsModalContent) return;

        state.selectedEvent = event;
        const seatsLeft = event.totalSeats - event.registeredCount;
        const isFull = seatsLeft <= 0;
        const dateObj = new Date(event.targetDate);
        const fullDateStr = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        DOM.detailsModalContent.innerHTML = `
            <!-- Modal Header Banner -->
            <div class="relative h-64 sm:h-80 w-full overflow-hidden">
                <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <button id="close-modal-inside" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:bg-slate-900 flex items-center justify-center transition border border-white/20">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="absolute bottom-6 left-6 right-6 text-white">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                            ${event.category}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${event.price === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}">
                            ${event.price === 0 ? 'FREE ADMISSION' : `$${event.price} Regular Pass`}
                        </span>
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-extrabold leading-tight text-white mb-2">
                        ${event.title}
                    </h2>
                    <p class="text-sm sm:text-base text-slate-300 font-medium">
                        ${event.tagline || ''}
                    </p>
                </div>
            </div>

            <!-- Modal Body Container -->
            <div class="p-6 sm:p-8 space-y-8">
                <!-- Highlight Bar / Quick Details -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="calendar" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">Date & Time</div>
                            <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${fullDateStr}</div>
                            <div class="text-xs text-slate-500">${event.time}</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="map-pin" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">Location</div>
                            <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${event.venue.name}</div>
                            <div class="text-xs text-slate-500">${event.venue.city} (${event.venue.type})</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">Availability</div>
                            <div class="text-xs sm:text-sm font-bold ${seatsLeft <= 15 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}">
                                ${seatsLeft} Seats Remaining
                            </div>
                            <div class="text-xs text-slate-500">Out of ${event.totalSeats} total spots</div>
                        </div>
                    </div>
                </div>

                <!-- Live Countdown Banner Inside Details -->
                <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4" data-countdown-target="${event.targetDate}">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-indicator"></span>
                        <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">Event Countdown:</span>
                    </div>
                    <div class="flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-300">
                        <div class="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><span class="timer-days">--</span> <span class="text-xs font-normal text-slate-400">Days</span></div>
                        <div class="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><span class="timer-hours">--</span> <span class="text-xs font-normal text-slate-400">Hours</span></div>
                        <div class="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><span class="timer-mins">--</span> <span class="text-xs font-normal text-slate-400">Mins</span></div>
                        <div class="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"><span class="timer-secs">--</span> <span class="text-xs font-normal text-slate-400">Secs</span></div>
                    </div>
                </div>

                <!-- Event Overview -->
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">About This Event</h3>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                        ${event.fullDescription || event.shortDescription}
                    </p>
                </div>

                <!-- Tags -->
                ${event.tags && event.tags.length ? `
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Event Highlights & Topics</h4>
                        <div class="flex flex-wrap gap-2">
                            ${event.tags.map(t => `<span class="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">#${t}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Agenda Section -->
                ${event.agenda && event.agenda.length ? `
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Official Schedule & Agenda</h3>
                        <div class="relative pl-6 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900 ml-2">
                            ${event.agenda.map(item => `
                                <div class="relative group">
                                    <div class="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600"></div>
                                    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">${item.time}</span>
                                    <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${item.title}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Speakers / Key Hosts -->
                ${event.speakers && event.speakers.length ? `
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Featured Speakers & Mentors</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${event.speakers.map(sp => `
                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                                    <img src="${sp.avatar}" alt="${sp.name}" class="w-12 h-12 rounded-full object-cover border border-indigo-300">
                                    <div>
                                        <div class="font-bold text-sm text-slate-900 dark:text-white">${sp.name}</div>
                                        <div class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">${sp.role}</div>
                                        <div class="text-xs text-slate-500">${sp.company}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Action Footer -->
                <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div class="text-xs text-slate-500">Ticket Tier Price</div>
                        <div class="text-2xl font-black ${event.price === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}">
                            ${event.price === 0 ? 'FREE' : `$${event.price}`}
                            <span class="text-xs font-normal text-slate-400">/ per attendee</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <button id="modal-share-btn" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Share Event">
                            <i data-lucide="share-2" class="w-5 h-5"></i>
                        </button>
                        <button id="modal-register-cta" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl ${isFull ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition" ${isFull ? 'disabled' : ''}>
                            <i data-lucide="ticket" class="w-4 h-4"></i> ${isFull ? 'Event Sold Out' : 'Register for Event'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        DOM.detailsModal.classList.remove('hidden');
        DOM.detailsModal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
        startCountdowns();

        // Bind inner actions
        const closeInsideBtn = DOM.detailsModalContent.querySelector('#close-modal-inside');
        if (closeInsideBtn) {
            closeInsideBtn.addEventListener('click', closeEventDetails);
        }

        const shareBtn = DOM.detailsModalContent.querySelector('#modal-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Event link copied to clipboard!', 'success');
                } else {
                    showToast('Share link ready!', 'info');
                }
            });
        }

        const registerCta = DOM.detailsModalContent.querySelector('#modal-register-cta');
        if (registerCta && !isFull) {
            registerCta.addEventListener('click', () => {
                closeEventDetails();
                openRegisterModal(event.id);
            });
        }
    }

    function closeEventDetails() {
        if (!DOM.detailsModal) return;
        DOM.detailsModal.classList.add('hidden');
        DOM.detailsModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    /* ==========================================================================
       6. Event Registration Modal & Live Validation
       ========================================================================== */
    function openRegisterModal(eventId) {
        const event = StorageManager.getEventById(eventId);
        if (!event) return;

        state.selectedEvent = event;

        // Render preview header inside registration modal
        if (DOM.registerEventSummary) {
            DOM.registerEventSummary.innerHTML = `
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-6">
                    <img src="${event.image}" alt="${event.title}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">${event.category}</span>
                        <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${event.title}</h4>
                        <div class="text-xs text-slate-500 truncate">${event.venue.name}, ${event.venue.city}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-slate-400">Unit Price</div>
                        <div class="text-sm font-black ${event.price === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}">
                            ${event.price === 0 ? 'FREE' : `$${event.price}`}
                        </div>
                    </div>
                </div>
            `;
        }

        // Reset form inputs & errors
        if (DOM.registerForm) {
            DOM.registerForm.reset();
            clearValidationErrors();
        }

        updatePricingSummary();

        DOM.registerModal.classList.remove('hidden');
        DOM.registerModal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
    }

    function closeRegisterModal() {
        if (!DOM.registerModal) return;
        DOM.registerModal.classList.add('hidden');
        DOM.registerModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    function updatePricingSummary() {
        if (!state.selectedEvent || !DOM.totalPriceSummary) return;
        const count = parseInt(DOM.ticketCountInput ? DOM.ticketCountInput.value : 1, 10) || 1;
        const tier = DOM.ticketTierSelect ? DOM.ticketTierSelect.value : 'general';
        const multiplier = tier === 'vip' ? 1.5 : 1;
        const unitPrice = state.selectedEvent.price * multiplier;
        const total = unitPrice * count;

        DOM.totalPriceSummary.textContent = state.selectedEvent.price === 0 ? 'FREE' : `$${total.toFixed(2)}`;
    }

    // Live Form Validation Logic
    const validators = {
        name: (val) => {
            const trimmed = val.trim();
            if (!trimmed) return 'Full Name is required.';
            if (trimmed.length < 3) return 'Name must be at least 3 characters.';
            if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name should contain valid letters only.';
            return null;
        },
        email: (val) => {
            const trimmed = val.trim();
            if (!trimmed) return 'Email address is required.';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g., alex@example.com).';
            return null;
        },
        phone: (val) => {
            const trimmed = val.trim();
            if (!trimmed) return 'Phone number is required.';
            // Allows international + digits, brackets, dashes, spaces, 10-15 digits
            const digits = trimmed.replace(/\D/g, '');
            if (digits.length < 10 || digits.length > 15) return 'Phone number must contain between 10 to 15 digits.';
            return null;
        },
        tickets: (val) => {
            const num = parseInt(val, 10);
            if (isNaN(num) || num < 1 || num > 5) return 'Ticket count must be between 1 and 5.';
            return null;
        },
        terms: (isChecked) => {
            if (!isChecked) return 'You must accept the terms & conditions to proceed.';
            return null;
        }
    };

    function validateField(fieldId, validatorFn, value) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);
        if (!input) return false;

        const error = validatorFn(value);

        if (error) {
            input.classList.remove('border-slate-300', 'dark:border-slate-700', 'border-emerald-500');
            input.classList.add('border-rose-500', 'focus:ring-rose-500');
            if (errorEl) {
                errorEl.textContent = error;
                errorEl.classList.remove('hidden');
            }
            return false;
        } else {
            input.classList.remove('border-rose-500', 'focus:ring-rose-500');
            input.classList.add('border-emerald-500');
            if (errorEl) {
                errorEl.classList.add('hidden');
            }
            return true;
        }
    }

    function clearValidationErrors() {
        ['reg-name', 'reg-email', 'reg-phone', 'reg-ticket-count', 'reg-terms'].forEach(id => {
            const input = document.getElementById(id);
            const err = document.getElementById(`${id}-error`);
            if (input) {
                input.classList.remove('border-rose-500', 'border-emerald-500');
            }
            if (err) {
                err.classList.add('hidden');
            }
        });
    }

    function initFormValidationListeners() {
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const phoneInput = document.getElementById('reg-phone');
        const ticketInput = document.getElementById('reg-ticket-count');
        const termsInput = document.getElementById('reg-terms');

        if (nameInput) {
            nameInput.addEventListener('blur', () => validateField('reg-name', validators.name, nameInput.value));
            nameInput.addEventListener('input', () => {
                if (nameInput.classList.contains('border-rose-500')) {
                    validateField('reg-name', validators.name, nameInput.value);
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => validateField('reg-email', validators.email, emailInput.value));
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('border-rose-500')) {
                    validateField('reg-email', validators.email, emailInput.value);
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => validateField('reg-phone', validators.phone, phoneInput.value));
            phoneInput.addEventListener('input', () => {
                if (phoneInput.classList.contains('border-rose-500')) {
                    validateField('reg-phone', validators.phone, phoneInput.value);
                }
            });
        }

        if (ticketInput) {
            ticketInput.addEventListener('input', () => {
                validateField('reg-ticket-count', validators.tickets, ticketInput.value);
                updatePricingSummary();
            });
        }

        if (DOM.ticketTierSelect) {
            DOM.ticketTierSelect.addEventListener('change', updatePricingSummary);
        }

        if (termsInput) {
            termsInput.addEventListener('change', () => validateField('reg-terms', validators.terms, termsInput.checked));
        }

        // Form Submit
        if (DOM.registerForm) {
            DOM.registerForm.addEventListener('submit', handleRegistrationSubmit);
        }
    }

    function handleRegistrationSubmit(e) {
        e.preventDefault();
        if (!state.selectedEvent) return;

        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const phoneInput = document.getElementById('reg-phone');
        const ticketInput = document.getElementById('reg-ticket-count');
        const termsInput = document.getElementById('reg-terms');
        const notesInput = document.getElementById('reg-notes');

        // Validate all
        const isNameValid = validateField('reg-name', validators.name, nameInput.value);
        const isEmailValid = validateField('reg-email', validators.email, emailInput.value);
        const isPhoneValid = validateField('reg-phone', validators.phone, phoneInput.value);
        const isTicketsValid = validateField('reg-ticket-count', validators.tickets, ticketInput.value);
        const isTermsValid = validateField('reg-terms', validators.terms, termsInput.checked);

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isTicketsValid || !isTermsValid) {
            showToast('Please fix the errors in the form before submitting.', 'error');
            return;
        }

        // Loading state
        const originalBtnText = DOM.submitRegisterBtn.innerHTML;
        DOM.submitRegisterBtn.disabled = true;
        DOM.submitRegisterBtn.innerHTML = `
            <span class="inline-flex items-center gap-2">
                <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Reserving your spot...
            </span>
        `;
        if (window.lucide) lucide.createIcons();

        // Simulate network processing
        setTimeout(() => {
            const ticketCount = parseInt(ticketInput.value, 10);
            const tier = DOM.ticketTierSelect.value;
            const multiplier = tier === 'vip' ? 1.5 : 1;
            const totalPrice = state.selectedEvent.price * multiplier * ticketCount;

            const registrationPayload = {
                eventId: state.selectedEvent.id,
                eventTitle: state.selectedEvent.title,
                eventImage: state.selectedEvent.image,
                eventDate: state.selectedEvent.targetDate,
                eventTime: state.selectedEvent.time,
                eventVenue: state.selectedEvent.venue,
                fullName: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                ticketCount: ticketCount,
                ticketTier: tier,
                totalPaid: totalPrice,
                notes: notesInput ? notesInput.value.trim() : ''
            };

            const confirmedTicket = StorageManager.addRegistration(registrationPayload);
            currentConfirmedTicket = confirmedTicket;

            // Update app state
            state.events = StorageManager.getAllEvents();
            filterAndSortEvents();
            renderFeaturedEvents();
            updateBookingsBadge();

            // Reset button
            DOM.submitRegisterBtn.disabled = false;
            DOM.submitRegisterBtn.innerHTML = originalBtnText;

            // Close registration modal & Open Success Ticket
            closeRegisterModal();
            openTicketSuccessModal(confirmedTicket);

            // Confetti Celebration
            triggerCelebrationConfetti();
            showToast('Registration Confirmed! Your digital pass is ready.', 'success');
        }, 700);
    }

    /* ==========================================================================
       7. Digital Ticket & Confirmation Modal
       ========================================================================== */
    function triggerCelebrationConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 250);
        }
    }

    function openTicketSuccessModal(ticket) {
        if (!ticket || !DOM.ticketDetailsContainer) return;

        const dateObj = new Date(ticket.eventDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        DOM.ticketDetailsContainer.innerHTML = `
            <div id="printable-ticket-section" class="ticket-container max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden">
                <!-- Side notches -->
                <div class="ticket-notch-left"></div>
                <div class="ticket-notch-right"></div>

                <!-- Top Header -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-2">
                        <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Verified Admission
                    </div>
                    <h3 class="text-xl sm:text-2xl font-black tracking-tight">${ticket.eventTitle}</h3>
                    <p class="text-xs text-indigo-100 mt-1">${ticket.eventVenue.name} • ${ticket.eventVenue.city}</p>
                </div>

                <!-- Ticket Details Section -->
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <div class="text-[11px] font-medium uppercase text-slate-400">Attendee Name</div>
                            <div class="text-sm font-bold text-slate-900 dark:text-white">${ticket.fullName}</div>
                        </div>
                        <div>
                            <div class="text-[11px] font-medium uppercase text-slate-400">Ticket ID</div>
                            <div class="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">#${ticket.ticketId}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <div class="text-[11px] font-medium uppercase text-slate-400">Date & Time</div>
                            <div class="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">${formattedDate}</div>
                            <div class="text-xs text-slate-500">${ticket.eventTime}</div>
                        </div>
                        <div>
                            <div class="text-[11px] font-medium uppercase text-slate-400">Pass Details</div>
                            <div class="text-sm font-bold text-slate-900 dark:text-white uppercase">${ticket.ticketTier} Pass (${ticket.ticketCount}x)</div>
                            <div class="text-xs text-emerald-500 font-semibold">${ticket.totalPaid === 0 ? 'COMPLIMENTARY' : 'PAID $' + ticket.totalPaid.toFixed(2)}</div>
                        </div>
                    </div>

                    <div class="text-left">
                        <div class="text-[11px] font-medium uppercase text-slate-400">Venue Address</div>
                        <div class="text-xs text-slate-600 dark:text-slate-300">${ticket.eventVenue.address || ticket.eventVenue.name}</div>
                    </div>
                </div>

                <!-- Perforation Line -->
                <div class="ticket-dashed-divider mx-4"></div>

                <!-- Ticket Footer with Barcode -->
                <div class="p-6 pt-4 text-center bg-slate-50 dark:bg-slate-800/40">
                    <div class="barcode-strip mx-auto mb-2 opacity-80"></div>
                    <div class="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        Scan at entrance • ${ticket.ticketId} • Non-Transferable
                    </div>
                </div>
            </div>
        `;

        DOM.ticketSuccessModal.classList.remove('hidden');
        DOM.ticketSuccessModal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        if (window.lucide) lucide.createIcons();
    }

    function closeTicketSuccessModal() {
        if (!DOM.ticketSuccessModal) return;
        DOM.ticketSuccessModal.classList.add('hidden');
        DOM.ticketSuccessModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    // Generate .ICS Calendar File
    function downloadIcsCalendar(ticket) {
        if (!ticket) return;

        const eventDate = new Date(ticket.eventDate);
        const formatDateForIcs = (date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };

        const startDate = formatDateForIcs(eventDate);
        const endDateObj = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration
        const endDate = formatDateForIcs(endDateObj);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//EventPulse//Event Management Platform//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `SUMMARY:${ticket.eventTitle}`,
            `UID:${ticket.ticketId}@eventpulse.io`,
            `DTSTAMP:${formatDateForIcs(new Date())}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `DESCRIPTION:Your ticket #${ticket.ticketId} for ${ticket.eventTitle}. Attendee: ${ticket.fullName}`,
            `LOCATION:${ticket.eventVenue.name}, ${ticket.eventVenue.city}`,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${ticket.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Ticket.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Calendar invite (.ics) downloaded!', 'success');
    }

    /* ==========================================================================
       8. My Bookings Drawer / Modal
       ========================================================================== */
    function openBookingsModal() {
        renderBookingsList();
        DOM.bookingsModal.classList.remove('hidden');
        DOM.bookingsModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }

    function closeBookingsModal() {
        if (!DOM.bookingsModal) return;
        DOM.bookingsModal.classList.add('hidden');
        DOM.bookingsModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    function renderBookingsList() {
        const bookings = StorageManager.getRegistrations();
        if (!DOM.bookingsListContainer) return;

        if (bookings.length === 0) {
            DOM.bookingsListContainer.innerHTML = '';
            if (DOM.emptyBookingsState) DOM.emptyBookingsState.classList.remove('hidden');
            return;
        }

        if (DOM.emptyBookingsState) DOM.emptyBookingsState.classList.add('hidden');

        DOM.bookingsListContainer.innerHTML = bookings.map(b => {
            const dateObj = new Date(b.eventDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return `
                <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <img src="${b.eventImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'}" alt="${b.eventTitle}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">#${b.ticketId}</span>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">CONFIRMED</span>
                            </div>
                            <h4 class="font-bold text-slate-900 dark:text-white text-base leading-snug">${b.eventTitle}</h4>
                            <div class="text-xs text-slate-500 mt-0.5">
                                ${formattedDate} • ${b.eventVenue.city} • ${b.ticketCount} Pass(es) (${b.fullName})
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                        <button class="view-single-ticket-btn px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition" data-ticket-id="${b.ticketId}">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i> View Ticket
                        </button>
                        <button class="cancel-booking-btn px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition" data-ticket-id="${b.ticketId}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Cancel
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* ==========================================================================
       9. Global Event Listeners & Delegations
       ========================================================================== */
    function initGlobalListeners() {
        // Hero quick search
        if (DOM.heroSearchBtn) {
            DOM.heroSearchBtn.addEventListener('click', () => {
                const query = DOM.heroSearchInput ? DOM.heroSearchInput.value : '';
                const category = DOM.heroCategorySelect ? DOM.heroCategorySelect.value : 'All';

                state.searchQuery = query;
                state.activeCategory = category;

                if (DOM.searchInput) DOM.searchInput.value = query;

                // Update category buttons active state
                updateCategoryPillsUI();

                filterAndSortEvents();

                // Smooth scroll to browse section
                const exploreSection = document.getElementById('explore-events');
                if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Live search input
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                if (DOM.clearSearchBtn) {
                    if (state.searchQuery) {
                        DOM.clearSearchBtn.classList.remove('hidden');
                    } else {
                        DOM.clearSearchBtn.classList.add('hidden');
                    }
                }
                filterAndSortEvents();
            });
        }

        if (DOM.clearSearchBtn) {
            DOM.clearSearchBtn.addEventListener('click', () => {
                if (DOM.searchInput) DOM.searchInput.value = '';
                state.searchQuery = '';
                DOM.clearSearchBtn.classList.add('hidden');
                filterAndSortEvents();
            });
        }

        // Category filter buttons
        if (DOM.categoryFiltersContainer) {
            DOM.categoryFiltersContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-category]');
                if (!btn) return;

                state.activeCategory = btn.getAttribute('data-category');
                updateCategoryPillsUI();
                filterAndSortEvents();
            });
        }

        // Price Filter
        if (DOM.priceFilterSelect) {
            DOM.priceFilterSelect.addEventListener('change', (e) => {
                state.priceFilter = e.target.value;
                filterAndSortEvents();
            });
        }

        // Sort Select
        if (DOM.sortSelect) {
            DOM.sortSelect.addEventListener('change', (e) => {
                state.sortBy = e.target.value;
                filterAndSortEvents();
            });
        }

        // Tabs: All Events vs Favorites
        if (DOM.tabAllEventsBtn && DOM.tabFavoritesBtn) {
            DOM.tabAllEventsBtn.addEventListener('click', () => {
                state.activeTab = 'all';
                DOM.tabAllEventsBtn.classList.add('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-slate-900', 'dark:text-white');
                DOM.tabAllEventsBtn.classList.remove('text-slate-600', 'dark:text-slate-400');

                DOM.tabFavoritesBtn.classList.remove('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-slate-900', 'dark:text-white');
                DOM.tabFavoritesBtn.classList.add('text-slate-600', 'dark:text-slate-400');

                filterAndSortEvents();
            });

            DOM.tabFavoritesBtn.addEventListener('click', () => {
                state.activeTab = 'favorites';
                DOM.tabFavoritesBtn.classList.add('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-slate-900', 'dark:text-white');
                DOM.tabFavoritesBtn.classList.remove('text-slate-600', 'dark:text-slate-400');

                DOM.tabAllEventsBtn.classList.remove('bg-white', 'dark:bg-slate-800', 'shadow-sm', 'text-slate-900', 'dark:text-white');
                DOM.tabAllEventsBtn.classList.add('text-slate-600', 'dark:text-slate-400');

                filterAndSortEvents();
            });
        }

        // Reset Filters Button
        if (DOM.resetFiltersBtn) {
            DOM.resetFiltersBtn.addEventListener('click', () => {
                state.searchQuery = '';
                state.activeCategory = 'All';
                state.priceFilter = 'all';
                state.sortBy = 'date-asc';
                state.activeTab = 'all';

                if (DOM.searchInput) DOM.searchInput.value = '';
                if (DOM.clearSearchBtn) DOM.clearSearchBtn.classList.add('hidden');
                if (DOM.priceFilterSelect) DOM.priceFilterSelect.value = 'all';
                if (DOM.sortSelect) DOM.sortSelect.value = 'date-asc';

                updateCategoryPillsUI();
                filterAndSortEvents();
            });
        }

        // Delegate Click on Event Cards (Details, Quick Register, Favorite)
        document.addEventListener('click', (e) => {
            // Favorite Button
            const favBtn = e.target.closest('.favorite-toggle-btn');
            if (favBtn) {
                const eventId = favBtn.getAttribute('data-event-id');
                const isNowFav = StorageManager.toggleFavorite(eventId);
                filterAndSortEvents();
                renderFeaturedEvents();
                showToast(isNowFav ? 'Added to your favorites' : 'Removed from favorites', 'info');
                return;
            }

            // View Details Button
            const detailsBtn = e.target.closest('.view-details-btn');
            if (detailsBtn) {
                const eventId = detailsBtn.getAttribute('data-event-id');
                openEventDetails(eventId);
                return;
            }

            // Quick Register Button
            const registerBtn = e.target.closest('.quick-register-btn');
            if (registerBtn) {
                const eventId = registerBtn.getAttribute('data-event-id');
                openRegisterModal(eventId);
                return;
            }

            // View Single Ticket from My Bookings
            const viewTicketBtn = e.target.closest('.view-single-ticket-btn');
            if (viewTicketBtn) {
                const ticketId = viewTicketBtn.getAttribute('data-ticket-id');
                const bookings = StorageManager.getRegistrations();
                const ticket = bookings.find(t => t.ticketId === ticketId);
                if (ticket) {
                    currentConfirmedTicket = ticket;
                    closeBookingsModal();
                    openTicketSuccessModal(ticket);
                }
                return;
            }

            // Cancel Booking from My Bookings
            const cancelBtn = e.target.closest('.cancel-booking-btn');
            if (cancelBtn) {
                const ticketId = cancelBtn.getAttribute('data-ticket-id');
                if (confirm('Are you sure you want to cancel this booking? This will release your reserved seats.')) {
                    const success = StorageManager.cancelRegistration(ticketId);
                    if (success) {
                        state.events = StorageManager.getAllEvents();
                        renderBookingsList();
                        updateBookingsBadge();
                        filterAndSortEvents();
                        renderFeaturedEvents();
                        showToast('Booking cancelled and seats released.', 'warning');
                    }
                }
                return;
            }
        });

        // Close Modals on Backdrop Click
        [DOM.detailsModal, DOM.registerModal, DOM.ticketSuccessModal, DOM.bookingsModal].forEach(modal => {
            if (!modal) return;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close Buttons
        if (DOM.closeDetailsModalBtn) DOM.closeDetailsModalBtn.addEventListener('click', closeEventDetails);
        if (DOM.closeRegisterModalBtn) DOM.closeRegisterModalBtn.addEventListener('click', closeRegisterModal);
        if (DOM.closeTicketModalBtn) DOM.closeTicketModalBtn.addEventListener('click', closeTicketSuccessModal);
        if (DOM.closeBookingsModalBtn) DOM.closeBookingsModalBtn.addEventListener('click', closeBookingsModal);

        // My Bookings open buttons
        if (DOM.myBookingsBtn) DOM.myBookingsBtn.addEventListener('click', openBookingsModal);
        if (DOM.mobileMyBookingsBtn) DOM.mobileMyBookingsBtn.addEventListener('click', openBookingsModal);

        // Ticket Success Actions
        if (DOM.printTicketBtn) {
            DOM.printTicketBtn.addEventListener('click', () => {
                window.print();
            });
        }

        if (DOM.downloadIcsBtn) {
            DOM.downloadIcsBtn.addEventListener('click', () => {
                downloadIcsCalendar(currentConfirmedTicket);
            });
        }

        if (DOM.viewBookingsFromTicketBtn) {
            DOM.viewBookingsFromTicketBtn.addEventListener('click', () => {
                closeTicketSuccessModal();
                openBookingsModal();
            });
        }

        // Newsletter / Host Event subscription form mock
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]');
                if (email && email.value) {
                    showToast('Thank you for subscribing to weekly event updates!', 'success');
                    newsletterForm.reset();
                }
            });
        }

        // Back to Top button
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                    backToTopBtn.classList.add('opacity-100');
                } else {
                    backToTopBtn.classList.remove('opacity-100');
                    backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    function updateCategoryPillsUI() {
        if (!DOM.categoryFiltersContainer) return;
        DOM.categoryFiltersContainer.querySelectorAll('[data-category]').forEach(btn => {
            const cat = btn.getAttribute('data-category');
            if (cat === state.activeCategory) {
                btn.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-md shadow-indigo-600/25';
            } else {
                btn.className = 'px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
            }
        });
    }

    /* ==========================================================================
       10. Initial Application Boot
       ========================================================================== */
    function bootstrap() {
        initTheme();
        initMobileMenu();
        initFormValidationListeners();
        initGlobalListeners();

        renderFeaturedEvents();
        filterAndSortEvents();
        updateFavoritesBadge();
        updateBookingsBadge();

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    bootstrap();
});
