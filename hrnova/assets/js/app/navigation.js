import { menuConfig, getMenuItemByKey } from './menuConfig.js';

export function initNavigation() {
    const pageName = getCurrentPageKey();
    updatePageTitle(pageName);
}

export function getCurrentPageKey() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop().replace('.php', '');
    return fileName || 'dashboard';
}

export function updatePageTitle(pageKey) {
    const titleElement = document.getElementById('pageTitle');
    if (!titleElement) return;

    const menuItem = getMenuItemByKey(pageKey);
    const pageTitle = menuItem?.label || 'Dashboard';

    titleElement.textContent = pageTitle;
    document.title = `${pageTitle} - HRNova`;
}

export function highlightActiveMenuItem() {
    const currentPage = getCurrentPageKey();
    const menuItems = document.querySelectorAll('.sidebar__menu-item');

    menuItems.forEach(item => {
        const pageKey = item.getAttribute('data-page');
        if (pageKey === currentPage) {
            item.classList.add('sidebar__menu-item--active');
        } else {
            item.classList.remove('sidebar__menu-item--active');
        }
    });
}
