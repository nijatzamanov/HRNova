export class FormValidator {
    constructor(form, rules = {}) {
        this.form = form;
        this.rules = rules;
    }

    validate() {
        let isValid = true;
        this.clearErrors();

        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.elements[fieldName];
            if (! field) return;

            const fieldRules = this.rules[fieldName];
            const value = field.value.trim();

            for (const rule of fieldRules) {
                const error = this.validateRule(value, rule, field);
                if (error) {
                    this.showError(fieldName, error);
                    isValid = false;
                    break;
                }
            }
        });

        return isValid;
    }

    validateRule(value, rule, field) {
        if (rule.required && !value) {
            return rule.message || 'This field is required';
        }

        if (rule.email && value && ! this.isValidEmail(value)) {
            return rule.message || 'Please enter a valid email address';
        }

        if (rule.minLength && value.length < rule.minLength) {
            return rule.message || `Minimum length is ${rule.minLength} characters`;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return rule.message || `Maximum length is ${rule.maxLength} characters`;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.message || 'Invalid format';
        }

        if (rule.custom && typeof rule.custom === 'function') {
            const customError = rule.custom(value, field, this.form);
            if (customError) return customError;
        }

        return null;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(fieldName, message) {
        const field = this.form.elements[fieldName];
        if (! field) return;

        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('form-group--error');
            const errorEl = formGroup.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = message;
            }
        }
    }

    clearErrors() {
        this.form.querySelectorAll('.form-group--error').forEach(group => {
            group.classList.remove('form-group--error');
        });
        this.form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
    }

    static create(form, rules) {
        return new FormValidator(form, rules);
    }
}