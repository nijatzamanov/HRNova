export const AurumI18n = {
    currentLanguage: 'en',
    translations: {},
    fallbackLanguage: 'en',
    supportedLanguages: ['en', 'az', 'ru', 'tr', 'de'],

    async init() {
        await this.loadTranslations(this.fallbackLanguage);
    },

    async loadTranslations(lang) {
        if (! this.supportedLanguages.includes(lang)) {
            console.warn(`Language "${lang}" not supported, falling back to ${this.fallbackLanguage}`);
            lang = this.fallbackLanguage;
        }

        try {
            const response = await fetch(`../assets/i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            if (lang !== this.fallbackLanguage) {
                await this.loadTranslations(this.fallbackLanguage);
            }
        }
    },

    async setLanguage(lang) {
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }
        this.currentLanguage = lang;
        this.translate();
        document.documentElement.lang = lang;

        const event = new CustomEvent('language-changed', { detail: { language: lang } });
        document.dispatchEvent(event);
    },

    t(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return fallback || key;
            }
        }

        return value || fallback || key;
    },

    translate() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            element.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.dataset.i18nTitle;
            element.title = this.t(key);
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.dataset.i18nAriaLabel;
            element.setAttribute('aria-label', this.t(key));
        });
    },

    // Locale-aware formatting
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.getLocaleCode(), {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.getLocaleCode(), options).format(number);
    },

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Intl.DateFormat(this.getLocaleCode(), { ...defaultOptions, ...options }).format(new Date(date));
    },

    formatDateTime(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateFormat(this.getLocaleCode(), { ...defaultOptions, ...options }).format(new Date(date));
    },

    getLocaleCode() {
        const localeMap = {
            'en': 'en-US',
            'az': 'az-AZ',
            'ru': 'ru-RU',
            'tr': 'tr-TR',
            'de': 'de-DE'
        };
        return localeMap[this.currentLanguage] || 'en-US';
    },

    getCurrentLanguage() {
        return this.currentLanguage;
    },

    getSupportedLanguages() {
        return this.supportedLanguages;
    }
};