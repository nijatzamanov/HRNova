<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.dashboard.title">Dashboard – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="dashboard" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <div class="app-main__header">
            <h1 class="app-main__title" data-i18n="dashboard.title">Dashboard</h1>
        </div>

        <!-- Summary Cards -->
        <div class="dashboard-cards" id="dashboardCards">
            <div class="card-stat">
                <div class="card-stat__icon card-stat__icon--primary">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <div class="card-stat__content">
                    <div class="card-stat__label" data-i18n="dashboard.cards.revenue">Revenue</div>
                    <div class="card-stat__value" data-stat="revenue">$0</div>
                </div>
            </div>

            <div class="card-stat">
                <div class="card-stat__icon card-stat__icon--error">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                </div>
                <div class="card-stat__content">
                    <div class="card-stat__label" data-i18n="dashboard.cards.expenses">Expenses</div>
                    <div class="card-stat__value" data-stat="expenses">$0</div>
                </div>
            </div>

            <div class="card-stat">
                <div class="card-stat__icon card-stat__icon--success">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                        <polyline points="16 7 22 7 22 13"/>
                    </svg>
                </div>
                <div class="card-stat__content">
                    <div class="card-stat__label" data-i18n="dashboard.cards.profit">Net Profit</div>
                    <div class="card-stat__value" data-stat="profit">$0</div>
                </div>
            </div>

            <div class="card-stat">
                <div class="card-stat__icon card-stat__icon--warning">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
                <div class="card-stat__content">
                    <div class="card-stat__label" data-i18n="dashboard.cards.accounts">Accounts</div>
                    <div class="card-stat__value" data-stat="accounts">0</div>
                </div>
            </div>
        </div>

        <!-- Recent Transactions -->
        <section class="dashboard-section">
            <div class="dashboard-section__header">
                <h2 class="dashboard-section__title" data-i18n="dashboard.recent.title">Recent Transactions</h2>
                <a href="journal.php" class="dashboard-section__link" data-i18n="dashboard.recent.viewAll">View All</a>
            </div>
            <div class="card" style="padding: 0; overflow:  hidden;">
                <div class="table-wrapper">
                    <div class="table-container">
                        <table class="table" id="recentTransactions">
                            <thead>
                            <tr>
                                <th data-i18n="dashboard.recent.table.date">Date</th>
                                <th data-i18n="dashboard.recent.table.description">Description</th>
                                <th data-i18n="dashboard.recent.table.account">Account</th>
                                <th class="table__cell--numeric" data-i18n="dashboard.recent.table.debit">Debit</th>
                                <th class="table__cell--numeric" data-i18n="dashboard.recent.table.credit">Credit</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colspan="5">
                                    <div class="table__empty">Loading...</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>