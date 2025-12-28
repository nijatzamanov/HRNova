<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - HR Platform</title>

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
    <link rel="stylesheet" href="./assets/css/components/heatmap.css">
    <link rel="stylesheet" href="./assets/css/components/task-list.css">
    <link rel="stylesheet" href="./assets/css/components/spinner.css">
    <link rel="stylesheet" href="./assets/css/pages/dashboard.css">
</head>
<body>

<!-- Loading Overlay -->
<div class="loading-overlay" id="loadingOverlay" hidden>
    <div class="loading-overlay__spinner"></div>
    <div class="loading-overlay__text">Loading...</div>
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
                        <a href="./dashboard.php" class="sidebar__link sidebar__link--active">
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
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div>
                <h1 class="dashboard-header__title" data-i18n="dashboard.title">Dashboard</h1>
                <p class="dashboard-header__subtitle">
                    <span id="currentDate">Monday, December 19, 2025</span>
                </p>
            </div>
        </div>

        <!-- Info Banner -->
        <div class="info-banner">
            <div class="info-banner__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            </div>
            <div class="info-banner__content">
                <span>Explore how to navigate the dashboard and make use of its full potential! </span>
                <a href="#" class="info-banner__link">Get Started the Smart Way</a>
            </div>
            <button class="info-banner__close" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="4" x2="4" y2="12"/>
                    <line x1="4" y1="4" x2="12" y2="12"/>
                </svg>
            </button>
        </div>

        <!-- Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card__header">
                    <div class="stat-card__icon stat-card__icon--primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Total Employees</div>
                    <div class="stat-card__value">24</div>
                    <div class="stat-card__change stat-card__change--up">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 2L10 6H2z"/>
                        </svg>
                        <span>+2 this month</span>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-card__header">
                    <div class="stat-card__icon stat-card__icon--warning">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Pending Leaves</div>
                    <div class="stat-card__value">3</div>
                    <div class="stat-card__change stat-card__change--down">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 10L2 6H10z"/>
                        </svg>
                        <span>-2 from last week</span>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-card__header">
                    <div class="stat-card__icon stat-card__icon--info">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Active Announcements</div>
                    <div class="stat-card__value">5</div>
                    <div class="stat-card__change stat-card__change--up">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 2L10 6H2z"/>
                        </svg>
                        <span>+1 today</span>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-card__header">
                    <div class="stat-card__icon stat-card__icon--success">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Total Documents</div>
                    <div class="stat-card__value">142</div>
                    <div class="stat-card__change stat-card__change--up">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 2L10 6H2z"/>
                        </svg>
                        <span>+12 this week</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Attendance Heatmap -->
        <section class="dashboard-section">
            <div class="heatmap-container">
                <div class="heatmap-header">
                    <h3 class="heatmap-title">Attendance Report</h3>
                    <div class="heatmap-legend">
                        <span>Less</span>
                        <div class="heatmap-legend__gradient">
                            <div class="heatmap-legend__gradient-item" style="background: #E0E7FF;"></div>
                            <div class="heatmap-legend__gradient-item" style="background: #C7D2FE;"></div>
                            <div class="heatmap-legend__gradient-item" style="background: #A5B4FC;"></div>
                            <div class="heatmap-legend__gradient-item" style="background: #818CF8;"></div>
                            <div class="heatmap-legend__gradient-item" style="background: #6366F1;"></div>
                            <div class="heatmap-legend__gradient-item" style="background: #5B5FF9;"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>

                <div class="heatmap">
                    <div class="heatmap__labels">
                        <div class="heatmap__label"></div>
                        <div class="heatmap__label">Sun</div>
                        <div class="heatmap__label">Mon</div>
                        <div class="heatmap__label">Tue</div>
                        <div class="heatmap__label">Wed</div>
                        <div class="heatmap__label">Thu</div>
                        <div class="heatmap__label">Fri</div>
                        <div class="heatmap__label">Sat</div>
                    </div>

                    <div class="heatmap__body" id="attendanceHeatmap"></div>
                </div>
            </div>
        </section>

        <!-- Today's Tasks -->
        <section class="dashboard-section">
            <div class="task-list-container">
                <div class="task-list-header">
                    <h3 class="task-list-title">Today's task</h3>
                    <button class="task-list-add-btn" aria-label="Add task">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="3" x2="8" y2="13"/>
                            <line x1="3" y1="8" x2="13" y2="8"/>
                        </svg>
                    </button>
                </div>

                <div class="task-list-headers">
                    <div>TASK</div>
                    <div>DUE</div>
                    <div>MEMBER</div>
                    <div>PROGRESS</div>
                    <div>TIME</div>
                </div>

                <div class="task-list" id="taskList"></div>
            </div>
        </section>

        <!-- Quick Actions & Activity -->
        <div class="dashboard-grid">
            <!-- Quick Actions -->
            <section class="dashboard-section">
                <div class="card">
                    <h3 class="dashboard-section__title">Quick Actions</h3>
                    <div class="quick-actions">
                        <a href="employees.php" class="quick-actions__item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <line x1="20" y1="8" x2="20" y2="14"/>
                                <line x1="23" y1="11" x2="17" y2="11"/>
                            </svg>
                            <span>Add Employee</span>
                        </a>

                        <a href="./announcements.php" class="quick-actions__item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <span>New Announcement</span>
                        </a>

                        <a href="./documents.php" class="quick-actions__item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="12" y1="18" x2="12" y2="12"/>
                                <line x1="9" y1="15" x2="15" y2="15"/>
                            </svg>
                            <span>Upload Document</span>
                        </a>
                    </div>
                </div>
            </section>

            <!-- Recent Activity -->
            <section class="dashboard-section">
                <div class="card">
                    <h3 class="dashboard-section__title">Recent Activity</h3>
                    <div class="activity-list" id="activityList"></div>
                </div>
            </section>

            <!-- Upcoming Events -->
            <section class="dashboard-section">
                <div class="card">
                    <h3 class="dashboard-section__title">Upcoming Events</h3>
                    <div class="events-list" id="eventsList"></div>
                </div>
            </section>
        </div>
    </main>
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
<script src="./assets/js/components/heatmap.js"></script>
<script src="./assets/js/components/taskList.js"></script>
<script src="./assets/js/pages/dashboard.js"></script>
</body>
</html>