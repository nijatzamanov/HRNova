import { AurumI18n } from '../core/i18n.js';

export default {
    transactions: [],
    journalLines: [],
    accounts:  [],
    editingEntryId: null,
    isViewMode: false,

    async init() {
        console.log('📔 Journal initializing...');
        await this.loadData();
        this.renderTransactions();
        this.bindEvents();
    },

    async loadData() {
        try {
            const [transactionsRes, accountsRes] = await Promise.all([
                fetch('../assets/data/transactions.json'),
                fetch('../assets/data/accounts.json')
            ]);

            if (transactionsRes.ok) {
                const allTransactions = await transactionsRes.json();
                this.transactions = this.groupTransactionsByRef(allTransactions);
            } else {
                this.transactions = [];
            }

            if (accountsRes.ok) {
                this.accounts = await accountsRes.json();
            } else {
                this.accounts = [];
            }

            console.log('✅ Journal data loaded:', this.transactions.length, 'entries');
        } catch (error) {
            console.error('❌ Error loading journal data:', error);
            this.transactions = [];
            this.accounts = [];
        }
    },

    groupTransactionsByRef(transactions) {
        const grouped = {};

        transactions.forEach(transaction => {
            const ref = transaction.ref || 'NO-REF';

            if (!grouped[ref]) {
                grouped[ref] = {
                    id: ref,
                    date: transaction.date,
                    ref: ref,
                    description: transaction.description,
                    lines: []
                };
            }

            grouped[ref].lines.push({
                account_code: transaction.account_code,
                account_name: transaction.account_name,
                debit: transaction.debit || 0,
                credit: transaction.credit || 0
            });
        });

        return Object.values(grouped);
    },

    bindEvents() {
        // Add entry button
        const addBtn = document.querySelector('[data-action="add-entry"]');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        // Add line button (delegate to handle dynamically added elements)
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="add-line"]')) {
                e.preventDefault();
                this.addJournalLine();
            }
        });

        // Form submit
        const journalForm = document.getElementById('journalForm');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-modal-close]')) {
                e.preventDefault();
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('journalModal');
                if (modal && ! modal.hasAttribute('hidden')) {
                    this.closeModal();
                }
            }
        });
    },

    renderTransactions() {
        const tbody = document.querySelector('#journalTable tbody');
        if (!tbody) {
            console.error('❌ Journal table tbody not found');
            return;
        }

        if (this.transactions.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="table__empty" data-i18n="journal.table.empty">No entries yet</div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        this.transactions.forEach(entry => {
            // Create a row for each line
            entry.lines.forEach((line, index) => {
                const row = document.createElement('tr');

                // Only show date, ref, description on first line
                if (index === 0) {
                    row.innerHTML = `
            <td rowspan="${entry.lines.length}">${this.formatDate(entry.date)}</td>
            <td rowspan="${entry.lines.length}"><strong>${entry.ref}</strong></td>
            <td rowspan="${entry.lines.length}">${this.escapeHtml(entry.description)}</td>
            <td>${this.escapeHtml(line.account_name)}</td>
            <td class="table__cell--numeric">${line.debit > 0 ? this.formatCurrency(line.debit) : '—'}</td>
            <td class="table__cell--numeric">${line.credit > 0 ? this.formatCurrency(line.credit) : '—'}</td>
            <td rowspan="${entry.lines.length}">
              <div class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-action="view" data-id="${entry.id}" aria-label="View">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-action="edit" data-id="${entry.id}" aria-label="Edit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-action="delete" data-id="${entry.id}" aria-label="Delete">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </td>
          `;
                } else {
                    // Subsequent lines only show account and amounts
                    row.innerHTML = `
            <td>${this.escapeHtml(line.account_name)}</td>
            <td class="table__cell--numeric">${line.debit > 0 ? this.formatCurrency(line.debit) : '—'}</td>
            <td class="table__cell--numeric">${line.credit > 0 ? this.formatCurrency(line.credit) : '—'}</td>
          `;
                }

                tbody.appendChild(row);
            });
        });

        // Bind action events
        tbody.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', () => this.handleView(btn.dataset.id));
        });

        tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => this.handleEdit(btn.dataset.id));
        });

        tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => this.handleDelete(btn.dataset.id));
        });
    },

    openAddModal() {
        console.log('📝 Opening add journal entry modal');

        this.resetModal();
        this.editingEntryId = null;
        this.isViewMode = false;

        // Set today's date
        const dateInput = document.getElementById('entryDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }

        // Add 2 initial lines
        this.addJournalLine();
        this.addJournalLine();

        // Update modal title
        this.setModalTitle('New Journal Entry');

        // Enable all form elements
        this.enableFormElements();

        // Show modal
        this.showModal();
    },

    resetModal() {
        const form = document.getElementById('journalForm');
        if (form) form.reset();

        this.journalLines = [];

        const container = document.getElementById('journalLines');
        if (container) container.innerHTML = '';

        this.updateTotals();
    },

    showModal() {
        const modal = document.getElementById('journalModal');
        if (modal) {
            modal.removeAttribute('hidden');
            document.body.classList.add('modal-open');
        }
    },

    closeModal() {
        const modal = document.getElementById('journalModal');
        if (modal) {
            modal.setAttribute('hidden', '');
            document.body.classList.remove('modal-open');
        }

        this.resetModal();
        this.editingEntryId = null;
        this.isViewMode = false;
    },

    setModalTitle(title) {
        const modalTitle = document.getElementById('journalModalTitle');
        if (modalTitle) {
            modalTitle.textContent = title;
        }
    },

    enableFormElements() {
        const form = document.getElementById('journalForm');
        if (!form) return;

        // Remove all readonly and disabled attributes
        form.querySelectorAll('input, select, textarea, button').forEach(element => {
            element.removeAttribute('readonly');
            element.removeAttribute('disabled');
        });

        // Show submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.display = '';
        }
    },

    disableFormElements() {
        const form = document.getElementById('journalForm');
        if (!form) return;

        // Disable inputs (safer approach)
        form.querySelectorAll('input').forEach(input => {
            if (input.type !== 'button') {
                input.setAttribute('readonly', 'readonly');
                input.setAttribute('disabled', 'disabled');
            }
        });

        // Disable selects
        form.querySelectorAll('select').forEach(select => {
            select.setAttribute('disabled', 'disabled');
        });

        // Disable textareas
        form.querySelectorAll('textarea').forEach(textarea => {
            textarea.setAttribute('readonly', 'readonly');
            textarea.setAttribute('disabled', 'disabled');
        });

        // Hide action buttons
        form.querySelectorAll('button').forEach(button => {
            if (! button.hasAttribute('data-modal-close')) {
                if (button.type === 'submit' || button.dataset.entryAction) {
                    button.style.display = 'none';
                }
            }
        });
    },

    addJournalLine() {
        const container = document.getElementById('journalLines');
        if (!container) {
            console.error('❌ Journal lines container not found');
            return;
        }

        const lineId = Date.now() + Math.random();
        this.journalLines.push({ id: lineId, account:  '', debit: 0, credit: 0 });

        const line = document.createElement('div');
        line.className = 'journal-line';
        line.dataset.lineId = lineId;

        // Build account options
        const accountOptions = this.accounts.map(acc => {
            const currentLang = AurumI18n.getCurrentLanguage();
            const accountName = acc[`name_${currentLang}`] || acc.name_en || acc.name;
            return `<option value="${acc.code}">${acc.code} - ${this.escapeHtml(accountName)}</option>`;
        }).join('');

        line.innerHTML = `
      <div class="form-group">
        <label class="form-label">Account</label>
        <select class="form-select" data-field="account" required>
          <option value="">Select account</option>
          ${accountOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Debit</label>
        <input type="number" class="form-input" data-field="debit" step="0.01" min="0" value="0" placeholder="0.00">
      </div>
      <div class="form-group">
        <label class="form-label">Credit</label>
        <input type="number" class="form-input" data-field="credit" step="0.01" min="0" value="0" placeholder="0.00">
      </div>
      <button type="button" class="journal-line__delete" data-action="remove-line" data-line-id="${lineId}" aria-label="Remove line">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    `;

        container.appendChild(line);

        // Bind events using event delegation
        line.querySelector('[data-action="remove-line"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.removeLine(lineId);
        });

        line.querySelectorAll('[data-field="debit"], [data-field="credit"]').forEach(input => {
            input.addEventListener('input', () => {
                this.handleAmountInput(input);
                this.updateTotals();
            });
        });

        this.updateTotals();
    },

    handleAmountInput(input) {
        const line = input.closest('.journal-line');
        if (! line) return;

        const debitInput = line.querySelector('[data-field="debit"]');
        const creditInput = line.querySelector('[data-field="credit"]');

        // If user enters debit, clear credit and vice versa
        if (input.dataset.field === 'debit' && parseFloat(input.value) > 0) {
            creditInput.value = '0';
        } else if (input.dataset.field === 'credit' && parseFloat(input.value) > 0) {
            debitInput.value = '0';
        }
    },

    removeLine(lineId) {
        const line = document.querySelector(`[data-line-id="${lineId}"]`);
        if (line) {
            line.remove();
            this.journalLines = this.journalLines.filter(l => l.id !== lineId);
            this.updateTotals();
        }
    },

    updateTotals() {
        const lines = document.querySelectorAll('.journal-line');
        let totalDebit = 0;
        let totalCredit = 0;

        lines.forEach(line => {
            const debit = parseFloat(line.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(line.querySelector('[data-field="credit"]').value) || 0;
            totalDebit += debit;
            totalCredit += credit;
        });

        const debitEl = document.querySelector('[data-total="debit"]');
        const creditEl = document.querySelector('[data-total="credit"]');
        const diffEl = document.querySelector('[data-total="diff"]');

        if (debitEl) debitEl.textContent = this.formatCurrency(totalDebit);
        if (creditEl) creditEl.textContent = this.formatCurrency(totalCredit);

        const diff = Math.abs(totalDebit - totalCredit);
        if (diffEl) {
            diffEl.textContent = this.formatCurrency(diff);
            diffEl.dataset.balanced = (diff < 0.01).toString();
        }
    },

    handleView(entryId) {
        console.log('��️ View journal entry:', entryId);

        const entry = this.transactions.find(t => t.id === entryId);
        if (!entry) {
            console.error('Entry not found:', entryId);
            return;
        }

        this.resetModal();
        this.editingEntryId = entryId;
        this.isViewMode = true;

        // Fill form
        this.fillFormWithEntry(entry);

        // Disable form (view-only)
        this.disableFormElements();

        // Update modal title
        this.setModalTitle(`View Entry - ${entry.ref}`);

        // Show modal
        this.showModal();
    },

    handleEdit(entryId) {
        console.log('✏️ Edit journal entry:', entryId);

        const entry = this.transactions.find(t => t.id === entryId);
        if (!entry) {
            console.error('Entry not found:', entryId);
            return;
        }

        this.resetModal();
        this.editingEntryId = entryId;
        this.isViewMode = false;

        // Fill form
        this.fillFormWithEntry(entry);

        // Enable form (editable)
        this.enableFormElements();

        // Update modal title
        this.setModalTitle(`Edit Entry - ${entry.ref}`);

        // Show modal
        this.showModal();
    },

    fillFormWithEntry(entry) {
        // Set form values
        const dateInput = document.getElementById('entryDate');
        const refInput = document.getElementById('entryRef');
        const descInput = document.getElementById('entryDescription');

        if (dateInput) dateInput.value = entry.date;
        if (refInput) refInput.value = entry.ref;
        if (descInput) descInput.value = entry.description;

        // Clear and add lines
        const container = document.getElementById('journalLines');
        if (container) {
            container.innerHTML = '';
            this.journalLines = [];

            entry.lines.forEach(line => {
                this.addJournalLine();
                const lastLine = container.lastElementChild;
                if (lastLine) {
                    const accountSelect = lastLine.querySelector('[data-field="account"]');
                    const debitInput = lastLine.querySelector('[data-field="debit"]');
                    const creditInput = lastLine.querySelector('[data-field="credit"]');

                    if (accountSelect) accountSelect.value = line.account_code;
                    if (debitInput) debitInput.value = line.debit;
                    if (creditInput) creditInput.value = line.credit;
                }
            });

            this.updateTotals();
        }
    },

    handleDelete(entryId) {
        console.log('🗑️ Delete journal entry:', entryId);

        if (!confirm('Are you sure you want to delete this journal entry?')) {
            return;
        }

        // In real app, this would call API
        console.log('Deleting entry:', entryId);

        // Remove from local array
        this.transactions = this.transactions.filter(t => t.id !== entryId);

        // Re-render table
        this.renderTransactions();

        // Show success message (if you have toast/notification system)
        console.log('✅ Entry deleted successfully');
    },

    handleSubmit(event) {
        event.preventDefault();

        const lines = document.querySelectorAll('.journal-line');
        let totalDebit = 0;
        let totalCredit = 0;

        lines.forEach(line => {
            const debit = parseFloat(line.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(line.querySelector('[data-field="credit"]').value) || 0;
            totalDebit += debit;
            totalCredit += credit;
        });

        // Validate balance
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            alert('Journal entry must be balanced!\nDebit and Credit totals must be equal.');
            return;
        }

        // Validate minimum 2 lines
        if (lines.length < 2) {
            alert('Journal entry must have at least 2 lines.');
            return;
        }

        // Get form data
        const formData = {
            date: document.getElementById('entryDate').value,
            ref: document.getElementById('entryRef').value,
            description: document.getElementById('entryDescription').value,
            lines: []
        };

        lines.forEach(line => {
            const account = line.querySelector('[data-field="account"]').value;
            const debit = parseFloat(line.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(line.querySelector('[data-field="credit"]').value) || 0;

            if (account) {
                formData.lines.push({ account, debit, credit });
            }
        });

        // In real app, send to backend API
        console.log('💾 Saving journal entry:', formData);

        // TODO: Replace with actual API call
        // await fetch('/api/journal-entries', {
        //   method: this.editingEntryId ? 'PUT' : 'POST',
        //   body: JSON.stringify(formData)
        // });

        console.log('✅ Journal entry saved successfully');

        this.closeModal();

        // Reload data (in real app, this would come from backend)
        setTimeout(() => {
            this.loadData().then(() => this.renderTransactions());
        }, 300);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits:  0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};