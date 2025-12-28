<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employees - HRNova</title>
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
                        <h1 class="page-header__title" data-i18n="employees.title">Employees</h1>
                        <p class="page-header__description" data-i18n="employees.description">Manage your organization's employee directory and information.</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-8" id="employeeStats">
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="employees.stats.total">Total Employees</div>
                    <div class="stat-card__value" id="statTotal">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="employees.stats.active">Active</div>
                    <div class="stat-card__value" style="color: var(--color-success-600);" id="statActive">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="employees.stats.onLeave">On Leave</div>
                    <div class="stat-card__value" style="color: var(--color-warning-600);" id="statOnLeave">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card__label" data-i18n="employees.stats.inactive">Inactive</div>
                    <div class="stat-card__value" style="color: var(--color-gray-500);" id="statInactive">0</div>
                </div>
            </div>

            <div id="employeeTableContainer"></div>
        </div>
    </main>
</div>

<div class="drawer-overlay" id="employeeDrawerOverlay"></div>
<div class="drawer" id="employeeDrawer">
    <div class="drawer-header">
        <h2 class="drawer-title" id="drawerTitle">Employee Details</h2>
        <button class="drawer-close" id="closeDrawer" aria-label="Close drawer">×</button>
    </div>

    <div class="tabs">
        <ul class="tabs-list" role="tablist">
            <li><button class="tab-button active" data-tab="overview" role="tab" aria-selected="true" data-i18n="employees.tabs.overview">Overview</button></li>
            <li><button class="tab-button" data-tab="job" role="tab" aria-selected="false" data-i18n="employees.tabs.job">Job Details</button></li>
            <li><button class="tab-button" data-tab="documents" role="tab" aria-selected="false" data-i18n="employees.tabs.documents">Documents</button></li>
            <li><button class="tab-button" data-tab="notes" role="tab" aria-selected="false" data-i18n="employees.tabs.notes">Notes</button></li>
        </ul>
    </div>

    <div class="drawer-body">
        <div class="tab-content active" id="tab-overview" role="tabpanel">
            <div class="profile-section">
                <h3 class="profile-section-title" data-i18n="employees.sections.personalInfo">Personal Information</h3>
                <div class="profile-grid">
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.employeeId">Employee ID</span>
                        <span class="profile-field-value" id="field-employeeId">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.fullName">Full Name</span>
                        <span class="profile-field-value" id="field-fullName">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.email">Email</span>
                        <span class="profile-field-value" id="field-email">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.phone">Phone</span>
                        <span class="profile-field-value" id="field-phone">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.birthDate">Birth Date</span>
                        <span class="profile-field-value" id="field-birthDate">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.gender">Gender</span>
                        <span class="profile-field-value" id="field-gender">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.nationality">Nationality</span>
                        <span class="profile-field-value" id="field-nationality">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.passport">Passport Number</span>
                        <span class="profile-field-value" id="field-passportNumber">-</span>
                    </div>
                    <div class="profile-field full-width">
                        <span class="profile-field-label" data-i18n="employees.fields.address">Address</span>
                        <span class="profile-field-value" id="field-address">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.emergencyContact">Emergency Contact</span>
                        <span class="profile-field-value" id="field-emergencyContact">-</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content" id="tab-job" role="tabpanel">
            <div class="profile-section">
                <h3 class="profile-section-title" data-i18n="employees.sections.jobInfo">Job Information</h3>
                <div class="profile-grid">
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.position">Position</span>
                        <span class="profile-field-value" id="field-position">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.department">Department</span>
                        <span class="profile-field-value" id="field-department">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.branch">Branch</span>
                        <span class="profile-field-value" id="field-branch">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.manager">Manager</span>
                        <span class="profile-field-value" id="field-manager">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.joinDate">Join Date</span>
                        <span class="profile-field-value" id="field-joinDate">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.contractType">Contract Type</span>
                        <span class="profile-field-value" id="field-contractType">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.workType">Work Type</span>
                        <span class="profile-field-value" id="field-workType">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.status">Status</span>
                        <span class="profile-field-value" id="field-status">-</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3 class="profile-section-title" data-i18n="employees.sections.compensation">Compensation</h3>
                <div class="profile-grid">
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.salary">Salary</span>
                        <span class="profile-field-value" id="field-salary">-</span>
                    </div>
                    <div class="profile-field">
                        <span class="profile-field-label" data-i18n="employees.fields.currency">Currency</span>
                        <span class="profile-field-value" id="field-currency">-</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content" id="tab-documents" role="tabpanel">
            <div class="profile-section">
                <h3 class="profile-section-title" data-i18n="employees.sections.documents">Documents</h3>
                <div class="table-empty">
                    <div class="table-empty-icon">📄</div>
                    <div class="table-empty-title" data-i18n="employees.documents.empty.title">No documents uploaded</div>
                    <div class="table-empty-description" data-i18n="employees.documents.empty.description">Documents and files will appear here.</div>
                </div>
            </div>
        </div>

        <div class="tab-content" id="tab-notes" role="tabpanel">
            <div class="profile-section">
                <h3 class="profile-section-title" data-i18n="employees.sections.notes">Notes</h3>
                <div class="table-empty">
                    <div class="table-empty-icon">📝</div>
                    <div class="table-empty-title" data-i18n="employees.notes.empty.title">No notes available</div>
                    <div class="table-empty-description" data-i18n="employees.notes.empty.description">Add notes to keep track of important information.</div>
                </div>
            </div>
        </div>
    </div>

    <div class="drawer-footer">
        <button class="btn btn-secondary" id="editEmployeeBtn" data-i18n="common.edit">Edit</button>
        <button class="btn btn-secondary" id="closeDrawerBtn" data-i18n="common.close">Close</button>
    </div>
</div>

<script type="module" src="../assets/js/app/boot.js"></script>
<script type="module" src="../assets/js/pages/employees.js"></script>
</body>
</html>
