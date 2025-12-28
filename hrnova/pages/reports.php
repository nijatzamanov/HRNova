<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports - HRNova</title>
    <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body>
<div class="page-shell">
    <div id="sidebar-mount"></div>
    <div id="topbar-mount"></div>

    <main class="main-content">
        <div class="content-container">
            <div class="page-header">
                <div class="page-header__top">
                    <div>
                        <h1 class="page-header__title" data-i18n="reports.title">Reports & Analytics</h1>
                        <p class="page-header__description" data-i18n="reports.description">Generate and export comprehensive HR reports.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="card" style="cursor: pointer;" onclick="window.generateReport('headcount')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">👥</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.headcount.title">Headcount Report</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.headcount.description">Total employees by department and branch</p>
                    </div>
                </div>

                <div class="card" style="cursor: pointer;" onclick="window.generateReport('attendance')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">📊</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.attendance.title">Attendance Report</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.attendance.description">Daily attendance and work hours summary</p>
                    </div>
                </div>

                <div class="card" style="cursor: pointer;" onclick="window.generateReport('leave')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">🏖️</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.leave.title">Leave Report</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.leave.description">Leave balances and usage by employee</p>
                    </div>
                </div>

                <div class="card" style="cursor: pointer;" onclick="window.generateReport('payroll')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">💰</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.payroll.title">Payroll Summary</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.payroll.description">Monthly payroll costs and breakdown</p>
                    </div>
                </div>

                <div class="card" style="cursor: pointer;" onclick="window.generateReport('turnover')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">📈</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.turnover.title">Turnover Analysis</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.turnover.description">Employee retention and turnover rates</p>
                    </div>
                </div>

                <div class="card" style="cursor: pointer;" onclick="window.generateReport('migration')">
                    <div class="card__body">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <div style="font-size: 32px;">📄</div>
                            <button class="btn btn-secondary btn--sm">Generate</button>
                        </div>
                        <h3 style="font-weight: 600; margin-bottom: 4px;" data-i18n="reports.migration.title">Migration Report</h3>
                        <p style="font-size: 13px; color: var(--color-text-secondary);" data-i18n="reports.migration.description">Document expiry and renewal status</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card__header">
                    <h2 class="card__title" data-i18n="reports.export.title">Export Center</h2>
                </div>
                <div class="card__body">
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <h3 style="font-weight: 600; margin-bottom: 16px; font-size: 15px;" data-i18n="reports.export.format">Export Format</h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="exportFormat" value="pdf" checked>
                                    <span>PDF Document</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="exportFormat" value="excel">
                                    <span>Excel Spreadsheet (.xlsx)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" name="exportFormat" value="csv">
                                    <span>CSV File</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 style="font-weight: 600; margin-bottom: 16px; font-size: 15px;" data-i18n="reports.export.dateRange">Date Range</h3>
                            <div class="form-group">
                                <label class="form-label">From</label>
                                <input type="date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label class="form-label">To</label>
                                <input type="date" class="form-control">
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border);">
                        <button class="btn btn-primary" onclick="window.exportReport()" data-i18n="reports.export.button">Export Report</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/reports.js"></script>
</body>
</html>
