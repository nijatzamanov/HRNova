<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Satış Fakturaları – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="sales-invoices" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">Satış Fakturaları</h1>
                <p class="app-main__subtitle">Müştərilərə göndərilən fakturalar</p>
            </div>
            <button class="btn btn--primary" data-action="add-invoice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>Yeni Faktura</span>
            </button>
        </div>

        <!-- Stats -->
        <div class="invoice-stats">
            <div class="invoice-stat-card">
                <div class="invoice-stat-card__icon" style="background:  linear-gradient(135deg, #6FBC9D, #52A385);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="9"/>
                        <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                </div>
                <div class="invoice-stat-card__content">
                    <div class="invoice-stat-card__label">Cəmi</div>
                    <div class="invoice-stat-card__value" data-stat="total">0</div>
                </div>
            </div>
            <div class="invoice-stat-card">
                <div class="invoice-stat-card__icon" style="background: linear-gradient(135deg, #E8B86D, #D69E4F);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <div class="invoice-stat-card__content">
                    <div class="invoice-stat-card__label">Gözləyən</div>
                    <div class="invoice-stat-card__value" data-stat="pending">0</div>
                </div>
            </div>
            <div class="invoice-stat-card">
                <div class="invoice-stat-card__icon" style="background: linear-gradient(135deg, #6C91C2, #4A73A8);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <div class="invoice-stat-card__content">
                    <div class="invoice-stat-card__label">Cəmi Məbləğ</div>
                    <div class="invoice-stat-card__value" data-stat="amount">0.00 ₼</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="invoice-filters">
            <div class="form-group" style="flex:  1; margin-bottom: 0;">
                <input type="search" id="searchInvoices" class="form-input form-input--search" placeholder="Faktura №, müştəri adı ilə axtarış... ">
            </div>
            <div class="form-group" style="min-width: 180px; margin-bottom: 0;">
                <select class="form-select" id="statusFilter">
                    <option value="all">Bütün Statuslar</option>
                    <option value="draft">Qaralama</option>
                    <option value="sent">Göndərilib</option>
                    <option value="paid">Ödənilib</option>
                    <option value="cancelled">Ləğv Edilib</option>
                </select>
            </div>
        </div>

        <!-- Invoices Table -->
        <div class="card" style="padding: 0; overflow:  hidden;">
            <div class="table-wrapper">
                <div class="table-container">
                    <table class="table table--hover" id="invoicesTable">
                        <thead>
                        <tr>
                            <th style="width: 120px;">Faktura №</th>
                            <th style="width: 100px;">Tarix</th>
                            <th>Müştəri</th>
                            <th style="width: 100px;">Status</th>
                            <th style="width: 120px; text-align: right;">Subtotal</th>
                            <th style="width: 100px; text-align: right;">ƏDV</th>
                            <th style="width: 120px; text-align: right;">Cəmi</th>
                            <th style="width: 160px; text-align: right;">Əməliyyatlar</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="8">
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

<!-- Add/Edit Invoice Modal -->
<div class="modal modal--xl" id="invoiceModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="modalTitle">Yeni Faktura</h2>
            <button class="modal__close" data-modal-close type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <form id="invoiceForm" class="modal__body invoice-form" novalidate>
            <!-- Header -->
            <div class="invoice-form-header">
                <div class="form-row">
                    <div class="form-group">
                        <label for="invoiceNumber" class="form-label form-label--required">Faktura №</label>
                        <input type="text" id="invoiceNumber" name="invoice_number" class="form-input" required placeholder="INV-2026-001">
                    </div>
                    <div class="form-group">
                        <label for="invoiceDate" class="form-label form-label--required">Tarix</label>
                        <input type="date" id="invoiceDate" name="invoice_date" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="dueDate" class="form-label form-label--required">Son Ödəniş Tarixi</label>
                        <input type="date" id="dueDate" name="due_date" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="status" class="form-label form-label--required">Status</label>
                        <select id="status" name="status" class="form-select" required>
                            <option value="draft">Qaralama</option>
                            <option value="sent">Göndərilib</option>
                            <option value="paid">Ödənilib</option>
                            <option value="cancelled">Ləğv Edilib</option>
                        </select>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="invoice-customer-section">
                    <h3>Müştəri Məlumatı</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customerName" class="form-label form-label--required">Müştəri Adı</label>
                            <input type="text" id="customerName" name="customer_name" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="customerTaxId" class="form-label">VÖEN</label>
                            <input type="text" id="customerTaxId" name="customer_tax_id" class="form-input">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customerEmail" class="form-label">Email</label>
                            <input type="email" id="customerEmail" name="customer_email" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="customerPhone" class="form-label">Telefon</label>
                            <input type="tel" id="customerPhone" name="customer_phone" class="form-input">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="customerAddress" class="form-label">Ünvan</label>
                        <input type="text" id="customerAddress" name="customer_address" class="form-input">
                    </div>
                </div>
            </div>

            <!-- Line Items -->
            <div class="invoice-lines-section">
                <div class="invoice-lines-header">
                    <h3>Məhsul/Xidmətlər</h3>
                    <button type="button" class="btn btn--sm btn--secondary" data-action="add-line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Sətir Əlavə Et</span>
                    </button>
                </div>

                <div class="invoice-lines-table-wrapper">
                    <table class="invoice-lines-table">
                        <thead>
                        <tr>
                            <th style="width: 200px;">Məhsul/Xidmət</th>
                            <th style="flex: 1;">Təsvir</th>
                            <th style="width: 80px;">Say</th>
                            <th style="width: 100px;">Qiymət</th>
                            <th style="width: 100px;">ƏDV %</th>
                            <th style="width: 120px;">Cəmi</th>
                            <th style="width: 48px;"></th>
                        </tr>
                        </thead>
                        <tbody id="invoiceLinesBody">
                        <!-- Lines added dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Totals -->
            <div class="invoice-totals">
                <div class="invoice-totals-grid">
                    <div class="invoice-totals-item">
                        <span class="invoice-totals-label">Subtotal:</span>
                        <span class="invoice-totals-value" data-total="subtotal">0.00 ₼</span>
                    </div>
                    <div class="invoice-totals-item">
                        <span class="invoice-totals-label">ƏDV:</span>
                        <span class="invoice-totals-value" data-total="vat">0.00 ₼</span>
                    </div>
                    <div class="invoice-totals-item invoice-totals-item--grand">
                        <span class="invoice-totals-label">Yekun Məbləğ:</span>
                        <span class="invoice-totals-value" data-total="grand">0.00 ₼</span>
                    </div>
                </div>
            </div>

            <!-- Notes -->
            <div class="form-group">
                <label for="notes" class="form-label">Qeydlər</label>
                <textarea id="notes" name="notes" class="form-textarea" rows="2" placeholder="Əlavə qeydlər..."></textarea>
            </div>

            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" data-modal-close>Ləğv Et</button>
                <button type="submit" class="btn btn--primary">Yadda Saxla</button>
            </div>
        </form>
    </div>
</div>

<!-- View Invoice Modal -->
<div class="modal modal--lg" id="viewModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close-view></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="viewModalTitle">Faktura</h2>
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
            <button type="button" class="btn btn--success" data-action="post-to-journal" id="postToJournalBtn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span>Jurnala Köçür</span>
            </button>
            <button type="button" class="btn btn--primary" data-action="edit-from-view">Redaktə Et</button>
        </div>
    </div>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>