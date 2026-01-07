<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jurnal Yazıları – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="journal" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">Jurnal Yazıları</h1>
                <p class="app-main__subtitle">Bütün mühasibat əməliyyatları</p>
            </div>
            <button class="btn btn--primary" data-action="add-entry">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>Yeni Qeyd</span>
            </button>
        </div>

        <!-- Filters & Stats -->
        <div class="journal-controls">
            <div class="journal-stats">
                <div class="journal-stat-card">
                    <div class="journal-stat-card__label">Cəmi Qeyd</div>
                    <div class="journal-stat-card__value" data-stat="total">0</div>
                </div>
                <div class="journal-stat-card">
                    <div class="journal-stat-card__label">Bu Ay</div>
                    <div class="journal-stat-card__value" data-stat="month">0</div>
                </div>
                <div class="journal-stat-card">
                    <div class="journal-stat-card__label">Bu Həftə</div>
                    <div class="journal-stat-card__value" data-stat="week">0</div>
                </div>
            </div>

            <!-- Search & Filter -->
            <div class="journal-filters">
                <div class="form-group" style="flex:  1; margin-bottom: 0;">
                    <input
                            type="search"
                            id="searchJournal"
                            class="form-input form-input--search"
                            placeholder="Ref, təsvir və ya hesab adı ilə axtarış..."
                    >
                </div>
                <div class="form-group" style="min-width: 180px; margin-bottom: 0;">
                    <select class="form-select" id="periodFilter">
                        <option value="all">Bütün Dövrlər</option>
                        <option value="today">Bu Gün</option>
                        <option value="week">Bu Həftə</option>
                        <option value="month" selected>Bu Ay</option>
                        <option value="quarter">Bu Rüb</option>
                        <option value="year">Bu İl</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Journal Entries Table -->
        <div class="card" style="padding: 0; overflow:  hidden;">
            <div class="table-wrapper">
                <div class="table-container">
                    <table class="table table--hover" id="journalTable">
                        <thead>
                        <tr>
                            <th style="width: 100px;">Tarix</th>
                            <th style="width: 120px;">Ref</th>
                            <th>Təsvir</th>
                            <th style="width: 120px; text-align: right;">Debet</th>
                            <th style="width: 120px; text-align: right;">Kredit</th>
                            <th style="width: 100px;">Status</th>
                            <th style="width: 140px; text-align: right;">Əməliyyatlar</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="7">
                                <div class="table__loading">
                                    <div class="spinner"></div>
                                    <p>Yüklənir...</p>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Add/Edit Journal Entry Modal -->
<div class="modal modal--xl" id="journalModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="modalTitle">Yeni Jurnal Qeydi</h2>
            <button class="modal__close" data-modal-close type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <form id="journalForm" class="modal__body journal-form" novalidate>
            <!-- Header Info -->
            <div class="journal-form-header">
                <div class="form-row">
                    <div class="form-group">
                        <label for="entryDate" class="form-label form-label--required">Tarix</label>
                        <input type="date" id="entryDate" name="date" class="form-input" required>
                        <span class="form-error" data-error="date"></span>
                    </div>
                    <div class="form-group">
                        <label for="entryRef" class="form-label form-label--required">Reference</label>
                        <input type="text" id="entryRef" name="reference" class="form-input" placeholder="JE-2026-001" required>
                        <span class="form-error" data-error="reference"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="entryDescription" class="form-label form-label--required">Təsvir</label>
                    <textarea id="entryDescription" name="description" class="form-textarea" rows="2" placeholder="Əməliyyatın qısa təsviri..." required></textarea>
                    <span class="form-error" data-error="description"></span>
                </div>
            </div>

            <!-- Journal Lines -->
            <div class="journal-lines-section">
                <div class="journal-lines-header">
                    <h3>Əməliyyat Sətirləri</h3>
                    <button type="button" class="btn btn--sm btn--secondary" data-action="add-line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Sətir Əlavə Et</span>
                    </button>
                </div>

                <div class="journal-lines-table-wrapper">
                    <table class="journal-lines-table">
                        <thead>
                        <tr>
                            <th style="width: 250px;">Hesab</th>
                            <th style="width: 120px;">Debet</th>
                            <th style="width: 120px;">Kredit</th>
                            <th style="flex: 1;">Qeyd</th>
                            <th style="width: 120px;">Xərc Mərkəzi</th>
                            <th style="width: 48px;"></th>
                        </tr>
                        </thead>
                        <tbody id="journalLinesBody">
                        <!-- Lines added dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Totals -->
            <div class="journal-totals">
                <div class="journal-totals-grid">
                    <div class="journal-totals-item">
                        <span class="journal-totals-label">Cəmi Debet: </span>
                        <span class="journal-totals-value" data-total="debit">0.00</span>
                    </div>
                    <div class="journal-totals-item">
                        <span class="journal-totals-label">Cəmi Kredit:</span>
                        <span class="journal-totals-value" data-total="credit">0.00</span>
                    </div>
                    <div class="journal-totals-item journal-totals-item--diff">
                        <span class="journal-totals-label">Fərq:</span>
                        <span class="journal-totals-value journal-totals-value--balanced" data-total="diff">0.00</span>
                    </div>
                </div>
            </div>

            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" data-modal-close>Ləğv Et</button>
                <button type="submit" class="btn btn--primary" id="submitBtn">
                    <span>Yadda Saxla</span>
                </button>
            </div>
        </form>
    </div>
</div>

<!-- View Entry Modal -->
<div class="modal modal--lg" id="viewModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close-view></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="viewModalTitle">Jurnal Qeydi</h2>
            <button class="modal__close" data-modal-close-view type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal__body" id="viewModalBody">
            <!-- Content loaded dynamically -->
        </div>
        <div class="modal__footer">
            <button type="button" class="btn btn--secondary" data-modal-close-view>Bağla</button>
            <button type="button" class="btn btn--primary" data-action="edit-from-view">Redaktə Et</button>
        </div>
    </div>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>