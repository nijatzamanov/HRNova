let toastContainer = null;

export function initToast() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

export function showToast(options = {}) {
    if (!toastContainer) {
        initToast();
    }

    const {
        type = 'info',
        title = '',
        message = '',
        duration = 5000
    } = options;

    const toastId = `toast-${Date.now()}`;
    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
        danger: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />',
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
    };

    const toastHTML = `
    <div class="toast toast--${type}" id="${toastId}">
      <svg class="toast__icon toast__icon--${type}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${icons[type]}
      </svg>
      <div class="toast__content">
        ${title ? `<div class="toast__title">${title}</div>` : ''}
        ${message ? `<div class="toast__message">${message}</div>` : ''}
      </div>
      <button class="toast__close" onclick="this.parentElement.remove()">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);

    if (duration > 0) {
        setTimeout(() => {
            toastElement.remove();
        }, duration);
    }

    return toastElement;
}

export function showSuccess(message, title = 'Success') {
    return showToast({ type: 'success', title, message });
}

export function showError(message, title = 'Error') {
    return showToast({ type: 'danger', title, message });
}

export function showWarning(message, title = 'Warning') {
    return showToast({ type: 'warning', title, message });
}

export function showInfo(message, title = 'Info') {
    return showToast({ type: 'info', title, message });
}
