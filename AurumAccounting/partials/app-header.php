<header class="app-header">
    <button class="app-header__toggle" data-action="toggle-sidebar" aria-label="Toggle sidebar">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    </button>

    <div class="app-header__brand">
        <svg class="app-header__logo" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logo-gradient)"/>
            <path d="M20 10L14 18H18V30H22V18H26L20 10Z" fill="white"/>
            <path d="M14 32H26" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                    <stop stop-color="#6366f1"/>
                    <stop offset="1" stop-color="#4f46e5"/>
                </linearGradient>
            </defs>
        </svg>
        <span class="app-header__title">AurumAccounting</span>
    </div>

    <div class="app-header__actions">
        <!-- Language Dropdown -->
        <div class="dropdown" data-dropdown="language">
            <button class="dropdown__trigger dropdown__trigger--ghost" aria-haspopup="true" aria-expanded="false" aria-label="Language">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="10" cy="10" r="8"/>
                    <path d="M2 10h16M10 2a15.3 15.3 0 0 1 3 8 15.3 15.3 0 0 1-3 8 15.3 15.3 0 0 1-3-8 15.3 15.3 0 0 1 3-8z"/>
                </svg>
                <span id="currentLang">EN</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 6l4 4 4-4z"/>
                </svg>
            </button>
            <ul class="dropdown__menu dropdown__menu--right" role="menu">
                <li>
                    <button class="dropdown__item" data-lang="en">
                        <span class="dropdown__item-flag">🇬🇧</span>
                        <span>English</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown__item" data-lang="az">
                        <span class="dropdown__item-flag">🇦🇿</span>
                        <span>Azərbaycan</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown__item" data-lang="ru">
                        <span class="dropdown__item-flag">🇷🇺</span>
                        <span>Русский</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown__item" data-lang="tr">
                        <span class="dropdown__item-flag">🇹🇷</span>
                        <span>Türkçe</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown__item" data-lang="de">
                        <span class="dropdown__item-flag">🇩🇪</span>
                        <span>Deutsch</span>
                    </button>
                </li>
            </ul>
        </div>

        <!-- User Menu -->
        <div class="dropdown" data-dropdown="user">
            <button class="dropdown__trigger dropdown__trigger--avatar" aria-haspopup="true" aria-expanded="false">
                <span class="avatar">AD</span>
            </button>
            <ul class="dropdown__menu dropdown__menu--right" role="menu">
                <li class="dropdown__header">
                    <div class="dropdown__user-name">Admin User</div>
                    <div class="dropdown__user-role" data-i18n="header.user.role.admin">Admin</div>
                </li>
                <li>
                    <button class="dropdown__item">
                        <svg class="dropdown__item-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="6" r="3"/>
                            <path d="M2 16a6 6 0 0 1 12 0"/>
                        </svg>
                        <span data-i18n="header.user.profile">Profile</span>
                    </button>
                </li>
                <li>
                    <button class="dropdown__item">
                        <svg class="dropdown__item-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="9" r="2"/>
                            <path d="M9 1v2m0 12v2M3.93 3.93l1.41 1.41m9.9 9.9l1.41 1.41M1 9h2m12 0h2M3.93 14.07l1.41-1.41m9.9-9.9l1.41-1.41"/>
                        </svg>
                        <span data-i18n="header.user.settings">Settings</span>
                    </button>
                </li>
                <li class="dropdown__divider"></li>
                <li>
                    <button class="dropdown__item dropdown__item--danger" data-action="logout">
                        <svg class="dropdown__item-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 16H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6M12 12l4-4-4-4M16 8H6"/>
                        </svg>
                        <span data-i18n="header.user.logout">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</header>