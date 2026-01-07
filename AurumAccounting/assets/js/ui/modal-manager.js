export class ModalManager {
    constructor() {
        this.openModals = new Set();
        this.focusedElementBeforeModal = null;
    }

    init() {
        document.addEventListener('click', this.handleCloseClick.bind(this));
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    open(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id "${modalId}" not found`);
            return;
        }

        this.focusedElementBeforeModal = document.activeElement;

        modal.removeAttribute('hidden');
        this.openModals.add(modal);
        document.body.classList.add('modal-open');

        if (options.onOpen) {
            options.onOpen(modal);
        }

        requestAnimationFrame(() => {
            this.trapFocus(modal);
            const firstFocusable = modal.querySelector('input, textarea, select, button:not([data-modal-close])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    }

    close(modalId) {
        const modal = typeof modalId === 'string' ?  document.getElementById(modalId) : modalId;
        if (! modal) return;

        modal.setAttribute('hidden', '');
        this.openModals.delete(modal);

        if (this.openModals.size === 0) {
            document.body.classList.remove('modal-open');
        }

        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            this.clearFormErrors(form);
        }

        if (this.focusedElementBeforeModal) {
            this.focusedElementBeforeModal.focus();
            this.focusedElementBeforeModal = null;
        }
    }

    handleCloseClick(event) {
        const closeButton = event.target.closest('[data-modal-close]');
        if (closeButton) {
            const modal = closeButton.closest('.modal');
            if (modal) {
                this.close(modal);
            }
            return;
        }

        const backdrop = event.target.closest('.modal__backdrop');
        if (backdrop) {
            const modal = backdrop.closest('.modal');
            if (modal && !modal.hasAttribute('data-no-backdrop-close')) {
                this.close(modal);
            }
        }
    }

    handleEscapeKey(event) {
        if (event.key === 'Escape' && this.openModals.size > 0) {
            const modals = Array.from(this.openModals);
            const lastModal = modals[modals.length - 1];
            if (! lastModal.hasAttribute('data-no-escape-close')) {
                this.close(lastModal);
            }
        }
    }

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        };

        modal.addEventListener('keydown', handleTab);
    }

    clearFormErrors(form) {
        form.querySelectorAll('.form-group--error').forEach(group => {
            group.classList.remove('form-group--error');
        });
        form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
    }
}