<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Updates - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="updates.title">Updates & Changelog</h1>
                        <p class="page-header__description" data-i18n="updates.description">Stay informed about new features and improvements.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-2">
                    <div id="changelogContainer"></div>
                </div>

                <div>
                    <div class="card mb-6">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="updates.feedback.title">Send Feedback</h2>
                        </div>
                        <div class="card__body">
                            <form class="form" id="feedbackForm">
                                <div class="form-group">
                                    <label class="form-label" data-i18n="updates.feedback.type">Feedback Type</label>
                                    <select class="form-control" name="type">
                                        <option value="bug">Bug Report</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="improvement">Improvement</option>
                                        <option value="question">Question</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" data-i18n="updates.feedback.message">Message <span style="color: var(--color-error);">*</span></label>
                                    <textarea class="form-control" name="message" rows="5" required placeholder="Tell us what you think..."></textarea>
                                </div>

                                <div class="form-group">
                                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                        <input type="checkbox" name="allowContact" checked>
                                        <span style="font-size: 14px;" data-i18n="updates.feedback.contact">Allow us to contact you</span>
                                    </label>
                                </div>

                                <button type="button" class="btn btn-primary btn--full" onclick="window.submitFeedback()" data-i18n="updates.feedback.submit">Submit Feedback</button>
                            </form>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card__header">
                            <h2 class="card__title" data-i18n="updates.version.title">System Info</h2>
                        </div>
                        <div class="card__body">
                            <div style="font-size: 13px;">
                                <div style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                                    <div style="color: var(--color-text-secondary); margin-bottom: 4px;" data-i18n="updates.version.current">Current Version</div>
                                    <div style="font-weight: 600;">v2.5.0</div>
                                </div>
                                <div style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                                    <div style="color: var(--color-text-secondary); margin-bottom: 4px;" data-i18n="updates.version.released">Released</div>
                                    <div style="font-weight: 600;">December 26, 2024</div>
                                </div>
                                <div style="padding: 8px 0;">
                                    <div style="color: var(--color-text-secondary); margin-bottom: 4px;" data-i18n="updates.version.upToDate">Status</div>
                                    <div style="font-weight: 600; color: var(--color-success-600);">✓ Up to date</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/updates.js"></script>
</body>
</html>
