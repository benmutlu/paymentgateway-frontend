/**
 * Main Application Controller
 * Initializes and manages the application lifecycle
 */

class Application {
    constructor() {
        this.initialized = false;
        this.theme = 'light';
    }
    
    /**
     * Initialize application
     */
    async init() {
        if (this.initialized) return;
        
        console.log('Initializing Payment Gateway Application...');
        
        // Initialize auth from storage
        Auth.init();
        
        // Load theme
        this.loadTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize socket if authenticated
        if (Auth.isAuthenticated()) {
            this.initializeSocket();
        }
        
        // Mark as initialized
        this.initialized = true;
        
        console.log('Application initialized successfully');
    }
    
    /**
     * Load theme from storage
     */
    loadTheme() {
        const savedTheme = StorageManager.get(CONFIG.STORAGE_KEY_THEME, 'light');
        this.setTheme(savedTheme);
    }
    
    /**
     * Set theme
     */
    setTheme(theme) {
        this.theme = theme;
        document.body.setAttribute('data-theme', theme);
        StorageManager.set(CONFIG.STORAGE_KEY_THEME, theme);
    }
    
    /**
     * Toggle theme
     */
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Auth events
        window.addEventListener('auth:login', (e) => {
            console.log('User logged in:', e.detail);
            this.initializeSocket();
        });
        
        window.addEventListener('auth:logout', () => {
            console.log('User logged out');
            this.cleanupSocket();
        });
        
        // Socket events
        window.addEventListener('socket:connected', () => {
            console.log('Socket connected');
            Notifications.success('Bağlantı kuruldu');
        });
        
        window.addEventListener('socket:disconnected', () => {
            console.log('Socket disconnected');
            Notifications.warning('Bağlantı kesildi');
        });
        
        window.addEventListener('socket:error', (e) => {
            console.error('Socket error:', e.detail);
        });
        
        // Transaction events
        window.addEventListener('transaction:update', (e) => {
            console.log('Transaction update:', e.detail);
            this.handleTransactionUpdate(e.detail);
        });
        
        window.addEventListener('transaction:status_update', (e) => {
            console.log('Transaction status update:', e.detail);
            this.handleTransactionStatusUpdate(e.detail);
        });
        
        // Online/Offline events
        window.addEventListener('online', () => {
            Notifications.success('İnternet bağlantısı geri geldi');
            if (Auth.isAuthenticated()) {
                this.initializeSocket();
            }
        });
        
        window.addEventListener('offline', () => {
            Notifications.warning('İnternet bağlantısı kesildi');
        });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && Auth.isAuthenticated()) {
                // Reconnect socket if needed
                if (!SocketManager.isConnected()) {
                    this.initializeSocket();
                }
            }
        });
    }
    
    /**
     * Initialize Socket.io connection
     */
    initializeSocket() {
        try {
            SocketManager.connect();
        } catch (error) {
            console.error('Socket initialization error:', error);
            // Fallback to polling
            console.log('Falling back to polling...');
        }
    }
    
    /**
     * Cleanup Socket.io connection
     */
    cleanupSocket() {
        SocketManager.disconnect();
        PollingManager.stopAll();
    }
    
    /**
     * Handle transaction update
     */
    handleTransactionUpdate(data) {
        // Play audio notification
        Notifications.playAudio();
        
        // Show toast notification
        Notifications.info('Yeni işlem geldi');
        
        // Dispatch custom event for screens to handle
        window.dispatchEvent(new CustomEvent('app:transaction_update', { detail: data }));
    }
    
    /**
     * Handle transaction status update
     */
    handleTransactionStatusUpdate(data) {
        // Dispatch custom event for screens to handle
        window.dispatchEvent(new CustomEvent('app:transaction_status_update', { detail: data }));
    }
    
    /**
     * Get current user
     */
    getCurrentUser() {
        return Auth.getUser();
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return Auth.isAuthenticated();
    }
    
    /**
     * Logout
     */
    logout() {
        Auth.logout();
    }
}

// Create global instance
window.App = new Application();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
