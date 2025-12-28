<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documents - HR Platform</title>

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
    <link rel="stylesheet" href="./assets/css/components/theme-toggle.css">
    <link rel="stylesheet" href="./assets/css/components/table.css">
    <link rel="stylesheet" href="./assets/css/pages/documents.css">
</head>
<body>

<!-- Header (reuse structure) -->
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
                        <a href="./documents.php" class="sidebar__link sidebar__link--active">
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
                <h1 class="page-header__title" data-i18n="documents.title">Documents</h1>
                <p class="text-muted">Manage company documents and employee files</p>
            </div>
            <button class="btn btn--primary" id="uploadDocBtn" data-i18n="documents.upload">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 10v2.67A1.33 1.33 0 0 1 12.67 14H3.33A1.33 1.33 0 0 1 2 12.67V10"/>
                    <polyline points="11.33 5.33 8 2 4.67 5.33"/>
                    <line x1="8" y1="2" x2="8" y2="10"/>
                </svg>
                Upload Document
            </button>
        </div>

        <!-- Category Filters -->
        <div class="document-filters">
            <button class="document-filter document-filter--active" data-category="all">
                All Documents
            </button>
            <button class="document-filter" data-category="policies">
                <span data-i18n="documents.policies">Policies</span>
            </button>
            <button class="document-filter" data-category="contracts">
                <span data-i18n="documents.contracts">Contracts</span>
            </button>
            <button class="document-filter" data-category="handbooks">
                <span data-i18n="documents.handbooks">Handbooks</span>
            </button>
            <button class="document-filter" data-category="certificates">
                <span data-i18n="documents.certificates">Certificates</span>
            </button>
        </div>

        <!-- Search -->
        <div class="form-search" style="margin-bottom: var(--space-6);">
            <svg class="form-search__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="7" cy="7" r="5"/>
                <line x1="11" y1="11" x2="15" y2="15"/>
            </svg>
            <input
                type="text"
                class="form-input"
                id="searchDocuments"
                placeholder="Search documents..."
            >
        </div>

        <!-- Documents Grid -->
        <div class="documents-grid" id="documentsGrid">
            <!-- Will be populated by JS -->
        </div>

        <!-- Empty State -->
        <div class="empty-state" id="emptyState" hidden>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
            </svg>
            <p class="empty-state__message" data-i18n="common.noResults">No documents found</p>
        </div>
    </main>
</div>

<!-- Upload Document Modal -->
<div class="modal" id="documentModal">
    <div class="modal__backdrop"></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" data-i18n="documents.upload">Upload Document</h2>
            <button class="modal__close" aria-label="Close" id="closeDocModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body">
            <form id="documentForm">
                <div class="form-group">
                    <label class="form-label form-label--required">Document Name</label>
                    <input type="text" class="form-input" id="docName" required>
                    <div class="form-error">This field is required</div>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required" data-i18n="documents.category">Category</label>
                    <select class="form-select" id="docCategory" required>
                        <option value="">Select category</option>
                        <option value="policies" data-i18n="documents.policies">Policies</option>
                        <option value="contracts" data-i18n="documents.contracts">Contracts</option>
                        <option value="handbooks" data-i18n="documents.handbooks">Handbooks</option>
                        <option value="certificates" data-i18n="documents.certificates">Certificates</option>
                    </select>
                    <div class="form-error">Please select a category</div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="documents.assignTo">Assign to Employee (Optional)</label>
                    <select class="form-select" id="docEmployee">
                        <option value="">All employees</option>
                        <option value="emp001">Ayşe Əliyeva</option>
                        <option value="emp002">Elvin Məmmədov</option>
                        <option value="emp003">Nigar Həsənova</option>
                        <option value="emp004">Rəşad Quliyev</option>
                        <option value="emp005">Leyla Əhmədova</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="documents.expiryDate">Expiry Date (Optional)</label>
                    <input type="date" class="form-input" id="docExpiry">
                </div>

                <div class="form-group">
                    <label class="form-label form-label--required">File</label>
                    <div class="file-upload" id="fileUpload">
                        <input type="file" id="docFile" accept=".pdf,.doc,.docx,.xls,.xlsx" hidden>
                        <button type="button" class="btn btn--secondary btn--block" id="fileSelectBtn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 10v2.67A1.33 1.33 0 0 1 12.67 14H3.33A1.33 1.33 0 0 1 2 12.67V10"/>
                                <polyline points="11.33 5.33 8 2 4.67 5.33"/>
                                <line x1="8" y1="2" x2="8" y2="10"/>
                            </svg>
                            Choose File
                        </button>
                        <p class="file-upload__name text-muted text-sm" id="fileName">No file selected</p>
                    </div>
                    <div class="form-help">Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</div>
                </div>
            </form>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary" id="cancelDocBtn" data-i18n="common.cancel">Cancel</button>
            <button class="btn btn--primary" id="uploadBtn" data-i18n="documents.upload">Upload</button>
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
<script src="./assets/js/components/themeToggle.js"></script>
<script src="./assets/js/pages/documents.js"></script>
</body>
</html>