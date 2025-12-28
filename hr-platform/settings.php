<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - HR Platform</title>

    <!-- CSS -->
    <link rel="stylesheet" href="./assets/css/base/reset.css">
    <link rel="stylesheet" href="./assets/css/base/variables.css">
    <link rel="stylesheet" href="./assets/css/base/typography.css">
    <link rel="stylesheet" href="./assets/css/base/layout.css">
    <link rel="stylesheet" href="./assets/css/components/buttons.css">
    <link rel="stylesheet" href="./assets/css/components/forms.css">
    <link rel="stylesheet" href="./assets/css/components/cards.css">
    <link rel="stylesheet" href="./assets/css/components/badge.css">
    <link rel="stylesheet" href="./assets/css/components/header.css">
    <link rel="stylesheet" href="./assets/css/components/sidebar.css">
    <link rel="stylesheet" href="./assets/css/components/dropdown.css">
    <link rel="stylesheet" href="./assets/css/components/modal.css">
    <link rel="stylesheet" href="./assets/css/components/toast.css">
    <link rel="stylesheet" href="./assets/css/components/table.css">
    <link rel="stylesheet" href="./assets/css/pages/settings.css">
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="header__container">
        <button class="header__menu-btn" id="menuToggle" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>

        <a href="./dashboard.php" class="header__brand">
            <svg class="header__logo" viewBox="0 0 32 32" fill="currentColor">
                <rect x="4" y="4" width="24" height="24" rx="4" fill="currentColor"/>
                <path d="M16 10v12M10 16h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>HR Platform</span>
        </a>

        <div class="header__actions">
            <div class="dropdown" id="langDropdown">
                <button class="dropdown__toggle" aria-expanded="false" aria-haspopup="true">
                    <span id="currentLang">EN</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="dropdown__menu">
                    <button class="dropdown__item" data-lang="en">English</button>
                    <button class="dropdown__item" data-lang="az">Azərbaycan</button>
                    <button class="dropdown__item" data-lang="ru">Русский</button>
                    <button class="dropdown__item" data-lang="tr">Türkçe</button>
                </div>
            </div>

            <div class="dropdown" id="userDropdown">
                <button class="dropdown__toggle" aria-expanded="false" aria-haspopup="true">
                    <img src="./assets/img/placeholders/avatar.svg" alt="User" style="width: 32px; height: 32px; border-radius: 50%;">
                </button>
                <div class="dropdown__menu">
                    <button class="dropdown__item">Profile</button>
                    <button class="dropdown__item" data-i18n="nav.settings">Settings</button>
                    <div class="dropdown__divider"></div>
                    <button class="dropdown__item dropdown__item--danger" data-i18n="nav.logout">Log Out</button>
                </div>
            </div>
        </div>
    </div>
</header>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="dashboard-layout__sidebar" id="sidebar">
        <nav class="sidebar">
            <div class="sidebar__section">
                <ul class="sidebar__nav">
                    <li>
                        <a href="./dashboard.php" class="sidebar__link">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                            </svg>
                            <span data-i18n="nav.dashboard">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="employees.php" class="sidebar__link">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <span data-i18n="nav.employees">Employees</span>
                        </a>
                    </li>
                    <li>
                        <a href="./leaves.php" class="sidebar__link">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span data-i18n="nav.leaves">Leave Management</span>
                            <span class="sidebar__link-badge">3</span>
                        </a>
                    </li>
                    <li>
                        <a href="./documents.php" class="sidebar__link">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                <polyline points="13 2 13 9 20 9"/>
                            </svg>
                            <span data-i18n="nav.documents">Documents</span>
                        </a>
                    </li>
                    <li>
                        <a href="./announcements.php" class="sidebar__link">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span data-i18n="nav.announcements">Announcements</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="sidebar__section">
                <h3 class="sidebar__section-title">Settings</h3>
                <ul class="sidebar__nav">
                    <li>
                        <a href="./settings.php" class="sidebar__link sidebar__link--active">
                            <svg class="sidebar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M12 1v6m0 6v6m6.36-15.36l-4.24 4.24m-4.24 4.24L5.64 22.36m14.72 0l-4.24-4.24m-4.24-4.24L1.64 1.64"/>
                            </svg>
                            <span data-i18n="nav.settings">Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-layout__main">
        <div class="page-header">
            <h1 class="page-header__title" data-i18n="settings.title">Settings</h1>
        </div>

        <!-- Company Information -->
        <section class="settings-section">
            <h2 class="settings-section__title" data-i18n="settings.company">Company Information</h2>
            <div class="card">
                <form id="companyForm">
                    <div class="form-group">
                        <label class="form-label" data-i18n="settings.companyName">Company Name</label>
                        <input type="text" class="form-input" id="companyName" value="My Company Ltd. ">
                    </div>

                    <div class="form-group">
                        <label class="form-label" data-i18n="settings.timezone">Timezone</label>
                        <select class="form-select" id="companyTimezone">
                            <option value="Asia/Baku" selected>Asia/Baku (GMT+4)</option>
                            <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
                            <option value="Europe/Moscow">Europe/Moscow (GMT+3)</option>
                            <option value="UTC">UTC (GMT+0)</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn--primary" data-i18n="common.save">Save Changes</button>
                </form>
            </div>
        </section>

        <!-- Departments -->
        <section class="settings-section">
            <div class="settings-section__header">
                <h2 class="settings-section__title" data-i18n="settings.departments">Departments</h2>
                <button class="btn btn--primary btn--sm" id="addDepartmentBtn" data-i18n="settings.addDepartment">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="7" y1="2" x2="7" y2="12"/>
                        <line x1="2" y1="7" x2="12" y2="7"/>
                    </svg>
                    Add Department
                </button>
            </div>

            <div class="card">
                <div class="table-wrapper">
                    <table class="table">
                        <thead class="table__head">
                        <tr>
                            <th>Department Name</th>
                            <th>Employee Count</th>
                            <th data-i18n="common.actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="table__body" id="departmentsTableBody">
                        <!-- Will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Leave Types -->
        <section class="settings-section">
            <div class="settings-section__header">
                <h2 class="settings-section__title" data-i18n="settings.leaveTypes">Leave Types</h2>
                <button class="btn btn--primary btn--sm" id="addLeaveTypeBtn" data-i18n="settings.addLeaveType">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="7" y1="2" x2="7" y2="12"/>
                        <line x1="2" y1="7" x2="12" y2="7"/>
                    </svg>
                    Add Leave Type
                </button>
            </div>

            <div class="card">
                <div class="table-wrapper">
                    <table class="table">
                        <thead class="table__head">
                        <tr>
                            <th>Leave Type</th>
                            <th data-i18n="settings.quota">Annual Quota (days)</th>
                            <th data-i18n="common.actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="table__body" id="leaveTypesTableBody">
                        <!-- Will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- Add Department Modal -->
<div class="modal" id="departmentModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content" style="max-width: 400px;">
        <div class="modal__header">
            <h2 class="modal__title" data-i18n="settings.addDepartment">Add Department</h2>
            <button class="modal__close" aria-label="Close" id="closeDeptModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body">
            <form id="departmentForm">
                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="settings.departmentName">Department Name</label>
                    <input type="text" class="form-input" id="deptName" required>
                    <div class="form-error">This field is required</div>
                </div>
            </form>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary" id="cancelDeptBtn" data-i18n="common.cancel">Cancel</button>
            <button class="btn btn--primary" id="saveDeptBtn" data-i18n="common.save">Save</button>
        </div>
    </div>
</div>

<!-- Add Leave Type Modal -->
<div class="modal" id="leaveTypeModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content" style="max-width: 400px;">
        <div class="modal__header">
            <h2 class="modal__title" data-i18n="settings.addLeaveType">Add Leave Type</h2>
            <button class="modal__close" aria-label="Close" id="closeLeaveTypeModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body">
            <form id="leaveTypeForm">
                <div class="form-group">
                    <label class="form-label form-label--required">Leave Type Name</label>
                    <input type="text" class="form-input" id="leaveTypeName" required>
                    <div class="form-error">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="settings.quota">Annual Quota (days)</label>
                    <input type="number" class="form-input" id="leaveTypeQuota" min="1" required>
                    <div class="form-error">Please enter a valid number</div>
                </div>
            </form>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary" id="cancelLeaveTypeBtn" data-i18n="common.cancel">Cancel</button>
            <button class="btn btn--primary" id="saveLeaveTypeBtn" data-i18n="common.save">Save</button>
        </div>
    </div>
</div>

<!-- Toast Container -->
<div class="toast-container" id="toastContainer"></div>

<!-- Scripts -->
<script src="./assets/js/core/dom.js"></script>
<script src="./assets/js/core/i18n.js"></script>
<script src="./assets/js/core/storage.js"></script>
<script src="./assets/js/core/api.js"></script>
<script src="./assets/js/components/dropdown.js"></script>
<script src="./assets/js/components/modal.js"></script>
<script src="./assets/js/components/toast.js"></script>
<script src="./assets/js/pages/settings.js"></script>
</body>
</html>