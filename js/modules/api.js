/**
 * API Manager
 * Handles all HTTP requests to the backend API
 */

class APIManager {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.pendingRequests = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
    }
    
    /**
     * Get authentication token
     */
    getToken() {
        const auth = StorageManager.get(CONFIG.STORAGE_KEY_AUTH);
        return auth?.token || null;
    }
    
    /**
     * Build full URL with path parameters
     */
    buildURL(endpoint, params = {}) {
        let url = endpoint;
        
        // Replace path parameters
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
        
        return this.baseURL + url;
    }
    
    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const {
            method = 'POST',
            body = {},
            params = {},
            headers = {},
            timeout = CONFIG.REQUEST_TIMEOUT,
            retry = true,
            signal
        } = options;
        
        const url = this.buildURL(endpoint, params);
        const token = this.getToken();
        
        // Build headers
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
        
        if (token) {
            requestHeaders['X-Authorization'] = token;
        }
        
        // Build request config
        const requestConfig = {
            method,
            headers: requestHeaders,
            signal
        };
        
        if (method !== 'GET' && Object.keys(body).length > 0) {
            requestConfig.body = JSON.stringify(body);
        }
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        // Merge signals if provided
        if (signal) {
            signal.addEventListener('abort', () => controller.abort());
        }
        requestConfig.signal = controller.signal;
        
        try {
            const response = await fetch(url, requestConfig);
            clearTimeout(timeoutId);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                
                // Check for authentication errors
                if (data.status === 'error' && data.code === 'UNAUTHORIZED') {
                    this.handleUnauthorized();
                    throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                }
                
                return data;
            } else {
                // Non-JSON response
                const text = await response.text();
                return { status: 'error', message: 'Invalid response format', data: text };
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            // Handle abort
            if (error.name === 'AbortError' || error.code === 'ABORT_ERR') {
                throw new Error('İstek iptal edildi');
            }
            
            // Handle network errors with retry
            if (retry && this.shouldRetry(error)) {
                return this.retryRequest(endpoint, options);
            }
            
            throw error;
        }
    }
    
    /**
     * Check if request should be retried
     */
    shouldRetry(error) {
        return error.message.includes('fetch') || 
               error.message.includes('network') ||
               error.message.includes('timeout');
    }
    
    /**
     * Retry failed request
     */
    async retryRequest(endpoint, options, attempt = 1) {
        if (attempt >= CONFIG.MAX_RETRIES) {
            throw new Error('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
        
        try {
            return await this.request(endpoint, { ...options, retry: false });
        } catch (error) {
            return this.retryRequest(endpoint, options, attempt + 1);
        }
    }
    
    /**
     * Handle unauthorized error
     */
    handleUnauthorized() {
        // Clear auth data
        StorageManager.remove(CONFIG.STORAGE_KEY_AUTH);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Redirect to login
        if (window.Router) {
            window.Router.navigate(CONFIG.ROUTES.LOGIN);
        }
    }
    
    /**
     * Cancel pending request
     */
    cancelRequest(requestId) {
        const controller = this.pendingRequests.get(requestId);
        if (controller) {
            controller.abort();
            this.pendingRequests.delete(requestId);
        }
    }
    
    /**
     * Cancel all pending requests
     */
    cancelAllRequests() {
        this.pendingRequests.forEach(controller => controller.abort());
        this.pendingRequests.clear();
    }
    
    /**
     * POST request
     */
    async post(endpoint, body = {}, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body,
            ...options
        });
    }
    
    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options
        });
    }
    
    /**
     * PUT request
     */
    async put(endpoint, body = {}, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body,
            ...options
        });
    }
    
    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options
        });
    }
}

/**
 * API Service
 * High-level API methods for specific endpoints
 */
class APIService {
    constructor() {
        this.api = new APIManager();
    }
    
    // ============ Authentication ============
    
    async login(username, password) {
        return this.api.post(ENDPOINTS.AUTH.LOGIN, { username, password });
    }
    
    // ============ Payments ============
    
    async getWaitingTransactions(signal) {
        return this.api.post(ENDPOINTS.PAYMENT.WAITING_ROOM, {}, { signal });
    }
    
    async getProcessingTransactions(signal) {
        return this.api.post(ENDPOINTS.PAYMENT.PROCESSING_ROOM, {}, { signal });
    }
    
    async getTransactionDetails(transactionId) {
        return this.api.post(ENDPOINTS.PAYMENT.VIEW, {}, {
            params: { id: transactionId }
        });
    }
    
    async updateTransactionStatus(transactionId, status) {
        return this.api.post(ENDPOINTS.PAYMENT.UPDATE_STATUS, { status }, {
            params: { id: transactionId }
        });
    }
    
    async updateTransactionPrice(transactionId, price) {
        return this.api.post(ENDPOINTS.PAYMENT.UPDATE_PRICE, { price }, {
            params: { id: transactionId }
        });
    }
    
    async getAgentDashboard(signal) {
        return this.api.post(ENDPOINTS.PAYMENT.AGENT_DASHBOARD, {}, { signal });
    }
    
    async searchTransactionHistory(filters) {
        return this.api.post(ENDPOINTS.PAYMENT.HISTORY_SEARCH, filters);
    }
    
    async getTransactionTimelapse(transactionId) {
        return this.api.post(ENDPOINTS.PAYMENT.TIMELAPSE, { transaction_id: transactionId });
    }
    
    async getDashboardCharts() {
        return this.api.post(ENDPOINTS.PAYMENT.DASHBOARD_CHARTS, {});
    }
    
    async getHistoryCharts(start, finish) {
        return this.api.post(ENDPOINTS.PAYMENT.HISTORY_CHARTS, { start, finish });
    }
    
    // ============ Reports ============
    
    async getDailyReport(date) {
        return this.api.post(ENDPOINTS.REPORT.DAILY, { date });
    }
    
    async getAgentReport(start, finish, agentId = null) {
        const body = { start, finish };
        if (agentId) body.agent_id = agentId;
        return this.api.post(ENDPOINTS.REPORT.AGENT, body);
    }
    
    async getSystemReport(start, finish) {
        return this.api.post(ENDPOINTS.REPORT.SYSTEM, { start, finish });
    }
    
    async getBanksReport(start, finish) {
        return this.api.post(ENDPOINTS.REPORT.BANKS, { start, finish });
    }
    
    async getGeneralReport(start, finish) {
        return this.api.post(ENDPOINTS.REPORT.GENERAL, { start, finish });
    }
    
    async getDailySystemReport(date) {
        return this.api.post(ENDPOINTS.REPORT.DAILY_SYSTEM, { date });
    }
    
    // ============ Team Management ============
    
    async getTeams() {
        return this.api.post(ENDPOINTS.TEAM.LIST, {});
    }
    
    async createTeamMember(data) {
        return this.api.post(ENDPOINTS.TEAM.CREATE, data);
    }
    
    async getTeamMember(teamId) {
        return this.api.post(ENDPOINTS.TEAM.VIEW, {}, {
            params: { id: teamId }
        });
    }
    
    async updateTeamMember(teamId, data) {
        return this.api.post(ENDPOINTS.TEAM.UPDATE, data, {
            params: { id: teamId }
        });
    }
    
    async updateTeamPassword(teamId, password) {
        return this.api.post(ENDPOINTS.TEAM.UPDATE_PASSWORD, { password }, {
            params: { id: teamId }
        });
    }
    
    async getTeamHistory(teamId, filters) {
        return this.api.post(ENDPOINTS.TEAM.HISTORY, filters, {
            params: { id: teamId }
        });
    }
    
    // ============ Transfer Methods ============
    
    async getTransferMethods() {
        return this.api.post(ENDPOINTS.TRANSFER.LIST, {});
    }
    
    async createTransferMethod(data) {
        return this.api.post(ENDPOINTS.TRANSFER.CREATE, data);
    }
    
    async getTransferMethod(methodId) {
        return this.api.post(ENDPOINTS.TRANSFER.VIEW, {}, {
            params: { id: methodId }
        });
    }
    
    async updateTransferMethod(methodId, data) {
        return this.api.post(ENDPOINTS.TRANSFER.UPDATE, data, {
            params: { id: methodId }
        });
    }
    
    // ============ Havale Methods ============
    
    async getHavaleMethods() {
        return this.api.post(ENDPOINTS.HAVALE.LIST, {});
    }
    
    async createHavaleMethod(data) {
        return this.api.post(ENDPOINTS.HAVALE.CREATE, data);
    }
    
    async getHavaleMethod(methodId) {
        return this.api.post(ENDPOINTS.HAVALE.VIEW, {}, {
            params: { id: methodId }
        });
    }
    
    async updateHavaleMethod(methodId, data) {
        return this.api.post(ENDPOINTS.HAVALE.UPDATE, data, {
            params: { id: methodId }
        });
    }
    
    async getHavalePrefix() {
        return this.api.post(ENDPOINTS.HAVALE.PREFIX, {});
    }
    
    // ============ Merchant Management ============
    
    async getMerchants() {
        return this.api.post(ENDPOINTS.MERCHANT.LIST, {});
    }
    
    async createMerchant(data) {
        return this.api.post(ENDPOINTS.MERCHANT.CREATE, data);
    }
    
    async getMerchant(merchantId) {
        return this.api.post(ENDPOINTS.MERCHANT.VIEW, {}, {
            params: { id: merchantId }
        });
    }
    
    async updateMerchant(merchantId, data) {
        return this.api.post(ENDPOINTS.MERCHANT.UPDATE, data, {
            params: { id: merchantId }
        });
    }
    
    async getCurrentMerchant() {
        return this.api.post(ENDPOINTS.MERCHANT.CURRENT_VIEW, {});
    }
    
    async getPaymentMethods() {
        return this.api.post(ENDPOINTS.MERCHANT.PAYMENT_METHOD, {});
    }
    
    async getPaymentStatus() {
        return this.api.post(ENDPOINTS.MERCHANT.PAYMENT_STATUS, {});
    }
    
    async getAgents() {
        return this.api.post(ENDPOINTS.MERCHANT.AGENTS, {});
    }
    
    async searchCallbackHistory(filters) {
        return this.api.post(ENDPOINTS.MERCHANT.CALLBACK_HISTORY, filters);
    }
    
    // ============ Profile ============
    
    async getMyProfile() {
        return this.api.post(ENDPOINTS.PROFILE.MY_PROFILE, {});
    }
    
    async changePassword(oldPassword, newPassword) {
        return this.api.post(ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
            old_password: oldPassword,
            new_password: newPassword
        });
    }
    
    async change2FA(enabled, code = null) {
        const body = { enabled };
        if (code) body.code = code;
        return this.api.post(ENDPOINTS.PROFILE.CHANGE_2FA, body);
    }
    
    async updateNotificationSettings(settings) {
        return this.api.post(ENDPOINTS.PROFILE.UPDATE_NOTIFICATION, settings);
    }
    
    // ============ Utilities ============
    
    async getBanks() {
        return this.api.post(ENDPOINTS.UTIL.BANKS, {});
    }
    
    async getWithdrawBanks() {
        return this.api.post(ENDPOINTS.UTIL.WITHDRAW_BANKS, {});
    }
    
    async getTimezones() {
        return this.api.post(ENDPOINTS.UTIL.TIMEZONES, {});
    }
}

// Create global instance
window.API = new APIService();
