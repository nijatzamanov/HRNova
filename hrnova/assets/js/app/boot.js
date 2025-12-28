import { menuConfig, filterMenuByPermissions } from './menuConfig.js';
import { AuthService, initializeMockUser } from '../services/auth.js';
import { i18n } from '../services/i18n.js';
import { initModals } from '../ui/modal.js';
import { initDropdowns } from '../ui/dropdown.js';
import { highlightActiveMenuItem } from './navigation.js';
import { showSuccess } from '../ui/toast.js';

export async function loadPartial(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load partial: ${url}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading partial:', error);
        return '';
    }
}

export function renderSidebar() {
    const userPermissions = AuthService.getUserPermissions();
    const allowedMenuItems = filterMenuByPermissions(userPermissions);
    const currentPath = window.location.pathname;

    const menuItemsHTML = allowedMenuItems.map(item => {
        const isActive = currentPath.includes(item.key) ||
            (item.key === 'dashboard' && currentPath.includes('dashboard'));
        const activeClass = isActive ? 'sidebar__menu-item--active' : '';
        const translatedLabel = i18n.translate(`menu.${item.key}`);

        return `
      <li>
        <a href="${item.href}" class="sidebar__menu-item ${activeClass}" data-page="${item.key}" data-nav>
          ${item.icon}
          <span class="sidebar__menu-text" data-i18n="menu.${item.key}">${translatedLabel}</span>
        </a>
      </li>
    `;
    }).join('');

    const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__header">
        <a href="/src/pages/dashboard.html" class="sidebar__logo" data-nav>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="currentColor"/>
            <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white"/>
          </svg>
          <span>HRNova</span>
        </a>
      </div>

      <nav class="sidebar__nav">
        <ul class="sidebar__menu">
          ${menuItemsHTML}
        </ul>
      </nav>

      <div class="sidebar__footer">
        <button class="sidebar__menu-item" id="logoutBtn">
          <svg class="sidebar__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="sidebar__menu-text" data-i18n="menu.logout">${i18n.translate('menu.logout')}</span>
        </button>
      </div>
    </aside>

    <div class="sidebar__overlay" id="sidebarOverlay"></div>
  `;

    return sidebarHTML;
}

function initGlobalEventDelegation() {
    document.addEventListener('click', (e) => {
        const languageOption = e.target.closest('[data-lang]');
        if (languageOption) {
            e.preventDefault();
            const lang = languageOption.getAttribute('data-lang');
            i18n.changeLanguage(lang);

            const dropdown = languageOption.closest('[data-dropdown]');
            if (dropdown) {
                const menu = dropdown.querySelector('[data-dropdown-menu]');
                if (menu) {
                    menu.classList.remove('dropdown__menu--active');
                }
            }
        }

        const logoutBtn = e.target.closest('#logoutBtn, #logoutBtnTop');
        if (logoutBtn) {
            e.preventDefault();
            handleLogout();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const event = new CustomEvent('global:escape');
            document.dispatchEvent(event);
        }
    });
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showSuccess('Logged out successfully');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    }
}

window.showSuccess = showSuccess;

export async function initializeApp() {
    await import('../services/i18n.js').then(module => module.initI18n());

    initializeMockUser();

    const sidebarMount = document.getElementById('sidebar-mount');
    const topbarMount = document.getElementById('topbar-mount');

    if (sidebarMount) {
        const sidebarHTML = renderSidebar();
        sidebarMount.innerHTML = sidebarHTML;
    }

    if (topbarMount) {
        const topbarHTML = await loadPartial('../partials/topbar.php');
        topbarMount.innerHTML = topbarHTML;
    }

    await import('./navigation.js').then(module => module.initNavigation());
    await import('../ui/sidebar.js').then(module => module.initSidebar());
    await import('../ui/toast.js').then(module => module.initToast());

    initModals();
    initDropdowns();
    initGlobalEventDelegation();

    highlightActiveMenuItem();

    i18n.subscribe((lang) => {
        const sidebarMount = document.getElementById('sidebar-mount');
        if (sidebarMount) {
            const sidebarHTML = renderSidebar();
            sidebarMount.innerHTML = sidebarHTML;
            import('../ui/sidebar.js').then(module => module.initSidebar());
            highlightActiveMenuItem();
        }
    });

    await import('./menu-demo.js');

    console.log('Application booted successfully');
}

document.addEventListener('DOMContentLoaded', initializeApp);
