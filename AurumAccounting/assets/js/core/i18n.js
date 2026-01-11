/**
 * Aurum i18n System
 * Handles multi-language translations
 *
 * @version 1.0.0
 */

import { AurumStorage } from './storage.js';

export class AurumI18n {
    constructor() {
        this.currentLanguage = 'az'; // Default language
        this.fallbackLanguage = 'en';
        this.translations = {};
        this.supportedLanguages = ['az', 'en', 'ru', 'tr', 'de'];
        this.isInitialized = false;
    }

    /**
     * Initialize i18n system
     */
    async init() {
        console.log('🌐 i18n:  Initializing...');

        try {
            // Load saved language or detect browser language
            this.currentLanguage = this.loadSavedLanguage();
            console.log('🌐 i18n: Detected language -', this.currentLanguage);

            // Load translations for current language
            await this.loadTranslations(this.currentLanguage);

            // Load fallback language if different
            if (this.currentLanguage !== this.fallbackLanguage) {
                await this.loadTranslations(this.fallbackLanguage);
            }

            this.isInitialized = true;
            console.log('✅ i18n:  Initialized successfully');

            return true;

        } catch (error) {
            console.error('❌ i18n:  Initialization failed:', error);

            // Use empty translations as fallback
            this.translations[this.currentLanguage] = {};
            this.isInitialized = true;

            return false;
        }
    }

    /**
     * Load saved language from localStorage or detect from browser
     */
    loadSavedLanguage() {
        // Try localStorage first
        const saved = AurumStorage.get('app_language');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        // Try user preference from user object
        const user = AurumStorage.get('current_user');
        if (user && user.language && this.supportedLanguages.includes(user.language)) {
            return user.language;
        }

        // Detect from browser
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // Default to Azerbaijani
        return 'az';
    }

    /**
     * Load translation file for a language
     */
    async loadTranslations(lang) {
        if (this.translations[lang]) {
            console.log(`🌐 i18n:  Translations for "${lang}" already loaded`);
            return;
        }

        try {
            console.log(`🌐 i18n: Loading translations for "${lang}"...`);

            // Construct correct path
            const path = `../assets/i18n/${lang}.json`;
            console.log(`🌐 i18n:  Fetching from ${path}`);

            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.translations[lang] = data;

            console.log(`✅ i18n: Loaded ${Object.keys(data).length} translations for "${lang}"`);

        } catch (error) {
            console.error(`❌ i18n: Failed to load translations for "${lang}":`, error.message);

            // Use empty object as fallback
            this.translations[lang] = {};

            // If this is current language, show user-friendly message
            if (lang === this.currentLanguage) {
                console.warn(`⚠️ i18n: Falling back to Azerbaijani... `);

                // Try to load Azerbaijani as last resort
                if (lang !== 'az') {
                    try {
                        const azResponse = await fetch('../assets/i18n/az.json');
                        if (azResponse.ok) {
                            this.translations['az'] = await azResponse.json();
                            this.currentLanguage = 'az';
                            console.log('✅ i18n: Loaded Azerbaijani as fallback');
                        }
                    } catch (fallbackError) {
                        console.error('❌ i18n: Even fallback failed');
                    }
                }
            }
        }
    }

    /**
     * Get translation for a key (supports nested keys)
     * @param {string} key - Translation key (e.g., "nav.item.dashboard")
     * @param {Object} params - Parameters for interpolation
     * @returns {string}
     */
    t(key, params = {}) {
        if (!key) return '';

        // Try current language
        let translation = this.getNestedValue(this.translations[this.currentLanguage], key);

        // Try fallback language
        if (!translation && this.currentLanguage !== this.fallbackLanguage) {
            translation = this.getNestedValue(this.translations[this.fallbackLanguage], key);
        }

        // Use key itself as last resort
        if (!translation) {
            console.warn(`⚠️ i18n:  Missing translation for key "${key}"`);
            return key;
        }

        // Replace parameters
        return this.interpolate(translation, params);
    }

    /**
     * Get nested value from object by dot notation
     * @param {Object} obj - Object to search in
     * @param {string} path - Dot notation path (e.g., "nav.item.dashboard")
     * @returns {*}
     */
    getNestedValue(obj, path) {
        if (!obj) return null;

        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current[key] === undefined) {
                return null;
            }
            current = current[key];
        }

        return current;
    }

    /**
     * Interpolate parameters in translation string
     */
    interpolate(text, params) {
        if (!params || Object.keys(params).length === 0) {
            return text;
        }

        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Change language
     */
    async changeLanguage(lang) {
        if (! this.supportedLanguages.includes(lang)) {
            console.error(`❌ i18n:  Unsupported language "${lang}"`);
            return false;
        }

        if (lang === this.currentLanguage) {
            console.log(`ℹ️ i18n: Language "${lang}" already active`);
            return true;
        }

        console.log(`🌐 i18n: Changing language to "${lang}"...`);

        // Load translations if not already loaded
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }

        // Set new language
        this.currentLanguage = lang;

        // Save to localStorage
        AurumStorage.set('app_language', lang);

        // Update user preference
        const user = AurumStorage.get('current_user');
        if (user) {
            user.language = lang;
            AurumStorage.set('current_user', user);
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        console.log(`✅ i18n: Language changed to "${lang}"`);

        return true;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return [... this.supportedLanguages];
    }

    /**
     * Check if language is supported
     */
    isLanguageSupported(lang) {
        return this.supportedLanguages.includes(lang);
    }

    /**
     * Get all translations for current language (for debugging)
     */
    getAllTranslations() {
        return { ...this.translations[this.currentLanguage] };
    }
}

// Export singleton instance
let i18nInstance = null;

export function getI18n() {
    if (!i18nInstance) {
        i18nInstance = new AurumI18n();
    }
    return i18nInstance;
}

export default AurumI18n;