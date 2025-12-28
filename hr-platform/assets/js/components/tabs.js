// tabs.js - Tabs Component (Enhanced for page-tabs)
(function() {
    'use strict';

    class Tabs {
        constructor(element) {
            this.element = element;

            // Support both .tabs__tab and .page-tabs__tab
            this.tabs = Array.from(
                element.querySelectorAll('.tabs__tab, .page-tabs__tab')
            );

            // Support both .tabs__panel and .page-tab-panel
            this.panels = Array.from(
                element.querySelectorAll('.tabs__panel, .page-tab-panel')
            );

            this.currentIndex = this.findActiveIndex();

            this.init();
        }

        findActiveIndex() {
            const activeTab = this.tabs.findIndex(tab =>
                tab.classList.contains('tabs__tab--active') ||
                tab.classList.contains('page-tabs__tab--active')
            );
            return activeTab >= 0 ? activeTab : 0;
        }

        init() {
            // Tab clicks
            this.tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => this.switchTab(index));
            });

            // Keyboard navigation
            this.element.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previous();
                }
            });
        }

        switchTab(index) {
            if (index === this.currentIndex) return;

            // Get tab identifier
            const targetTab = this.tabs[index];
            const tabId = targetTab.dataset.tab;

            // Remove active from all
            this.tabs.forEach(tab => {
                tab.classList.remove('tabs__tab--active', 'page-tabs__tab--active');
                tab.setAttribute('aria-selected', 'false');
            });

            this.panels.forEach(panel => {
                panel.classList.remove('tabs__panel--active', 'page-tab-panel--active');
            });

            // Add active to selected
            targetTab.classList.add(
                targetTab.classList.contains('page-tabs__tab')
                    ? 'page-tabs__tab--active'
                    : 'tabs__tab--active'
            );
            targetTab.setAttribute('aria-selected', 'true');

            if (this.panels[index]) {
                this.panels[index].classList.add(
                    this.panels[index].classList.contains('page-tab-panel')
                        ? 'page-tab-panel--active'
                        : 'tabs__panel--active'
                );
            }

            this.currentIndex = index;

            // Dispatch event with tab id
            this.element.dispatchEvent(new CustomEvent('tabChanged', {
                detail:  {
                    index: index,
                    tabId: tabId
                }
            }));
        }

        next() {
            const nextIndex = (this.currentIndex + 1) % this.tabs.length;
            this.switchTab(nextIndex);
        }

        previous() {
            const prevIndex = (this.currentIndex - 1 + this.tabs.length) % this.tabs.length;
            this.switchTab(prevIndex);
        }
    }

    // Auto-initialize
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize both .tabs and .page-tabs
        document.querySelectorAll('.tabs, .page-tabs').forEach(element => {
            new Tabs(element);
        });
    });

    window.Tabs = Tabs;
})();