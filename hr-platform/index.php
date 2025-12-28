<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Modern HR Management for Growing Teams - Streamline employee management, leave tracking, and document storage">
    <meta property="og:title" content="HR Platform - Modern HR Management">
    <meta property="og:description" content="Streamline employee management, leave tracking, and document storage in one simple platform">
    <meta property="og:type" content="website">
    <title>HR Platform - Modern HR Management</title>

    <!-- CSS -->
    <link rel="stylesheet" href="./assets/css/base/reset.css">
    <link rel="stylesheet" href="./assets/css/base/variables.css">
    <link rel="stylesheet" href="./assets/css/base/typography.css">
    <link rel="stylesheet" href="./assets/css/base/layout.css">
    <link rel="stylesheet" href="./assets/css/components/buttons.css">
    <link rel="stylesheet" href="./assets/css/components/cards.css">
    <link rel="stylesheet" href="./assets/css/components/header.css">
    <link rel="stylesheet" href="./assets/css/components/footer.css">
    <link rel="stylesheet" href="./assets/css/components/dropdown.css">
    <link rel="stylesheet" href="./assets/css/pages/landing.css">
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="header__container">
        <a href="./index.php" class="header__brand">
            <svg class="header__logo" viewBox="0 0 32 32" fill="currentColor">
                <rect x="4" y="4" width="24" height="24" rx="4" fill="currentColor"/>
                <path d="M16 10v12M10 16h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>HR Platform</span>
        </a>

        <nav class="header__nav">
            <a href="#features" class="header__nav-link" data-i18n="nav.features">Features</a>
            <a href="#pricing" class="header__nav-link" data-i18n="nav.pricing">Pricing</a>
            <a href="./dashboard.php" class="header__nav-link" data-i18n="nav.dashboard">Dashboard</a>
        </nav>

        <div class="header__actions">
            <!-- Language Dropdown -->
            <div class="dropdown" id="langDropdown">
                <button class="dropdown__toggle" aria-expanded="false" aria-haspopup="true">
                    <span id="currentLang">EN</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="dropdown__menu">
                    <button class="dropdown__item" data-lang="en">English</button>
                    <button class="dropdown__item" data-lang="az">Azərbaycan</button>
                    <button class="dropdown__item" data-lang="ru">Русский</button>
                    <button class="dropdown__item" data-lang="tr">Türkçe</button>
                </div>
            </div>

            <a href="./dashboard.php" class="btn btn--primary" data-i18n="landing.cta_start">Start Free</a>
        </div>
    </div>
</header>

<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <div class="hero__content">
            <h1 class="hero__title" data-i18n="landing.hero_title">Modern HR Management for Growing Teams</h1>
            <p class="hero__subtitle" data-i18n="landing.hero_subtitle">Streamline employee management, leave tracking, and document storage in one simple platform</p>
            <div class="hero__actions">
                <a href="./dashboard.php" class="btn btn--primary btn--lg" data-i18n="landing.cta_start">Start Free</a>
                <a href="./dashboard.php" class="btn btn--secondary btn--lg" data-i18n="landing.cta_demo">View Demo</a>
            </div>
        </div>
        <div class="hero__image">
            <svg viewBox="0 0 600 400" class="hero__illustration">
                <rect x="50" y="50" width="500" height="300" rx="12" fill="var(--color-primary-light)" opacity="0.3"/>
                <rect x="80" y="80" width="200" height="120" rx="8" fill="var(--color-primary)" opacity="0.6"/>
                <rect x="320" y="80" width="200" height="60" rx="8" fill="var(--color-success)" opacity="0.6"/>
                <rect x="320" y="160" width="200" height="60" rx="8" fill="var(--color-warning)" opacity="0.6"/>
            </svg>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="features" id="features">
    <div class="container">
        <h2 class="features__title text-center" data-i18n="landing.features_title">Everything you need to manage your team</h2>

        <div class="grid grid--4">
            <!-- Feature 1 -->
            <div class="card">
                <div class="features__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
                <h3 class="card__title" data-i18n="landing.feature1_title">Employee Directory</h3>
                <p class="text-muted" data-i18n="landing.feature1_desc">Centralized profiles with contact info, documents, and history</p>
            </div>

            <!-- Feature 2 -->
            <div class="card">
                <div class="features__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                </div>
                <h3 class="card__title" data-i18n="landing.feature2_title">Leave Management</h3>
                <p class="text-muted" data-i18n="landing.feature2_desc">Simple request/approval workflows with balance tracking</p>
            </div>

            <!-- Feature 3 -->
            <div class="card">
                <div class="features__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                    </svg>
                </div>
                <h3 class="card__title" data-i18n="landing.feature3_title">Document Storage</h3>
                <p class="text-muted" data-i18n="landing.feature3_desc">Secure storage for contracts, policies, and certificates</p>
            </div>

            <!-- Feature 4 -->
            <div class="card">
                <div class="features__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-info)" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <h3 class="card__title" data-i18n="landing.feature4_title">Announcements</h3>
                <p class="text-muted" data-i18n="landing.feature4_desc">Keep your team informed with company-wide updates</p>
            </div>
        </div>
    </div>
</section>

<!-- Pricing Section -->
<section class="pricing" id="pricing">
    <div class="container">
        <h2 class="pricing__title text-center" data-i18n="landing.pricing_title">Simple, Transparent Pricing</h2>

        <div class="pricing__grid">
            <!-- Basic Plan -->
            <div class="pricing-card">
                <div class="pricing-card__header">
                    <h3 class="pricing-card__name" data-i18n="landing.pricing_basic">Basic</h3>
                    <div class="pricing-card__price">
                        <span class="pricing-card__amount" data-i18n="landing.pricing_basic_price">Free</span>
                    </div>
                    <p class="pricing-card__desc text-muted" data-i18n="landing.pricing_basic_desc">Perfect for small teams</p>
                </div>
                <ul class="pricing-card__features">
                    <li>✓ Up to 10 employees</li>
                    <li>✓ Basic leave management</li>
                    <li>✓ Document storage (1GB)</li>
                    <li>✓ Email support</li>
                </ul>
                <a href="./dashboard.php" class="btn btn--primary btn--block" data-i18n="landing.cta_start">Start Free</a>
            </div>

            <!-- Pro Plan -->
            <div class="pricing-card pricing-card--featured">
                <div class="pricing-card__badge">Pro</div>
                <div class="pricing-card__header">
                    <h3 class="pricing-card__name" data-i18n="landing.pricing_pro">Pro</h3>
                    <div class="pricing-card__price">
                        <span class="pricing-card__amount" data-i18n="landing.pricing_pro_price">Coming Soon</span>
                    </div>
                    <p class="pricing-card__desc text-muted" data-i18n="landing.pricing_pro_desc">Advanced features for growing companies</p>
                </div>
                <ul class="pricing-card__features">
                    <li>✓ Unlimited employees</li>
                    <li>✓ Advanced workflows</li>
                    <li>✓ Unlimited storage</li>
                    <li>✓ Priority support</li>
                    <li>✓ API access</li>
                    <li>✓ Custom reports</li>
                </ul>
                <button class="btn btn--primary btn--block" disabled>Coming Soon</button>
            </div>
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer__grid">
            <div>
                <h4 class="footer__section-title">HR Platform</h4>
                <p class="text-muted text-sm">Modern HR management for growing teams</p>
            </div>

            <div>
                <h4 class="footer__section-title">Product</h4>
                <nav class="footer__links">
                    <a href="#features" class="footer__link">Features</a>
                    <a href="#pricing" class="footer__link">Pricing</a>
                    <a href="./dashboard.php" class="footer__link">Dashboard</a>
                </nav>
            </div>

            <div>
                <h4 class="footer__section-title">Support</h4>
                <nav class="footer__links">
                    <a href="#" class="footer__link">Help Center</a>
                    <a href="#" class="footer__link">Contact</a>
                    <a href="#" class="footer__link">Privacy</a>
                </nav>
            </div>
        </div>

        <div class="footer__bottom">
            <p>&copy; 2025 HR Platform. All rights reserved. </p>
            <div class="footer__social">
                <a href="#" class="footer__social-link" aria-label="Twitter">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>
                </a>
                <a href="#" class="footer__social-link" aria-label="LinkedIn">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                        <circle cx="4" cy="4" r="2"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</footer>

<!-- Scripts -->
<script src="./assets/js/core/i18n.js"></script>
<script src="./assets/js/core/storage.js"></script>
<script src="./assets/js/components/dropdown.js"></script>
<script src="./assets/js/pages/landing.js"></script>
</body>
</html>