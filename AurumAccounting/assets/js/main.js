import { AurumI18n } from './core/i18n.js';
import { AurumStorage } from './core/storage.js';
import { AurumUI } from './ui/ui-manager.js';
import { AurumModal } from './components/modal.js';
import { AurumDropdown } from './components/dropdown.js';
import { AurumSidebar } from './components/sidebar.js';
import { AurumToast } from './components/toast.js';

const AurumApp = {
    pageModules: {},

    async init() {
        this.initI18n();
        await this.loadPartials();
        this.initComponents();
        this.initPageModule();
        this.setupLanguageSwitcher();
    },

    initI18n() {
        AurumI18n.init();
        const savedLang = AurumStorage.get('language') || this.detectBrowserLanguage();
        AurumI18n.setLanguage(savedLang);
    },

    detectBrowserLanguage() {
        const browserLang = navigator.language.slice(0, 2);
        const supported = AurumI18n.getSupportedLanguages();
        return supported.includes(browserLang) ? browserLang : 'en';
    },

    async loadPartials() {
        const isAppPage = document.body.classList.contains('app-page');
        if (! isAppPage) return;

        await this.loadPartial('appHeader', '../partials/app-header.php');
        await this.loadPartial('appSidebar', '../partials/app-sidebar.php');
        this.setActiveNav();
    },

    async loadPartial(elementId, path) {
        const container = document.getElementById(elementId);
        if (!container) return;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            const html = await response.text();
            container.innerHTML = html;
            AurumI18n.translate();
        } catch (error) {
            console.error(`Error loading partial ${path}:`, error);
        }
    },

    setActiveNav() {
        const pageName = document.body.dataset.page;
        if (!pageName) return;

        const navLink = document.querySelector(`[data-nav="${pageName}"]`);
        if (navLink) {
            navLink.classList.add('sidebar__link--active');
        }
    },

    initComponents() {
        // Legacy components (will be deprecated)
        AurumModal.init();
        AurumDropdown.init();
        AurumSidebar.init();
        AurumToast.init();

        const logoutBtns = document.querySelectorAll('[data-action="logout"]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleLogout());
        });
    },

    setupLanguageSwitcher() {
        const languageDropdown = document.querySelector('[data-dropdown="language"]');
        if (languageDropdown) {
            const currentLang = AurumI18n.getCurrentLanguage();
            this.updateLanguageTrigger(currentLang);

            // Populate language menu
            const menu = languageDropdown.querySelector('.dropdown__menu');
            if (menu && menu.children.length === 0) {
                const languages = {
                    'en': 'English',
                    'az': 'Azərbaycan',
                    'ru': 'Русский',
                    'tr': 'Türkçe',
                    'de': 'Deutsch'
                };

                Object.entries(languages).forEach(([code, name]) => {
                    const li = document.createElement('li');
                    const btn = document.createElement('button');
                    btn.className = 'dropdown__item';
                    btn.dataset.lang = code;
                    btn.textContent = name;
                    if (code === currentLang) {
                        btn.classList.add('dropdown__item--active');
                    }
                    li.appendChild(btn);
                    menu.appendChild(li);
                });
            }
        }

        // Listen for language change
        document.addEventListener('language-changed', (event) => {
            this.updateLanguageTrigger(event.detail.language);
        });
    },

    updateLanguageTrigger(lang) {
        const languageDropdown = document.querySelector('[data-dropdown="language"]');
        if (!languageDropdown) return;

        const trigger = languageDropdown.querySelector('.dropdown__trigger');
        if (trigger) {
            const langMap = {
                'en': 'EN',
                'az': 'AZ',
                'ru': 'RU',
                'tr': 'TR',
                'de': 'DE'
            };
            const triggerText = trigger.querySelector('span');
            if (triggerText) {
                triggerText.textContent = langMap[lang] || lang.toUpperCase();
            }
        }
    },

    async initPageModule() {
        const pageName = document.body.dataset.page;
        if (!pageName) {
            console.warn('⚠️ No page name found in body[data-page]');
            return;
        }

        console.log(`📄 Loading page module: ${pageName}`);

        try {
            const module = await import(`./pages/${pageName}.js`);
            if (module.default && typeof module.default.init === 'function') {
                console.log(`✅ Initializing ${pageName} module`);
                module.default.init();
            } else {
                console.warn(`⚠️ Module ${pageName} has no default export or init method`);
            }
        } catch (error) {
            console.warn(`⚠️ No module found for page: ${pageName}`, error);
        }
    },

    handleLogout() {
        AurumStorage.clear();
        window.location.href = '../login.php';
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    AurumApp.init();
});

// Expose globally for easy access
window.AurumApp = AurumApp;
window.AurumUI = AurumUI;
window.AurumI18n = AurumI18n;