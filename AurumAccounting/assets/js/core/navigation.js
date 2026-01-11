/**
 * Navigation Manager with Sub-Menu Accordion Support
 * @version 1.2.0
 */

import { AurumI18n } from './i18n.js';
import { AurumStorage } from './storage.js';

export class NavigationManager {
    constructor() {
        this.navigation = null;
        this.featureFlags = null;
        this.userRoles = [];
        this.currentUser = null;
        this.i18n = null;
        this.sidebarElement = null;
        this.collapsedGroups = new Set();
        this.openSubMenus = new Set(); // Track open sub-menus for accordion
        this.isInitialized = false;
    }

    /**
     * Initialize navigation system
     */
    async init(i18nInstance, sidebarSelector = '#appSidebar') {
        try {
            console.log('🧭 Navigation Manager initializing...');

            this.i18n = i18nInstance;

            this.sidebarElement = document.querySelector(sidebarSelector);
            if (!this.sidebarElement) {
                console.warn(`⚠️ Sidebar element not found: ${sidebarSelector}`);
                return false;
            }

            this.loadUserData();
            await this.loadNavigationData();
            await this.loadFeatureFlags();
            this.loadCollapsedState();
            this.loadOpenSubMenus(); // Load open sub-menus state
            this.render();
            this.setActivePage();
            this.bindEvents();

            this.isInitialized = true;
            console.log('✅ Navigation Manager initialized successfully');
            return true;

        } catch (error) {
            console.error('❌ Navigation Manager initialization failed:', error);
            return false;
        }
    }

    /**
     * Load user data from localStorage
     */
    loadUserData() {
        const storedUser = AurumStorage.get('current_user');

        if (storedUser) {
            this.currentUser = storedUser;
            this.userRoles = storedUser.roles || ['viewer'];
        } else {
            // Create demo user with all roles
            this.currentUser = {
                id: 1,
                name: 'Admin User',
                email: 'admin@aurum.az',
                company: 'Demo Company',
                roles: ['admin', 'accountant', 'viewer'],
                avatar: null,
                language: 'az'
            };
            this.userRoles = this.currentUser.roles;

            // Save to localStorage
            AurumStorage.set('current_user', this.currentUser);
        }

        console.log('👤 User loaded:', this.currentUser.name, 'Roles:', this.userRoles);
    }

    /**
     * Load navigation configuration from JSON
     */
    async loadNavigationData() {
        try {
            const response = await fetch('../assets/data/navigation.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.navigation = await response.json();
            console.log('✅ Navigation data loaded:', this.navigation.groups.length, 'groups');

        } catch (error) {
            console.error('❌ Failed to load navigation data:', error);

            // Fallback to minimal navigation
            this.navigation = {
                version: '1.0.0',
                groups: [
                    {
                        id: 'overview',
                        titleKey: 'nav.group.overview',
                        iconKey: 'layout-dashboard',
                        items: [
                            {
                                id: 'dashboard',
                                labelKey: 'nav.item.dashboard',
                                route: '../app/dashboard.php',
                                iconKey: 'home',
                                requiredRoles: ['viewer', 'accountant', 'admin'],
                                featureFlag: null
                            }
                        ]
                    }
                ]
            };
        }
    }

    /**
     * Load feature flags from JSON
     */
    async loadFeatureFlags() {
        try {
            const response = await fetch('../assets/data/feature-flags.json');

            if (! response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.featureFlags = data.flags || {};

            console.log('✅ Feature flags loaded:', Object.keys(this.featureFlags).length, 'flags');

        } catch (error) {
            console.error('❌ Failed to load feature flags:', error);
            this.featureFlags = {};
        }
    }

    /**
     * Load collapsed groups state from localStorage
     */
    loadCollapsedState() {
        const collapsed = AurumStorage.get('sidebar_collapsed_groups') || [];
        this.collapsedGroups = new Set(collapsed);
    }

    /**
     * Save collapsed groups state to localStorage
     */
    saveCollapsedState() {
        AurumStorage.set('sidebar_collapsed_groups', Array.from(this.collapsedGroups));
    }

    /**
     * Load open sub-menus state from localStorage
     */
    loadOpenSubMenus() {
        const open = AurumStorage.get('sidebar_open_submenus') || [];
        this.openSubMenus = new Set(open);
    }

    /**
     * Save open sub-menus state to localStorage
     */
    saveOpenSubMenus() {
        AurumStorage.set('sidebar_open_submenus', Array.from(this.openSubMenus));
    }

    /**
     * Check if navigation item should be visible
     */
    isItemVisible(item) {
        // Check feature flag
        if (item.featureFlag) {
            const flagValue = this.featureFlags[item.featureFlag];
            if (flagValue === false) {
                return false;
            }
        }

        // Check user roles
        if (item.requiredRoles && item.requiredRoles.length > 0) {
            const hasRequiredRole = item.requiredRoles.some(role =>
                this.userRoles.includes(role)
            );

            if (!hasRequiredRole) {
                return false;
            }
        }

        return true;
    }

    /**
     * Process items including sub-items
     */
    processItems(items) {
        if (!items || ! Array.isArray(items)) return [];

        return items
            .map(item => {
                // Check if item itself is visible
                if (! this.isItemVisible(item)) {
                    return null;
                }

                const processedItem = {
                    ...item,
                    label: this.i18n ?  this.i18n.t(item.labelKey) : item.labelKey
                };

                // Process sub-items if exists
                if (item.hasSubItems && item.subItems && Array.isArray(item.subItems)) {
                    const visibleSubItems = item.subItems
                        .filter(sub => this.isItemVisible(sub))
                        .map(sub => ({
                            ...sub,
                            label: this.i18n ?  this.i18n.t(sub.labelKey) : sub.labelKey
                        }));

                    // Only include parent if it has visible sub-items
                    if (visibleSubItems.length > 0) {
                        processedItem.subItems = visibleSubItems;
                    } else {
                        return null; // Hide parent if no visible sub-items
                    }
                }

                return processedItem;
            })
            .filter(item => item !== null);
    }

    /**
     * Get filtered and translated navigation groups
     */
    getVisibleGroups() {
        if (!this.navigation || !this.navigation.groups) {
            return [];
        }

        return this.navigation.groups
            .map(group => {
                const visibleItems = this.processItems(group.items);

                if (visibleItems.length === 0) {
                    return null;
                }

                return {
                    ...group,
                    title: this.i18n ? this.i18n.t(group.titleKey) : group.titleKey,
                    items: visibleItems,
                    isCollapsed: this.collapsedGroups.has(group.id)
                };
            })
            .filter(group => group !== null);
    }

    /**
     * Render sidebar navigation with sub-menu support
     */
    render() {
        if (!this.sidebarElement) {
            console.warn('⚠️ Cannot render:  sidebar element not found');
            return;
        }

        const visibleGroups = this.getVisibleGroups();

        if (visibleGroups.length === 0) {
            this.sidebarElement.innerHTML = `
        <div class="sidebar__empty">
          <p>No navigation items available</p>
        </div>
      `;
            return;
        }

        // Build navigation HTML
        let html = '<nav class="sidebar__nav" aria-label="Main navigation">';

        visibleGroups.forEach(group => {
            const collapsedClass = group.isCollapsed ? 'sidebar__group--collapsed' : '';

            html += `
        <div class="sidebar__group ${collapsedClass}" data-group-id="${group.id}">
          <button 
            class="sidebar__group-header" 
            type="button"
            aria-expanded="${! group.isCollapsed}"
            aria-controls="nav-group-${group.id}"
          >
            <span class="sidebar__group-title">${this.escapeHtml(group.title)}</span>
            <svg class="sidebar__group-toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <ul class="sidebar__menu" id="nav-group-${group.id}" role="list">
      `;

            group.items.forEach(item => {
                // Check if item has sub-items
                if (item.hasSubItems && item.subItems && item.subItems.length > 0) {
                    const subMenuId = `submenu-${item.id}`;
                    const isSubMenuOpen = this.openSubMenus.has(subMenuId);
                    const subMenuClass = isSubMenuOpen ? '' : 'sidebar__submenu--collapsed';

                    html += `
            <li class="sidebar__item sidebar__item--parent">
              <button 
                class="sidebar__link sidebar__link--parent" 
                type="button"
                data-submenu-toggle="${subMenuId}"
                aria-expanded="${isSubMenuOpen}"
              >
                ${this.renderIcon(item.iconKey)}
                <span class="sidebar__label">${this.escapeHtml(item.label)}</span>
                <svg class="sidebar__submenu-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <ul class="sidebar__submenu ${subMenuClass}" id="${subMenuId}">
          `;

                    item.subItems.forEach(subItem => {
                        html += `
              <li class="sidebar__subitem">
                <a 
                  href="${subItem.route}" 
                  class="sidebar__sublink" 
                  data-nav-id="${subItem.id}"
                  data-page="${this.getPageFromRoute(subItem.route)}"
                >
                  <span class="sidebar__sublabel">${this.escapeHtml(subItem.label)}</span>
                </a>
              </li>
            `;
                    });

                    html += `
              </ul>
            </li>
          `;
                } else {
                    // Regular item (no sub-items)
                    html += `
            <li class="sidebar__item">
              <a 
                href="${item.route}" 
                class="sidebar__link" 
                data-nav-id="${item.id}"
                data-page="${this.getPageFromRoute(item.route)}"
              >
                ${this.renderIcon(item.iconKey)}
                <span class="sidebar__label">${this.escapeHtml(item.label)}</span>
              </a>
            </li>
          `;
                }
            });

            html += `
          </ul>
        </div>
      `;
        });

        html += '</nav>';

        // Render footer
        html += `
      <div class="sidebar__footer">
        <div class="sidebar__credits">
          <div class="sidebar__version">v1.0.0</div>
          <div class="sidebar__company">
            <span>Developed by</span>
            <strong>Aildco</strong>
          </div>
        </div>
      </div>
    `;

        this.sidebarElement.innerHTML = html;
    }

    /**
     * Render icon using Lucide icon system
     */
    renderIcon(iconKey) {
        const paths = this.getIconPath(iconKey);

        return `
      <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="${iconKey}">
        ${paths}
      </svg>
    `;
    }

    /**
     * Get icon SVG path by key
     */
    getIconPath(iconKey) {
        const icons = {
            'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
            'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
            'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
            'list-tree': '<path d="M21 12h-8"/><path d="M21 6h-8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>',
            'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
            'book':  '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
            'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
            'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
            'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
            'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
            'file-minus': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/>',
            'receipt': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/>',
            'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
            'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
            'file-input': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/>',
            'file-plus': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 18v-6"/>',
            'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
            'building': '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
            'landmark': '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
            'wallet': '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
            'arrow-left-right': '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
            'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
            'percent': '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
            'file-badge': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><circle cx="12" cy="13" r="2"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
            'file-bar-chart': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 18v-2"/><path d="M12 18v-4"/><path d="M16 18v-6"/>',
            'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
            'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
            'grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
            'trending-down': '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
            'activity': '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
            'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
            'timer': '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
            'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
            'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
            'user-cog': '<circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/>',
            'hash': '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
            'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
            'file-search': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="M13.3 16.3 15 18"/>'
        };

        return icons[iconKey] || '<circle cx="12" cy="12" r="10"/>';
    }

    /**
     * Extract page identifier from route
     */
    getPageFromRoute(route) {
        const match = route.match(/\/([^\/]+)\.php/);
        return match ? match[1] : '';
    }

    /**
     * Set active page based on current URL
     */
    setActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = this.getPageFromRoute(currentPath);

        // Remove all active states
        this.sidebarElement.querySelectorAll('.sidebar__link, .sidebar__sublink').forEach(link => {
            link.classList.remove('sidebar__link--active', 'sidebar__sublink--active');
        });

        if (currentPage) {
            const activeLink = this.sidebarElement.querySelector(`[data-page="${currentPage}"]`);

            if (activeLink) {
                // Check if it's a sub-link
                if (activeLink.classList.contains('sidebar__sublink')) {
                    activeLink.classList.add('sidebar__sublink--active');

                    // Find parent sub-menu and open it
                    const parentSubmenu = activeLink.closest('.sidebar__submenu');
                    if (parentSubmenu) {
                        const submenuId = parentSubmenu.id;

                        // Open this sub-menu (close others due to accordion)
                        this.openSubMenus.clear(); // Clear others
                        this.openSubMenus.add(submenuId);

                        parentSubmenu.classList.remove('sidebar__submenu--collapsed');
                        const toggle = this.sidebarElement.querySelector(`[data-submenu-toggle="${submenuId}"]`);
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'true');
                        }

                        this.saveOpenSubMenus();
                    }
                } else {
                    // Regular link
                    activeLink.classList.add('sidebar__link--active');
                }

                // Expand parent group if collapsed
                const group = activeLink.closest('.sidebar__group');
                if (group && group.classList.contains('sidebar__group--collapsed')) {
                    const groupId = group.dataset.groupId;
                    this.expandGroup(groupId);
                }
            }
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Group toggle
        this.sidebarElement.addEventListener('click', (e) => {
            const groupHeader = e.target.closest('.sidebar__group-header');

            if (groupHeader) {
                e.preventDefault();
                const group = groupHeader.closest('.sidebar__group');
                const groupId = group.dataset.groupId;
                this.toggleGroup(groupId);
            }
        });

        // Sub-menu toggle
        this.sidebarElement.addEventListener('click', (e) => {
            const subMenuToggle = e.target.closest('[data-submenu-toggle]');

            if (subMenuToggle) {
                e.preventDefault();
                const subMenuId = subMenuToggle.dataset.submenuToggle;
                this.toggleSubMenu(subMenuId);
            }
        });

        // Navigation links
        this.sidebarElement.addEventListener('click', (e) => {
            const link = e.target.closest('.sidebar__link');

            if (link && !link.classList.contains('sidebar__link--parent')) {
                // Update active state
                this.sidebarElement.querySelectorAll('.sidebar__link').forEach(l => {
                    l.classList.remove('sidebar__link--active');
                });
                link.classList.add('sidebar__link--active');
            }

            // Sub-links
            const subLink = e.target.closest('.sidebar__sublink');
            if (subLink) {
                this.sidebarElement.querySelectorAll('.sidebar__sublink').forEach(l => {
                    l.classList.remove('sidebar__sublink--active');
                });
                subLink.classList.add('sidebar__sublink--active');
            }
        });

        // Listen for language change
        document.addEventListener('languageChanged', () => {
            console.log('🌐 Language changed, re-rendering navigation');
            this.render();
            this.setActivePage();
        });

        // Listen for user role change
        document.addEventListener('userRoleChanged', (e) => {
            console.log('👤 User role changed:', e.detail);
            this.userRoles = e.detail.roles || [];
            this.render();
            this.setActivePage();
        });
    }

    /**
     * Toggle group collapse state
     */
    toggleGroup(groupId) {
        if (this.collapsedGroups.has(groupId)) {
            this.expandGroup(groupId);
        } else {
            this.collapseGroup(groupId);
        }
    }

    /**
     * Expand a group
     */
    expandGroup(groupId) {
        this.collapsedGroups.delete(groupId);
        this.saveCollapsedState();

        const group = this.sidebarElement.querySelector(`[data-group-id="${groupId}"]`);
        if (group) {
            group.classList.remove('sidebar__group--collapsed');

            const header = group.querySelector('.sidebar__group-header');
            if (header) {
                header.setAttribute('aria-expanded', 'true');
            }
        }
    }

    /**
     * Collapse a group
     */
    collapseGroup(groupId) {
        this.collapsedGroups.add(groupId);
        this.saveCollapsedState();

        const group = this.sidebarElement.querySelector(`[data-group-id="${groupId}"]`);
        if (group) {
            group.classList.add('sidebar__group--collapsed');

            const header = group.querySelector('.sidebar__group-header');
            if (header) {
                header.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /**
     * Toggle sub-menu with accordion behavior
     */
    toggleSubMenu(subMenuId) {
        const subMenu = this.sidebarElement.querySelector(`#${subMenuId}`);
        const toggle = this.sidebarElement.querySelector(`[data-submenu-toggle="${subMenuId}"]`);

        if (!subMenu || !toggle) return;

        const isCurrentlyOpen = this.openSubMenus.has(subMenuId);

        if (isCurrentlyOpen) {
            // Close this sub-menu
            subMenu.classList.add('sidebar__submenu--collapsed');
            toggle.setAttribute('aria-expanded', 'false');
            this.openSubMenus.delete(subMenuId);
        } else {
            // ACCORDION BEHAVIOR:  Close all other sub-menus first
            this.openSubMenus.forEach(openId => {
                const otherSubMenu = this.sidebarElement.querySelector(`#${openId}`);
                const otherToggle = this.sidebarElement.querySelector(`[data-submenu-toggle="${openId}"]`);

                if (otherSubMenu && otherToggle) {
                    otherSubMenu.classList.add('sidebar__submenu--collapsed');
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Clear the set
            this.openSubMenus.clear();

            // Now open the clicked sub-menu
            subMenu.classList.remove('sidebar__submenu--collapsed');
            toggle.setAttribute('aria-expanded', 'true');
            this.openSubMenus.add(subMenuId);
        }

        // Save state
        this.saveOpenSubMenus();
    }

    /**
     * Programmatically navigate to a page
     */
    navigateTo(itemId) {
        const allItems = this.navigation.groups
            .flatMap(group => group.items)
            .find(item => item.id === itemId);

        if (allItems && this.isItemVisible(allItems)) {
            window.location.href = allItems.route;
        } else {
            console.warn(`⚠️ Navigation item not found or not accessible: ${itemId}`);
        }
    }

    /**
     * Get navigation item by ID
     */
    getItem(itemId) {
        if (! this.navigation) return null;

        for (const group of this.navigation.groups) {
            const item = group.items.find(i => i.id === itemId);
            if (item) {
                return {
                    ...item,
                    label: this.i18n ?  this.i18n.t(item.labelKey) : item.labelKey
                };
            }
        }

        return null;
    }

    /**
     * Check if feature is enabled
     */
    isFeatureEnabled(featureFlag) {
        if (!featureFlag) return true;
        return this.featureFlags[featureFlag] !== false;
    }

    /**
     * Check if user has required role
     */
    hasRole(roles) {
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.some(role => this.userRoles.includes(role));
    }

    /**
     * Refresh navigation
     */
    refresh() {
        if (! this.isInitialized) {
            console.warn('⚠️ Navigation not initialized yet');
            return;
        }

        console.log('🔄 Refreshing navigation...');
        this.render();
        this.setActivePage();
    }

    /**
     * Destroy navigation manager
     */
    destroy() {
        if (this.sidebarElement) {
            this.sidebarElement.innerHTML = '';
        }

        this.navigation = null;
        this.featureFlags = null;
        this.userRoles = [];
        this.currentUser = null;
        this.collapsedGroups.clear();
        this.openSubMenus.clear();
        this.isInitialized = false;

        console.log('🗑️ Navigation Manager destroyed');
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get navigation statistics
     */
    getStats() {
        const visibleGroups = this.getVisibleGroups();
        const totalItems = visibleGroups.reduce((sum, g) => sum + g.items.length, 0);

        return {
            totalGroups: this.navigation ?  this.navigation.groups.length :  0,
            visibleGroups: visibleGroups.length,
            totalItems: totalItems,
            userRoles: this.userRoles,
            collapsedGroups: Array.from(this.collapsedGroups),
            openSubMenus: Array.from(this.openSubMenus)
        };
    }
}

// Singleton instance
let navigationInstance = null;

/**
 * Get or create navigation manager instance
 */
export function getNavigationManager() {
    if (!navigationInstance) {
        navigationInstance = new NavigationManager();
    }
    return navigationInstance;
}

/**
 * Initialize navigation
 */
export async function initNavigation(i18nInstance, sidebarSelector = '#appSidebar') {
    const manager = getNavigationManager();
    await manager.init(i18nInstance, sidebarSelector);
    return manager;
}

export default NavigationManager;