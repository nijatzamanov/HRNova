<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maliyyə Hesabatları – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="reports-financial-statements" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">Maliyyə Hesabatları</h1>
                <p class="app-main__subtitle">Balans və Mənfəət-Zərər Hesabatı</p>
            </div>
            <button class="btn btn--primary" data-action="export-statements">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>CSV Export</span>
            </button>
        </div>

        <!-- Report Controls -->
        <div class="report-controls">
            <div class="form-group" style="margin-bottom: 0;">
                <label for="statementPeriod" class="form-label">Hesabat Dövrü</label>
                <select id="statementPeriod" class="form-select">
                    <option value="month" selected>Bu Ay</option>
                    <option value="quarter">Bu Rüb</option>
                    <option value="year">Bu İl</option>
                    <option value="all">Bütün Dövr</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label for="statementType" class="form-label">Hesabat Növü</label>
                <select id="statementType" class="form-select">
                    <option value="both" selected>Hər İkisi</option>
                    <option value="balance-sheet">Balans Hesabatı</option>
                    <option value="income-statement">Mənfəət-Zərər</option>
                </select>
            </div>

            <div style="display: flex; align-items: flex-end;">
                <button class="btn btn--secondary" data-action="generate-statements">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span>Hesabat Yarat</span>
                </button>
            </div>
        </div>

        <!-- Balance Sheet -->
        <div class="card report-card" id="balanceSheetCard">
            <div class="report-card__header">
                <h2>Balans Hesabatı</h2>
                <span class="report-card__date" id="balanceSheetDate">-</span>
            </div>
            <div class="report-table-wrapper">
                <table class="report-table financial-statement-table">
                    <thead>
                    <tr>
                        <th style="width: 60%;">Maddə</th>
                        <th style="width: 40%; text-align: right;">Məbləğ</th>
                    </tr>
                    </thead>
                    <tbody id="balanceSheetBody">
                    <tr>
                        <td colspan="2">
                            <div class="table__loading">
                                <div class="spinner"></div>
                                <p>Hesabat hazırlanır...</p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Income Statement (P&L) -->
        <div class="card report-card" id="incomeStatementCard" style="margin-top: var(--space-6);">
            <div class="report-card__header">
                <h2>Mənfəət və Zərər Hesabatı</h2>
                <span class="report-card__date" id="incomeStatementDate">-</span>
            </div>
            <div class="report-table-wrapper">
                <table class="report-table financial-statement-table">
                    <thead>
                    <tr>
                        <th style="width: 60%;">Maddə</th>
                        <th style="width: 40%; text-align: right;">Məbləğ</th>
                    </tr>
                    </thead>
                    <tbody id="incomeStatementBody">
                    <tr>
                        <td colspan="2">
                            <div class="table__loading">
                                <div class="spinner"></div>
                                <p>Hesabat hazırlanır...</p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>