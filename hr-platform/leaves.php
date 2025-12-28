<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Management - HR Platform</title>

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
    <link rel="stylesheet" href="./assets/css/components/tabs.css">
    <link rel="stylesheet" href="./assets/css/components/theme-toggle.css">
    <link rel="stylesheet" href="./assets/css/components/table.css">
    <link rel="stylesheet" href="./assets/css/pages/leaves.css">
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
            <!-- Theme Toggle -->
            <button class="theme-toggle" aria-label="Toggle theme">
                <svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            </button>

            <!-- Language Dropdown -->
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
                        <a href="./leaves.php" class="sidebar__link sidebar__link--active">
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
                        <a href="./settings.php" class="sidebar__link">
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
            <div>
                <h1 class="page-header__title" data-i18n="leaves.title">Leave Management</h1>
                <p class="text-muted">Manage leave requests and track balances</p>
            </div>
            <button class="btn btn--primary" id="newLeaveBtn" data-i18n="leaves.newRequest">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="3" x2="8" y2="13"/>
                    <line x1="3" y1="8" x2="13" y2="8"/>
                </svg>
                New Request
            </button>
        </div>

        <!-- Leave Balance Card -->
        <div class="leave-balance-card card">
            <div class="leave-balance-card__header">
                <h3 data-i18n="leaves.balance">Leave Balance</h3>
                <span class="badge badge--info">2025</span>
            </div>
            <div class="leave-balance-card__grid">
                <div class="leave-balance-item">
                    <div class="leave-balance-item__label" data-i18n="leaves.vacation">Vacation</div>
                    <div class="leave-balance-item__value">
                        <span class="leave-balance-item__remaining">15</span>
                        <span class="leave-balance-item__total">/ 20</span>
                        <span class="text-muted text-xs" data-i18n="leaves.daysRemaining">days remaining</span>
                    </div>
                </div>
                <div class="leave-balance-item">
                    <div class="leave-balance-item__label" data-i18n="leaves.sick">Sick Leave</div>
                    <div class="leave-balance-item__value">
                        <span class="leave-balance-item__remaining">10</span>
                        <span class="leave-balance-item__total">/ 10</span>
                        <span class="text-muted text-xs" data-i18n="leaves.daysRemaining">days remaining</span>
                    </div>
                </div>
                <div class="leave-balance-item">
                    <div class="leave-balance-item__label" data-i18n="leaves.personal">Personal Leave</div>
                    <div class="leave-balance-item__value">
                        <span class="leave-balance-item__remaining">3</span>
                        <span class="leave-balance-item__total">/ 5</span>
                        <span class="text-muted text-xs" data-i18n="leaves.daysRemaining">days remaining</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs" id="leavesTabs">
            <div class="tabs__list">
                <button class="tabs__tab tabs__tab--active" data-i18n="leaves.pending">Pending</button>
                <button class="tabs__tab" data-i18n="leaves.approved">Approved</button>
                <button class="tabs__tab" data-i18n="leaves.rejected">Rejected</button>
            </div>

            <!-- Pending Panel -->
            <div class="tabs__panel tabs__panel--active">
                <div class="table-wrapper">
                    <table class="table">
                        <thead class="table__head">
                        <tr>
                            <th data-i18n="employees.name">Employee</th>
                            <th data-i18n="leaves.leaveType">Leave Type</th>
                            <th data-i18n="leaves.startDate">Start Date</th>
                            <th data-i18n="leaves.endDate">End Date</th>
                            <th>Days</th>
                            <th data-i18n="leaves.reason">Reason</th>
                            <th data-i18n="common.actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody class="table__body" id="pendingTableBody">
                        <!-- Will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Approved Panel -->
            <div class="tabs__panel">
                <div class="table-wrapper">
                    <table class="table">
                        <thead class="table__head">
                        <tr>
                            <th data-i18n="employees.name">Employee</th>
                            <th data-i18n="leaves.leaveType">Leave Type</th>
                            <th data-i18n="leaves.startDate">Start Date</th>
                            <th data-i18n="leaves.endDate">End Date</th>
                            <th>Days</th>
                            <th data-i18n="leaves.reason">Reason</th>
                        </tr>
                        </thead>
                        <tbody class="table__body" id="approvedTableBody">
                        <!-- Will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Rejected Panel -->
            <div class="tabs__panel">
                <div class="table-wrapper">
                    <table class="table">
                        <thead class="table__head">
                        <tr>
                            <th data-i18n="employees.name">Employee</th>
                            <th data-i18n="leaves.leaveType">Leave Type</th>
                            <th data-i18n="leaves.startDate">Start Date</th>
                            <th data-i18n="leaves.endDate">End Date</th>
                            <th>Days</th>
                            <th data-i18n="leaves.reason">Reason</th>
                        </tr>
                        </thead>
                        <tbody class="table__body" id="rejectedTableBody">
                        <!-- Will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- New Leave Request Modal -->
<div class="modal" id="leaveModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" data-i18n="leaves.newRequest">New Leave Request</h2>
            <button class="modal__close" aria-label="Close" id="closeLeaveModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body">
            <form id="leaveForm">
                <input type="hidden" id="leaveId">

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="leaves.leaveType">Leave Type</label>
                    <select class="form-select" id="leaveType" required>
                        <option value="">Select type</option>
                        <option value="vacation" data-i18n="leaves.vacation">Vacation</option>
                        <option value="sick" data-i18n="leaves.sick">Sick Leave</option>
                        <option value="personal" data-i18n="leaves.personal">Personal Leave</option>
                    </select>
                    <div class="form-error">Please select a leave type</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="leaves.startDate">Start Date</label>
                    <input type="date" class="form-input" id="leaveStartDate" required>
                    <div class="form-error">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="leaves.endDate">End Date</label>
                    <input type="date" class="form-input" id="leaveEndDate" required>
                    <div class="form-error">End date must be after start date</div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="leaves.reason">Reason</label>
                    <textarea class="form-textarea" id="leaveReason" rows="4" data-i18n-placeholder="leaves.reason"></textarea>
                </div>
            </form>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary" id="cancelLeaveBtn" data-i18n="common.cancel">Cancel</button>
            <button class="btn btn--primary" id="submitLeaveBtn" data-i18n="common.save">Submit Request</button>
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
<script src="./assets/js/core/state.js"></script>
<script src="./assets/js/components/dropdown.js"></script>
<script src="./assets/js/components/modal.js"></script>
<script src="./assets/js/components/toast.js"></script>
<script src="./assets/js/components/tabs.js"></script>
<script src="./assets/js/components/themeToggle.js"></script>
<script src="./assets/js/pages/leaves.js"></script>
</body>
</html>