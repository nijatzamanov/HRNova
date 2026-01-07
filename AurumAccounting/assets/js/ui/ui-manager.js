import { ModalManager } from './modal-manager.js';
import { ToastManager } from './toast-manager.js';
import { DropdownManager } from './dropdown-manager.js';
import { ConfirmDialog } from './confirm-dialog.js';

class UIManager {
    constructor() {
        this.modal = null;
        this.toast = null;
        this.dropdown = null;
        this.confirmDialog = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.modal = new ModalManager();
            this.toast = new ToastManager();
            this.dropdown = new DropdownManager();
            this.confirmDialog = new ConfirmDialog();

            this.modal.init();
            this.toast.init();
            this.dropdown.init();
            this.confirmDialog.init();

            this.initialized = true;
            console.log('✅ AurumUI initialized successfully');
        } catch (error) {
            console.error('❌ AurumUI initialization error:', error);
        }
    }

    showModal(modalId, options = {}) {
        if (!this.initialized) this.init();
        return this.modal?.open(modalId, options);
    }

    hideModal(modalId) {
        if (!this.initialized) this.init();
        return this.modal?.close(modalId);
    }

    showToast(message, type = 'info', duration = 4000) {
        if (!this.initialized) this.init();
        return this.toast?.show(message, type, duration);
    }

    success(message, duration = 4000) {
        if (!this.initialized) this.init();
        return this.toast?.success(message, duration);
    }

    error(message, duration = 5000) {
        if (!this.initialized) this.init();
        return this.toast?.error(message, duration);
    }

    warning(message, duration = 4000) {
        if (!this.initialized) this.init();
        return this.toast?.warning(message, duration);
    }

    info(message, duration = 4000) {
        if (!this.initialized) this.init();
        return this.toast?.info(message, duration);
    }

    async confirm(message, options = {}) {
        if (!this.initialized) this.init();
        if (!this.confirmDialog) {
            console.warn('ConfirmDialog not initialized');
            return false;
        }
        return this.confirmDialog.show(message, options);
    }

    async prompt(message, options = {}) {
        if (!this.initialized) this.init();
        if (!this.confirmDialog) {
            console.warn('ConfirmDialog not initialized');
            return null;
        }
        return this.confirmDialog.prompt(message, options);
    }
}

// Create singleton instance
export const AurumUI = new UIManager();

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AurumUI.init());
    } else {
        AurumUI.init();
    }

    // Expose globally
    window.AurumUI = AurumUI;
}