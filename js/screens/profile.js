/**
 * Profile Screen
 * User profile and settings
 */

const ProfileScreen = {
    /**
     * Render profile screen
     */
    async render() {
        const app = document.getElementById('app');
        const user = Auth.getUser();
        
        app.innerHTML = `
            <div class="dashboard-layout">
                ${this.renderNavbar()}
                <div class="dashboard-content">
                    <div class="container">
                        <h1>Profil</h1>
                        
                        <div class="card mt-2">
                            <div class="card-header">
                                <h3 class="card-title">Kullanıcı Bilgileri</h3>
                            </div>
                            <div class="card-body">
                                <p><strong>Kullanıcı Adı:</strong> ${user?.username || 'N/A'}</p>
                                <p><strong>Ad Soyad:</strong> ${user?.name || ''} ${user?.surname || ''}</p>
                                <p><strong>Rol:</strong> ${user?.role?.label || user?.role?.value || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div class="card mt-2">
                            <div class="card-body">
                                <h3>Geliştirme Aşamasında</h3>
                                <p>Profil ekranı şu anda geliştirilmektedir. Bu ekran şunları içerecek:</p>
                                <ul>
                                    <li><strong>Şifre Değiştirme</strong> - Change password</li>
                                    <li><strong>2FA Ayarları</strong> - Two-factor authentication</li>
                                    <li><strong>Bildirim Ayarları</strong> - Notification preferences</li>
                                    <li><strong>Tema Ayarları</strong> - Theme settings</li>
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
                            '<li class="nav-item" data-path="/app/admin" onclick="Router.navigate(\'/app/admin\')">Yönetim</li>' : ''}
                        <li class="nav-item active" data-path="/app/profile" onclick="Router.navigate('/app/profile')">Profil</li>
                        <li class="nav-item" onclick="App.logout()">Çıkış</li>
                    </ul>
                </div>
            </nav>
        `;
    }
};

// Export to global Screens object
if (!window.Screens) window.Screens = {};
window.Screens.Profile = ProfileScreen;
