// modal.js - Modal Component
(function() {
    'use strict';

    class Modal {
        constructor(id) {
            this.id = id;
            this.element = document.getElementById(id);
            if (!this.element) return;

            this.backdrop = this.element.querySelector('.modal__backdrop');
            this.content = this.element.querySelector('.modal__content');
            this.closeButtons = this.element.querySelectorAll('.modal__close, [data-modal-close]');

            this.init();
        }

        init() {
            // Close button clicks
            this.closeButtons.forEach(btn => {
                btn.addEventListener('click', () => this.close());
            });

            // Backdrop click
            if (this.backdrop) {
                this.backdrop.addEventListener('click', () => this.close());
            }

            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });

            // Prevent backdrop click from closing when clicking content
            if (this.content) {
                this.content.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }

        open() {
            this.element.classList.add('modal--open');
            document.body.classList.add('modal-open');

            // Focus trap
            this.trapFocus();

            // Dispatch event
            this.element.dispatchEvent(new CustomEvent('modalOpen'));
        }

        close() {
            this.element.classList.remove('modal--open');
            document.body.classList.remove('modal-open');

            // Dispatch event
            this.element.dispatchEvent(new CustomEvent('modalClose'));
        }

        toggle() {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        }

        isOpen() {
            return this.element.classList.contains('modal--open');
        }

        trapFocus() {
            const focusableElements = this.element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            this.element.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });

            firstElement.focus();
        }

        static get(id) {
            return new Modal(id);
        }
    }

    window.Modal = Modal;
})();