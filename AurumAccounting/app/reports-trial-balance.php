<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.trialBalance.title">Trial Balance – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="reports-trial-balance" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <div class="app-main__header">
            <h1 class="app-main__title" data-i18n="reports.trialBalance.title">Trial Balance</h1>
            <button class="btn btn--secondary" data-action="export-pdf">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span data-i18n="reports.export.pdf">Export PDF</span>
            </button>
        </div>

        <!-- Period Selector -->
        <div class="report-filters" style="display: flex; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-6); align-items: flex-end;">
            <div class="form-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                <label for="periodStart" class="form-label" data-i18n="reports.period.start">From</label>
                <input type="date" id="periodStart" class="form-input">
            </div>
            <div class="form-group" style="flex: 1; min-width:  200px; margin-bottom:  0;">
                <label for="periodEnd" class="form-label" data-i18n="reports.period.end">To</label>
                <input type="date" id="periodEnd" class="form-input">
            </div>
            <button class="btn btn--primary" data-action="generate-report">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span data-i18n="reports.generate">Generate</span>
            </button>
        </div>

        <!-- Report Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
            <div class="table-wrapper">
                <div class="table-container" id="trialBalanceTable">
                    <table class="table">
                        <thead>
                        <tr>
                            <th data-i18n="reports.trialBalance.table.code">Code</th>
                            <th data-i18n="reports.trialBalance.table.account">Account</th>
                            <th class="table__cell--numeric" data-i18n="reports.trialBalance.table.debit">Debit</th>
                            <th class="table__cell--numeric" data-i18n="reports.trialBalance.table.credit">Credit</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="4">
                                <div class="table__empty" data-i18n="reports.trialBalance.empty">Select a period and generate report</div>
                            </td>
                        </tr>
                        </tbody>
                        <tfoot class="table__footer">
                        <tr>
                            <td colspan="2" style="font-weight: var(--font-weight-bold);" data-i18n="reports.trialBalance.totals">Totals</td>
                            <td class="table__cell--numeric" style="font-weight: var(--font-weight-bold);" data-total="debit">—</td>
                            <td class="table__cell--numeric" style="font-weight: var(--font-weight-bold);" data-total="credit">—</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>