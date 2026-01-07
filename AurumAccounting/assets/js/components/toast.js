export const AurumToast = {
    container: null,

    init() {
        this.createContainer();
    },

    createContainer() {
        if (document.querySelector('.toast-container')) return;

        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.createContainer();

        const toast = this.createToast(message, type);
        this.container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        return toast;
    },

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icon = this.getIcon(type);
        const closeBtn = this.createCloseButton();

        toast.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div class="toast__content">
        <div class="toast__message">${message}</div>
      </div>
    `;
        toast.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => this.hide(toast));

        return toast;
    },

    getIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
            error:  '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="9"/><path d="M10 6v4M10 14h.01"/></svg>',
            warning: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2L2 18h16L10 2zM10 8v4M10 16h.01"/></svg>',
            info: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="9"/><path d="M10 10v4M10 6h.01"/></svg>'
        };
        return icons[type] || icons.info;
    },

    createCloseButton() {
        const btn = document.createElement('button');
        btn.className = 'toast__close';
        btn.setAttribute('aria-label', 'Close');
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4L4 12M4 4l8 8"/></svg>';
        return btn;
    },

    hide(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};