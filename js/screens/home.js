/**
 * Home Screen
 * Dashboard with live monitoring
 */

const HomeScreen = {
    /**
     * Render home screen
     */
    async render() {
        const app = document.getElementById('app');
        const user = Auth.getUser();
        
        app.innerHTML = `
            <div class="dashboard-layout">
                ${this.renderNavbar()}
                <div class="dashboard-content">
                    <div class="container">
                        <h1>Hoş Geldiniz, ${user?.name || user?.username || 'Agent'}!</h1>
                        <p>Ana sayfa şu anda geliştirilme aşamasındadır.</p>
                        
                        <div class="card mt-2">
                            <div class="card-body">
                                <h3>Geliştirme Durumu</h3>
                                <p>Bu ekran henüz tamamlanmamıştır. Lütfen diğer menüleri kullanın:</p>
                                <ul>
                                    <li><strong>İşlemler</strong> - Transaction management (To be implemented)</li>
                                    <li><strong>Finans</strong> - Reports and analytics (To be implemented)</li>
                                    <li><strong>Yönetim</strong> - Admin panel (To be implemented)</li>
                                    <li><strong>Profil</strong> - User profile (To be implemented)</li>
                                </ul>
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
        const user = Auth.getUser();
        
        return `
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-brand">Payment Gateway</div>
                    <ul class="navbar-menu">
                        <li class="nav-item" data-path="/app" onclick="Router.navigate('/app')">Ana Sayfa</li>
                        <li class="nav-item" data-path="/app/payments" onclick="Router.navigate('/app/payments')">İşlemler</li>
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
window.Screens.Home = HomeScreen;
