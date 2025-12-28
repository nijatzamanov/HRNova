// themeToggle.js - Dark/Light mode toggle
(function(window) {
    'use strict';

    const ThemeToggle = {
        currentTheme: 'light',

        init:  function() {
            // Get saved theme or default to light
            this.currentTheme = Storage.get('theme', 'light');
            this.applyTheme(this.currentTheme);
            this.setupToggleButton();
        },

        setupToggleButton: function() {
            // Find all theme toggle buttons
            const toggleButtons = document.querySelectorAll('.theme-toggle');

            toggleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.toggleTheme();
                });
            });
        },

        toggleTheme: function() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
            Storage.set('theme', newTheme);
            this.currentTheme = newTheme;
        },

        applyTheme: function(theme) {
            document.documentElement.setAttribute('data-theme', theme);

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme }
            }));
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ThemeToggle.init());
    } else {
        ThemeToggle.init();
    }

    window.ThemeToggle = ThemeToggle;
})(window);