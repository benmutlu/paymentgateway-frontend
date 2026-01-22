/**
 * Socket Manager
 * Handles Socket.io real-time communication
 */

class SocketManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }
    
    /**
     * Connect to Socket.io server
     */
    connect() {
        if (this.socket && this.connected) {
            return;
        }
        
        const token = Auth.getToken();
        if (!token) {
            console.warn('Cannot connect socket: No auth token');
            return;
        }
        
        try {
            // Initialize Socket.io connection
            this.socket = io(CONFIG.SOCKET_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay
            });
            
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Socket connection error:', error);
        }
    }
    
    /**
     * Setup socket event listeners
     */
    setupEventListeners() {
        if (!this.socket) return;
        
        // Connection events
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.emit('socket:connected');
        });
        
        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.connected = false;
            this.emit('socket:disconnected', reason);
        });
        
        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.reconnectAttempts++;
            this.emit('socket:error', error);
        });
        
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
            this.emit('socket:reconnected', attemptNumber);
        });
        
        this.socket.on('reconnect_failed', () => {
            console.error('Socket reconnection failed');
            this.emit('socket:reconnect_failed');
        });
        
        // Application events
        this.socket.on('merchant:transaction:update', (data) => {
            this.emit('transaction:update', data);
        });
        
        this.socket.on('merchant:transaction:status:update', (data) => {
            this.emit('transaction:status_update', data);
        });
        
        this.socket.on('live:map', (data) => {
            this.emit('live:map', data);
        });
        
        this.socket.on('live:transactions', (data) => {
            this.emit('live:transactions', data);
        });
    }
    
    /**
     * Disconnect from Socket.io server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }
    
    /**
     * Check if connected
     */
    isConnected() {
        return this.connected;
    }
    
    /**
     * Emit event to listeners
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Socket listener error:', error);
                }
            });
        }
        
        // Also dispatch as window event
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
    
    /**
     * Add event listener
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        
        // Return unlisten function
        return () => this.off(event, callback);
    }
    
    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    /**
     * Send message to server
     */
    send(event, data) {
        if (this.socket && this.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Cannot send message: Socket not connected');
        }
    }
}

/**
 * Polling Fallback Manager
 * Falls back to polling if Socket.io is not available
 */
class PollingManager {
    constructor() {
        this.intervals = new Map();
        this.enabled = false;
    }
    
    /**
     * Start polling
     */
    start(key, callback, interval) {
        if (this.intervals.has(key)) {
            this.stop(key);
        }
        
        // Call immediately
        callback();
        
        // Then set interval
        const intervalId = setInterval(callback, interval);
        this.intervals.set(key, intervalId);
        this.enabled = true;
    }
    
    /**
     * Stop polling
     */
    stop(key) {
        if (this.intervals.has(key)) {
            clearInterval(this.intervals.get(key));
            this.intervals.delete(key);
        }
        
        if (this.intervals.size === 0) {
            this.enabled = false;
        }
    }
    
    /**
     * Stop all polling
     */
    stopAll() {
        this.intervals.forEach(intervalId => clearInterval(intervalId));
        this.intervals.clear();
        this.enabled = false;
    }
    
    /**
     * Check if polling is enabled
     */
    isEnabled() {
        return this.enabled;
    }
}

// Create global instances
window.SocketManager = new SocketManager();
window.PollingManager = new PollingManager();
