<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.journal.title">Journal Entries – AurumAccounting</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="journal" class="app-page">

<div id="appHeader"></div>

<div class="app-layout">
    <aside id="appSidebar" class="app-sidebar"></aside>

    <main class="app-main">
        <div class="app-main__header">
            <h1 class="app-main__title" data-i18n="journal.title">Journal Entries</h1>
            <button class="btn btn--primary" data-action="add-entry">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span data-i18n="journal.addEntry">New Entry</span>
            </button>
        </div>

        <div class="card" style="padding: 0; overflow: hidden;">
            <div class="table-wrapper">
                <div class="table-container" id="journalTable">
                    <table class="table table--hover">
                        <thead>
                        <tr>
                            <th data-i18n="journal.table.date">Date</th>
                            <th data-i18n="journal.table.ref">Ref</th>
                            <th data-i18n="journal.table.description">Description</th>
                            <th data-i18n="journal.table.account">Account</th>
                            <th class="table__cell--numeric" data-i18n="journal.table.debit">Debit</th>
                            <th class="table__cell--numeric" data-i18n="journal.table.credit">Credit</th>
                            <th style="text-align: right;" data-i18n="journal.table.actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="7">
                                <div class="table__empty" data-i18n="journal.table.empty">No entries yet</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Add Journal Entry Modal -->
<div class="modal modal--lg" id="journalModal" role="dialog" aria-labelledby="journalModalTitle" aria-modal="true" hidden>
    <div class="modal__backdrop" data-modal-close></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title" id="journalModalTitle" data-i18n="journal. modal.title">New Journal Entry</h2>
            <button class="modal__close" data-modal-close aria-label="Close" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <form id="journalForm" class="modal__body" novalidate>
            <!-- Date and Reference -->
            <div class="form-row">
                <div class="form-group">
                    <label for="entryDate" class="form-label form-label--required" data-i18n="journal.modal.date.label">Date</label>
                    <input type="date" id="entryDate" name="date" class="form-input" required>
                    <span class="form-error" data-error="date"></span>
                </div>
                <div class="form-group">
                    <label for="entryRef" class="form-label" data-i18n="journal.modal.ref.label">Reference</label>
                    <input type="text" id="entryRef" name="ref" class="form-input" placeholder="JE-001">
                </div>
            </div>

            <!-- Description -->
            <div class="form-group">
                <label for="entryDescription" class="form-label form-label--required" data-i18n="journal.modal.description.label">Description</label>
                <textarea id="entryDescription" name="description" class="form-textarea" rows="3" required placeholder="Enter transaction description..."></textarea>
                <span class="form-error" data-error="description"></span>
            </div>

            <!-- Journal Lines Section -->
            <div class="journal-lines-section">
                <div class="journal-lines-header">
                    <h3 class="journal-lines-title" data-i18n="journal.modal.lines.title">Lines</h3>
                    <button type="button" class="btn btn--sm btn--secondary" data-action="add-line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span data-i18n="journal.modal.addLine">Add Line</span>
                    </button>
                </div>

                <!-- Journal Lines Container -->
                <div class="journal-lines-container" id="journalLines">
                    <!-- Lines will be added dynamically by JS -->
                </div>
            </div>

            <!-- Totals Summary -->
            <div class="journal-totals">
                <div class="journal-totals-grid">
                    <div class="journal-totals-item">
                        <span class="journal-totals-label" data-i18n="journal.modal.totals.debit">Total Debit: </span>
                        <span class="journal-totals-value" data-total="debit">0.00</span>
                    </div>
                    <div class="journal-totals-item">
                        <span class="journal-totals-label" data-i18n="journal.modal.totals.credit">Total Credit:</span>
                        <span class="journal-totals-value" data-total="credit">0.00</span>
                    </div>
                    <div class="journal-totals-item journal-totals-item--diff">
                        <span class="journal-totals-label" data-i18n="journal.modal.totals.diff">Difference:</span>
                        <span class="journal-totals-value" data-total="diff" data-balanced="true">0.00</span>
                    </div>
                </div>
            </div>

            <div class="modal__footer">
                <button type="button" class="btn btn--secondary" data-modal-close data-i18n="journal.modal.cancel">Cancel</button>
                <button type="submit" class="btn btn--primary" data-i18n="journal.modal.save">Save Entry</button>
            </div>
        </form>
    </div>
</div>

<script type="module" src="../assets/js/main.js"></script>
</body>
</html>