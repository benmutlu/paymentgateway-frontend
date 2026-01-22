/**
 * Client-Side Router
 * Handles navigation without page reloads
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeHooks = [];
        this.afterHooks = [];
        
        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }
    
    /**
     * Register a route
     */
    register(path, handler, options = {}) {
        this.routes.set(path, {
            handler,
            requiresAuth: options.requiresAuth !== false,
            roles: options.roles || null,
            title: options.title || 'Payment Gateway'
        });
    }
    
    /**
     * Add before navigation hook
     */
    beforeEach(hook) {
        this.beforeHooks.push(hook);
    }
    
    /**
     * Add after navigation hook
     */
    afterEach(hook) {
        this.afterHooks.push(hook);
    }
    
    /**
     * Navigate to a route
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
    }
    
    /**
     * Go back
     */
    back() {
        window.history.back();
    }
    
    /**
     * Handle route change
     */
    async handleRouteChange() {
        let hash = window.location.hash.slice(1);
        
        // If no hash, redirect to login
        if (!hash) {
            window.location.hash = '#/login';
            return;
        }
        
        const route = this.matchRoute(hash);
        
        if (!route) {
            this.handle404();
            return;
        }
        
        // Run before hooks
        for (const hook of this.beforeHooks) {
            const result = await hook(route, this.currentRoute);
            if (result === false) {
                return; // Navigation cancelled
            }
        }
        
        // Check authentication
        if (route.config.requiresAuth && !Auth.isAuthenticated()) {
            this.navigate('/login', true);
            return;
        }
        
        // Check authorization
        if (route.config.roles && !Auth.hasRole(route.config.roles)) {
            Notifications.error('Bu sayfaya erişim yetkiniz yok');
            this.navigate('/app', true);
            return;
        }
        
        // Update page title
        document.title = route.config.title;
        
        // Store current route
        this.currentRoute = route;
        
        // Execute route handler
        try {
            await route.config.handler(route.params);
        } catch (error) {
            console.error('Route handler error:', error);
            Notifications.error('Sayfa yüklenirken bir hata oluştu');
        }
        
        // Run after hooks
        for (const hook of this.afterHooks) {
            await hook(route);
        }
    }
    
    /**
     * Match route from hash
     */
    matchRoute(hash) {
        // Try exact match first
        if (this.routes.has(hash)) {
            return {
                path: hash,
                params: {},
                config: this.routes.get(hash)
            };
        }
        
        // Try pattern matching
        for (const [pattern, config] of this.routes.entries()) {
            const params = this.matchPattern(pattern, hash);
            if (params !== null) {
                return {
                    path: hash,
                    params,
                    config
                };
            }
        }
        
        return null;
    }
    
    /**
     * Match pattern with parameters
     */
    matchPattern(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        
        if (patternParts.length !== pathParts.length) {
            return null;
        }
        
        const params = {};
        
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];
            
            if (patternPart.startsWith(':')) {
                // Parameter
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // No match
                return null;
            }
        }
        
        return params;
    }
    
    /**
     * Handle 404
     */
    handle404() {
        document.title = '404 - Sayfa Bulunamadı';
        
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-page">
                    <h1>404</h1>
                    <p>Aradığınız sayfa bulunamadı</p>
                    <button onclick="Router.navigate('/app')" class="btn btn-primary">
                        Ana Sayfaya Dön
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Get current path
     */
    getCurrentPath() {
        return window.location.hash.slice(1) || '/login';
    }
}

// Create global instance
window.Router = new Router();

// Register routes
Router.register('/login', async () => {
    console.log('Route /login triggered, Screens.Login:', window.Screens.Login);
    await Screens.Login.render();
}, {
    requiresAuth: false,
    title: 'Giriş - Payment Gateway'
});

Router.register('/app', async () => {
    await Screens.Home.render();
}, {
    title: 'Ana Sayfa - Payment Gateway'
});

Router.register('/app/payments', async () => {
    await Screens.Payments.render();
}, {
    title: 'İşlemler - Payment Gateway'
});

Router.register('/app/finance', async () => {
    await Screens.Finance.render();
}, {
    title: 'Finans - Payment Gateway'
});

Router.register('/app/admin', async () => {
    await Screens.Admin.render();
}, {
    roles: [CONFIG.ROLES.ROOT, CONFIG.ROLES.MERCHANT, CONFIG.ROLES.ADMIN],
    title: 'Yönetim - Payment Gateway'
});

Router.register('/app/profile', async () => {
    await Screens.Profile.render();
}, {
    title: 'Profil - Payment Gateway'
});

// Navigation guards
Router.beforeEach(async (to, from) => {
    // Show loading
    UI.showLoading();
    return true;
});

Router.afterEach(async (to) => {
    // Hide loading
    UI.hideLoading();
    
    // Update active nav item
    UI.updateActiveNav(to.path);
});
