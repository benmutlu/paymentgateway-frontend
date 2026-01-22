/**
 * Notification Manager
 * Handles toast notifications, audio alerts, and push notifications
 */

class NotificationManager {
    constructor() {
        this.audioContext = null;
        this.audioBuffer = null;
        this.audioEnabled = StorageManager.get(CONFIG.STORAGE_KEY_AUDIO, CONFIG.AUDIO.ENABLED_BY_DEFAULT);
        this.toastContainer = null;
        this.initToastContainer();
    }
    
    /**
     * Initialize toast container
     */
    initToastContainer() {
        if (document.getElementById('toast-container')) return;
        
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        this.toastContainer = container;
    }
    
    /**
     * Show toast notification
     */
    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    /**
     * Get toast icon based on type
     */
    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * Show success toast
     */
    success(message, duration) {
        this.toast(message, 'success', duration);
    }
    
    /**
     * Show error toast
     */
    error(message, duration) {
        this.toast(message, 'error', duration);
    }
    
    /**
     * Show warning toast
     */
    warning(message, duration) {
        this.toast(message, 'warning', duration);
    }
    
    /**
     * Show info toast
     */
    info(message, duration) {
        this.toast(message, 'info', duration);
    }
    
    /**
     * Initialize audio
     */
    async initAudio() {
        if (this.audioContext) return;
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load notification sound (simple beep)
            await this.createBeepSound();
            
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    }
    
    /**
     * Create simple beep sound
     */
    async createBeepSound() {
        if (!this.audioContext) return;
        
        // Create a simple beep sound
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.2; // 200ms
        const frequency = 800; // 800Hz
        
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5);
        }
        
        this.audioBuffer = buffer;
    }
    
    /**
     * Play audio notification
     */
    async playAudio() {
        if (!this.audioEnabled) return;
        
        try {
            // Initialize audio if not already done
            if (!this.audioContext) {
                await this.initAudio();
            }
            
            if (!this.audioBuffer) return;
            
            // Create source
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            
            // Create gain node for volume control
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = CONFIG.AUDIO.VOLUME;
            
            // Connect nodes
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Play
            source.start(0);
            
        } catch (error) {
            console.error('Audio play error:', error);
        }
    }
    
    /**
     * Enable audio notifications
     */
    enableAudio() {
        this.audioEnabled = true;
        StorageManager.set(CONFIG.STORAGE_KEY_AUDIO, true);
    }
    
    /**
     * Disable audio notifications
     */
    disableAudio() {
        this.audioEnabled = false;
        StorageManager.set(CONFIG.STORAGE_KEY_AUDIO, false);
    }
    
    /**
     * Toggle audio notifications
     */
    toggleAudio() {
        if (this.audioEnabled) {
            this.disableAudio();
        } else {
            this.enableAudio();
        }
        return this.audioEnabled;
    }
    
    /**
     * Check if audio is enabled
     */
    isAudioEnabled() {
        return this.audioEnabled;
    }
    
    /**
     * Show banner notification
     */
    showBanner(message, type = 'info', duration = 5000) {
        const existingBanner = document.getElementById('notification-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        const banner = document.createElement('div');
        banner.id = 'notification-banner';
        banner.className = `notification-banner notification-banner-${type}`;
        banner.innerHTML = `
            <div class="notification-banner-content">
                <div class="notification-banner-icon">${this.getToastIcon(type)}</div>
                <div class="notification-banner-message">${message}</div>
                <button class="notification-banner-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                banner.classList.add('notification-banner-fade-out');
                setTimeout(() => banner.remove(), 300);
            }, duration);
        }
    }
    
    /**
     * Hide banner notification
     */
    hideBanner() {
        const banner = document.getElementById('notification-banner');
        if (banner) {
            banner.remove();
        }
    }
    
    /**
     * Request push notification permission
     */
    async requestPushPermission() {
        if (!('Notification' in window)) {
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }
    
    /**
     * Show push notification
     */
    async showPushNotification(title, options = {}) {
        if (!('Notification' in window)) {
            return;
        }
        
        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/badge-72.png',
                ...options
            });
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification(title, options);
            }
        }
    }
}

// Create global instance
window.Notifications = new NotificationManager();
