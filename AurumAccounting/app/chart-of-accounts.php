<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.coa.title">Chart of Accounts – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="chart-of-accounts" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title" data-i18n="coa.title">Hesablar Planı</h1>
                <p class="app-main__subtitle">Azərbaycan Yeni Hesablar Planı</p>
            </div>
            <button class="btn btn--primary" data-action="add-account" aria-label="Add account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span data-i18n="coa.addAccount">Hesab Əlavə Et</span>
            </button>
        </div>

        <!-- Filters & Search -->
        <div class="coa-controls">
            <!-- Search -->
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input
                        type="search"
                        id="searchAccounts"
                        class="form-input form-input--search"
                        placeholder="Hesab kodu və ya adı ilə axtarış..."
                        data-i18n-placeholder="coa.search.placeholder"
                >
            </div>

            <!-- Section Filter -->
            <div class="coa-section-filters">
                <button class="coa-section-btn coa-section-btn--active" data-section="all">
                    <span>Hamısı</span>
                </button>
                <button class="coa-section-btn" data-section="1">
                    <span>1-Qeyri-dövriyyə</span>
                </button>
                <button class="coa-section-btn" data-section="2">
                    <span>2-Dövriyyə</span>
                </button>
                <button class="coa-section-btn" data-section="3">
                    <span>3-Kapital</span>
                </button>
                <button class="coa-section-btn" data-section="4-5">
                    <span>4-5-Öhdəliklər</span>
                </button>
                <button class="coa-section-btn" data-section="6">
                    <span>6-Gəlirlər</span>
                </button>
                <button class="coa-section-btn" data-section="7">
                    <span>7-Xərclər</span>
                </button>
                <button class="coa-section-btn" data-section="8-9">
                    <span>8-9-Maliyyə</span>
                </button>
            </div>

            <!-- View Toggle -->
            <div class="coa-view-toggle">
                <button class="coa-view-btn coa-view-btn--active" data-view="tree" title="Tree View">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"/>
                        <line x1="8" y1="12" x2="21" y2="12"/>
                        <line x1="8" y1="18" x2="21" y2="18"/>
                        <line x1="3" y1="6" x2="3.01" y2="6"/>
                        <line x1="3" y1="12" x2="3.01" y2="12"/>
                        <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                </button>
                <button class="coa-view-btn" data-view="flat" title="Flat List">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="21" y1="10" x2="3" y2="10"/>
                        <line x1="21" y1="6" x2="3" y2="6"/>
                        <line x1="21" y1="14" x2="3" y2="14"/>
                        <line x1="21" y1="18" x2="3" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Accounts Tree -->
        <div class="card coa-card">
            <div class="coa-tree" id="accountsTree">
                <div class="coa-tree__loading">
                    <div class="spinner"></div>
                    <p>Hesablar yüklənir...</p>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Account Details Drawer -->
<div class="drawer" id="accountDrawer" hidden>
    <div class="drawer__backdrop" data-drawer-close></div>
    <div class="drawer__content">
        <div class="drawer__header">
            <h2 class="drawer__title" id="drawerTitle">Hesab Detalları</h2>
            <button class="drawer__close" data-drawer-close aria-label="Close" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="drawer__body" id="drawerBody">
            <!-- Populated by JS -->
        </div>
        <div class="drawer__footer">
            <button class="btn btn--secondary" data-drawer-close>Bağla</button>
            <button class="btn btn--primary" data-action="edit-account-drawer">Redaktə Et</button>
        </div>
    </div>
</div>

<!-- Add/Edit Account Modal -->
<div class="modal" id="accountModal" role="dialog" aria-labelledby="accountModalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="accountModalTitle">Yeni Hesab</h2>
            <button class="modal__close" data-modal-close aria-label="Close" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <form id="accountForm" class="modal__body" novalidate>
            <!-- Account Code -->
            <div class="form-group">
                <label for="accountCode" class="form-label form-label--required">Hesab Kodu</label>
                <input type="text" id="accountCode" name="code" class="form-input" required placeholder="10101">
                <span class="form-error" data-error="code"></span>
            </div>

            <!-- Account Name (AZ) -->
            <div class="form-group">
                <label for="accountName" class="form-label form-label--required">Hesab Adı (AZ)</label>
                <input type="text" id="accountName" name="name" class="form-input" required placeholder="Patent və lisenziyalar">
                <span class="form-error" data-error="name"></span>
            </div>

            <!-- Account Name (EN) -->
            <div class="form-group">
                <label for="accountNameEn" class="form-label">Hesab Adı (EN)</label>
                <input type="text" id="accountNameEn" name="name_en" class="form-input" placeholder="Patents and Licenses">
            </div>

            <!-- Parent Account -->
            <div class="form-group">
                <label for="parentAccount" class="form-label">Ana Hesab</label>
                <select id="parentAccount" name="parent_code" class="form-select">
                    <option value="">Yoxdur (Əsas hesab)</option>
                    <!-- Populated by JS -->
                </select>
            </div>

            <!-- Type -->
            <div class="form-row">
                <div class="form-group">
                    <label for="accountType" class="form-label form-label--required">Növ</label>
                    <select id="accountType" name="type" class="form-select" required>
                        <option value="">Seç</option>
                        <option value="asset">Aktiv</option>
                        <option value="liability">Öhdəlik</option>
                        <option value="equity">Kapital</option>
                        <option value="revenue">Gəlir</option>
                        <option value="expense">Xərc</option>
                    </select>
                    <span class="form-error" data-error="type"></span>
                </div>

                <div class="form-group">
                    <label for="normalBalance" class="form-label form-label--required">Normal Balans</label>
                    <select id="normalBalance" name="normal_balance" class="form-select" required>
                        <option value="">Seç</option>
                        <option value="debit">Debet</option>
                        <option value="credit">Kredit</option>
                    </select>
                    <span class="form-error" data-error="normal_balance"></span>
                </div>
            </div>

            <!-- Description -->
            <div class="form-group">
                <label for="accountDescription" class="form-label">Təsvir</label>
                <textarea id="accountDescription" name="description" class="form-textarea" rows="3" placeholder="Hesab haqqında qısa məlumat... "></textarea>
            </div>

            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" data-modal-close>Ləğv Et</button>
                <button type="submit" class="btn btn--primary">Yadda Saxla</button>
            </div>
        </form>
    </div>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>