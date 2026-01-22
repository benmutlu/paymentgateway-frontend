/**
 * Storage Manager
 * Handles localStorage operations with multi-tab synchronization
 */

class StorageManager {
    constructor() {
        this.listeners = new Map();
        this.setupStorageListener();
    }
    
    /**
     * Setup storage event listener for multi-tab sync
     */
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key && this.listeners.has(e.key)) {
                const callbacks = this.listeners.get(e.key);
                const newValue = this.safeJSONParse(e.newValue);
                callbacks.forEach(callback => callback(newValue, e.oldValue));
            }
        });
    }
    
    /**
     * Safe JSON parse
     */
    safeJSONParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }
    
    /**
     * Get item from localStorage
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return this.safeJSONParse(item);
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }
    
    /**
     * Set item in localStorage
     */
    set(key, value) {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, stringValue);
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }
    
    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
    
    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
    
    /**
     * Check if key exists
     */
    has(key) {
        return localStorage.getItem(key) !== null;
    }
    
    /**
     * Get all keys
     */
    keys() {
        return Object.keys(localStorage);
    }
    
    /**
     * Listen to storage changes
     */
    listen(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Return unlisten function
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    /**
     * Get and set with expiry
     */
    setWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        this.set(key, item);
    }
    
    getWithExpiry(key) {
        const itemStr = this.get(key);
        if (!itemStr) return null;
        
        const item = typeof itemStr === 'string' ? this.safeJSONParse(itemStr) : itemStr;
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            this.remove(key);
            return null;
        }
        
        return item.value;
    }
}

// Create global instance
window.StorageManager = new StorageManager();
