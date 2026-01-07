import { AurumStorage } from '../core/storage.js';

export default {
    entries: [],
    accounts: [],
    editingEntryId: null,
    lines: [],

    async init() {
        console.log('📔 Journal Entries initializing...');
        await this.loadData();
        this.renderStats();
        this.renderEntries();
        this.bindEvents();
    },

    async loadData() {
        try {
            // Load accounts
            const accountsRes = await fetch('../assets/data/az_accounts_new.json');
            if (accountsRes.ok) {
                const data = await accountsRes.json();
                this.accounts = data.accounts.filter(a => ! a.is_header);
            }

            // Check if first run
            const hasData = AurumStorage.get('journal_entries');

            if (!hasData) {
                // First run - load demo data
                const demoRes = await fetch('../assets/data/demo_journal.json');
                if (demoRes.ok) {
                    const demoData = await demoRes.json();
                    AurumStorage.set('journal_entries', demoData.entries);
                    console.log('✅ Demo journal data loaded');
                }
            }

            // Load entries from localStorage
            this.entries = AurumStorage.get('journal_entries') || [];

            console.log('✅ Journal data loaded:', this.entries.length, 'entries');
        } catch (error) {
            console.error('❌ Error loading journal data:', error);
            this.entries = [];
            this.accounts = [];
        }
    },

    bindEvents() {
        // Add entry
        document.querySelector('[data-action="add-entry"]')?.addEventListener('click', () => {
            this.openAddModal();
        });

        // Add line
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="add-line"]')) {
                e.preventDefault();
                this.addLine();
            }
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-modal-close]')) {
                this.closeModal();
            }
            if (e.target.closest('[data-modal-close-view]')) {
                this.closeViewModal();
            }
        });

        // Form submit
        document.getElementById('journalForm')?.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Table actions
        document.getElementById('journalTable')?.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-action="view-entry"]');
            const editBtn = e.target.closest('[data-action="edit-entry"]');
            const deleteBtn = e.target.closest('[data-action="delete-entry"]');

            if (viewBtn) {
                e.preventDefault();
                this.viewEntry(viewBtn.dataset.entryId);
            } else if (editBtn) {
                e.preventDefault();
                this.editEntry(editBtn.dataset.entryId);
            } else if (deleteBtn) {
                e.preventDefault();
                this.deleteEntry(deleteBtn.dataset.entryId);
            }
        });

        // Edit from view modal
        document.querySelector('[data-action="edit-from-view"]')?.addEventListener('click', () => {
            this.closeViewModal();
            if (this.currentViewEntryId) {
                this.editEntry(this.currentViewEntryId);
            }
        });

        // Search
        document.getElementById('searchJournal')?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Period filter
        document.getElementById('periodFilter')?.addEventListener('change', (e) => {
            this.handlePeriodFilter(e.target.value);
        });
    },

    renderStats() {
        const total = this.entries.length;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const monthEntries = this.entries.filter(e => new Date(e.date) >= startOfMonth);
        const weekEntries = this.entries.filter(e => new Date(e.date) >= startOfWeek);

        document.querySelector('[data-stat="total"]').textContent = total;
        document.querySelector('[data-stat="month"]').textContent = monthEntries.length;
        document.querySelector('[data-stat="week"]').textContent = weekEntries.length;
    },

    renderEntries() {
        const tbody = document.querySelector('#journalTable tbody');
        if (!tbody) return;

        if (this.entries.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="table__empty">Heç bir jurnal qeydi yoxdur</div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        // Sort by date desc
        const sortedEntries = [...this.entries].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        sortedEntries.forEach(entry => {
            const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
            const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);

            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${this.formatDate(entry.date)}</td>
        <td><strong>${this.escapeHtml(entry.reference)}</strong></td>
        <td>${this.escapeHtml(entry.description)}</td>
        <td style="text-align: right;">${this.formatCurrency(totalDebit)}</td>
        <td style="text-align: right;">${this.formatCurrency(totalCredit)}</td>
        <td>
          <span class="badge badge--solid badge--sm badge--success">Posted</span>
        </td>
        <td>
          <div class="table__actions">
            <button class="table__action-btn table__action-btn--view" data-action="view-entry" data-entry-id="${entry.id}" type="button" title="Bax">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--edit" data-action="edit-entry" data-entry-id="${entry.id}" type="button" title="Redaktə">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--delete" data-action="delete-entry" data-entry-id="${entry.id}" type="button" title="Sil">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </td>
      `;
            tbody.appendChild(row);
        });
    },

    openAddModal() {
        this.resetModal();
        this.editingEntryId = null;
        this.lines = [];

        // Set today's date
        document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];

        // Generate reference
        const nextNum = this.entries.length + 1;
        const year = new Date().getFullYear();
        document.getElementById('entryRef').value = `JE-${year}-${String(nextNum).padStart(3, '0')}`;

        // Add 2 lines
        this.addLine();
        this.addLine();

        document.getElementById('modalTitle').textContent = 'Yeni Jurnal Qeydi';
        document.getElementById('journalModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    addLine() {
        const container = document.getElementById('journalLinesBody');
        if (!container) return;

        const lineId = Date.now() + Math.random();
        this.lines.push({ id: lineId });

        const row = document.createElement('tr');
        row.dataset.lineId = lineId;

        const accountOptions = this.accounts.map(acc =>
            `<option value="${acc.code}">${acc.code} - ${acc.name}</option>`
        ).join('');

        row.innerHTML = `
      <td>
        <select class="form-select" data-field="account" required>
          <option value="">Hesab seç</option>
          ${accountOptions}
        </select>
      </td>
      <td>
        <input type="number" class="form-input" data-field="debit" step="0.01" min="0" value="0" placeholder="0.00">
      </td>
      <td>
        <input type="number" class="form-input" data-field="credit" step="0.01" min="0" value="0" placeholder="0.00">
      </td>
      <td>
        <input type="text" class="form-input" data-field="memo" placeholder="Qeyd (istəyə görə)">
      </td>
      <td>
        <input type="text" class="form-input" data-field="cost_center" placeholder="ADMIN">
      </td>
      <td>
        <button type="button" class="journal-line-delete" data-action="remove-line" data-line-id="${lineId}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </td>
    `;

        container.appendChild(row);

        // Bind events
        row.querySelector('[data-action="remove-line"]').addEventListener('click', () => {
            this.removeLine(lineId);
        });

        row.querySelectorAll('[data-field="debit"], [data-field="credit"]').forEach(input => {
            input.addEventListener('input', () => {
                this.handleAmountInput(input);
                this.updateTotals();
            });
        });

        this.updateTotals();
    },

    handleAmountInput(input) {
        const row = input.closest('tr');
        const debitInput = row.querySelector('[data-field="debit"]');
        const creditInput = row.querySelector('[data-field="credit"]');

        if (input.dataset.field === 'debit' && parseFloat(input.value) > 0) {
            creditInput.value = '0';
        } else if (input.dataset.field === 'credit' && parseFloat(input.value) > 0) {
            debitInput.value = '0';
        }
    },

    removeLine(lineId) {
        const row = document.querySelector(`[data-line-id="${lineId}"]`);
        if (row) {
            row.remove();
            this.lines = this.lines.filter(l => l.id !== lineId);
            this.updateTotals();
        }
    },

    updateTotals() {
        const rows = document.querySelectorAll('#journalLinesBody tr');
        let totalDebit = 0;
        let totalCredit = 0;

        rows.forEach(row => {
            const debit = parseFloat(row.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(row.querySelector('[data-field="credit"]').value) || 0;
            totalDebit += debit;
            totalCredit += credit;
        });

        document.querySelector('[data-total="debit"]').textContent = this.formatCurrency(totalDebit);
        document.querySelector('[data-total="credit"]').textContent = this.formatCurrency(totalCredit);

        const diff = Math.abs(totalDebit - totalCredit);
        const diffEl = document.querySelector('[data-total="diff"]');
        diffEl.textContent = this.formatCurrency(diff);

        if (diff < 0.01) {
            diffEl.classList.add('journal-totals-value--balanced');
            diffEl.classList.remove('journal-totals-value--unbalanced');
        } else {
            diffEl.classList.add('journal-totals-value--unbalanced');
            diffEl.classList.remove('journal-totals-value--balanced');
        }
    },

    handleSubmit(event) {
        event.preventDefault();

        // Validate balance
        const rows = document.querySelectorAll('#journalLinesBody tr');
        let totalDebit = 0;
        let totalCredit = 0;

        rows.forEach(row => {
            const debit = parseFloat(row.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(row.querySelector('[data-field="credit"]').value) || 0;
            totalDebit += debit;
            totalCredit += credit;
        });

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            alert('Xəta:  Debet və Kredit məbləğləri bərabər olmalıdır!\n\nDebet: ' + this.formatCurrency(totalDebit) + '\nKredit: ' + this.formatCurrency(totalCredit));
            return;
        }

        if (rows.length < 2) {
            alert('Minimum 2 sətir olmalıdır! ');
            return;
        }

        // Build entry
        const entry = {
            id: this.editingEntryId || document.getElementById('entryRef').value,
            date: document.getElementById('entryDate').value,
            reference: document.getElementById('entryRef').value,
            description: document.getElementById('entryDescription').value,
            status: 'posted',
            created_at: new Date().toISOString(),
            created_by: 'User',
            lines: []
        };

        rows.forEach((row, index) => {
            const account = row.querySelector('[data-field="account"]').value;
            const accountName = this.accounts.find(a => a.code === account)?.name || '';
            const debit = parseFloat(row.querySelector('[data-field="debit"]').value) || 0;
            const credit = parseFloat(row.querySelector('[data-field="credit"]').value) || 0;
            const memo = row.querySelector('[data-field="memo"]').value;
            const cost_center = row.querySelector('[data-field="cost_center"]').value;

            if (account) {
                entry.lines.push({
                    id: String(index + 1),
                    account_code: account,
                    account_name: accountName,
                    debit,
                    credit,
                    memo,
                    cost_center:  cost_center || null
                });
            }
        });

        if (this.editingEntryId) {
            const index = this.entries.findIndex(e => e.id === this.editingEntryId);
            if (index !== -1) {
                this.entries[index] = entry;
            }
        } else {
            this.entries.push(entry);
        }

        AurumStorage.set('journal_entries', this.entries);

        console.log('✅ Journal entry saved:', entry);

        this.closeModal();
        this.renderStats();
        this.renderEntries();
    },

    viewEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        this.currentViewEntryId = entryId;

        const totalDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
        const totalCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0);

        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
      <div class="entry-details">
        <div class="entry-details-header">
          <div class="entry-detail-item">
            <dt>Tarix:</dt>
            <dd>${this.formatDate(entry.date)}</dd>
          </div>
          <div class="entry-detail-item">
            <dt>Reference:</dt>
            <dd>${entry.reference}</dd>
          </div>
          <div class="entry-detail-item">
            <dt>Status:</dt>
            <dd><span class="badge badge--solid badge--success">Posted</span></dd>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: var(--space-3);">Təsvir</h3>
          <p style="padding:  var(--space-4); background: var(--color-neutral-50); border-radius: var(--radius-lg); border-left: 3px solid #6C91C2;">
            ${this.escapeHtml(entry.description)}
          </p>
        </div>

        <div>
          <h3 style="margin-bottom: var(--space-4);">Əməliyyat Sətirləri</h3>
          <table class="entry-lines-table">
            <thead>
              <tr>
                <th>Hesab</th>
                <th style="text-align: right;">Debet</th>
                <th style="text-align: right;">Kredit</th>
                <th>Qeyd</th>
                <th>Xərc Mərkəzi</th>
              </tr>
            </thead>
            <tbody>
              ${entry.lines.map(line => `
                <tr>
                  <td><strong>${line.account_code}</strong> - ${line.account_name}</td>
                  <td style="text-align: right; font-family: var(--font-family-mono);">${line.debit > 0 ? this.formatCurrency(line.debit) : '—'}</td>
                  <td style="text-align: right; font-family: var(--font-family-mono);">${line.credit > 0 ?  this.formatCurrency(line.credit) : '—'}</td>
                  <td>${line.memo || '—'}</td>
                  <td>${line.cost_center || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td>CƏMİ</td>
                <td style="text-align: right; font-family: var(--font-family-mono); color: #4A73A8;">${this.formatCurrency(totalDebit)}</td>
                <td style="text-align: right; font-family: var(--font-family-mono); color: #4A73A8;">${this.formatCurrency(totalCredit)}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;

        document.getElementById('viewModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    editEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (!entry) return;

        this.resetModal();
        this.editingEntryId = entryId;

        document.getElementById('entryDate').value = entry.date;
        document.getElementById('entryRef').value = entry.reference;
        document.getElementById('entryDescription').value = entry.description;

        const container = document.getElementById('journalLinesBody');
        container.innerHTML = '';
        this.lines = [];

        entry.lines.forEach(line => {
            this.addLine();
            const lastRow = container.lastElementChild;
            lastRow.querySelector('[data-field="account"]').value = line.account_code;
            lastRow.querySelector('[data-field="debit"]').value = line.debit;
            lastRow.querySelector('[data-field="credit"]').value = line.credit;
            lastRow.querySelector('[data-field="memo"]').value = line.memo || '';
            lastRow.querySelector('[data-field="cost_center"]').value = line.cost_center || '';
        });

        this.updateTotals();

        document.getElementById('modalTitle').textContent = 'Jurnal Qeydini Redaktə Et';
        document.getElementById('journalModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    deleteEntry(entryId) {
        if (! confirm('Bu jurnal qeydini silmək istədiyinizdən əminsiniz?')) {
            return;
        }

        this.entries = this.entries.filter(e => e.id !== entryId);
        AurumStorage.set('journal_entries', this.entries);

        console.log('✅ Entry deleted');

        this.renderStats();
        this.renderEntries();
    },

    resetModal() {
        document.getElementById('journalForm').reset();
        document.getElementById('journalLinesBody').innerHTML = '';
        this.lines = [];
    },

    closeModal() {
        document.getElementById('journalModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.editingEntryId = null;
    },

    closeViewModal() {
        document.getElementById('viewModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.currentViewEntryId = null;
    },

    handleSearch(query) {
        // Search implementation
        console.log('Search:', query);
    },

    handlePeriodFilter(period) {
        // Filter implementation
        console.log('Filter:', period);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('az-AZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount) + ' ₼';
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('az-AZ', {
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