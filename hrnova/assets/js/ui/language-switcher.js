import { i18n } from '../services/i18n.js';

export function initLanguageSwitcher() {
    const toggleBtn = document.getElementById('languageToggle');
    const dropdown = document.getElementById('languageDropdown');
    const options = document.querySelectorAll('.language-switcher__option');

    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    options.forEach(option => {
        option.addEventListener('click', async (e) => {
            const lang = option.getAttribute('data-lang');
            if (lang) {
                await i18n.changeLanguage(lang);
                updateActiveOption();
                closeDropdown();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            closeDropdown();
        }
    });

    updateActiveOption();
}

function toggleDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('language-switcher__dropdown--active');
    }
}

function closeDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('language-switcher__dropdown--active');
    }
}

function updateActiveOption() {
    const currentLang = i18n.getCurrentLanguage();
    const options = document.querySelectorAll('.language-switcher__option');

    options.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLang) {
            option.classList.add('language-switcher__option--active');
        } else {
            option.classList.remove('language-switcher__option--active');
        }
    });
}
