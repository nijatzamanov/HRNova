export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.idCounter = 0;
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        if (document.querySelector('.toast-container')) {
            this.container = document.querySelector('.toast-container');
            return;
        }

        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.createContainer();

        const id = ++this.idCounter;
        const toast = this.createToast(id, message, type);

        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }

        return id;
    }

    createToast(id, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.dataset.toastId = id;

        const icon = this.getIcon(type);
        const closeBtn = this.createCloseButton(id);

        toast.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div class="toast__content">
        <div class="toast__message">${this.escapeHtml(message)}</div>
      </div>
    `;
        toast.appendChild(closeBtn);

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
            error:  '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="9"/><path d="M10 6v4M10 14h.01"/></svg>',
            warning: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2L2 18h16L10 2zM10 8v4M10 16h.01"/></svg>',
            info: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="9"/><path d="M10 10v4M10 6h.01"/></svg>'
        };
        return icons[type] || icons.info;
    }

    createCloseButton(id) {
        const btn = document.createElement('button');
        btn.className = 'toast__close';
        btn.setAttribute('aria-label', 'Close');
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4L4 12M4 4l8 8"/></svg>';
        btn.addEventListener('click', () => this.hide(id));
        return btn;
    }

    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        toast.classList.add('toast--exit');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}