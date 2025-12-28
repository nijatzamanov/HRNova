import { showSuccess } from '../ui/toast.js';
import { i18n } from '../services/i18n.js';

function initLanguageSelector() {
    const container = document.getElementById('languageSwitcherContainer');
    const currentLang = i18n.getCurrentLanguage();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'az', name: 'Azərbaycanca' },
        { code: 'tr', name: 'Türkçe' },
        { code: 'ru', name: 'Русский' },
        { code: 'de', name: 'Deutsch' }
    ];

    container.innerHTML = `
    <select class="form-control" id="languageSelect">
      ${languages.map(lang => `
        <option value="${lang.code}" ${currentLang === lang.code ? 'selected' : ''}>
          ${lang.name}
        </option>
      `).join('')}
    </select>
  `;

    const select = document.getElementById('languageSelect');
    select.addEventListener('change', async (e) => {
        await i18n.changeLanguage(e.target.value);
        showSuccess('Language changed successfully!');
    });
}

window.saveGeneralSettings = () => {
    showSuccess('General settings saved successfully!');
};

window.saveBrandingSettings = () => {
    showSuccess('Branding settings saved successfully!');
};

window.saveNotificationSettings = () => {
    showSuccess('Notification preferences saved successfully!');
};

window.saveSecuritySettings = () => {
    showSuccess('Security settings saved successfully!');
};

initLanguageSelector();
