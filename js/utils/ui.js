/**
 * UI Utilities
 * Helper functions for UI rendering and manipulation
 */

class UIManager {
    constructor() {
        this.loadingElement = null;
        this.modalStack = [];
    }
    
    /**
     * Show loading indicator
     */
    showLoading(message = 'Yükleniyor...') {
        if (this.loadingElement) return;
        
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'loading-overlay';
        this.loadingElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(this.loadingElement);
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }
    
    /**
     * Show modal
     */
    showModal(options) {
        const {
            title,
            content,
            footer,
            size = 'medium',
            closable = true,
            onClose
        } = options;
        
        const modalId = Utils.generateId();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = `modal modal-${size}`;
        modal.innerHTML = `
            <div class="modal-overlay" onclick="UI.closeModal('${modalId}')"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${title}</h3>
                    ${closable ? `<button class="modal-close" onclick="UI.closeModal('${modalId}')">×</button>` : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modalStack.push({ id: modalId, onClose });
        
        // Trigger animation
        setTimeout(() => modal.classList.add('modal-show'), 10);
        
        return modalId;
    }
    
    /**
     * Close modal
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.remove();
            
            // Call onClose callback
            const modalData = this.modalStack.find(m => m.id === modalId);
            if (modalData && modalData.onClose) {
                modalData.onClose();
            }
            
            // Remove from stack
            this.modalStack = this.modalStack.filter(m => m.id !== modalId);
        }, 300);
    }
    
    /**
     * Close all modals
     */
    closeAllModals() {
        this.modalStack.forEach(modal => this.closeModal(modal.id));
    }
    
    /**
     * Show drawer
     */
    showDrawer(options) {
        const {
            title,
            content,
            position = 'right',
            width = '400px',
            onClose
        } = options;
        
        const drawerId = Utils.generateId();
        const drawer = document.createElement('div');
        drawer.id = drawerId;
        drawer.className = `drawer drawer-${position}`;
        drawer.style.setProperty('--drawer-width', width);
        drawer.innerHTML = `
            <div class="drawer-overlay" onclick="UI.closeDrawer('${drawerId}')"></div>
            <div class="drawer-container">
                <div class="drawer-header">
                    <h3>${title}</h3>
                    <button class="drawer-close" onclick="UI.closeDrawer('${drawerId}')">×</button>
                </div>
                <div class="drawer-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(drawer);
        
        // Trigger animation
        setTimeout(() => drawer.classList.add('drawer-show'), 10);
        
        return drawerId;
    }
    
    /**
     * Close drawer
     */
    closeDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        if (!drawer) return;
        
        drawer.classList.remove('drawer-show');
        setTimeout(() => drawer.remove(), 300);
    }
    
    /**
     * Show confirm dialog
     */
    confirm(options) {
        return new Promise((resolve) => {
            const {
                title = 'Onay',
                message,
                confirmText = 'Evet',
                cancelText = 'Hayır',
                type = 'warning'
            } = options;
            
            const content = `
                <div class="confirm-dialog confirm-${type}">
                    <p>${message}</p>
                </div>
            `;
            
            const footer = `
                <button class="btn btn-secondary" onclick="UI.handleConfirm('${false}')">
                    ${cancelText}
                </button>
                <button class="btn btn-primary" onclick="UI.handleConfirm('${true}')">
                    ${confirmText}
                </button>
            `;
            
            const modalId = this.showModal({
                title,
                content,
                footer,
                size: 'small',
                closable: false
            });
            
            // Store resolver
            this._confirmResolver = resolve;
            this._confirmModalId = modalId;
        });
    }
    
    /**
     * Handle confirm response
     */
    handleConfirm(result) {
        if (this._confirmResolver) {
            this._confirmResolver(result === 'true');
            this._confirmResolver = null;
        }
        if (this._confirmModalId) {
            this.closeModal(this._confirmModalId);
            this._confirmModalId = null;
        }
    }
    
    /**
     * Render table
     */
    renderTable(options) {
        const {
            columns,
            data,
            loading = false,
            empty = 'Veri bulunamadı',
            onRowClick
        } = options;
        
        if (loading) {
            return '<div class="table-loading"><div class="spinner"></div></div>';
        }
        
        if (!data || data.length === 0) {
            return `<div class="table-empty">${empty}</div>`;
        }
        
        let html = '<table class="data-table"><thead><tr>';
        
        // Render headers
        columns.forEach(col => {
            html += `<th>${col.title}</th>`;
        });
        
        html += '</tr></thead><tbody>';
        
        // Render rows
        data.forEach((row, index) => {
            const rowClass = onRowClick ? 'table-row-clickable' : '';
            const rowClick = onRowClick ? `onclick="(${onRowClick})(${index})"` : '';
            html += `<tr class="${rowClass}" ${rowClick}>`;
            
            columns.forEach(col => {
                const value = col.render ? col.render(row, index) : row[col.key];
                html += `<td>${value}</td>`;
            });
            
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        
        return html;
    }
    
    /**
     * Render tabs
     */
    renderTabs(options) {
        const {
            tabs,
            activeTab,
            onChange
        } = options;
        
        let html = '<div class="tabs"><div class="tabs-nav">';
        
        tabs.forEach(tab => {
            const active = tab.key === activeTab ? 'active' : '';
            html += `
                <button class="tab-item ${active}" onclick="(${onChange})('${tab.key}')">
                    ${tab.label}
                </button>
            `;
        });
        
        html += '</div></div>';
        
        return html;
    }
    
    /**
     * Render badge
     */
    renderBadge(text, type = 'default') {
        return `<span class="badge badge-${type}">${text}</span>`;
    }
    
    /**
     * Render tag
     */
    renderTag(text, color = 'default') {
        return `<span class="tag tag-${color}">${text}</span>`;
    }
    
    /**
     * Render card
     */
    renderCard(options) {
        const {
            title,
            extra,
            content,
            footer
        } = options;
        
        return `
            <div class="card">
                ${title || extra ? `
                    <div class="card-header">
                        ${title ? `<h3 class="card-title">${title}</h3>` : ''}
                        ${extra ? `<div class="card-extra">${extra}</div>` : ''}
                    </div>
                ` : ''}
                <div class="card-body">
                    ${content}
                </div>
                ${footer ? `<div class="card-footer">${footer}</div>` : ''}
            </div>
        `;
    }
    
    /**
     * Update active navigation item
     */
    updateActiveNav(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-path') === path) {
                item.classList.add('active');
            }
        });
    }
    
    /**
     * Scroll to top
     */
    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }
    
    /**
     * Copy to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Notifications.success('Panoya kopyalandı');
            return true;
        } catch (error) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            Notifications.success('Panoya kopyalandı');
            return true;
        }
    }
    
    /**
     * Format phone number for display
     */
    formatPhone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
        }
        return phone;
    }
    
    /**
     * Truncate text
     */
    truncate(text, length = 50) {
        if (!text || text.length <= length) return text;
        return text.slice(0, length) + '...';
    }
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.UI = new UIManager();
