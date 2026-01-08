<nav class="sidebar" aria-label="Main navigation">
    <!-- Main Menu -->
    <ul class="sidebar__menu">
        <!-- Dashboard -->
        <li class="sidebar__item">
            <a href="../app/dashboard.php" class="sidebar__link" data-nav="dashboard">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.dashboard">Dashboard</span>
            </a>
        </li>

        <!-- Separator -->
        <li class="sidebar__separator">
            <span class="sidebar__separator-label">Mühasibat</span>
        </li>

        <!-- Chart of Accounts -->
        <li class="sidebar__item">
            <a href="../app/chart-of-accounts.php" class="sidebar__link" data-nav="chart-of-accounts">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.chartOfAccounts">Hesablar Planı</span>
            </a>
        </li>

        <!-- Journal Entries -->
        <li class="sidebar__item">
            <a href="../app/journal.php" class="sidebar__link" data-nav="journal">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.journal">Jurnal Yazıları</span>
            </a>
        </li>

        <!-- Separator -->
        <li class="sidebar__separator">
            <span class="sidebar__separator-label">Satış və Alış</span>
        </li>

        <!-- Sales Invoices -->
        <li class="sidebar__item">
            <a href="../app/sales-invoices.php" class="sidebar__link" data-nav="sales-invoices">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.salesInvoices">Satış Fakturaları</span>
            </a>
        </li>

        <!-- Purchase Bills -->
        <li class="sidebar__item">
            <a href="../app/purchase-bills.php" class="sidebar__link" data-nav="purchase-bills">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.purchaseBills">Alış Qaimələri</span>
            </a>
        </li>

        <li class="sidebar__item">
            <a href="../app/payments.php" class="sidebar__link" data-nav="payments">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                    <path d="M12 18V6"/>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.payments">Ödənişlər</span>
            </a>
        </li>

        <!-- Separator -->
        <li class="sidebar__separator">
            <span class="sidebar__separator-label">Hesabatlar</span>
        </li>

        <!-- Trial Balance -->
        <li class="sidebar__item">
            <a href="../app/reports-trial-balance.php" class="sidebar__link" data-nav="reports-trial-balance">
                <svg class="sidebar__icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span class="sidebar__label" data-i18n="sidebar.trialBalance">Trial Balance</span>
            </a>
        </li>
    </ul>

    <!-- Footer -->
    <div class="sidebar__footer">
        <div class="sidebar__credits">
            <div class="sidebar__company-info">
                <div class="sidebar__version">v1.0.0</div>
            </div>
            <span>Developed by</span>
            <strong>Aildco</strong>
        </div>
    </div>
</nav>