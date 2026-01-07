export const AurumDropdown = {
    activeDropdown: null,

    init() {
        document.addEventListener('click', event => {
            const trigger = event.target.closest('.dropdown__trigger');

            if (trigger) {
                event.stopPropagation();
                const dropdown = trigger.closest('.dropdown');
                this.toggle(dropdown);
            } else {
                if (this.activeDropdown) {
                    this.close(this.activeDropdown);
                }
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && this.activeDropdown) {
                this.close(this.activeDropdown);
            }
        });

        document.addEventListener('click', event => {
            const item = event.target.closest('.dropdown__item');
            if (item) {
                const dropdown = item.closest('.dropdown');
                this.handleItemClick(item, dropdown);
            }
        });
    },

    toggle(dropdown) {
        if (this.activeDropdown && this.activeDropdown !== dropdown) {
            this.close(this.activeDropdown);
        }

        const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            this.close(dropdown);
        } else {
            this.open(dropdown);
        }
    },

    open(dropdown) {
        dropdown.setAttribute('aria-expanded', 'true');
        this.activeDropdown = dropdown;
    },

    close(dropdown) {
        dropdown.setAttribute('aria-expanded', 'false');
        this.activeDropdown = null;
    },

    handleItemClick(item, dropdown) {
        const value = item.dataset.value;
        const lang = item.dataset.lang;

        if (lang) {
            this.handleLanguageChange(lang);
        }

        if (value !== undefined) {
            const trigger = dropdown.querySelector('.dropdown__trigger span');
            if (trigger) {
                trigger.textContent = item.textContent;
            }
            dropdown.dataset.value = value;

            const event = new CustomEvent('dropdown-change', {
                detail:  {value, text: item.textContent}
            });
            dropdown.dispatchEvent(event);
        }

        this.close(dropdown);
    },

    async handleLanguageChange(lang) {
        const {AurumI18n} = await import('../core/i18n.js');
        const {AurumStorage} = await import('../core/storage.js');

        await AurumI18n.setLanguage(lang);
        AurumStorage.set('language', lang);
    }
};