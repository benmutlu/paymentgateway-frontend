/**
 * Payments Screen
 * Transaction management
 */

const PaymentsScreen = {
    /**
     * Render payments screen
     */
    async render() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="dashboard-layout">
                ${this.renderNavbar()}
                <div class="dashboard-content">
                    <div class="container">
                        <h1>İşlemler</h1>
                        
                        <div class="card mt-2">
                            <div class="card-body">
                                <h3>Geliştirme Aşamasında</h3>
                                <p>İşlemler ekranı şu anda geliştirilmektedir. Bu ekran şunları içerecek:</p>
                                <ul>
                                    <li><strong>Bekleyen İşlemler</strong> - Waiting room with claim functionality</li>
                                    <li><strong>İşlemdekiler</strong> - Processing transactions with approve/reject</li>
                                    <li><strong>İşlem Geçmişi</strong> - Transaction history with search</li>
                                    <li><strong>Günlük İstatistikler</strong> - Daily statistics dashboard</li>
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
                        <li class="nav-item active" data-path="/app/payments" onclick="Router.navigate('/app/payments')">İşlemler</li>
                        <li class="nav-item" data-path="/app/finance" onclick="Router.navigate('/app/finance')">Finans</li>
                        ${Auth.hasRole(['root', 'merchant', 'admin']) ? 
                            '<li class="nav-item" data-path="/app/admin" onclick="Router.navigate(\'/app/admin\')">Yönetim</li>' : ''}
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
window.Screens.Payments = PaymentsScreen;
