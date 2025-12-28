// i18n.js - Internationalization
(function(window) {
    'use strict';

    const I18n = {
        currentLang: 'en',
        translations: {},
        supportedLangs: ['en', 'az', 'ru', 'tr'],

        init: function() {
            // Get saved language or detect from browser
            const savedLang = Storage.get('language');
            const browserLang = navigator.language.split('-')[0];

            const defaultLang = savedLang ||
                (this.supportedLangs.includes(browserLang) ? browserLang : 'en');

            this.setLanguage(defaultLang);
        },

        async setLanguage(lang) {
            if (! this.supportedLangs.includes(lang)) {
                console.warn(`Language ${lang} not supported`);
                return;
            }

            try {
                const response = await fetch(`./assets/i18n/${lang}.json`);
                this.translations = await response.json();
                this.currentLang = lang;

                Storage.set('language', lang);
                this.updatePage();
                this.updateLanguageDisplay();

                // Dispatch event
                window.dispatchEvent(new CustomEvent('languageChanged', {
                    detail: { language: lang }
                }));
            } catch (error) {
                console.error(`Failed to load language ${lang}: `, error);
            }
        },

        get: function(key, defaultValue = key) {
            const keys = key.split('.');
            let value = this.translations;

            for (const k of keys) {
                if (value && value.hasOwnProperty(k)) {
                    value = value[k];
                } else {
                    return defaultValue;
                }
            }

            return value || defaultValue;
        },

        updatePage: function() {
            // Update elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.get(key);

                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            });

            // Update placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                element.placeholder = this.get(key);
            });

            // Update aria-labels
            document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                const key = element.getAttribute('data-i18n-aria');
                element.setAttribute('aria-label', this.get(key));
            });
        },

        updateLanguageDisplay: function() {
            const langDisplay = document.getElementById('currentLang');
            if (langDisplay) {
                langDisplay.textContent = this.currentLang.toUpperCase();
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => I18n.init());
    } else {
        I18n.init();
    }

    // Language switcher
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('[data-lang]');
        if (langBtn) {
            const lang = langBtn.getAttribute('data-lang');
            I18n.setLanguage(lang);
        }
    });

    window.I18n = I18n;
})(window);