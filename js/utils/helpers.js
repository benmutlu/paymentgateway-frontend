/**
 * Helper Utilities
 * Common helper functions
 */

const Utils = {
    /**
     * Generate unique ID
     */
    generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Format date
     */
    formatDate(date, format = 'DD.MM.YYYY HH:mm') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const pad = (n) => String(n).padStart(2, '0');
        
        return format
            .replace('YYYY', d.getFullYear())
            .replace('MM', pad(d.getMonth() + 1))
            .replace('DD', pad(d.getDate()))
            .replace('HH', pad(d.getHours()))
            .replace('mm', pad(d.getMinutes()))
            .replace('ss', pad(d.getSeconds()));
    },
    
    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'TRY') {
        if (amount === null || amount === undefined) return '';
        
        const formatted = Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        if (currency === 'TRY') {
            return `₺${formatted}`;
        }
        
        return `${formatted} ${currency}`;
    },
    
    /**
     * Format number
     */
    formatNumber(num, decimals = 0) {
        if (num === null || num === undefined) return '';
        return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
     * Sleep/delay function
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export to global
window.Utils = Utils;
