<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AurumAccounting – Modern accounting for global businesses">
    <title data-i18n="page.login.title">Login – AurumAccounting</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="auth" class="auth-page">

<div class="auth-container">
    <div class="auth-card">
        <svg class="auth-card__logo" width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="18" fill="url(#auth-logo-gradient)"/>
            <path d="M36 22L26 34H32V50H40V34H46L36 22Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M26 54H46" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
            <defs>
                <linearGradient id="auth-logo-gradient" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6366f1"/>
                    <stop offset="1" stop-color="#4f46e5"/>
                </linearGradient>
            </defs>
        </svg>

        <h1 class="auth-card__title" data-i18n="auth.login.title">Sign In</h1>
        <p class="auth-card__subtitle" data-i18n="auth.login.subtitle">Access your accounting dashboard</p>

        <form id="loginForm" class="auth-form" novalidate>
            <!-- Email Input -->
            <div class="form-group">
                <label for="email" class="form-label form-label--required" data-i18n="auth.email.label">Email</label>
                <div class="form-input-group">
                    <svg class="form-input-group__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input"
                            required
                            autocomplete="email"
                            data-i18n-placeholder="auth.email.placeholder"
                            placeholder="you@company.com"
                    >
                </div>
                <span class="form-error" data-error="email"></span>
            </div>

            <!-- Password Input -->
            <div class="form-group">
                <label for="password" class="form-label form-label--required" data-i18n="auth.password.label">Password</label>
                <div class="form-input-group">
                    <svg class="form-input-group__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-input"
                            required
                            autocomplete="current-password"
                            data-i18n-placeholder="auth.password.placeholder"
                            placeholder="••••••••"
                    >
                </div>
                <span class="form-error" data-error="password"></span>
            </div>

            <!-- Remember Me -->
            <div class="form-group--inline">
                <input type="checkbox" id="remember" name="remember" class="form-checkbox">
                <label for="remember" class="form-label" style="cursor: pointer;">
                    <span data-i18n="auth.login.remember">Remember me</span>
                </label>
            </div>

            <button type="submit" class="btn btn--primary btn--block">
                <span data-i18n="auth.login.submit">Sign In</span>
            </button>
        </form>

        <p class="auth-card__footer">
            <span data-i18n="auth.login.noAccount">Don't have an account?  </span>
            <a href="#" class="auth-card__link" data-i18n="auth.register.link">Register</a>
        </p>
    </div>

    <!-- Language Switcher -->
    <div class="auth-lang">
        <button class="auth-lang__btn" data-lang="en" aria-label="English">🇬🇧 EN</button>
        <button class="auth-lang__btn" data-lang="az" aria-label="Azərbaycan">🇦🇿 AZ</button>
        <button class="auth-lang__btn" data-lang="ru" aria-label="Русский">🇷🇺 RU</button>
        <button class="auth-lang__btn" data-lang="tr" aria-label="Türkçe">🇹🇷 TR</button>
        <button class="auth-lang__btn" data-lang="de" aria-label="Deutsch">🇩🇪 DE</button>
    </div>
</div>

<script type="module" src="assets/js/main.js"></script>
<script type="module">
    // Auth page language switcher
    document.addEventListener('DOMContentLoaded', () => {
        const langButtons = document.querySelectorAll('.auth-lang__btn');

        // Set active language on load
        const currentLang = localStorage.getItem('aurum_language') || 'en';
        langButtons.forEach(btn => {
            if (btn.dataset.lang === currentLang) {
                btn.classList.add('auth-lang__btn--active');
            }
        });

        // Language switch handler
        langButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const lang = btn.dataset.lang;

                // Remove active from all
                langButtons.forEach(b => b.classList.remove('auth-lang__btn--active'));
                // Add active to clicked
                btn.classList.add('auth-lang__btn--active');

                // Change language
                const { AurumI18n } = await import('./assets/js/core/i18n.js');
                const { AurumStorage } = await import('./assets/js/core/storage.js');

                await AurumI18n.setLanguage(lang);
                AurumStorage.set('language', lang);
            });
        });
    });
</script>
</body>
</html>