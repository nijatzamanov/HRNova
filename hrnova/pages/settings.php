<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="settings.title">Settings</h1>
                        <p class="page-header__description" data-i18n="settings.description">Configure system preferences and notifications.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="settings.general.title">General Settings</h2>
                    </div>
                    <div class="card__body">
                        <form class="form">
                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.general.language">Language</label>
                                <div id="languageSwitcherContainer"></div>
                                <small style="color: var(--color-text-secondary); font-size: 12px;" data-i18n="settings.general.languageHelp">
                                    Select your preferred interface language
                                </small>
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.general.timezone">Timezone</label>
                                <select class="form-control">
                                    <option value="utc">UTC (GMT+0)</option>
                                    <option value="asia/baku" selected>Asia/Baku (GMT+4)</option>
                                    <option value="europe/istanbul">Europe/Istanbul (GMT+3)</option>
                                    <option value="europe/moscow">Europe/Moscow (GMT+3)</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.general.dateFormat">Date Format</label>
                                <select class="form-control">
                                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                                    <option value="mm/dd/yyyy" selected>MM/DD/YYYY</option>
                                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.general.timeFormat">Time Format</label>
                                <select class="form-control">
                                    <option value="12h" selected>12 Hour (AM/PM)</option>
                                    <option value="24h">24 Hour</option>
                                </select>
                            </div>

                            <button type="button" class="btn btn-primary" onclick="window.saveGeneralSettings()" data-i18n="settings.general.save">Save Changes</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="settings.branding.title">Branding</h2>
                    </div>
                    <div class="card__body">
                        <form class="form">
                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.branding.companyName">Company Name</label>
                                <input type="text" class="form-control" value="HRNova">
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.branding.logo">Company Logo</label>
                                <input type="file" class="form-control" accept="image/*" disabled style="opacity: 0.6;">
                                <small style="color: var(--color-text-secondary); font-size: 12px;">
                                    Logo upload placeholder (UI only)
                                </small>
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.branding.primaryColor">Primary Color</label>
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <input type="color" value="#3b82f6" style="width: 60px; height: 40px; cursor: pointer;">
                                    <input type="text" class="form-control" value="#3b82f6" style="flex: 1;">
                                </div>
                            </div>

                            <button type="button" class="btn btn-primary" onclick="window.saveBrandingSettings()" data-i18n="settings.branding.save">Save Changes</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="settings.notifications.title">Notifications</h2>
                    </div>
                    <div class="card__body">
                        <form class="form">
                            <h3 style="font-weight: 600; margin-bottom: 16px; font-size: 14px;" data-i18n="settings.notifications.email">Email Notifications</h3>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" checked>
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.leaveRequests">Leave requests</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" checked>
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.announcements">Announcements</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" checked>
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.documentExpiry">Document expiry alerts</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox">
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.weeklyDigest">Weekly digest</span>
                                </label>
                            </div>

                            <h3 style="font-weight: 600; margin: 24px 0 16px; font-size: 14px;" data-i18n="settings.notifications.push">Push Notifications</h3>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" checked>
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.browser">Browser notifications</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox">
                                    <span style="font-size: 14px;" data-i18n="settings.notifications.mobile">Mobile notifications</span>
                                </label>
                            </div>

                            <button type="button" class="btn btn-primary" onclick="window.saveNotificationSettings()" data-i18n="settings.notifications.save">Save Changes</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card__header">
                        <h2 class="card__title" data-i18n="settings.security.title">Security</h2>
                    </div>
                    <div class="card__body">
                        <form class="form">
                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.security.passwordPolicy">Password Policy</label>
                                <select class="form-control">
                                    <option value="basic">Basic (8+ characters)</option>
                                    <option value="standard" selected>Standard (8+ chars, numbers)</option>
                                    <option value="strong">Strong (12+ chars, mixed case, symbols)</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" data-i18n="settings.security.sessionTimeout">Session Timeout</label>
                                <select class="form-control">
                                    <option value="30">30 minutes</option>
                                    <option value="60" selected>1 hour</option>
                                    <option value="240">4 hours</option>
                                    <option value="480">8 hours</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" checked>
                                    <span style="font-size: 14px;" data-i18n="settings.security.twoFactor">Require two-factor authentication</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox">
                                    <span style="font-size: 14px;" data-i18n="settings.security.ipWhitelist">IP whitelist restrictions</span>
                                </label>
                            </div>

                            <button type="button" class="btn btn-primary" onclick="window.saveSecuritySettings()" data-i18n="settings.security.save">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/settings.js"></script>
</body>
</html>
