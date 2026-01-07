export const AurumModal = {
    openModals: new Set(),

    init() {
        document.addEventListener('click', event => {
            const closeBtn = event.target.closest('[data-modal-close]');
            if (closeBtn) {
                const modal = closeBtn.closest('.modal');
                if (modal) this.close(modal);
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && this.openModals.size > 0) {
                const modals = Array.from(this.openModals);
                const lastModal = modals[modals.length - 1];
                this.close(lastModal);
            }
        });
    },

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (! modal) return;

        modal.hidden = false;
        this.openModals.add(modal);
        document.body.classList.add('modal-open');

        this.trapFocus(modal);

        requestAnimationFrame(() => {
            const firstInput = modal.querySelector('input, textarea, select, button');
            if (firstInput) firstInput.focus();
        });
    },

    close(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        if (!modal) return;

        modal.hidden = true;
        this.openModals.delete(modal);

        if (this.openModals.size === 0) {
            document.body.classList.remove('modal-open');
        }

        const form = modal.querySelector('form');
        if (form) form.reset();

        this.clearErrors(modal);
    },

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = event => {
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

        modal.addEventListener('keydown', handleTabKey);
    },

    clearErrors(modal) {
        modal.querySelectorAll('.form-field--error').forEach(field => {
            field.classList.remove('form-field--error');
        });
        modal.querySelectorAll('.form-field__error').forEach(error => {
            error.textContent = '';
        });
    }
};