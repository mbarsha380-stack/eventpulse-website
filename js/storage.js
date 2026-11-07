/**
 * EventPulse - LocalStorage & State Management System
 * Handles persistent registrations, favorites, theme preference, and live seat count tracking.
 */

const STORAGE_KEYS = {
    EVENTS: 'eventpulse_events_data',
    REGISTRATIONS: 'eventpulse_registrations',
    FAVORITES: 'eventpulse_favorites',
    THEME: 'eventpulse_theme'
};

const StorageManager = {
    /**
     * Initializes events in localStorage if not already present
     */
    initEvents() {
        const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(window.INITIAL_EVENTS || []));
            return window.INITIAL_EVENTS || [];
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse events from storage, resetting:', e);
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(window.INITIAL_EVENTS || []));
            return window.INITIAL_EVENTS || [];
        }
    },

    /**
     * Gets all events
     */
    getAllEvents() {
        return this.initEvents();
    },

    /**
     * Gets single event by ID
     */
    getEventById(id) {
        const events = this.getAllEvents();
        return events.find(e => e.id === id) || null;
    },

    /**
     * Updates seat count for an event
     */
    adjustEventSeats(eventId, countChange) {
        const events = this.getAllEvents();
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            events[eventIndex].registeredCount = Math.max(
                0,
                Math.min(events[eventIndex].totalSeats, events[eventIndex].registeredCount + countChange)
            );
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
            return events[eventIndex];
        }
        return null;
    },

    /**
     * Get all registrations
     */
    getRegistrations() {
        const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse registrations', e);
            return [];
        }
    },

    /**
     * Save a new registration
     */
    addRegistration(registrationData) {
        const registrations = this.getRegistrations();
        const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
        const newRecord = {
            ticketId,
            ...registrationData,
            registeredAt: new Date().toISOString()
        };

        registrations.unshift(newRecord);
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

        // Adjust seat counts
        this.adjustEventSeats(registrationData.eventId, registrationData.ticketCount || 1);

        return newRecord;
    },

    /**
     * Cancel / remove a registration
     */
    cancelRegistration(ticketId) {
        const registrations = this.getRegistrations();
        const target = registrations.find(r => r.ticketId === ticketId);
        if (!target) return false;

        const updated = registrations.filter(r => r.ticketId !== ticketId);
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));

        // Release seats
        this.adjustEventSeats(target.eventId, -(target.ticketCount || 1));
        return true;
    },

    /**
     * Favorites / Bookmarks
     */
    getFavorites() {
        const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    },

    isFavorite(eventId) {
        return this.getFavorites().includes(eventId);
    },

    toggleFavorite(eventId) {
        let favs = this.getFavorites();
        const exists = favs.includes(eventId);
        if (exists) {
            favs = favs.filter(id => id !== eventId);
        } else {
            favs.push(eventId);
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        return !exists;
    },

    /**
     * Theme management
     */
    getTheme() {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved) return saved;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};

window.StorageManager = StorageManager;
