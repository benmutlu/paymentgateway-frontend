/**
 * Admin Screen
 * Administration panel
 */

const AdminScreen = {
    /**
     * Render admin screen
     */
    async render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="dashboard-layout">
                ${this.renderNavbar()}
                <div class="dashboard-content">
                    <div class="container">
                        <h1>Yönetim</h1>
                        
                        <div class="card mt-2">
                            <div class="card-body">
                                <h3>Geliştirme Aşamasında</h3>
                                <p>Yönetim ekranı şu anda geliştirilmektedir. Bu ekran şunları içerecek:</p>
                                <ul>
                                    <li><strong>Takım Yönetimi</strong> - Team management</li>
                                    <li><strong>Havale Yönetimi</strong> - Havale method management</li>
                                    <li><strong>Method Yönetimi</strong> - Transfer method management</li>
                                    <li><strong>Callback İzleme</strong> - Callback monitoring</li>
                                    <li><strong>İşlem Geçmişi</strong> - Transaction history</li>
                                    <li><strong>Merchant Yönetimi</strong> - Merchant management (Root/Merchant only)</li>
                                </ul>
                                <p class="mt-2">Detaylı uygulama için <code>DEVELOPMENT_ROADMAP.md</code> dosyasına bakınız.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render navbar
     */
    renderNavbar() {
        return `
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-brand">Payment Gateway</div>
                    <ul class="navbar-menu">
                        <li class="nav-item" data-path="/app" onclick="Router.navigate('/app')">Ana Sayfa</li>
                        <li class="nav-item" data-path="/app/payments" onclick="Router.navigate('/app/payments')">İşlemler</li>
                        <li class="nav-item" data-path="/app/finance" onclick="Router.navigate('/app/finance')">Finans</li>
                        ${Auth.hasRole(['root', 'merchant', 'admin']) ? 
                            '<li class="nav-item active" data-path="/app/admin" onclick="Router.navigate(\'/app/admin\')">Yönetim</li>' : ''}
                        <li class="nav-item" data-path="/app/profile" onclick="Router.navigate('/app/profile')">Profil</li>
                        <li class="nav-item" onclick="App.logout()">Çıkış</li>
                    </ul>
                </div>
            </nav>
        `;
    }
};

// Export to global Screens object
if (!window.Screens) window.Screens = {};
window.Screens.Admin = AdminScreen;
