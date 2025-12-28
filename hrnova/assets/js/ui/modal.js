let activeModal = null;
let previousFocusedElement = null;
const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export class Modal {
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || '';
        this.content = options.content || '';
        this.onConfirm = options.onConfirm;
        this.onCancel = options.onCancel;
        this.confirmText = options.confirmText || 'Confirm';
        this.cancelText = options.cancelText || 'Cancel';
        this.showConfirm = options.showConfirm !== false;
        this.modal = null;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleFocusTrap = this.handleFocusTrap.bind(this);
    }

    create() {
        const modalHTML = `
      <div class="modal" id="${this.id}" role="dialog" aria-modal="true" aria-labelledby="${this.id}-title">
        <div class="modal__backdrop" data-modal-close></div>
        <div class="modal__content" role="document">
          <div class="modal__header">
            <h3 class="modal__title" id="${this.id}-title">${this.title}</h3>
            <button class="modal__close" data-modal-close aria-label="Close">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal__body">
            ${this.content}
          </div>
          <div class="modal__footer">
            <button class="btn btn-secondary" data-modal-close>${this.cancelText}</button>
            ${this.showConfirm ? `<button class="btn btn-primary" data-modal-confirm>${this.confirmText}</button>` : ''}
          </div>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById(this.id);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const closeButtons = this.modal.querySelectorAll('[data-modal-close]');
        const confirmButton = this.modal.querySelector('[data-modal-confirm]');

        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });
        });

        if (confirmButton) {
            confirmButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.onConfirm) {
                    const shouldClose = this.onConfirm();
                    if (shouldClose !== false) {
                        this.close();
                    }
                } else {
                    this.close();
                }
            });
        }

        const backdrop = this.modal.querySelector('.modal__backdrop');
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.close();
            }
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
        } else if (e.key === 'Tab') {
            this.handleFocusTrap(e);
        }
    }

    handleFocusTrap(e) {
        const focusableElements = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        const focusableArray = Array.from(focusableElements);
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    open() {
        if (!this.modal) {
            this.create();
        }

        previousFocusedElement = document.activeElement;

        this.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;

        document.addEventListener('keydown', this.handleKeyDown);

        activeModal = this;

        requestAnimationFrame(() => {
            const firstFocusable = this.modal.querySelector(FOCUSABLE_ELEMENTS);
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('modal--active');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            document.removeEventListener('keydown', this.handleKeyDown);

            if (previousFocusedElement && previousFocusedElement.focus) {
                previousFocusedElement.focus();
            }

            if (this.onCancel) {
                this.onCancel();
            }

            setTimeout(() => {
                this.destroy();
            }, 300);

            if (activeModal === this) {
                activeModal = null;
            }
        }
    }

    destroy() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
}

export function showModal(options) {
    const modal = new Modal(options);
    modal.open();
    return modal;
}

export function closeActiveModal() {
    if (activeModal) {
        activeModal.close();
    }
}

export function initModals() {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger) {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-target');
            handleModalTrigger(modalId);
        }
    });
}

function handleModalTrigger(modalId) {
    if (modalId === 'addEmployeeModal') {
        showAddEmployeeModal();
    }
}

function showAddEmployeeModal() {
    showModal({
        title: 'Add New Employee',
        content: `
      <form class="form" id="addEmployeeForm">
        <div class="form-group">
          <label class="form-label">Full Name <span class="form-required">*</span></label>
          <input type="text" class="form-control" name="fullName" required placeholder="John Doe">
        </div>

        <div class="form-group">
          <label class="form-label">Email <span class="form-required">*</span></label>
          <input type="email" class="form-control" name="email" required placeholder="john@example.com">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Department <span class="form-required">*</span></label>
            <select class="form-control" name="department" required>
              <option value="">Select department</option>
              <option value="hr">Human Resources</option>
              <option value="it">IT</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Position <span class="form-required">*</span></label>
            <input type="text" class="form-control" name="position" required placeholder="Software Engineer">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Start Date <span class="form-required">*</span></label>
            <input type="date" class="form-control" name="startDate" required>
          </div>

          <div class="form-group">
            <label class="form-label">Employment Type</label>
            <select class="form-control" name="employmentType">
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </form>
    `,
        confirmText: 'Add Employee',
        onConfirm: () => {
            const form = document.getElementById('addEmployeeForm');
            if (form && form.checkValidity()) {
                console.log('Employee added successfully');
                if (window.showSuccess) {
                    window.showSuccess('Employee added successfully!');
                }
                return true;
            } else {
                if (form) {
                    form.reportValidity();
                }
                return false;
            }
        }
    });
}

function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

export { activeModal };
