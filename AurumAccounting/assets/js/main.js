/**
 * Aurum Accounting - Main Entry Point
 * @version 1.3.0
 */

import { AurumI18n } from './core/i18n.js';
import { initNavigation, getNavigationManager } from './core/navigation.js';
import { AurumStorage } from './core/storage.js';

class AurumApp {
    constructor() {
        this.i18n = null;
        this.navigation = null;
        this.currentUser = null;
        this.currentPage = null;
        this.isInitialized = false;
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Aurum Accounting v1.3.0 starting.. .');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        try {
            // 1. Initialize i18n
            await this.initializeI18n();

            // 2. Load user session
            this.loadUserSession();

            // 3. Render header
            this.renderHeader();

            // 4. Initialize navigation (sidebar)
            await this.initializeNavigation();

            // 5. Load page-specific module
            await this.loadPageModule();

            // 6. Bind global events
            this.bindGlobalEvents();

            // 7. Mark as initialized
            this.isInitialized = true;

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ Aurum Accounting initialized successfully');

            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('aurumReady', {
                detail: { timestamp: new Date() }
            }));

        } catch (error) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ Application initialization failed:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Initialize i18n system
     */
    async initializeI18n() {
        console.log('🌐 Initializing i18n.. .');

        this.i18n = new AurumI18n();
        await this.i18n.init();

        // Make i18n globally accessible
        window.aurumI18n = this.i18n;

        console.log('✅ i18n initialized - Language:', this.i18n.currentLanguage);
    }

    /**
     * Load user session from localStorage or set demo user
     */
    loadUserSession() {
        console.log('👤 Loading user session...');

        // Try to get from localStorage
        const storedUser = AurumStorage.get('current_user');

        if (storedUser) {
            this.currentUser = storedUser;
            console.log('✅ User session restored:', storedUser.name);
        } else {
            // Set demo user for development WITH ALL ROLES
            this.currentUser = {
                id: 1,
                name: 'Admin User',
                email: 'admin@aurum.az',
                company: 'Demo Company',
                roles: ['admin', 'accountant', 'viewer'],
                avatar: null,
                language: 'az'
            };

            // Save demo user
            AurumStorage.set('current_user', this.currentUser);

            console.log('✅ Demo user created:', this.currentUser.name);
            console.log('👤 User roles:', this.currentUser.roles);
        }

        // Make user globally accessible
        window.currentUser = this.currentUser;
    }

    /**
     * Render premium header with language switcher
     */
    renderHeader() {
        const headerContainer = document.getElementById('appHeader');

        if (!headerContainer) {
            console.warn('⚠️ Header container not found (#appHeader)');
            return;
        }

        console.log('📋 Rendering header...');

        const currentPageTitle = this.getPageTitle();

        // Safe language display
        const currentLang = this.i18n?.currentLanguage || 'az';
        const langDisplay = this.getLanguageName(currentLang);

        // User info
        const userName = this.currentUser?.name || 'Admin User';
        const userInitials = this.getUserInitials();

        headerContainer.innerHTML = `
      <header class="app-header">
        <!-- Left Section -->
        <div class="app-header__left">
          <button class="app-header__menu-btn" id="sidebarToggle" type="button" aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          
          <div class="app-header__brand">
            <div class="app-header__logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="url(#logo-gradient)" stroke="#6C91C2" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6C91C2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4A73A8;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="app-header__brand-text">
              <span class="app-header__brand-name">Aurum</span>
              <span class="app-header__brand-suffix">Accounting</span>
            </div>
          </div>
        </div>

        <!-- Center Section -->
        <div class="app-header__center">
          <div class="app-header__page-info">
            <h1 class="app-header__page-title">${this.escapeHtml(currentPageTitle)}</h1>
            <div class="app-header__breadcrumb">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span>Dashboard</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span>${this.escapeHtml(currentPageTitle)}</span>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="app-header__right">
          <!-- Quick Actions -->
          <button class="app-header__action-btn" type="button" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span class="app-header__badge">3</span>
          </button>

          <!-- Language Switcher -->
          <div class="app-header__language" id="languageSwitcherContainer">
            <button class="app-header__language-btn" id="languageSwitcher" type="button" aria-label="Change language" aria-haspopup="true" aria-expanded="false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <span class="app-header__language-label" id="currentLanguageLabel">${langDisplay}</span>
              <svg class="app-header__language-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

          <!-- User Menu -->
          <div class="app-header__user">
            <button class="app-header__user-btn" id="userMenuToggle" type="button" aria-label="User menu">
              <div class="app-header__user-avatar">
                ${this.escapeHtml(userInitials)}
                <div class="app-header__user-status"></div>
              </div>
              <div class="app-header__user-info">
                <span class="app-header__user-name">${this.escapeHtml(userName)}</span>
                <span class="app-header__user-role">Administrator</span>
              </div>
              <svg class="app-header__user-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;

        // Bind header events
        this.bindHeaderEvents();

        console.log('✅ Header rendered');
    }

    /**
     * Get language display name
     */
    getLanguageName(code) {
        const names = {
            'az': 'AZ',
            'en': 'EN',
            'ru':  'RU',
            'tr': 'TR',
            'de': 'DE'
        };
        return names[code] || code.toUpperCase();
    }

    /**
     * Get user initials for avatar
     */
    getUserInitials() {
        if (!this.currentUser || !this.currentUser.name) return 'AU';

        const names = this.currentUser.name.split(' ');
        if (names.length >= 2) {
            return names[0][0] + names[1][0];
        }
        return names[0][0] + (names[0][1] || '');
    }

    /**
     * Get current page title
     */
    getPageTitle() {
        this.currentPage = document.body.dataset.page || 'dashboard';

        const pageTitles = {
            'dashboard':  'Dashboard',
            'chart-of-accounts': 'Chart of Accounts',
            'journal': 'Journal Entries',
            'sales-invoices': 'Sales Invoices',
            'purchase-bills': 'Purchase Bills',
            'payments': 'Payments',
            'reports-trial-balance': 'Trial Balance',
            'reports-general-ledger': 'General Ledger',
            'reports-financial-statements': 'Financial Statements'
        };

        return pageTitles[this.currentPage] || 'Aurum Accounting';
    }

    /**
     * Initialize navigation (sidebar)
     */
    async initializeNavigation() {
        console.log('🧭 Initializing navigation...');

        try {
            // Initialize navigation with i18n
            this.navigation = await initNavigation(this.i18n, '#appSidebar');

            // Make navigation globally accessible
            window.navigationManager = this.navigation;

            console.log('✅ Navigation initialized');
            console.log('📊 Navigation stats:', this.navigation.getStats());

        } catch (error) {
            console.error('❌ Navigation initialization failed:', error);
            throw error;
        }
    }

    /**
     * Load page-specific module
     */
    async loadPageModule() {
        if (!this.currentPage) {
            console.warn('⚠️ No page specified');
            return;
        }

        console.log(`📄 Loading page module: ${this.currentPage}... `);

        try {
            const module = await import(`./pages/${this.currentPage}.js`);

            if (module.default && typeof module.default.init === 'function') {
                await module.default.init();
                console.log(`✅ Page module loaded: ${this.currentPage}`);
            } else {
                console.warn(`⚠️ Page module has no init function: ${this.currentPage}`);
            }

        } catch (error) {
            console.warn(`⚠️ Page module not found or failed to load: ${this.currentPage}`, error.message);
        }
    }

    /**
     * Bind header events
     */
    bindHeaderEvents() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
            });
        }

        // Language switcher
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageMenu();
            });
        }

        // User menu toggle
        const userMenuToggle = document.getElementById('userMenuToggle');
        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', () => {
                this.showUserMenu();
            });
        }
    }

    /**
     * Toggle language selection menu
     */
    toggleLanguageMenu() {
        const container = document.getElementById('languageSwitcherContainer');
        const existingMenu = document.getElementById('languageMenu');

        // If menu exists, close it
        if (existingMenu) {
            this.closeLanguageMenu();
            return;
        }

        // Create menu
        const languages = [
            { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
            { code: 'en', name:  'English', flag: '🇬🇧' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'tr', name:  'Türkçe', flag: '🇹🇷' },
            { code:  'de', name: 'Deutsch', flag: '🇩🇪' }
        ];

        const currentLang = this.i18n?.currentLanguage || 'az';

        const menu = document.createElement('div');
        menu.id = 'languageMenu';
        menu.className = 'language-menu';
        menu.setAttribute('role', 'menu');

        menu.innerHTML = languages.map(lang => `
      <button 
        class="language-menu__item ${lang.code === currentLang ? 'language-menu__item--active' :  ''}"
        data-lang="${lang.code}"
        role="menuitem"
        type="button"
      >
        <span class="language-menu__flag">${lang.flag}</span>
        <span class="language-menu__name">${lang.name}</span>
        ${lang.code === currentLang ?  '<svg class="language-menu__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </button>
    `).join('');

        container.appendChild(menu);

        // Update aria-expanded
        const switcher = document.getElementById('languageSwitcher');
        if (switcher) {
            switcher.setAttribute('aria-expanded', 'true');
        }

        // Animate in
        requestAnimationFrame(() => {
            menu.classList.add('language-menu--visible');
        });

        // Bind click events
        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-lang]');
            if (btn) {
                const newLang = btn.dataset.lang;
                this.changeLanguage(newLang);
            }
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', this.closeLanguageMenuHandler);
        }, 100);
    }

    /**
     * Close language menu
     */
    closeLanguageMenu() {
        const menu = document.getElementById('languageMenu');
        if (menu) {
            menu.classList.remove('language-menu--visible');

            setTimeout(() => {
                menu.remove();

                const switcher = document.getElementById('languageSwitcher');
                if (switcher) {
                    switcher.setAttribute('aria-expanded', 'false');
                }
            }, 200);
        }

        document.removeEventListener('click', this.closeLanguageMenuHandler);
    }

    /**
     * Close menu handler
     */
    closeLanguageMenuHandler = (e) => {
        const menu = document.getElementById('languageMenu');
        const switcher = document.getElementById('languageSwitcher');

        if (menu && ! menu.contains(e.target) && ! switcher.contains(e.target)) {
            this.closeLanguageMenu();
        }
    }

    /**
     * Change application language
     */
    async changeLanguage(langCode) {
        console.log(`🌐 Changing language to: ${langCode}`);

        try {
            // Change language in i18n
            await this.i18n.changeLanguage(langCode);

            // Update header label
            const label = document.getElementById('currentLanguageLabel');
            if (label) {
                label.textContent = this.getLanguageName(langCode);
            }

            // Close menu
            this.closeLanguageMenu();

            // Dispatch custom event for app
            window.dispatchEvent(new CustomEvent('app: langChanged', {
                detail: { lang: langCode }
            }));

            console.log(`✅ Language changed to: ${langCode}`);

        } catch (error) {
            console.error('❌ Failed to change language:', error);
        }
    }

    /**
     * Show user menu
     */
    showUserMenu() {
        alert('User menu - To be implemented in Phase 1 (Authentication)');
    }

    /**
     * Bind global events
     */
    bindGlobalEvents() {
        console.log('🔗 Binding global events...');

        // Handle language change
        document.addEventListener('languageChanged', (e) => {
            console.log('🌐 Language changed event received:', e.detail.language);
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape - Close menus
            if (e.key === 'Escape') {
                this.closeLanguageMenu();

                document.querySelectorAll('.modal: not([hidden])').forEach(modal => {
                    modal.setAttribute('hidden', '');
                });
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
        });

        window.addEventListener('offline', () => {
            console.warn('⚠️ Connection lost');
        });

        console.log('✅ Global events bound');
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const container = document.body;

        container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="max-width: 600px; background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E17B77" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 style="font-size: 1.5rem; font-weight: 700; color:  #1a202c; margin-bottom: 1rem; text-align: center;">
            Application Failed to Initialize
          </h1>
          <p style="color: #4a5568; margin-bottom: 1.5rem; text-align: center;">
            An error occurred while loading Aurum Accounting. Please try refreshing the page.
          </p>
          <details style="margin-bottom: 1.5rem; padding: 1rem; background: #f7fafc; border-radius: 8px; border:  1px solid #e2e8f0;">
            <summary style="cursor: pointer; font-weight: 600; color: #2d3748;">Error Details</summary>
            <pre style="margin-top: 1rem; padding: 0.5rem; background: white; border-radius: 4px; overflow:  auto; font-size: 0.875rem; color: #e53e3e;">${error.message}\n\n${error.stack}</pre>
          </details>
          <button onclick="window.location.reload()" style="width: 100%; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new AurumApp();
        app.init();

        // Make app globally accessible for debugging
        window.aurumApp = app;
    });
} else {
    // DOM already loaded
    const app = new AurumApp();
    app.init();
    window.aurumApp = app;
}