/**
 * Authentication Manager
 * Handles user authentication and authorization
 */

class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
        this.initialized = false;
        
        // Listen to storage changes for multi-tab sync
        StorageManager.listen(CONFIG.STORAGE_KEY_AUTH, (newValue) => {
            if (!newValue) {
                this.handleLogout();
            }
        });
        
        // Listen to custom logout event
        window.addEventListener('auth:logout', () => {
            this.handleLogout();
        });
    }
    
    /**
     * Initialize auth from storage
     */
    init() {
        if (this.initialized) return;
        
        const authData = StorageManager.get(CONFIG.STORAGE_KEY_AUTH);
        if (authData && authData.token) {
            this.user = authData.user;
            this.token = authData.token;
        }
        
        this.initialized = true;
    }
    
    /**
     * Login
     */
    async login(username, password) {
        try {
            const response = await API.login(username, password);
            
            if (response.status !== 'success') {
                throw new Error(response.message || 'Giriş başarısız');
            }
            
            // Store auth data
            const authData = {
                user: response.data,
                token: response.data.token
            };
            
            StorageManager.set(CONFIG.STORAGE_KEY_AUTH, authData);
            
            this.user = response.data;
            this.token = response.data.token;
            
            // Dispatch login event
            window.dispatchEvent(new CustomEvent('auth:login', { detail: this.user }));
            
            return { success: true, user: this.user };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Logout
     */
    logout() {
        StorageManager.remove(CONFIG.STORAGE_KEY_AUTH);
        this.user = null;
        this.token = null;
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Navigate to login
        if (window.Router) {
            window.Router.navigate(CONFIG.ROUTES.LOGIN);
        }
    }
    
    /**
     * Handle logout (from storage change or event)
     */
    handleLogout() {
        this.user = null;
        this.token = null;
        
        // Navigate to login if not already there
        if (window.location.hash !== '#/login' && window.Router) {
            window.Router.navigate(CONFIG.ROUTES.LOGIN);
        }
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.token !== null && this.user !== null;
    }
    
    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }
    
    /**
     * Get current token
     */
    getToken() {
        return this.token;
    }
    
    /**
     * Check if user has specific role
     */
    hasRole(roles) {
        if (!this.user) return false;
        if (!Array.isArray(roles)) roles = [roles];
        return roles.includes(this.user.role?.value);
    }
    
    /**
     * Check if user has specific permission
     */
    hasPermission(permission) {
        if (!this.user) return false;
        if (this.user.role?.value === CONFIG.ROLES.ROOT) return true;
        return this.user.permissions?.[permission] === true;
    }
    
    /**
     * Check if user can access route
     */
    canAccessRoute(route) {
        if (!this.isAuthenticated()) return false;
        
        // Public routes
        if (route === CONFIG.ROUTES.HOME || route === CONFIG.ROUTES.PAYMENTS) {
            return true;
        }
        
        // Finance route - check permission
        if (route === CONFIG.ROUTES.FINANCE) {
            return this.hasPermission('view_reports');
        }
        
        // Admin route - check role
        if (route === CONFIG.ROUTES.ADMIN) {
            return this.hasRole([CONFIG.ROLES.ROOT, CONFIG.ROLES.MERCHANT, CONFIG.ROLES.ADMIN]);
        }
        
        return true;
    }
    
    /**
     * Get user display name
     */
    getUserDisplayName() {
        if (!this.user) return '';
        return `${this.user.name || ''} ${this.user.surname || ''}`.trim() || this.user.username;
    }
    
    /**
     * Get user role label
     */
    getUserRoleLabel() {
        if (!this.user) return '';
        return this.user.role?.label || this.user.role?.value || '';
    }
    
    /**
     * Refresh user data
     */
    async refreshUser() {
        try {
            const response = await API.getMyProfile();
            
            if (response.status === 'success') {
                this.user = { ...this.user, ...response.data };
                
                // Update storage
                const authData = StorageManager.get(CONFIG.STORAGE_KEY_AUTH);
                if (authData) {
                    authData.user = this.user;
                    StorageManager.set(CONFIG.STORAGE_KEY_AUTH, authData);
                }
                
                return { success: true, user: this.user };
            }
            
            return { success: false };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create global instance
window.Auth = new AuthManager();
