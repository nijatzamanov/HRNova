<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Ledger – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="reports-general-ledger" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">General Ledger</h1>
                <p class="app-main__subtitle">Hesab üzrə ətraflı əməliyyat siyahısı</p>
            </div>
            <button class="btn btn--primary" data-action="export-csv">
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
            <div class="form-group" style="flex: 2; margin-bottom: 0;">
                <label for="accountSelect" class="form-label form-label--required">Hesab Seç</label>
                <select id="accountSelect" class="form-select" required>
                    <option value="">Hesab seçin</option>
                    <!-- Populated by JS -->
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label for="periodSelect" class="form-label">Dövr</label>
                <select id="periodSelect" class="form-select">
                    <option value="all">Bütün Dövr</option>
                    <option value="month" selected>Bu Ay</option>
                    <option value="quarter">Bu Rüb</option>
                    <option value="year">Bu İl</option>
                </select>
            </div>

            <div style="display: flex; align-items: flex-end;">
                <button class="btn btn--secondary" data-action="generate-ledger">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span>Hesabat Yarat</span>
                </button>
            </div>
        </div>

        <!-- Account Info -->
        <div class="ledger-account-info" id="accountInfo" style="display: none;">
            <div class="ledger-account-info__header">
                <div>
                    <div class="ledger-account-info__code" id="accountCode">-</div>
                    <div class="ledger-account-info__name" id="accountName">-</div>
                </div>
                <div class="ledger-account-info__balance">
                    <div class="ledger-account-info__balance-label">Cari Balans</div>
                    <div class="ledger-account-info__balance-value" id="accountBalance">0.00 ₼</div>
                </div>
            </div>
        </div>

        <!-- Ledger Table -->
        <div class="card report-card" id="ledgerCard" style="display: none;">
            <div class="report-table-wrapper">
                <table class="report-table" id="ledgerTable">
                    <thead>
                    <tr>
                        <th style="width: 100px;">Tarix</th>
                        <th style="width: 120px;">Jurnal №</th>
                        <th style="min-width: 200px;">Təsvir</th>
                        <th style="width: 150px; text-align: right;">Debet</th>
                        <th style="width: 150px; text-align: right;">Kredit</th>
                        <th style="width: 150px; text-align: right;">Balans</th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Populated by JS -->
                    </tbody>
                    <tfoot>
                    <tr class="report-table__total">
                        <td colspan="3"><strong>CƏMİ</strong></td>
                        <td style="text-align: right;" data-total="debit">0.00 ₼</td>
                        <td style="text-align: right;" data-total="credit">0.00 ₼</td>
                        <td style="text-align: right;" data-total="balance">0.00 ₼</td>
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