export class ConfirmDialog {
    constructor() {
        this.dialogId = 'aurum-confirm-dialog';
        this.resolveCallback = null;
    }

    init() {
        this.createDialog();
    }

    createDialog() {
        if (document.getElementById(this.dialogId)) return;

        const dialog = document.createElement('div');
        dialog.id = this.dialogId;
        dialog.className = 'modal';
        dialog.setAttribute('hidden', '');
        dialog.innerHTML = `
      <div class="modal__backdrop"></div>
      <div class="modal__content confirm-dialog">
        <div class="modal__body">
          <div class="confirm-dialog__icon" data-icon></div>
          <h3 class="confirm-dialog__title" data-title></h3>
          <p class="confirm-dialog__message" data-message></p>
          <div class="confirm-dialog__input hidden" data-input-wrapper>
            <input type="text" class="form-input" data-input placeholder="">
          </div>
          <div class="confirm-dialog__actions">
            <button type="button" class="btn btn--secondary" data-cancel></button>
            <button type="button" class="btn btn--primary" data-confirm></button>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(dialog);

        const cancelBtn = dialog.querySelector('[data-cancel]');
        const confirmBtn = dialog.querySelector('[data-confirm]');

        cancelBtn.addEventListener('click', () => this.handleCancel());
        confirmBtn.addEventListener('click', () => this.handleConfirm());

        dialog.querySelector('.modal__backdrop').addEventListener('click', () => this.handleCancel());

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && ! dialog.hasAttribute('hidden')) {
                this.handleCancel();
            }
        });
    }

    show(message, options = {}) {
        return new Promise((resolve) => {
            this.resolveCallback = resolve;

            const dialog = document.getElementById(this.dialogId);
            const icon = dialog.querySelector('[data-icon]');
            const title = dialog.querySelector('[data-title]');
            const messageEl = dialog.querySelector('[data-message]');
            const cancelBtn = dialog.querySelector('[data-cancel]');
            const confirmBtn = dialog.querySelector('[data-confirm]');
            const inputWrapper = dialog.querySelector('[data-input-wrapper]');

            inputWrapper.classList.add('hidden');

            const {
                title: titleText = 'Confirm',
                type = 'warning',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmButtonClass = 'btn--primary'
            } = options;

            icon.className = `confirm-dialog__icon confirm-dialog__icon--${type}`;
            icon.innerHTML = this.getIcon(type);
            title.textContent = titleText;
            messageEl.textContent = message;
            cancelBtn.textContent = cancelText;
            confirmBtn.textContent = confirmText;
            confirmBtn.className = `btn ${confirmButtonClass}`;

            dialog.removeAttribute('hidden');
            document.body.classList.add('modal-open');

            confirmBtn.focus();
        });
    }

    prompt(message, options = {}) {
        return new Promise((resolve) => {
            this.resolveCallback = resolve;

            const dialog = document.getElementById(this.dialogId);
            const icon = dialog.querySelector('[data-icon]');
            const title = dialog.querySelector('[data-title]');
            const messageEl = dialog.querySelector('[data-message]');
            const cancelBtn = dialog.querySelector('[data-cancel]');
            const confirmBtn = dialog.querySelector('[data-confirm]');
            const inputWrapper = dialog.querySelector('[data-input-wrapper]');
            const input = dialog.querySelector('[data-input]');

            const {
                title: titleText = 'Input Required',
                type = 'info',
                confirmText = 'OK',
                cancelText = 'Cancel',
                placeholder = '',
                defaultValue = ''
            } = options;

            icon.className = `confirm-dialog__icon confirm-dialog__icon--${type}`;
            icon.innerHTML = this.getIcon(type);
            title.textContent = titleText;
            messageEl.textContent = message;
            cancelBtn.textContent = cancelText;
            confirmBtn.textContent = confirmText;
            input.placeholder = placeholder;
            input.value = defaultValue;

            inputWrapper.classList.remove('hidden');

            dialog.removeAttribute('hidden');
            document.body.classList.add('modal-open');

            input.focus();
        });
    }

    handleConfirm() {
        const dialog = document.getElementById(this.dialogId);
        const inputWrapper = dialog.querySelector('[data-input-wrapper]');
        const input = dialog.querySelector('[data-input]');

        let result = true;

        if (! inputWrapper.classList.contains('hidden')) {
            result = input.value;
        }

        this.close();

        if (this.resolveCallback) {
            this.resolveCallback(result);
            this.resolveCallback = null;
        }
    }

    handleCancel() {
        this.close();

        if (this.resolveCallback) {
            this.resolveCallback(false);
            this.resolveCallback = null;
        }
    }

    close() {
        const dialog = document.getElementById(this.dialogId);
        dialog.setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
    }

    getIcon(type) {
        const icons = {
            warning: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4L4 28h24L16 4zM16 12v8M16 24h.01"/></svg>',
            danger: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="14"/><path d="M16 8v8M16 20h.01"/></svg>',
            info: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="14"/><path d="M16 16v8M16 8h.01"/></svg>'
        };
        return icons[type] || icons.info;
    }
}