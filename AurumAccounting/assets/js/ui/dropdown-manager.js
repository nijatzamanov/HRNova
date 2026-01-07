export class DropdownManager {
    constructor() {
        this.activeDropdown = null;
    }

    init() {
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleClick(event) {
        const trigger = event.target.closest('.dropdown__trigger');

        if (trigger) {
            event.stopPropagation();
            const dropdown = trigger.closest('.dropdown');
            this.toggle(dropdown);
            return;
        }

        const item = event.target.closest('.dropdown__item');
        if (item && ! item.disabled) {
            const dropdown = item.closest('.dropdown');
            this.handleItemClick(item, dropdown);
            return;
        }

        // Close active dropdown if clicked outside
        if (this.activeDropdown) {
            const clickedInsideDropdown = event.target.closest('.dropdown') === this.activeDropdown;
            if (!clickedInsideDropdown) {
                this.close(this.activeDropdown);
            }
        }
    }

    handleKeydown(event) {
        if (event.key === 'Escape' && this.activeDropdown) {
            this.close(this.activeDropdown);
            const trigger = this.activeDropdown.querySelector('.dropdown__trigger');
            if (trigger) trigger.focus();
        }

        if (event.key === 'ArrowDown' && this.activeDropdown) {
            event.preventDefault();
            this.focusNextItem();
        }

        if (event.key === 'ArrowUp' && this.activeDropdown) {
            event.preventDefault();
            this.focusPreviousItem();
        }
    }

    toggle(dropdown) {
        if (this.activeDropdown && this.activeDropdown !== dropdown) {
            this.close(this.activeDropdown);
        }

        const isOpen = dropdown.querySelector('.dropdown__trigger').getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.close(dropdown);
        } else {
            this.open(dropdown);
        }
    }

    open(dropdown) {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const menu = dropdown.querySelector('.dropdown__menu');

        trigger.setAttribute('aria-expanded', 'true');
        menu.setAttribute('data-show', 'true');
        this.activeDropdown = dropdown;

        // Auto-position menu if it overflows viewport
        this.autoPosition(dropdown);
    }

    close(dropdown) {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const menu = dropdown.querySelector('.dropdown__menu');

        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('data-show', 'false');
        this.activeDropdown = null;
    }

    autoPosition(dropdown) {
        const menu = dropdown.querySelector('.dropdown__menu');
        const rect = dropdown.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if menu overflows bottom
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < menuRect.height && spaceAbove > spaceBelow) {
            menu.classList.add('dropdown__menu--top');
        } else {
            menu.classList.remove('dropdown__menu--top');
        }

        // Check if menu overflows right
        const viewportWidth = window.innerWidth;
        const spaceRight = viewportWidth - rect.right;

        if (spaceRight < menuRect.width) {
            menu.classList.add('dropdown__menu--right');
        } else {
            menu.classList.remove('dropdown__menu--right');
        }
    }

    async handleItemClick(item, dropdown) {
        const value = item.dataset.value;
        const lang = item.dataset.lang;

        if (lang) {
            await this.handleLanguageChange(lang);
        }

        if (value !== undefined) {
            const trigger = dropdown.querySelector('.dropdown__trigger');
            const triggerText = trigger.querySelector('span: not(.dropdown__item-flag)');
            if (triggerText) {
                triggerText.textContent = item.textContent.trim();
            }
            dropdown.dataset.value = value;

            const event = new CustomEvent('dropdown-change', {
                detail: {value, text: item.textContent, item}
            });
            dropdown.dispatchEvent(event);
        }

        this.close(dropdown);
    }

    async handleLanguageChange(lang) {
        try {
            const {AurumI18n} = await import('../core/i18n.js');
            const {AurumStorage} = await import('../core/storage.js');

            await AurumI18n.setLanguage(lang);
            AurumStorage.set('language', lang);

            // Update current language display
            const langMap = {
                'en': 'EN',
                'az': 'AZ',
                'ru': 'RU',
                'tr': 'TR',
                'de': 'DE'
            };
            const currentLangEl = document.getElementById('currentLang');
            if (currentLangEl) {
                currentLangEl.textContent = langMap[lang] || lang.toUpperCase();
            }

            console.log('✅ Language changed to:', lang);
        } catch (error) {
            console.error('❌ Language change error:', error);
        }
    }

    focusNextItem() {
        const items = Array.from(this.activeDropdown.querySelectorAll('.dropdown__item:not([disabled])'));
        const currentIndex = items.indexOf(document.activeElement);
        const nextIndex = currentIndex + 1 < items.length ? currentIndex + 1 : 0;
        items[nextIndex].focus();
    }

    focusPreviousItem() {
        const items = Array.from(this.activeDropdown.querySelectorAll('.dropdown__item:not([disabled])'));
        const currentIndex = items.indexOf(document.activeElement);
        const prevIndex = currentIndex - 1 >= 0 ?  currentIndex - 1 : items.length - 1;
        items[prevIndex].focus();
    }
}