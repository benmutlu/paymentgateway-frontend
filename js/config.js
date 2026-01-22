/**
 * Payment Gateway Configuration
 * Central configuration for the entire application
 */

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://api.fastlinepay.com/api/v1',
    SOCKET_URL: 'https://api.fastlinepay.com',
    
    // Polling Configuration
    POLL_INTERVAL_WAITING: 3000,      // 3 seconds for waiting room
    POLL_INTERVAL_PROCESSING: 5000,   // 5 seconds for processing room
    POLL_INTERVAL_STATS: 5000,        // 5 seconds for statistics
    POLL_INTERVAL_REPORTS: 10000,     // 10 seconds for reports
    
    // Request Configuration
    REQUEST_TIMEOUT: 30000,            // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,                 // 1 second
    
    // Storage Keys
    STORAGE_KEY_AUTH: 'payment_gateway_auth',
    STORAGE_KEY_THEME: 'payment_gateway_theme',
    STORAGE_KEY_NOTIFIED: 'notified_transactions',
    STORAGE_KEY_AUDIO: 'notification_audio',
    
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    
    // Transaction Status
    STATUS: {
        WAITING: 'payment_wait_room',
        PROCESSING: 'payment_on_process',
        COMPLETED: 'payment_completed',
        DECLINED: 'payment_declined'
    },
    
    // User Roles
    ROLES: {
        ROOT: 'root',
        MERCHANT: 'merchant',
        ADMIN: 'admin',
        AGENT: 'agent'
    },
    
    // Routes
    ROUTES: {
        LOGIN: '/login',
        HOME: '/app',
        PAYMENTS: '/app/payments',
        FINANCE: '/app/finance',
        ADMIN: '/app/admin',
        PROFILE: '/app/profile'
    },
    
    // Date Formats
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
    DISPLAY_DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
    
    // Chart Colors
    CHART_COLORS: {
        SUCCESS: '#76d90c',
        FAILED: '#cc0808',
        PENDING: '#ffa500',
        PRIMARY: '#1a73e8',
        SECONDARY: '#5f6368'
    },
    
    // Audio Settings
    AUDIO: {
        ENABLED_BY_DEFAULT: true,
        VOLUME: 0.5
    }
};

/**
 * API Endpoints
 * Organized by category for easy reference
 */
const ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/admin/auth/login'
    },
    
    // Payment Management
    PAYMENT: {
        WAITING_ROOM: '/admin/payment/list/wait-room',
        PROCESSING_ROOM: '/admin/payment/list/on-process',
        VIEW: '/admin/payment/{id}/view',
        UPDATE_STATUS: '/admin/payment/{id}/status/update',
        UPDATE_PRICE: '/admin/payment/{id}/price/update',
        AGENT_DASHBOARD: '/admin/payment/agent/dashboard',
        HISTORY_SEARCH: '/admin/payment/history/search',
        TIMELAPSE: '/admin/payment/history/timelapse',
        DASHBOARD_CHARTS: '/admin/payment/dashboard/charts',
        HISTORY_CHARTS: '/admin/payment/history/charts'
    },
    
    // Reports
    REPORT: {
        DAILY: '/admin/payment/report/daily',
        AGENT: '/admin/payment/report/agent',
        SYSTEM: '/admin/payment/report/system',
        BANKS: '/admin/payment/report/banks',
        GENERAL: '/admin/payment/report/general',
        DAILY_SYSTEM: '/admin/payment/report/daily/system'
    },
    
    // Team Management
    TEAM: {
        LIST: '/admin/teams',
        CREATE: '/admin/team/create',
        VIEW: '/admin/team/{id}/view',
        UPDATE: '/admin/team/{id}/update',
        UPDATE_PASSWORD: '/admin/team/{id}/update/password',
        HISTORY: '/admin/team/{id}/payment/history/search'
    },
    
    // Transfer Methods
    TRANSFER: {
        LIST: '/admin/transfer/methods',
        CREATE: '/admin/transfer/method/create',
        VIEW: '/admin/transfer/method/{id}/view',
        UPDATE: '/admin/transfer/method/{id}/update'
    },
    
    // Havale Methods
    HAVALE: {
        LIST: '/admin/havale/methods',
        CREATE: '/admin/havale/method/create',
        VIEW: '/admin/havale/method/{id}/view',
        UPDATE: '/admin/havale/method/{id}/update',
        PREFIX: '/admin/havale/prefix'
    },
    
    // Merchant Management
    MERCHANT: {
        LIST: '/admin/merchants',
        CREATE: '/admin/merchant/create',
        VIEW: '/admin/merchant/{id}/view',
        UPDATE: '/admin/merchant/{id}/update',
        UPDATE_LOGO: '/admin/merchant/{id}/update/logo',
        HISTORY: '/admin/merchant/{id}/history',
        HISTORY_SEARCH: '/admin/merchant/{id}/history/search',
        CHECK_BRANDING: '/admin/merchant/{id}/check/branding',
        TEAMS: '/admin/merchant/{id}/teams',
        SUB_MERCHANTS: '/admin/merchant/{id}/sub/merchants',
        TEAM_CREATE: '/admin/merchant/{id}/team/create',
        TEAM_VIEW: '/admin/merchant/{id}/team/{team_id}/view',
        TEAM_UPDATE: '/admin/merchant/{id}/team/{team_id}/update',
        TEAM_UPDATE_PASSWORD: '/admin/merchant/{id}/team/{team_id}/update/password',
        
        // Current Merchant
        CURRENT_VIEW: '/admin/merchant/view',
        PAYMENT_METHOD: '/admin/merchant/payment/method',
        ACCESS_ASSIGNMENT: '/admin/merchant/access/assigment',
        AGENTS: '/admin/merchant/agents',
        ASSIGNMENT_METHOD: '/admin/merchant/assigment/method',
        PAYMENT_OPERATORS: '/admin/merchant/payment/operators',
        OPERATOR_PAYMENTS: '/admin/merchant/payment/operators/payments',
        PAYMENT_MERCHANTS: '/admin/merchant/payment/merchants',
        APPS_TRANSFER: '/admin/merchant/apps/transfer',
        PAYMENT_STATUS: '/admin/merchant/payment/status',
        PAYMENT_CURRENCY: '/admin/merchant/payment/currency',
        METHOD_STATUS: '/admin/merchant/payment/method/status',
        CALLBACK_HISTORY: '/admin/merchant/callback/history/search'
    },
    
    // Profile
    PROFILE: {
        MY_PROFILE: '/admin/profile/my/profile',
        CHANGE_PASSWORD: '/admin/profile/my/password/change',
        CHANGE_2FA: '/admin/profile/my/2fa/change',
        UPDATE_NOTIFICATION: '/admin/profile/my/notification/update',
        ACCESS_MERCHANT: '/admin/profile/access/merchant',
        UPDATE_AGENT_ACCESS: '/admin/profile/access/merchant/agent/{id}/update'
    },
    
    // Utilities
    UTIL: {
        BANKS: '/banks',
        WITHDRAW_BANKS: '/withdraw/banks',
        TIMEZONES: '/timezones',
        LANGUAGE: '/language/{lang}',
        BLOCK_MESSAGES: '/admin/messages/blocks'
    }
};

/**
 * Utility Functions
 */
const Utils = {
    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'TRY') {
        try {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(Number(amount || 0));
        } catch (e) {
            return `${Number(amount || 0).toFixed(2)} ${currency}`;
        }
    },
    
    /**
     * Format number
     */
    formatNumber(number) {
        return new Intl.NumberFormat('tr-TR').format(Number(number || 0));
    },
    
    /**
     * Format date
     */
    formatDate(dateString, format = CONFIG.DISPLAY_DATE_FORMAT) {
        if (!dateString) return '-';
        // Use dayjs or native Date
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        if (format === CONFIG.DISPLAY_DATE_FORMAT) {
            return `${day}/${month}/${year}`;
        } else if (format === CONFIG.DISPLAY_DATETIME_FORMAT) {
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
        return dateString;
    },
    
    /**
     * Calculate time difference
     */
    formatTimeDiff(dateString) {
        if (!dateString) return { hours: 0, minutes: 0, seconds: 0 };
        
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffSec = Math.floor(diffMs / 1000);
        
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;
        
        return { hours, minutes, seconds };
    },
    
    /**
     * Format time display
     */
    formatTimeDisplay(timeDiff) {
        const { hours, minutes, seconds } = timeDiff;
        if (hours > 0) return `${hours} Saat ${minutes} Dakika ${seconds} Saniye`;
        if (minutes > 0) return `${minutes} Dakika ${seconds} Saniye`;
        return `${seconds} Saniye`;
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Turkish to English character conversion
     */
    trToEn(str) {
        const map = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        };
        return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => map[match] || match);
    },
    
    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    /**
     * Safe JSON parse
     */
    safeJsonParse(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    },
    
    /**
     * Check if phone field
     */
    isPhoneField(label, value) {
        const labelStr = String(label || '').toLowerCase();
        const valueStr = String(value || '').toLowerCase();
        return labelStr.includes('telefon') || valueStr.includes('telefon');
    },
    
    /**
     * Get status color
     */
    getStatusColor(status) {
        const colors = {
            [CONFIG.STATUS.WAITING]: '#ffa500',
            [CONFIG.STATUS.PROCESSING]: '#1a73e8',
            [CONFIG.STATUS.COMPLETED]: '#76d90c',
            [CONFIG.STATUS.DECLINED]: '#cc0808'
        };
        return colors[status] || '#5f6368';
    },
    
    /**
     * Get status label
     */
    getStatusLabel(status) {
        const labels = {
            [CONFIG.STATUS.WAITING]: 'Bekleyen',
            [CONFIG.STATUS.PROCESSING]: 'İşlemde',
            [CONFIG.STATUS.COMPLETED]: 'Tamamlandı',
            [CONFIG.STATUS.DECLINED]: 'Reddedildi'
        };
        return labels[status] || status;
    },
    
    /**
     * Check user permission
     */
    hasPermission(user, permission) {
        if (!user) return false;
        if (user.role?.value === CONFIG.ROLES.ROOT) return true;
        return user.permissions?.[permission] === true;
    },
    
    /**
     * Check user role
     */
    hasRole(user, roles) {
        if (!user) return false;
        if (!Array.isArray(roles)) roles = [roles];
        return roles.includes(user.role?.value);
    }
};

// Export to global scope
window.CONFIG = CONFIG;
window.ENDPOINTS = ENDPOINTS;
window.Utils = Utils;
