import { StorageService } from './storage.js';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE = 'az';
const SUPPORTED_LANGUAGES = ['az', 'en', 'ru', 'tr', 'de'];

class I18nService {
    constructor() {
        this.currentLanguage = DEFAULT_LANGUAGE;
        this.translations = {};
        this.observers = [];
    }

    async init() {
        const savedLanguage = StorageService.get(STORAGE_KEY, DEFAULT_LANGUAGE);
        await this.loadLanguage(savedLanguage);
        return this;
    }

    async loadLanguage(languageCode) {
        if (!SUPPORTED_LANGUAGES.includes(languageCode)) {
            console.warn(`Language ${languageCode} not supported, falling back to ${DEFAULT_LANGUAGE}`);
            languageCode = DEFAULT_LANGUAGE;
        }

        try {
            const response = await fetch(`/i18n/${languageCode}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${languageCode}`);
            }

            this.translations = await response.json();
            this.currentLanguage = languageCode;
            StorageService.set(STORAGE_KEY, languageCode);

            this.notifyObservers();
            return true;
        } catch (error) {
            console.error('Error loading language:', error);
            if (languageCode !== DEFAULT_LANGUAGE) {
                return this.loadLanguage(DEFAULT_LANGUAGE);
            }
            return false;
        }
    }

    translate(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        if (typeof value === 'string') {
            return this.interpolate(value, params);
        }

        return key;
    }

    interpolate(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    }

    translateElement(element) {
        const key = element.getAttribute('data-i18n');
        const params = element.getAttribute('data-i18n-params');

        if (!key) return;

        const parsedParams = params ? JSON.parse(params) : {};
        const translation = this.translate(key, parsedParams);

        const target = element.getAttribute('data-i18n-target');
        if (target === 'placeholder') {
            element.placeholder = translation;
        } else if (target === 'title') {
            element.title = translation;
        } else if (target === 'aria-label') {
            element.setAttribute('aria-label', translation);
        } else {
            element.textContent = translation;
        }
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => this.translateElement(element));

        document.documentElement.lang = this.currentLanguage;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(observer => observer !== callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLanguage));
    }

    async changeLanguage(languageCode) {
        if (languageCode === this.currentLanguage) return;

        const success = await this.loadLanguage(languageCode);
        if (success) {
            this.translatePage();
        }
        return success;
    }

    t(key, params = {}) {
        return this.translate(key, params);
    }
}

export const i18n = new I18nService();

export async function initI18n() {
    await i18n.init();
    i18n.translatePage();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.hasAttribute('data-i18n')) {
                        i18n.translateElement(node);
                    }
                    const elements = node.querySelectorAll('[data-i18n]');
                    elements.forEach(el => i18n.translateElement(el));
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return i18n;
}

if (typeof window !== 'undefined') {
    window.i18n = i18n;
}
