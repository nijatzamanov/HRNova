import {AurumToast} from '../components/toast.js';
import {AurumStorage} from '../core/storage.js';

export default {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', event => this.handleLogin(event));
        }
    },

    async handleLogin(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        this.clearErrors(form);

        if (! this.validate(data, form)) return;

        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        setTimeout(() => {
            AurumStorage.set('user', {
                email: data.email,
                name: 'Admin User',
                role: 'admin'
            });

            AurumToast.success('Login successful!');

            setTimeout(() => {
                window.location.href = 'app/dashboard.html';
            }, 500);
        }, 1000);
    },

    validate(data, form) {
        let isValid = true;

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showError(form, 'email', 'Please enter a valid email address');
            isValid = false;
        }

        if (! data.password || data.password.length < 6) {
            this.showError(form, 'password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showError(form, fieldName, message) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (! field) return;

        const fieldContainer = field.closest('.form-field');
        if (fieldContainer) {
            fieldContainer.classList.add('form-field--error');
            const errorSpan = fieldContainer.querySelector(`[data-error="${fieldName}"]`);
            if (errorSpan) {
                errorSpan.textContent = message;
            }
        }
    },

    clearErrors(form) {
        form.querySelectorAll('.form-field--error').forEach(field => {
            field.classList.remove('form-field--error');
        });
        form.querySelectorAll('.form-field__error').forEach(error => {
            error.textContent = '';
        });
    }
};