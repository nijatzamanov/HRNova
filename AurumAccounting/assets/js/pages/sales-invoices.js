import { AurumStorage } from '../core/storage.js';

export default {
    invoices: [],
    editingInvoiceId: null,
    lines: [],
    accountMapping: null,

    async init() {
        console.log('📄 Sales Invoices initializing...');
        await this.loadData();
        this.renderStats();
        this.renderInvoices();
        this.bindEvents();
    },

    async loadData() {
        try {
            // Load account mapping
            const mappingRes = await fetch('../assets/data/account_mapping.json');
            if (mappingRes.ok) {
                this.accountMapping = await mappingRes.json();
            }

            // Check if first run
            const hasData = AurumStorage.get('sales_invoices');

            if (!hasData) {
                // First run - load demo data
                const demoRes = await fetch('../assets/data/demo_invoices.json');
                if (demoRes.ok) {
                    const demoData = await demoRes.json();
                    AurumStorage.set('sales_invoices', demoData.invoices);
                    console.log('✅ Demo invoices loaded');
                }
            }

            // Load invoices from localStorage
            this.invoices = AurumStorage.get('sales_invoices') || [];

            console.log('✅ Invoices loaded:', this.invoices.length);
        } catch (error) {
            console.error('❌ Error loading invoices:', error);
            this.invoices = [];
        }
    },

    bindEvents() {
        // Add invoice
        document.querySelector('[data-action="add-invoice"]')?.addEventListener('click', () => {
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
        document.getElementById('invoiceForm')?.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Table actions
        document.getElementById('invoicesTable')?.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-action="view-invoice"]');
            const editBtn = e.target.closest('[data-action="edit-invoice"]');
            const deleteBtn = e.target.closest('[data-action="delete-invoice"]');

            if (viewBtn) {
                e.preventDefault();
                this.viewInvoice(viewBtn.dataset.invoiceId);
            } else if (editBtn) {
                e.preventDefault();
                this.editInvoice(editBtn.dataset.invoiceId);
            } else if (deleteBtn) {
                e.preventDefault();
                this.deleteInvoice(deleteBtn.dataset.invoiceId);
            }
        });

        // Post to journal
        document.querySelector('[data-action="post-to-journal"]')?.addEventListener('click', () => {
            this.postToJournal();
        });

        // Edit from view
        document.querySelector('[data-action="edit-from-view"]')?.addEventListener('click', () => {
            this.closeViewModal();
            if (this.currentViewInvoiceId) {
                this.editInvoice(this.currentViewInvoiceId);
            }
        });

        // Search
        document.getElementById('searchInvoices')?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Status filter
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.handleStatusFilter(e.target.value);
        });
    },

    renderStats() {
        const total = this.invoices.length;
        const pending = this.invoices.filter(i => i.status === 'sent' || i.status === 'draft').length;
        const amount = this.invoices.reduce((sum, i) => sum + (i.total || 0), 0);

        document.querySelector('[data-stat="total"]').textContent = total;
        document.querySelector('[data-stat="pending"]').textContent = pending;
        document.querySelector('[data-stat="amount"]').textContent = this.formatCurrency(amount);
    },

    renderInvoices() {
        const tbody = document.querySelector('#invoicesTable tbody');
        if (!tbody) return;

        if (this.invoices.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="table__empty">Heç bir faktura yoxdur</div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        // Sort by date desc
        const sortedInvoices = [...this.invoices].sort((a, b) =>
            new Date(b.invoice_date) - new Date(a.invoice_date)
        );

        sortedInvoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td><strong>${invoice.invoice_number}</strong></td>
        <td>${this.formatDate(invoice.invoice_date)}</td>
        <td>${this.escapeHtml(invoice.customer.name)}</td>
        <td>${this.renderStatusBadge(invoice.status)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(invoice.subtotal)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(invoice.vat_total)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(invoice.total)}</strong></td>
        <td>
          <div class="table__actions">
            <button class="table__action-btn table__action-btn--view" data-action="view-invoice" data-invoice-id="${invoice.id}" type="button" title="Bax">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--edit" data-action="edit-invoice" data-invoice-id="${invoice.id}" type="button" title="Redaktə">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--delete" data-action="delete-invoice" data-invoice-id="${invoice.id}" type="button" title="Sil">
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

    renderStatusBadge(status) {
        const statusMap = {
            'draft': { label: 'Qaralama', class: 'status-badge--draft' },
            'sent': { label: 'Göndərilib', class: 'status-badge--sent' },
            'paid': { label: 'Ödənilib', class: 'status-badge--paid' },
            'cancelled': { label:  'Ləğv edilib', class:  'status-badge--cancelled' }
        };

        const statusInfo = statusMap[status] || statusMap.draft;
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
    },

    openAddModal() {
        this.resetModal();
        this.editingInvoiceId = null;
        this.lines = [];

        // Set today's date
        document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];

        // Set due date (30 days)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

        // Generate invoice number
        const nextNum = this.invoices.length + 1;
        const year = new Date().getFullYear();
        document.getElementById('invoiceNumber').value = `INV-${year}-${String(nextNum).padStart(3, '0')}`;

        // Add 1 line
        this.addLine();

        document.getElementById('modalTitle').textContent = 'Yeni Faktura';
        document.getElementById('invoiceModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    addLine() {
        const container = document.getElementById('invoiceLinesBody');
        if (!container) return;

        const lineId = Date.now() + Math.random();
        this.lines.push({ id: lineId });

        const row = document.createElement('tr');
        row.dataset.lineId = lineId;

        row.innerHTML = `
      <td>
        <input type="text" class="form-input" data-field="item_name" placeholder="Məhsul/Xidmət adı" required>
      </td>
      <td>
        <input type="text" class="form-input" data-field="description" placeholder="Təsvir">
      </td>
      <td>
        <input type="number" class="form-input" data-field="quantity" min="1" value="1" step="1" required>
      </td>
      <td>
        <input type="number" class="form-input" data-field="unit_price" min="0" value="0" step="0.01" placeholder="0.00" required>
      </td>
      <td>
        <select class="form-select" data-field="vat_rate">
          <option value="0">0%</option>
          <option value="18" selected>18%</option>
        </select>
      </td>
      <td>
        <input type="text" class="form-input" data-field="line_total" value="0.00" readonly style="background: var(--color-neutral-50);">
      </td>
      <td>
        <button type="button" class="invoice-line-delete" data-action="remove-line" data-line-id="${lineId}">
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

        row.querySelectorAll('[data-field="quantity"], [data-field="unit_price"], [data-field="vat_rate"]').forEach(input => {
            input.addEventListener('input', () => {
                this.calculateLineTotal(row);
                this.updateTotals();
            });
        });
    },

    removeLine(lineId) {
        const row = document.querySelector(`[data-line-id="${lineId}"]`);
        if (row) {
            row.remove();
            this.lines = this.lines.filter(l => l.id !== lineId);
            this.updateTotals();
        }
    },

    calculateLineTotal(row) {
        const quantity = parseFloat(row.querySelector('[data-field="quantity"]').value) || 0;
        const unitPrice = parseFloat(row.querySelector('[data-field="unit_price"]').value) || 0;
        const vatRate = parseFloat(row.querySelector('[data-field="vat_rate"]').value) || 0;

        const subtotal = quantity * unitPrice;
        const vatAmount = subtotal * (vatRate / 100);
        const total = subtotal + vatAmount;

        row.querySelector('[data-field="line_total"]').value = total.toFixed(2);
    },

    updateTotals() {
        const rows = document.querySelectorAll('#invoiceLinesBody tr');
        let subtotal = 0;
        let vatTotal = 0;

        rows.forEach(row => {
            const quantity = parseFloat(row.querySelector('[data-field="quantity"]').value) || 0;
            const unitPrice = parseFloat(row.querySelector('[data-field="unit_price"]').value) || 0;
            const vatRate = parseFloat(row.querySelector('[data-field="vat_rate"]').value) || 0;

            const lineSubtotal = quantity * unitPrice;
            const lineVat = lineSubtotal * (vatRate / 100);

            subtotal += lineSubtotal;
            vatTotal += lineVat;
        });

        const grandTotal = subtotal + vatTotal;

        document.querySelector('[data-total="subtotal"]').textContent = this.formatCurrency(subtotal);
        document.querySelector('[data-total="vat"]').textContent = this.formatCurrency(vatTotal);
        document.querySelector('[data-total="grand"]').textContent = this.formatCurrency(grandTotal);
    },

    handleSubmit(event) {
        event.preventDefault();

        const rows = document.querySelectorAll('#invoiceLinesBody tr');
        if (rows.length === 0) {
            alert('Minimum 1 sətir əlavə edin! ');
            return;
        }

        // Build invoice
        const invoice = {
            id: this.editingInvoiceId || document.getElementById('invoiceNumber').value,
            type: 'sales',
            status: document.getElementById('status').value,
            invoice_number: document.getElementById('invoiceNumber').value,
            invoice_date: document.getElementById('invoiceDate').value,
            due_date: document.getElementById('dueDate').value,
            customer: {
                id: `CUST-${Date.now()}`,
                name: document.getElementById('customerName').value,
                tax_id: document.getElementById('customerTaxId').value || null,
                email: document.getElementById('customerEmail').value || null,
                phone: document.getElementById('customerPhone').value || null,
                address: document.getElementById('customerAddress').value || null
            },
            lines: [],
            subtotal: 0,
            vat_total: 0,
            total:  0,
            notes: document.getElementById('notes').value || null,
            posted_to_journal: false,
            journal_entry_id: null,
            created_at: new Date().toISOString(),
            created_by: 'User'
        };

        let subtotal = 0;
        let vatTotal = 0;

        rows.forEach((row, index) => {
            const itemName = row.querySelector('[data-field="item_name"]').value;
            const description = row.querySelector('[data-field="description"]').value;
            const quantity = parseFloat(row.querySelector('[data-field="quantity"]').value) || 0;
            const unitPrice = parseFloat(row.querySelector('[data-field="unit_price"]').value) || 0;
            const vatRate = parseFloat(row.querySelector('[data-field="vat_rate"]').value) || 0;

            const lineSubtotal = quantity * unitPrice;
            const vatAmount = lineSubtotal * (vatRate / 100);
            const lineTotal = lineSubtotal + vatAmount;

            subtotal += lineSubtotal;
            vatTotal += vatAmount;

            if (itemName) {
                invoice.lines.push({
                    id: String(index + 1),
                    item_name: itemName,
                    description:  description || null,
                    quantity,
                    unit_price: unitPrice,
                    vat_rate:  vatRate,
                    vat_amount: vatAmount,
                    line_total: lineTotal
                });
            }
        });

        invoice.subtotal = subtotal;
        invoice.vat_total = vatTotal;
        invoice.total = subtotal + vatTotal;

        if (this.editingInvoiceId) {
            const index = this.invoices.findIndex(i => i.id === this.editingInvoiceId);
            if (index !== -1) {
                // Preserve journal posting status
                invoice.posted_to_journal = this.invoices[index].posted_to_journal;
                invoice.journal_entry_id = this.invoices[index].journal_entry_id;
                this.invoices[index] = invoice;
            }
        } else {
            this.invoices.push(invoice);
        }

        AurumStorage.set('sales_invoices', this.invoices);

        console.log('✅ Invoice saved:', invoice);

        this.closeModal();
        this.renderStats();
        this.renderInvoices();
    },

    viewInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id === invoiceId);
        if (!invoice) return;

        this.currentViewInvoiceId = invoiceId;

        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
      <div class="invoice-view-details">
        ${invoice.posted_to_journal ? `
          <div class="alert-banner alert-banner--success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Bu faktura artıq jurnala köçürülüb (${invoice.journal_entry_id})</span>
          </div>
        ` : ''}

        <div class="invoice-view-header">
          <div class="invoice-view-section">
            <h3>Faktura Məlumatı</h3>
            <dl>
              <div class="invoice-view-field">
                <dt>Faktura №:</dt>
                <dd><strong>${invoice.invoice_number}</strong></dd>
              </div>
              <div class="invoice-view-field">
                <dt>Tarix:</dt>
                <dd>${this.formatDate(invoice.invoice_date)}</dd>
              </div>
              <div class="invoice-view-field">
                <dt>Son Ödəniş:</dt>
                <dd>${this.formatDate(invoice.due_date)}</dd>
              </div>
              <div class="invoice-view-field">
                <dt>Status:</dt>
                <dd>${this.renderStatusBadge(invoice.status)}</dd>
              </div>
            </dl>
          </div>

          <div class="invoice-view-section">
            <h3>Müştəri</h3>
            <dl>
              <div class="invoice-view-field">
                <dt>Ad:</dt>
                <dd><strong>${invoice.customer.name}</strong></dd>
              </div>
              ${invoice.customer.tax_id ?  `
                <div class="invoice-view-field">
                  <dt>VÖEN: </dt>
                  <dd>${invoice.customer.tax_id}</dd>
                </div>
              ` : ''}
              ${invoice.customer.email ? `
                <div class="invoice-view-field">
                  <dt>Email:</dt>
                  <dd>${invoice.customer.email}</dd>
                </div>
              ` : ''}
              ${invoice.customer.phone ? `
                <div class="invoice-view-field">
                  <dt>Telefon:</dt>
                  <dd>${invoice.customer.phone}</dd>
                </div>
              ` : ''}
            </dl>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: var(--space-4);">Məhsul/Xidmətlər</h3>
          <table class="invoice-view-lines-table">
            <thead>
              <tr>
                <th>Məhsul/Xidmət</th>
                <th>Say</th>
                <th style="text-align: right;">Qiymət</th>
                <th style="text-align:  right;">ƏDV</th>
                <th style="text-align: right;">Cəmi</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.lines.map(line => `
                <tr>
                  <td>
                    <strong>${line.item_name}</strong>
                    ${line.description ?  `<br><small style="color: var(--color-text-secondary);">${line.description}</small>` : ''}
                  </td>
                  <td>${line.quantity}</td>
                  <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(line.unit_price)}</td>
                  <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(line.vat_amount)}</td>
                  <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(line.line_total)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right;">Subtotal:</td>
                <td style="text-align:  right; font-family: var(--font-family-mono);">${this.formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right;">ƏDV:</td>
                <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(invoice.vat_total)}</td>
              </tr>
              <tr style="font-size: var(--font-size-lg); color: #4A73A8;">
                <td colspan="4" style="text-align: right;">CƏMİ:</td>
                <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(invoice.total)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${invoice.notes ? `
          <div class="invoice-view-section">
            <h3>Qeydlər</h3>
            <p>${this.escapeHtml(invoice.notes)}</p>
          </div>
        ` : ''}
      </div>
    `;

        // Update post button state
        const postBtn = document.getElementById('postToJournalBtn');
        if (postBtn) {
            if (invoice.posted_to_journal) {
                postBtn.disabled = true;
                postBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Artıq Köçürülüb</span>
        `;
            } else {
                postBtn.disabled = false;
                postBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span>Jurnala Köçür</span>
        `;
            }
        }

        document.getElementById('viewModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    postToJournal() {
        const invoice = this.invoices.find(i => i.id === this.currentViewInvoiceId);
        if (!invoice || invoice.posted_to_journal) return;

        if (! this.accountMapping) {
            alert('Hesab mappinqi yüklənmədi!  Zəhmət olmasa settings səhifəsini yoxlayın.');
            return;
        }

        // Generate journal entry
        const journalEntryId = `JE-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

        const journalEntry = {
            id: journalEntryId,
            date: invoice.invoice_date,
            reference: invoice.invoice_number,
            description: `Satış fakturas${invoice.customer.name} - ${invoice.invoice_number}`,
            status: 'posted',
            created_at: new Date().toISOString(),
            created_by: 'User',
            lines: [
                {
                    id: '1',
                    account_code: this.accountMapping.sales.accounts_receivable,
                    account_name: 'Debitor borcları',
                    debit: invoice.total,
                    credit: 0,
                    memo: `${invoice.customer.name} - ${invoice.invoice_number}`,
                    cost_center: null
                },
                {
                    id: '2',
                    account_code:  this.accountMapping.sales.sales_revenue,
                    account_name: 'Xidmət gəliri',
                    debit: 0,
                    credit: invoice.subtotal,
                    memo: 'Satış gəliri',
                    cost_center: null
                },
                {
                    id: '3',
                    account_code: this.accountMapping.sales.vat_payable,
                    account_name:  'ƏDV öhdəliyi',
                    debit: 0,
                    credit: invoice.vat_total,
                    memo: 'ƏDV (18%)',
                    cost_center:  null
                }
            ]
        };

        // Save journal entry
        const journalEntries = AurumStorage.get('journal_entries') || [];
        journalEntries.push(journalEntry);
        AurumStorage.set('journal_entries', journalEntries);

        // Update invoice
        invoice.posted_to_journal = true;
        invoice.journal_entry_id = journalEntryId;

        const index = this.invoices.findIndex(i => i.id === invoice.id);
        if (index !== -1) {
            this.invoices[index] = invoice;
            AurumStorage.set('sales_invoices', this.invoices);
        }

        console.log('✅ Posted to journal:', journalEntryId);

        alert(`Uğurla jurnala köçürüldü!\n\nJurnal Qeydi: ${journalEntryId}\n\nJurnal səhifəsində görə bilərsiniz. `);

        this.closeViewModal();
        this.renderInvoices();
    },

    editInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id === invoiceId);
        if (!invoice) return;

        this.resetModal();
        this.editingInvoiceId = invoiceId;

        // Fill form header
        document.getElementById('invoiceNumber').value = invoice.invoice_number;
        document.getElementById('invoiceDate').value = invoice.invoice_date;
        document. getElementById('dueDate').value = invoice.due_date;
        document.getElementById('status').value = invoice.status;

        // Fill customer info
        document.getElementById('customerName').value = invoice.customer. name;
        document.getElementById('customerTaxId').value = invoice.customer.tax_id || '';
        document.getElementById('customerEmail').value = invoice.customer. email || '';
        document.getElementById('customerPhone').value = invoice.customer. phone || '';
        document.getElementById('customerAddress').value = invoice.customer.address || '';

        // Fill notes
        document.getElementById('notes').value = invoice.notes || '';

        // Add lines
        const container = document.getElementById('invoiceLinesBody');
        container.innerHTML = '';
        this.lines = [];

        invoice.lines.forEach(line => {
            this.addLine();
            const lastRow = container.lastElementChild;
            lastRow.querySelector('[data-field="item_name"]').value = line.item_name;
            lastRow.querySelector('[data-field="description"]').value = line.description || '';
            lastRow.querySelector('[data-field="quantity"]').value = line.quantity;
            lastRow.querySelector('[data-field="unit_price"]').value = line.unit_price;
            lastRow.querySelector('[data-field="vat_rate"]').value = line.vat_rate;
            this.calculateLineTotal(lastRow);
        });

        this.updateTotals();

        // Update modal title
        document.getElementById('modalTitle').textContent = 'Fakturanı Redaktə Et';

        // Show modal
        document.getElementById('invoiceModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    deleteInvoice(invoiceId) {
        if (! confirm('Bu fakturanı silmək istədiyinizdən əminsiniz?')) {
            return;
        }

        this.invoices = this.invoices.filter(i => i.id !== invoiceId);
        AurumStorage.set('sales_invoices', this.invoices);

        console.log('✅ Invoice deleted');

        this.renderStats();
        this.renderInvoices();
    },

    resetModal() {
        document.getElementById('invoiceForm').reset();
        document.getElementById('invoiceLinesBody').innerHTML = '';
        this.lines = [];
    },

    closeModal() {
        document.getElementById('invoiceModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.editingInvoiceId = null;
    },

    closeViewModal() {
        document.getElementById('viewModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.currentViewInvoiceId = null;
    },

    handleSearch(query) {
        console.log('Search:', query);
    },

    handleStatusFilter(status) {
        console.log('Filter:', status);
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