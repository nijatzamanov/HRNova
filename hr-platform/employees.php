<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page_title">Employees - HR Platform</title>

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
    <link rel="stylesheet" href="./assets/css/components/table.css">
    <link rel="stylesheet" href="./assets/css/components/theme-toggle.css">
    <link rel="stylesheet" href="./assets/css/components/org-chart.css">
    <link rel="stylesheet" href="./assets/css/components/spinner.css">
    <link rel="stylesheet" href="./assets/css/pages/employees.css">
</head>
<body>

<!-- Loading Overlay -->
<div class="loading-overlay" id="loadingOverlay" hidden>
    <div class="loading-overlay__spinner"></div>
    <div class="loading-overlay__text" data-i18n="loading">Loading...</div>
</div>

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

            <!-- User Dropdown -->
            <div class="dropdown" id="userDropdown">
                <button class="dropdown__toggle" aria-expanded="false" aria-haspopup="true">
                    <img src="./assets/img/placeholders/avatar.svg" alt="User" style="width: 32px; height: 32px; border-radius: 50%;">
                </button>
                <div class="dropdown__menu">
                    <button class="dropdown__item" data-i18n="nav.profile">Profile</button>
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
                        <a href="employees.php" class="sidebar__link sidebar__link--active">
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
                <h3 class="sidebar__section-title" data-i18n="nav.settings">Settings</h3>
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
        <!-- Page Header -->
        <div class="page-header">
            <h1 class="page-header__title" data-i18n="employees.title">Employees</h1>
            <div class="page-header__actions">
                <button class="btn btn--secondary" id="exportCSVBtn" title="Export CSV">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span data-i18n="employees.exportCSV">Export CSV</span>
                </button>
                <button class="btn btn--primary" id="addEmployeeBtn" data-i18n="employees.addEmployee">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="3" x2="8" y2="13"/>
                        <line x1="3" y1="8" x2="13" y2="8"/>
                    </svg>
                    <span>Add Employee</span>
                </button>
            </div>
        </div>

        <!-- Page Tabs -->
        <div class="page-tabs">
            <button class="page-tabs__tab page-tabs__tab--active" data-tab="employee-list">
                <span data-i18n="employees.tabs.list">Employee list</span>
            </button>
            <button class="page-tabs__tab" data-tab="directory">
                <span data-i18n="employees.tabs.directory">Directory</span>
            </button>
            <button class="page-tabs__tab" data-tab="org-chart">
                <span data-i18n="employees.tabs.orgChart">ORG Chart</span>
            </button>
        </div>

        <!-- Tab Content -->
        <div class="page-tab-content">
            <!-- Employee List Tab -->
            <div class="page-tab-panel page-tab-panel--active" data-panel="employee-list">
                <!-- Toolbar -->
                <div class="employees-toolbar">
                    <!-- Search -->
                    <div class="form-search">
                        <svg class="form-search__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="7" cy="7" r="5"/>
                            <line x1="11" y1="11" x2="15" y2="15"/>
                        </svg>
                        <input
                                type="text"
                                class="form-input"
                                id="searchEmployees"
                                placeholder="Search employees..."
                                data-i18n-placeholder="employees.search"
                                aria-label="Search employees"
                        >
                    </div>

                    <!-- Filters -->
                    <div class="employees-toolbar__filters">
                        <!-- Filter Dropdown -->
                        <div class="dropdown" id="filterDropdown">
                            <button class="dropdown__toggle filter-btn" aria-expanded="false" aria-haspopup="true">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="4" y1="6" x2="12" y2="6"/>
                                    <line x1="4" y1="10" x2="12" y2="10"/>
                                    <line x1="6" y1="14" x2="10" y2="14"/>
                                </svg>
                                <span data-i18n="employees.filter">Filter</span>
                            </button>
                            <div class="dropdown__menu dropdown__menu--large">
                                <div class="filter-menu">
                                    <div class="filter-menu__section">
                                        <label class="filter-menu__label" data-i18n="department">Department</label>
                                        <select class="form-select form-select--sm" id="filterDepartment">
                                            <option value="" data-i18n="all_departments">All Departments</option>
                                            <option value="Executive">Executive</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="HR">Human Resources</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Operations">Operations</option>
                                            <option value="Design">Design</option>
                                            <option value="Product">Product</option>
                                            <option value="Legal">Legal</option>
                                        </select>
                                    </div>

                                    <div class="filter-menu__section">
                                        <label class="filter-menu__label" data-i18n="status">Status</label>
                                        <select class="form-select form-select--sm" id="filterStatus">
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div class="filter-menu__actions">
                                        <button class="btn btn--sm btn--ghost" id="clearFiltersBtn" data-i18n="clear">Clear</button>
                                        <button class="btn btn--sm btn--primary" id="applyFiltersBtn" data-i18n="apply">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sort Dropdown -->
                        <div class="dropdown" id="sortDropdown">
                            <button class="dropdown__toggle sort-btn" aria-expanded="false" aria-haspopup="true">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="8" y1="3" x2="8" y2="13"/>
                                    <polyline points="4 9 8 13 12 9"/>
                                </svg>
                                <span data-i18n="employees.sort">Sort</span>
                            </button>
                            <div class="dropdown__menu">
                                <button class="dropdown__item" data-sort="name-asc">Name (A-Z)</button>
                                <button class="dropdown__item" data-sort="name-desc">Name (Z-A)</button>
                                <div class="dropdown__divider"></div>
                                <button class="dropdown__item" data-sort="date-desc">Hire Date (Newest)</button>
                                <button class="dropdown__item" data-sort="date-asc">Hire Date (Oldest)</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Employees Grid -->
                <div class="grid grid--4" id="employeesGrid">
                    <!-- Populated by employees.js -->
                </div>

                <!-- Empty State -->
                <div class="empty-state" id="emptyState" hidden>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p class="empty-state__message" data-i18n="no_employees">No employees found</p>
                </div>
            </div>

            <!-- Directory Tab -->
            <div class="page-tab-panel" data-panel="directory">
                <div class="card">
                    <p class="text-muted" data-i18n="employees.directoryComingSoon">Directory view - Coming in MVP version</p>
                </div>
            </div>

            <!-- ORG Chart Tab -->
            <div class="page-tab-panel" data-panel="org-chart">

                <!-- Org Chart Controls (Embedded in Tab) -->
                <div class="org-chart-controls">
                    <div class="org-chart-controls__left">
                        <!-- Search -->
                        <div class="form-search">
                            <svg class="form-search__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="7" cy="7" r="5"/>
                                <line x1="11" y1="11" x2="15" y2="15"/>
                            </svg>
                            <input
                                    type="text"
                                    class="form-input"
                                    id="orgChartSearch"
                                    placeholder="Search employees..."
                                    data-i18n-placeholder="search_placeholder"
                                    aria-label="Search employees in org chart"
                            >
                        </div>
                    </div>

                    <div class="org-chart-controls__right">
                        <!-- View Toggle -->
                        <button class="btn btn--icon" id="viewToggleBtn" aria-label="Toggle view mode" title="Toggle view">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>

                        <!-- Zoom Controls -->
                        <div class="btn-group">
                            <button class="btn btn--icon" id="zoomOutBtn" aria-label="Zoom out" title="Zoom out">
                                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="M8 11h6M21 21l-4.35-4.35"></path>
                                </svg>
                            </button>
                            <button class="btn btn--icon" id="zoomResetBtn" aria-label="Reset zoom" title="Reset zoom">
                                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v8M8 12h8"></path>
                                </svg>
                            </button>
                            <button class="btn btn--icon" id="zoomInBtn" aria-label="Zoom in" title="Zoom in">
                                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="M11 8v6M8 11h6M21 21l-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Department Filter Sidebar (Inline) -->
                <div class="org-chart-layout">
                    <aside class="org-chart-sidebar-filter" id="orgChartSidebarFilter">
                        <h3 class="org-chart-sidebar-filter__title" data-i18n="departments">Departments</h3>
                        <ul class="org-chart-sidebar-filter__list" id="orgDepartmentList">
                            <!-- Populated by orgChart.js -->
                        </ul>
                    </aside>

                    <!-- Org Chart Canvas -->
                    <div class="org-chart-wrapper">

                        <!-- Loading State -->
                        <div class="org-chart-loading" id="orgChartLoading">
                            <div class="org-chart-loading__spinner"></div>
                            <p data-i18n="loading">Loading...</p>
                        </div>

                        <!-- Error State -->
                        <div class="org-chart-error" id="orgChartError" style="display: none;">
                            <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p class="org-chart-error__message" data-i18n="error_loading">Error loading data</p>
                            <button class="btn btn--primary" id="orgChartRetryBtn" data-i18n="retry">Retry</button>
                        </div>

                        <!-- Empty State -->
                        <div class="org-chart-empty" id="orgChartEmpty" style="display: none;">
                            <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                            </svg>
                            <p data-i18n="no_employees">No employees found</p>
                        </div>

                        <!-- Chart Container -->
                        <div class="org-chart-canvas" id="orgChartCanvas">
                            <div class="org-chart" id="orgChart">
                                <!-- Tree rendered here by orgChart.js -->
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </main>
</div>

<!-- Add/Edit Employee Modal -->
<div class="modal" id="employeeModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="modalTitle" data-i18n="employees.modal.addTitle">Add Employee</h2>
            <button class="modal__close" aria-label="Close" id="closeModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body">
            <form id="employeeForm">
                <input type="hidden" id="employeeId">

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="employees.form.name">Name</label>
                    <input type="text" class="form-input" id="employeeName" required>
                    <div class="form-error" data-i18n="employees.form.nameError">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="email">Email</label>
                    <input type="email" class="form-input" id="employeeEmail" required>
                    <div class="form-error" data-i18n="employees.form.emailError">Please enter a valid email</div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="phone">Phone</label>
                    <input type="tel" class="form-input" id="employeePhone">
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="employees.form.position">Position</label>
                    <input type="text" class="form-input" id="employeePosition" required>
                    <div class="form-error" data-i18n="employees.form.positionError">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="department">Department</label>
                    <select class="form-select" id="employeeDepartment" required>
                        <option value="" data-i18n="employees.form.selectDepartment">Select department</option>
                        <option value="Executive">Executive</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">Human Resources</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="Design">Design</option>
                        <option value="Product">Product</option>
                        <option value="Legal">Legal</option>
                    </select>
                    <div class="form-error" data-i18n="employees.form.departmentError">Please select a department</div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="employees.form.manager">Manager</label>
                    <select class="form-select" id="employeeManager">
                        <option value="">No Manager (CEO/Top Level)</option>
                        <!-- Populated dynamically by employees.js -->
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="employees.form.hireDate">Hire Date</label>
                    <input type="date" class="form-input" id="employeeHireDate" required>
                    <div class="form-error" data-i18n="employees.form.hireDateError">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="status">Status</label>
                    <select class="form-select" id="employeeStatus">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary" id="cancelBtn" data-i18n="cancel">Cancel</button>
            <button class="btn btn--primary" id="saveEmployeeBtn" data-i18n="save">Save</button>
        </div>
    </div>
</div>

<!-- Employee Detail Modal (for Org Chart) -->
<div class="modal" id="employeeDetailModal" style="display:none;">
    <div class="modal__backdrop" id="employeeDetailOverlay"></div>
    <div class="modal__content">
        <button class="modal__close" id="employeeDetailCloseBtn" aria-label="Close modal">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div class="modal__header">
            <img class="modal__avatar" id="detailModalAvatar" src="" alt="" />
            <div>
                <h2 class="modal__title" id="detailModalName"></h2>
                <p class="modal__subtitle" id="detailModalTitle"></p>
            </div>
        </div>

        <div class="modal__body">
            <div class="detail-row">
                <span class="detail-row__label" data-i18n="department">Department</span>
                <span class="detail-row__value" id="detailModalDepartment"></span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label" data-i18n="email">Email</span>
                <a class="detail-row__value detail-row__value--link" id="detailModalEmail" href=""></a>
            </div>
            <div class="detail-row">
                <span class="detail-row__label" data-i18n="phone">Phone</span>
                <a class="detail-row__value detail-row__value--link" id="detailModalPhone" href=""></a>
            </div>
            <div class="detail-row" id="detailModalManagerRow" style="display: none;">
                <span class="detail-row__label" data-i18n="reports_to">Reports to</span>
                <span class="detail-row__value" id="detailModalManager"></span>
            </div>
            <div class="detail-row" id="detailModalReportsRow" style="display:none;">
                <span class="detail-row__label" data-i18n="direct_reports">Direct reports</span>
                <span class="detail-row__value" id="detailModalReports"></span>
            </div>
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
<script src="./assets/js/components/orgChart.js"></script>
<script src="./assets/js/pages/employees.js"></script>
</body>
</html>