// dropdown.js - Dropdown Component
(function() {
    'use strict';

    class Dropdown {
        constructor(element) {
            this.element = element;
            this.toggle = element.querySelector('.dropdown__toggle');
            this.menu = element.querySelector('.dropdown__menu');
            this.isOpen = false;

            this.init();
        }

        init() {
            if (!this.toggle || !this.menu) return;

            // Toggle click
            this.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!this.element.contains(e.target) && this.isOpen) {
                    this.close();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Close on item click
            this.menu.querySelectorAll('.dropdown__item').forEach(item => {
                item.addEventListener('click', () => {
                    this.close();
                });
            });
        }

        toggleMenu() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.menu.classList.add('dropdown__menu--open');
            this.toggle.setAttribute('aria-expanded', 'true');
            this.isOpen = true;
        }

        close() {
            this.menu.classList.remove('dropdown__menu--open');
            this.toggle.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
        }
    }

    // Auto-initialize all dropdowns
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.dropdown').forEach(element => {
            new Dropdown(element);
        });
    });

    window.Dropdown = Dropdown;
})();