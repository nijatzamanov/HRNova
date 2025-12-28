// toast.js - Toast Notifications
(function(window) {
    'use strict';

    const Toast = {
        container: null,
        duration: 5000,

        init: function() {
            this.container = document.getElementById('toastContainer');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toastContainer';
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },

        show: function(type, title, message) {
            if (!this.container) this.init();

            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;

            const icon = this.getIcon(type);

            toast.innerHTML = `
        ${icon}
        <div class="toast__content">
          <div class="toast__title">${title}</div>
          ${message ?  `<div class="toast__message">${message}</div>` : ''}
        </div>
        <button class="toast__close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="4" x2="4" y2="12"/>
            <line x1="4" y1="4" x2="12" y2="12"/>
          </svg>
        </button>
      `;

            // Close button
            const closeBtn = toast.querySelector('.toast__close');
            closeBtn.addEventListener('click', () => this.remove(toast));

            this.container.appendChild(toast);

            // Auto remove
            setTimeout(() => this.remove(toast), this.duration);
        },

        remove: function(toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        },

        getIcon: function(type) {
            const icons = {
                success: '<svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-success);"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
                error: '<svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-danger);"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
                warning: '<svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-warning);"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
                info: '<svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-info);"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
            };
            return icons[type] || icons.info;
        },

        success: function(title, message = '') {
            this.show('success', title, message);
        },

        error: function(title, message = '') {
            this.show('error', title, message);
        },

        warning:  function(title, message = '') {
            this.show('warning', title, message);
        },

        info: function(title, message = '') {
            this.show('info', title, message);
        }
    };

    window.Toast = Toast;
})(window);