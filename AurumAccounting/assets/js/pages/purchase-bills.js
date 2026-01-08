import { AurumStorage } from '../core/storage.js';

export default {
    bills: [],
    editingBillId: null,
    lines: [],
    accountMapping: null,
    currentViewBillId: null,

    async init() {
        console.log('📄 Purchase Bills initializing...');
        await this.loadData();
        this.renderStats();
        this.renderBills();
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
            const hasData = AurumStorage.get('purchase_bills');

            if (!hasData) {
                // First run - load demo data
                const demoRes = await fetch('../assets/data/demo_invoices.json');
                if (demoRes.ok) {
                    const demoData = await demoRes.json();
                    AurumStorage.set('purchase_bills', demoData.bills);
                    console.log('✅ Demo bills loaded');
                }
            }

            // Load bills from localStorage
            this.bills = AurumStorage.get('purchase_bills') || [];

            console.log('✅ Bills loaded:', this.bills.length);
        } catch (error) {
            console.error('❌ Error loading bills:', error);
            this.bills = [];
        }
    },

    bindEvents() {
        // Add bill
        document.querySelector('[data-action="add-bill"]')?.addEventListener('click', () => {
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
        document.getElementById('billForm')?.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Table actions
        document.getElementById('billsTable')?.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-action="view-bill"]');
            const editBtn = e.target.closest('[data-action="edit-bill"]');
            const deleteBtn = e.target.closest('[data-action="delete-bill"]');

            if (viewBtn) {
                e.preventDefault();
                this.viewBill(viewBtn.dataset.billId);
            } else if (editBtn) {
                e.preventDefault();
                this.editBill(editBtn.dataset.billId);
            } else if (deleteBtn) {
                e.preventDefault();
                this.deleteBill(deleteBtn.dataset.billId);
            }
        });

        // Post to journal
        document.querySelector('[data-action="post-to-journal"]')?.addEventListener('click', () => {
            this.postToJournal();
        });

        // Edit from view
        document.querySelector('[data-action="edit-from-view"]')?.addEventListener('click', () => {
            this.closeViewModal();
            if (this.currentViewBillId) {
                this.editBill(this.currentViewBillId);
            }
        });

        // Search
        document.getElementById('searchBills')?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Status filter
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.handleStatusFilter(e.target.value);
        });
    },

    renderStats() {
        const total = this.bills.length;
        const pending = this.bills.filter(b => b.status === 'sent' || b.status === 'draft').length;
        const amount = this.bills.reduce((sum, b) => sum + (b.total || 0), 0);

        document.querySelector('[data-stat="total"]').textContent = total;
        document.querySelector('[data-stat="pending"]').textContent = pending;
        document.querySelector('[data-stat="amount"]').textContent = this.formatCurrency(amount);
    },

    renderBills() {
        const tbody = document.querySelector('#billsTable tbody');
        if (! tbody) return;

        if (this.bills.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="table__empty">Heç bir alış qaiməsi yoxdur</div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        // Sort by date desc
        const sortedBills = [...this.bills].sort((a, b) =>
            new Date(b.bill_date) - new Date(a.bill_date)
        );

        sortedBills.forEach(bill => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td><strong>${bill.bill_number}</strong></td>
        <td>${this.formatDate(bill.bill_date)}</td>
        <td>${this.escapeHtml(bill.vendor.name)}</td>
        <td>${this.renderStatusBadge(bill.status)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(bill.subtotal)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(bill.vat_total)}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(bill.total)}</strong></td>
        <td>
          <div class="table__actions">
            <button class="table__action-btn table__action-btn--view" data-action="view-bill" data-bill-id="${bill.id}" type="button" title="Bax">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--edit" data-action="edit-bill" data-bill-id="${bill.id}" type="button" title="Redaktə">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--delete" data-action="delete-bill" data-bill-id="${bill.id}" type="button" title="Sil">
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
            'cancelled': { label:  'Ləğv edilib', class: 'status-badge--cancelled' }
        };

        const statusInfo = statusMap[status] || statusMap.draft;
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
    },

    openAddModal() {
        this.resetModal();
        this.editingBillId = null;
        this.lines = [];

        // Set today's date
        document.getElementById('billDate').value = new Date().toISOString().split('T')[0];

        // Set due date (30 days)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('dueDateBill').value = dueDate.toISOString().split('T')[0];

        // Generate bill number
        const nextNum = this.bills.length + 1;
        const year = new Date().getFullYear();
        document.getElementById('billNumber').value = `BILL-${year}-${String(nextNum).padStart(3, '0')}`;

        // Add 1 line
        this.addLine();

        document.getElementById('modalTitle').textContent = 'Yeni Alış Qaiməsi';
        document.getElementById('billModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    addLine() {
        const container = document.getElementById('billLinesBody');
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
        <input type="text" class="form-input" data-field="line_total" value="0.00" readonly style="background:  var(--color-neutral-50);">
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
        const rows = document.querySelectorAll('#billLinesBody tr');
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

        const rows = document.querySelectorAll('#billLinesBody tr');
        if (rows.length === 0) {
            alert('Minimum 1 sətir əlavə edin! ');
            return;
        }

        // Build bill
        const bill = {
            id: this.editingBillId || document.getElementById('billNumber').value,
            type: 'purchase',
            status: document.getElementById('statusBill').value,
            bill_number: document.getElementById('billNumber').value,
            bill_date:  document.getElementById('billDate').value,
            due_date: document.getElementById('dueDateBill').value,
            vendor: {
                id: `VEND-${Date.now()}`,
                name: document.getElementById('vendorName').value,
                tax_id: document.getElementById('vendorTaxId').value || null,
                email: document.getElementById('vendorEmail').value || null,
                phone: document.getElementById('vendorPhone').value || null,
                address: document.getElementById('vendorAddress').value || null
            },
            lines: [],
            subtotal: 0,
            vat_total: 0,
            total:  0,
            notes: document.getElementById('notesBill').value || null,
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
                bill.lines.push({
                    id: String(index + 1),
                    item_name: itemName,
                    description: description || null,
                    quantity,
                    unit_price: unitPrice,
                    vat_rate:  vatRate,
                    vat_amount: vatAmount,
                    line_total: lineTotal
                });
            }
        });

        bill.subtotal = subtotal;
        bill.vat_total = vatTotal;
        bill.total = subtotal + vatTotal;

        if (this.editingBillId) {
            const index = this.bills.findIndex(b => b.id === this.editingBillId);
            if (index !== -1) {
                // Preserve journal posting status
                bill.posted_to_journal = this.bills[index].posted_to_journal;
                bill.journal_entry_id = this.bills[index].journal_entry_id;
                this.bills[index] = bill;
            }
        } else {
            this.bills.push(bill);
        }

        AurumStorage.set('purchase_bills', this.bills);

        console.log('✅ Bill saved:', bill);

        this.closeModal();
        this.renderStats();
        this.renderBills();
    },

    viewBill(billId) {
        const bill = this.bills.find(b => b.id === billId);
        if (!bill) return;

        this.currentViewBillId = billId;

        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
      <div class="invoice-view-details">
        ${bill.posted_to_journal ? `
          <div class="alert-banner alert-banner--success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Bu qaimə artıq jurnala köçürülüb (${bill.journal_entry_id})</span>
          </div>
        ` : ''}

        <div class="invoice-view-header">
          <div class="invoice-view-section">
            <h3>Qaimə Məlumatı</h3>
            <dl>
              <div class="invoice-view-field">
                <dt>Qaimə №:</dt>
                <dd><strong>${bill.bill_number}</strong></dd>
              </div>
              <div class="invoice-view-field">
                <dt>Tarix:</dt>
                <dd>${this.formatDate(bill.bill_date)}</dd>
              </div>
              <div class="invoice-view-field">
                <dt>Son Ödəniş:</dt>
                <dd>${this.formatDate(bill.due_date)}</dd>
              </div>
              <div class="invoice-view-field">
                <dt>Status:</dt>
                <dd>${this.renderStatusBadge(bill.status)}</dd>
              </div>
            </dl>
          </div>

          <div class="invoice-view-section">
            <h3>Təchizatçı</h3>
            <dl>
              <div class="invoice-view-field">
                <dt>Ad:</dt>
                <dd><strong>${bill.vendor.name}</strong></dd>
              </div>
              ${bill.vendor.tax_id ?  `
                <div class="invoice-view-field">
                  <dt>VÖEN:</dt>
                  <dd>${bill.vendor.tax_id}</dd>
                </div>
              ` : ''}
              ${bill.vendor.email ? `
                <div class="invoice-view-field">
                  <dt>Email:</dt>
                  <dd>${bill.vendor.email}</dd>
                </div>
              ` : ''}
              ${bill.vendor.phone ? `
                <div class="invoice-view-field">
                  <dt>Telefon:</dt>
                  <dd>${bill.vendor.phone}</dd>
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
                <th style="text-align: right;">ƏDV</th>
                <th style="text-align: right;">Cəmi</th>
              </tr>
            </thead>
            <tbody>
              ${bill.lines.map(line => `
                <tr>
                  <td>
                    <strong>${line.item_name}</strong>
                    ${line.description ? `<br><small style="color: var(--color-text-secondary);">${line.description}</small>` : ''}
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
                <td style="text-align:  right; font-family: var(--font-family-mono);">${this.formatCurrency(bill.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: right;">ƏDV:</td>
                <td style="text-align: right; font-family: var(--font-family-mono);">${this.formatCurrency(bill.vat_total)}</td>
              </tr>
              <tr style="font-size: var(--font-size-lg); color: #4A73A8;">
                <td colspan="4" style="text-align: right;">CƏMİ:</td>
                <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(bill.total)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${bill.notes ? `
          <div class="invoice-view-section">
            <h3>Qeydlər</h3>
            <p>${this.escapeHtml(bill.notes)}</p>
          </div>
        ` : ''}
      </div>
    `;

        // Update post button state
        const postBtn = document.getElementById('postToJournalBtn');
        if (postBtn) {
            if (bill.posted_to_journal) {
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
        const bill = this.bills.find(b => b.id === this.currentViewBillId);
        if (!bill || bill.posted_to_journal) return;

        if (! this.accountMapping) {
            alert('Hesab mappinqi yüklənmədi!  Zəhmət olmasa settings səhifəsini yoxlayın.');
            return;
        }

        // Generate journal entry
        const journalEntryId = `JE-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

        // Determine which account to use (inventory or expense)
        const useInventory = this.accountMapping.use_inventory_for_purchases;
        const debitAccount = useInventory
            ? this.accountMapping.purchase.inventory
            : this.accountMapping.purchase.expense;
        const debitAccountName = useInventory ?  'Ehtiyatlar' : 'Xərclər';

        const journalEntry = {
            id: journalEntryId,
            date: bill.bill_date,
            reference: bill.bill_number,
            description: `Alış qaiməsi: ${bill.vendor.name} - ${bill.bill_number}`,
            status: 'posted',
            created_at: new Date().toISOString(),
            created_by: 'User',
            lines: [
                {
                    id: '1',
                    account_code: debitAccount,
                    account_name: debitAccountName,
                    debit:  bill.subtotal,
                    credit: 0,
                    memo: `${bill.vendor.name} - ${bill.bill_number}`,
                    cost_center: null
                },
                {
                    id: '2',
                    account_code:  this.accountMapping.purchase.vat_receivable,
                    account_name:  'ƏDV alınacaq',
                    debit: bill.vat_total,
                    credit: 0,
                    memo: 'ƏDV (18%)',
                    cost_center: null
                },
                {
                    id: '3',
                    account_code:  this.accountMapping.purchase.accounts_payable,
                    account_name: 'Kreditor borcları',
                    debit:  0,
                    credit: bill.total,
                    memo: `${bill.vendor.name} - ${bill.bill_number}`,
                    cost_center: null
                }
            ]
        };

        // Save journal entry
        const journalEntries = AurumStorage.get('journal_entries') || [];
        journalEntries.push(journalEntry);
        AurumStorage.set('journal_entries', journalEntries);

        // Update bill
        bill.posted_to_journal = true;
        bill.journal_entry_id = journalEntryId;

        const index = this.bills.findIndex(b => b.id === bill.id);
        if (index !== -1) {
            this.bills[index] = bill;
            AurumStorage.set('purchase_bills', this.bills);
        }

        console.log('✅ Posted to journal:', journalEntryId);

        alert(`Uğurla jurnala köçürüldü!\n\nJurnal Qeydi: ${journalEntryId}\n\nJurnal səhifəsində görə bilərsiniz. `);

        this.closeViewModal();
        this.renderBills();
    },

    editBill(billId) {
        const bill = this.bills.find(b => b.id === billId);
        if (!bill) return;

        this.resetModal();
        this.editingBillId = billId;

        // Fill form
        document.getElementById('billNumber').value = bill.bill_number;
        document.getElementById('billDate').value = bill.bill_date;
        document.getElementById('dueDateBill').value = bill.due_date;
        document.getElementById('statusBill').value = bill.status;

        document.getElementById('vendorName').value = bill.vendor.name;
        document.getElementById('vendorTaxId').value = bill.vendor.tax_id || '';
        document.getElementById('vendorEmail').value = bill.vendor.email || '';
        document.getElementById('vendorPhone').value = bill.vendor.phone || '';
        document.getElementById('vendorAddress').value = bill.vendor.address || '';

        document.getElementById('notesBill').value = bill.notes || '';

        // Add lines
        const container = document.getElementById('billLinesBody');
        container.innerHTML = '';
        this.lines = [];

        bill.lines.forEach(line => {
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

        document.getElementById('modalTitle').textContent = 'Alış Qaiməsini Redaktə Et';
        document.getElementById('billModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    deleteBill(billId) {
        if (! confirm('Bu alış qaiməsini silmək istədiyinizdən əminsiniz?')) {
            return;
        }

        this.bills = this.bills.filter(b => b.id !== billId);
        AurumStorage.set('purchase_bills', this.bills);

        console.log('✅ Bill deleted');

        this.renderStats();
        this.renderBills();
    },

    resetModal() {
        document.getElementById('billForm')?.reset();
        document.getElementById('billLinesBody').innerHTML = '';
        this.lines = [];
    },

    closeModal() {
        document.getElementById('billModal')?.setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.editingBillId = null;
    },

    closeViewModal() {
        document.getElementById('viewModal')?.setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.currentViewBillId = null;
    },

    handleSearch(query) {
        // Search implementation
        console.log('Search:', query);
    },

    handleStatusFilter(status) {
        // Filter implementation
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