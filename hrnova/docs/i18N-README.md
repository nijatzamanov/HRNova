# Internationalization (i18n) System

## Overview

The HRNova dashboard includes a complete i18n system supporting 5 languages with no external dependencies. All translations are managed through JSON files and applied automatically via data attributes.

## Supported Languages

- **az** (Azərbaycanca) - Azerbaijani - **DEFAULT**
- **en** (English)
- **ru** (Русский) - Russian
- **tr** (Türkçe) - Turkish
- **de** (Deutsch) - German

## Files Structure

```
src/
├── i18n/
│   ├── az.json          # Azerbaijani translations (default)
│   ├── en.json          # English translations
│   ├── ru.json          # Russian translations
│   ├── tr.json          # Turkish translations
│   └── de.json          # German translations
└── assets/js/services/
    └── i18n.js          # i18n service
```

## Translation File Structure

Each JSON file follows this structure:

```json
{
  "app": {
    "name": "HRNova",
    "title": "Human Resources Management System"
  },
  "menu": {
    "dashboard": "Dashboard",
    "employees": "Employees",
    "settings": "Settings"
  },
  "common": {
    "add": "Add",
    "edit": "Edit",
    "save": "Save",
    "cancel": "Cancel"
  },
  "table": {
    "name": "Name",
    "email": "Email",
    "status": "Status"
  }
}
```

## Usage

### Using data-i18n Attribute

The simplest way to translate text:

```html
<h1 data-i18n="dashboard.title">Dashboard</h1>
<button data-i18n="common.save">Save</button>
```

The system automatically:
1. Looks up the translation key
2. Replaces the element's text content
3. Updates when language changes

### Translation Targets

Translate different element properties:

```html
<!-- Translate text content (default) -->
<span data-i18n="common.loading">Loading...</span>

<!-- Translate placeholder -->
<input data-i18n="form.enterEmail" data-i18n-target="placeholder" placeholder="Enter email">

<!-- Translate title attribute -->
<button data-i18n="common.edit" data-i18n-target="title" title="Edit"></button>

<!-- Translate aria-label -->
<button data-i18n="common.close" data-i18n-target="aria-label" aria-label="Close"></button>
```

### Parameters in Translations

Use parameters for dynamic content:

**Translation:**
```json
{
  "table": {
    "showing": "Showing {from}-{to} of {total}"
  }
}
```

**HTML:**
```html
<span
  data-i18n="table.showing"
  data-i18n-params='{"from": "1", "to": "10", "total": "100"}'>
  Showing 1-10 of 100
</span>
```

### JavaScript API

```javascript
import { i18n } from './services/i18n.js';

// Get translation
const text = i18n.translate('menu.dashboard');
// or shorthand
const text = i18n.t('menu.dashboard');

// With parameters
const text = i18n.translate('table.showing', {
  from: 1,
  to: 10,
  total: 100
});

// Change language
await i18n.changeLanguage('en');

// Get current language
const current = i18n.getCurrentLanguage(); // 'az'

// Subscribe to language changes
i18n.subscribe((newLang) => {
  console.log('Language changed to:', newLang);
});
```

## Language Switcher

The language switcher is automatically added to the topbar:

```html
<div class="language-switcher">
  <button class="language-switcher__trigger">
    <!-- Language icon -->
  </button>
  <div class="language-switcher__dropdown">
    <button data-lang="az">🇦🇿 Azərbaycanca</button>
    <button data-lang="en">🇬🇧 English</button>
    <button data-lang="ru">🇷🇺 Русский</button>
    <button data-lang="tr">🇹🇷 Türkçe</button>
    <button data-lang="de">🇩🇪 Deutsch</button>
  </div>
</div>
```

## How It Works

### 1. Initialization

```javascript
// In boot.js
await initI18n();
```

This:
- Loads saved language from localStorage (or default 'az')
- Fetches the translation JSON file
- Translates all elements with `data-i18n`
- Sets up a MutationObserver for dynamic content

### 2. Storage

Selected language is saved in localStorage:
- Key: `hrnova_language`
- Default: `az`
- Persists across sessions

### 3. Dynamic Content

New elements with `data-i18n` are automatically translated:

```javascript
// Add new element
const button = document.createElement('button');
button.setAttribute('data-i18n', 'common.save');
button.textContent = 'Save'; // Will be translated automatically
document.body.appendChild(button);
```

### 4. Menu Translation

The sidebar menu is dynamically rendered with translations:

```javascript
// Menu items get translated automatically
const translatedLabel = i18n.translate(`menu.${item.key}`);
```

## Adding New Translations

### 1. Add to All Language Files

Add the same key to all 5 language files:

**az.json:**
```json
{
  "newSection": {
    "greeting": "Salam"
  }
}
```

**en.json:**
```json
{
  "newSection": {
    "greeting": "Hello"
  }
}
```

...and so on for ru, tr, de.

### 2. Use in HTML

```html
<h1 data-i18n="newSection.greeting">Hello</h1>
```

### 3. Use in JavaScript

```javascript
const greeting = i18n.t('newSection.greeting');
```

## Translation Categories

Existing translation categories:

- `app.*` - App name, title
- `menu.*` - Menu items
- `common.*` - Common buttons, actions
- `table.*` - Table headers, pagination
- `form.*` - Form labels, placeholders, validation
- `dashboard.*` - Dashboard specific
- `employees.*` - Employees page specific
- `language.*` - Language names
- `notifications.*` - Notification types

## Best Practices

### 1. Consistent Key Naming

Use hierarchical, descriptive keys:
```
✅ Good: form.firstName, table.actions, dashboard.totalEmployees
❌ Bad: firstName, actions, total
```

### 2. Provide Default Values

Always provide fallback text in HTML:
```html
<button data-i18n="common.save">Save</button>
```

### 3. Test All Languages

Switch between languages to ensure:
- All keys exist in all files
- Text fits in UI elements
- No layout breaks

### 4. Use Parameters for Dynamic Content

Don't concatenate strings:
```
✅ Good: "Showing {from}-{to} of {total}"
❌ Bad: Multiple separate strings
```

### 5. Keep Translations Short

UI space is limited, especially for buttons:
```
✅ Good: "Save", "Edit", "Delete"
❌ Bad: "Save this document", "Edit this record"
```

## Console Testing

Test language switching in the browser console:

```javascript
// Change to English
await i18n.changeLanguage('en');

// Change to Russian
await i18n.changeLanguage('ru');

// Get current language
console.log(i18n.getCurrentLanguage());

// Get translation
console.log(i18n.t('menu.dashboard'));
```

## Adding More Languages

To add a new language:

1. Create translation file: `src/i18n/es.json` (example: Spanish)
2. Add language code to `SUPPORTED_LANGUAGES` in `i18n.js`:
```javascript
const SUPPORTED_LANGUAGES = ['az', 'en', 'ru', 'tr', 'de', 'es'];
```
3. Add to language switcher in `topbar.html`:
```html
<button class="language-switcher__option" data-lang="es">
  <span class="language-switcher__flag">🇪🇸</span>
  <span data-i18n="language.es">Español</span>
</button>
```
4. Add language name to all translation files:
```json
{
  "language": {
    "es": "Español"
  }
}
```

## Performance

- Translation files are loaded once per language
- Translations are cached in memory
- MutationObserver is efficient for dynamic content
- No external dependencies = faster load times

## Fallback Behavior

If a translation key is not found:
1. Console warning is logged
2. The key itself is displayed (e.g., "menu.missing")
3. App continues to function

If a language file fails to load:
1. Falls back to default language (az)
2. Console error is logged
3. App continues with fallback

## Integration with RBAC

The menu system combines i18n with RBAC:
- Menu items are filtered by permissions
- Visible items are translated
- Language changes update menu in real-time

```javascript
// Menu is re-rendered when language changes
i18n.subscribe((lang) => {
  renderSidebar(); // Re-renders with new translations
});
```
