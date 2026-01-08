<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ödənişlər – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="payments" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <!-- Page Header -->
        <div class="app-main__header">
            <div>
                <h1 class="app-main__title">Ödənişlər</h1>
                <p class="app-main__subtitle">Daxil olan və gedən ödənişlər</p>
            </div>
            <div style="display: flex; gap: var(--space-3);">
                <button class="btn btn--success" data-action="add-payment-incoming">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Daxil Olan</span>
                </button>
                <button class="btn btn--error" data-action="add-payment-outgoing">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Gedən</span>
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="payments-stats">
            <div class="payment-stat-card payment-stat-card--incoming">
                <div class="payment-stat-card__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"/>
                        <polyline points="5 12 12 5 19 12"/>
                    </svg>
                </div>
                <div class="payment-stat-card__content">
                    <div class="payment-stat-card__label">Daxil Olan</div>
                    <div class="payment-stat-card__value" data-stat="incoming">0. 00 ₼</div>
                </div>
            </div>

            <div class="payment-stat-card payment-stat-card--outgoing">
                <div class="payment-stat-card__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <polyline points="19 12 12 19 5 12"/>
                    </svg>
                </div>
                <div class="payment-stat-card__content">
                    <div class="payment-stat-card__label">Gedən</div>
                    <div class="payment-stat-card__value" data-stat="outgoing">0.00 ₼</div>
                </div>
            </div>

            <div class="payment-stat-card payment-stat-card--balance">
                <div class="payment-stat-card__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9. 5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <div class="payment-stat-card__content">
                    <div class="payment-stat-card__label">Net Hərəkət</div>
                    <div class="payment-stat-card__value" data-stat="balance">0.00 ₼</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="payments-filters">
            <div class="form-group" style="flex:  1; margin-bottom: 0;">
                <input type="search" id="searchPayments" class="form-input form-input--search" placeholder="Ödəniş №, kontragent adı ilə axtarış... ">
            </div>
            <div class="form-group" style="min-width: 150px; margin-bottom: 0;">
                <select class="form-select" id="typeFilter">
                    <option value="all">Bütün Növlər</option>
                    <option value="incoming">Daxil Olan</option>
                    <option value="outgoing">Gedən</option>
                </select>
            </div>
            <div class="form-group" style="min-width: 150px; margin-bottom: 0;">
                <select class="form-select" id="methodFilter">
                    <option value="all">Bütün Metodlar</option>
                    <option value="cash">Nağd</option>
                    <option value="bank">Bank</option>
                </select>
            </div>
            <div class="form-group" style="min-width:  180px; margin-bottom: 0;">
                <select class="form-select" id="periodFilter">
                    <option value="all">Bütün Dövrlər</option>
                    <option value="today">Bu Gün</option>
                    <option value="week">Bu Həftə</option>
                    <option value="month" selected>Bu Ay</option>
                    <option value="year">Bu İl</option>
                </select>
            </div>
        </div>

        <!-- Payments Table -->
        <div class="card" style="padding: 0; overflow:  hidden;">
            <div class="table-wrapper">
                <div class="table-container">
                    <table class="table table--hover" id="paymentsTable">
                        <thead>
                        <tr>
                            <th style="width: 120px;">Ödəniş №</th>
                            <th style="width: 100px;">Tarix</th>
                            <th style="width: 100px;">Növ</th>
                            <th>Kontragent</th>
                            <th style="width: 100px;">Metod</th>
                            <th style="width: 120px;">Hesab</th>
                            <th style="width: 120px; text-align: right;">Məbləğ</th>
                            <th style="width: 140px; text-align: right;">Əməliyyatlar</th>
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

<!-- Add/Edit Payment Modal -->
<div class="modal modal--lg" id="paymentModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="modalTitle">Yeni Ödəniş</h2>
            <button class="modal__close" data-modal-close type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <form id="paymentForm" class="modal__body payment-form" novalidate>
            <!-- Type Badge -->
            <div class="payment-type-badge" id="paymentTypeBadge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                </svg>
                <span>Daxil Olan Ödəniş</span>
            </div>

            <input type="hidden" id="paymentType" name="type" value="incoming">

            <div class="form-row">
                <div class="form-group">
                    <label for="paymentNumber" class="form-label form-label--required">Ödəniş №</label>
                    <input type="text" id="paymentNumber" name="payment_number" class="form-input" required placeholder="PAY-2026-001">
                </div>
                <div class="form-group">
                    <label for="paymentDate" class="form-label form-label--required">Tarix</label>
                    <input type="date" id="paymentDate" name="payment_date" class="form-input" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="paymentMethod" class="form-label form-label--required">Ödəniş Metodu</label>
                    <select id="paymentMethod" name="method" class="form-select" required>
                        <option value="">Seç</option>
                        <option value="cash">Nağd</option>
                        <option value="bank">Bank köçürməsi</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="paymentAccount" class="form-label form-label--required">Hesab</label>
                    <select id="paymentAccount" name="account" class="form-select" required>
                        <option value="">Seç</option>
                        <!-- Populated by JS -->
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="amount" class="form-label form-label--required">Məbləğ</label>
                <input type="number" id="amount" name="amount" class="form-input" required min="0" step="0.01" placeholder="0.00">
            </div>

            <div class="form-group">
                <label for="counterpartyName" class="form-label form-label--required">Kontragent</label>
                <input type="text" id="counterpartyName" name="counterparty_name" class="form-input" required placeholder="Müştəri və ya Təchizatçı adı">
            </div>

            <div class="form-group">
                <label for="linkedDocument" class="form-label">Əlaqəli Sənəd</label>
                <select id="linkedDocument" name="linked_document" class="form-select">
                    <option value="">Yoxdur</option>
                    <!-- Populated by JS based on type -->
                </select>
            </div>

            <div class="form-group">
                <label for="reference" class="form-label">İstinad</label>
                <input type="text" id="reference" name="reference" class="form-input" placeholder="Bank köçürməsi №, çek №, və s. ">
            </div>

            <div class="form-group">
                <label for="paymentNotes" class="form-label">Qeydlər</label>
                <textarea id="paymentNotes" name="notes" class="form-textarea" rows="2" placeholder="Əlavə qeydlər..."></textarea>
            </div>

            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" data-modal-close>Ləğv Et</button>
                <button type="submit" class="btn btn--primary">Yadda Saxla</button>
            </div>
        </form>
    </div>
</div>

<!-- View Payment Modal -->
<div class="modal modal--lg" id="viewModal" role="dialog" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close-view></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="viewModalTitle">Ödəniş</h2>
            <button class="modal__close" data-modal-close-view type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1r="6" x2="18" y2="18"/>
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