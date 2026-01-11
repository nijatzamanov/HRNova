<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Balance – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="reports-trial-balance" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">Trial Balance</h1>
                <p class="app-main__subtitle">Hesablar üzrə debet və kredit balansı</p>
            </div>
            <div style="display: flex; gap: var(--space-3);">
                <button class="btn btn--secondary" data-action="refresh-report">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    <span>Yenilə</span>
                </button>
                <button class="btn btn--primary" data-action="export-csv">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>CSV Export</span>
                </button>
            </div>
        </div>

        <!-- Report Period -->
        <div class="report-controls">
            <div class="form-group" style="margin-bottom: 0;">
                <label for="reportPeriod" class="form-label">Hesabat Dövrü</label>
                <select id="reportPeriod" class="form-select">
                    <option value="all">Bütün Dövr</option>
                    <option value="today">Bu Gün</option>
                    <option value="week">Bu Həftə</option>
                    <option value="month" selected>Bu Ay</option>
                    <option value="quarter">Bu Rüb</option>
                    <option value="year">Bu İl</option>
                    <option value="custom">Xüsusi Dövr</option>
                </select>
            </div>

            <div class="form-group" id="customDateRange" style="margin-bottom: 0; display: none;">
                <label for="dateFrom" class="form-label">-dən</label>
                <input type="date" id="dateFrom" class="form-input">
            </div>

            <div class="form-group" id="customDateRangeTo" style="margin-bottom:  0; display: none;">
                <label for="dateTo" class="form-label">-dək</label>
                <input type="date" id="dateTo" class="form-input">
            </div>

            <div class="form-group" style="flex:  1; margin-bottom: 0;">
                <label for="searchAccount" class="form-label">Hesab Axtar</label>
                <input type="search" id="searchAccount" class="form-input form-input--search" placeholder="Hesab kodu və ya adı... ">
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="report-summary">
            <div class="report-summary-card">
                <div class="report-summary-card__label">Cəmi Debet</div>
                <div class="report-summary-card__value report-summary-card__value--debit" data-summary="total-debit">0.00 ₼</div>
            </div>
            <div class="report-summary-card">
                <div class="report-summary-card__label">Cəmi Kredit</div>
                <div class="report-summary-card__value report-summary-card__value--credit" data-summary="total-credit">0.00 ₼</div>
            </div>
            <div class="report-summary-card">
                <div class="report-summary-card__label">Fərq</div>
                <div class="report-summary-card__value report-summary-card__value--diff" data-summary="diff">0.00 ₼</div>
            </div>
        </div>

        <!-- Trial Balance Table -->
        <div class="card report-card">
            <div class="report-table-wrapper">
                <table class="report-table" id="trialBalanceTable">
                    <thead>
                    <tr>
                        <th style="width: 100px;">Kod</th>
                        <th style="min-width: 250px;">Hesab Adı</th>
                        <th style="width: 150px; text-align: right;">Açılış Balansı</th>
                        <th style="width: 150px; text-align: right;">Debet</th>
                        <th style="width: 150px; text-align: right;">Kredit</th>
                        <th style="width: 150px; text-align: right;">Bağlanış Balansı</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="6">
                            <div class="table__loading">
                                <div class="spinner"></div>
                                <p>Hesabat hazırlanır...</p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr class="report-table__total">
                        <td colspan="2"><strong>CƏMİ</strong></td>
                        <td style="text-align: right;" data-total="opening">0.00 ₼</td>
                        <td style="text-align: right;" data-total="debit">0.00 ₼</td>
                        <td style="text-align: right;" data-total="credit">0.00 ₼</td>
                        <td style="text-align: right;" data-total="closing">0.00 ₼</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>