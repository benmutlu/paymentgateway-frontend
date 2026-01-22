/**
 * Login Screen
 * Handles user authentication
 */

const LoginScreen = {
    /**
     * Render login screen
     */
    async render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <h1>Payment Gateway</h1>
                        <p>Agent Dashboard</p>
                    </div>
                    
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label class="form-label" for="username">Kullanıcı Adı</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                class="form-input" 
                                required 
                                autocomplete="username"
                                placeholder="Kullanıcı adınızı girin"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="password">Şifre</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input" 
                                required 
                                autocomplete="current-password"
                                placeholder="Şifrenizi girin"
                            >
                        </div>
                        
                        <div id="login-error" class="login-error" style="display: none;"></div>
                        
                        <button type="submit" class="btn btn-primary btn-block" id="login-btn">
                            Giriş Yap
                        </button>
                    </form>
                    
                    <div class="login-footer">
                        <p>© 2026 Payment Gateway. All rights reserved.</p>
                    </div>
                </div>
            </div>
            
            <style>
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: var(--spacing-md);
                }
                
                .login-box {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: var(--spacing-xl);
                    width: 100%;
                    max-width: 400px;
                    box-shadow: var(--shadow-lg);
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                }
                
                .login-header h1 {
                    color: var(--color-gray-900);
                    margin-bottom: var(--spacing-sm);
                }
                
                .login-header p {
                    color: var(--color-gray-600);
                    margin: 0;
                }
                
                .login-form {
                    margin-bottom: var(--spacing-lg);
                }
                
                .login-error {
                    background: #fee;
                    color: var(--color-danger);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--spacing-md);
                    font-size: 0.875rem;
                }
                
                .btn-block {
                    width: 100%;
                }
                
                .login-footer {
                    text-align: center;
                    color: var(--color-gray-600);
                    font-size: 0.875rem;
                }
                
                .login-footer p {
                    margin: 0;
                }
            </style>
        `;
        
        this.setupEventListeners();
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            if (!username || !password) {
                this.showError('Lütfen tüm alanları doldurun');
                return;
            }
            
            // Disable form
            loginBtn.disabled = true;
            loginBtn.textContent = 'Giriş yapılıyor...';
            errorDiv.style.display = 'none';
            
            // Attempt login
            const result = await Auth.login(username, password);
            
            if (result.success) {
                // Redirect to home
                Router.navigate('/app');
            } else {
                // Show error
                this.showError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Giriş Yap';
            }
        });
        
        // Focus username input
        usernameInput.focus();
    },
    
    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
};

// Export to global Screens object
if (!window.Screens) window.Screens = {};
window.Screens.Login = LoginScreen;
