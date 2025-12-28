<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Migration Cases - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="migration.title">Migration Cases</h1>
                        <p class="page-header__description" data-i18n="migration.description">Track work permits and visa expiry dates.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="migration.stats.expiringSoon">Expiring Soon</div>
                    <div class="stat-card__value" style="color: var(--color-error-600);" id="statExpiringSoon">0</div>
                    <div class="text-xs text-secondary mt-2" data-i18n="migration.stats.next30Days">next 30 days</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="migration.stats.upcomingRenewals">Upcoming Renewals</div>
                    <div class="stat-card__value" style="color: var(--color-warning-600);" id="statUpcoming">0</div>
                    <div class="text-xs text-secondary mt-2" data-i18n="migration.stats.next60Days">next 60 days</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="migration.stats.active">Active Documents</div>
                    <div class="stat-card__value" style="color: var(--color-success-600);" id="statActive">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="migration.stats.expired">Expired</div>
                    <div class="stat-card__value" style="color: var(--color-error-600);" id="statExpired">0</div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-2">
                    <div id="migrationTableContainer"></div>
                </div>

                <div>
                    <div class="card">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="migration.reminders.title">Reminder Settings</h2>
                        </div>
                        <div class="card__body">
                            <form class="form" id="reminderSettingsForm">
                                <div class="form-group">
                                    <label class="form-label" data-i18n="migration.reminders.firstNotice">First Notice</label>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="number" class="form-control" value="90" min="1" style="width: 80px;">
                                        <span style="font-size: 14px; color: var(--color-text-secondary);" data-i18n="migration.reminders.daysBefore">days before</span>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" data-i18n="migration.reminders.secondNotice">Second Notice</label>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="number" class="form-control" value="60" min="1" style="width: 80px;">
                                        <span style="font-size: 14px; color: var(--color-text-secondary);" data-i18n="migration.reminders.daysBefore">days before</span>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" data-i18n="migration.reminders.finalNotice">Final Notice</label>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="number" class="form-control" value="30" min="1" style="width: 80px;">
                                        <span style="font-size: 14px; color: var(--color-text-secondary);" data-i18n="migration.reminders.daysBefore">days before</span>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" checked>
                                        <span style="font-size: 14px;" data-i18n="migration.reminders.emailNotifications">Email Notifications</span>
                                    </label>
                                </div>

                                <div class="form-group">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" checked>
                                        <span style="font-size: 14px;" data-i18n="migration.reminders.dashboardAlerts">Dashboard Alerts</span>
                                    </label>
                                </div>

                                <button type="button" class="btn btn-primary btn--full" onclick="window.saveReminderSettings()" data-i18n="migration.reminders.save">Save Settings</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/migration.js"></script>
</body>
</html>
