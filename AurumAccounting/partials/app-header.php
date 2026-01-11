<header class="app-header">
    <div class="app-header__left">
        <!-- Mobile Menu Toggle -->
        <button class="app-header__menu-toggle" data-action="toggle-sidebar" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>

        <!-- Logo & Company Name -->
        <div class="app-header__brand">
            <div class="app-header__logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
            </div>
            <div class="app-header__text">
                <div class="app-header__title">AurumAccounting</div>
                <div class="app-header__company" data-i18n="header.defaultCompany">Şirkətim</div>
            </div>
        </div>
    </div>

    <div class="app-header__right">
        <!-- Language Switcher -->
        <div class="app-header__language">
            <button class="app-header__language-btn" id="languageBtn" aria-label="Dil seçimi">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span class="app-header__language-text" id="currentLanguage">AZ</span>
            </button>

            <!-- Language Dropdown -->
            <div class="app-header__dropdown" id="languageDropdown" hidden>
                <button class="app-header__dropdown-item" data-lang="az">
                    <span class="app-header__flag">🇦🇿</span>
                    <span>Azərbaycan</span>
                </button>
                <button class="app-header__dropdown-item" data-lang="en">
                    <span class="app-header__flag">🇬🇧</span>
                    <span>English</span>
                </button>
                <button class="app-header__dropdown-item" data-lang="ru">
                    <span class="app-header__flag">🇷🇺</span>
                    <span>Русский</span>
                </button>
                <button class="app-header__dropdown-item" data-lang="tr">
                    <span class="app-header__flag">🇹🇷</span>
                    <span>Türkçe</span>
                </button>
                <button class="app-header__dropdown-item" data-lang="ar">
                    <span class="app-header__flag">🇸🇦</span>
                    <span>العربية</span>
                </button>
            </div>
        </div>

        <!-- Notifications -->
        <button class="app-header__icon-btn" aria-label="Bildirişlər">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="app-header__badge">3</span>
        </button>

        <!-- User Menu -->
        <div class="app-header__user">
            <button class="app-header__user-btn" id="userMenuBtn">
                <div class="app-header__avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <span class="app-header__user-name" data-user="name">İstifadəçi</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            <!-- User Dropdown -->
            <div class="app-header__dropdown app-header__dropdown--right" id="userDropdown" hidden>
                <div class="app-header__dropdown-header">
                    <div class="app-header__dropdown-name" data-user="name">İstifadəçi</div>
                    <div class="app-header__dropdown-role" data-user="email">user@email.com</div>
                </div>
                <div class="app-header__dropdown-divider"></div>
                <button class="app-header__dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span data-i18n="header.profile">Profil</span>
                </button>
                <button class="app-header__dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6"/>
                    </svg>
                    <span data-i18n="header.settings">Tənzimləmələr</span>
                </button>
                <div class="app-header__dropdown-divider"></div>
                <button class="app-header__dropdown-item app-header__dropdown-item--danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span data-i18n="header.logout">Çıxış</span>
                </button>
            </div>
        </div>
    </div>
</header>