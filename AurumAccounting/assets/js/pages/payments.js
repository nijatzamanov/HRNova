import { AurumStorage } from '../core/storage.js';

export default {
    payments: [],
    accounts: [],
    invoices: [],
    bills: [],
    editingPaymentId: null,
    currentViewPaymentId: null,
    currentPaymentType: 'incoming',

    async init() {
        console.log('💰 Payments initializing...');
        await this.loadData();
        this.renderStats();
        this.renderPayments();
        this.bindEvents();
    },

    async loadData() {
        try {
            // Load accounts (cash and bank only)
            const accountsRes = await fetch('../assets/data/az_accounts_new.json');
            if (accountsRes.ok) {
                const data = await accountsRes.json();
                // Filter cash and bank accounts
                this.accounts = data.accounts.filter(a =>
                    a.code === '1010' || // Cash on hand
                    a.code === '20301' || // Cash in bank AZN
                    a.code === '20302' || // Cash in bank AZN
                    a.code === '20303'    // Cash in bank foreign
                );
            }

            // Load invoices
            this.invoices = AurumStorage.get('sales_invoices') || [];

            // Load bills
            this.bills = AurumStorage.get('purchase_bills') || [];

            // Check if first run
            const hasData = AurumStorage.get('payments');

            if (!hasData) {
                // First run - load demo data
                const demoRes = await fetch('../assets/data/demo_payments.json');
                if (demoRes.ok) {
                    const demoData = await demoRes.json();
                    AurumStorage.set('payments', demoData.payments);
                    console.log('✅ Demo payments loaded');
                }
            }

            // Load payments from localStorage
            this.payments = AurumStorage.get('payments') || [];

            console.log('✅ Payments loaded:', this.payments.length);
        } catch (error) {
            console.error('❌ Error loading payments:', error);
            this.payments = [];
        }
    },

    bindEvents() {
        // Add payment buttons
        document.querySelector('[data-action="add-payment-incoming"]')?.addEventListener('click', () => {
            this.openAddModal('incoming');
        });

        document.querySelector('[data-action="add-payment-outgoing"]')?.addEventListener('click', () => {
            this.openAddModal('outgoing');
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
        document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Payment method change (update accounts list)
        document.getElementById('paymentMethod')?.addEventListener('change', (e) => {
            this.updateAccountsList(e.target.value);
        });

        // Table actions
        document.getElementById('paymentsTable')?.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-action="view-payment"]');
            const editBtn = e.target.closest('[data-action="edit-payment"]');
            const deleteBtn = e.target.closest('[data-action="delete-payment"]');

            if (viewBtn) {
                e.preventDefault();
                this.viewPayment(viewBtn.dataset.paymentId);
            } else if (editBtn) {
                e.preventDefault();
                this.editPayment(editBtn.dataset.paymentId);
            } else if (deleteBtn) {
                e.preventDefault();
                this.deletePayment(deleteBtn.dataset.paymentId);
            }
        });

        // Post to journal
        document.querySelector('[data-action="post-to-journal"]')?.addEventListener('click', () => {
            this.postToJournal();
        });

        // Edit from view
        document.querySelector('[data-action="edit-from-view"]')?.addEventListener('click', () => {
            this.closeViewModal();
            if (this.currentViewPaymentId) {
                this.editPayment(this.currentViewPaymentId);
            }
        });

        // Filters
        document.getElementById('searchPayments')?.addEventListener('input', (e) => {
            this.applyFilters();
        });

        document.getElementById('typeFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('methodFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('periodFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });
    },

    renderStats() {
        const incoming = this.payments
            .filter(p => p.type === 'incoming')
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        const outgoing = this.payments
            .filter(p => p.type === 'outgoing')
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        const balance = incoming - outgoing;

        document.querySelector('[data-stat="incoming"]').textContent = this.formatCurrency(incoming);
        document.querySelector('[data-stat="outgoing"]').textContent = this.formatCurrency(outgoing);
        document.querySelector('[data-stat="balance"]').textContent = this.formatCurrency(balance);
    },

    renderPayments() {
        const tbody = document.querySelector('#paymentsTable tbody');
        if (! tbody) return;

        if (this.payments.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="table__empty">Heç bir ödəniş qeydiyyatı yoxdur</div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        // Sort by date desc
        const sortedPayments = [...this.payments].sort((a, b) =>
            new Date(b.payment_date) - new Date(a.payment_date)
        );

        sortedPayments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td><strong>${payment.payment_number}</strong></td>
        <td>${this.formatDate(payment.payment_date)}</td>
        <td>${this.renderTypeBadge(payment.type)}</td>
        <td>${this.escapeHtml(payment.counterparty.name)}</td>
        <td>${this.renderMethodBadge(payment.method)}</td>
        <td style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${payment.account}</td>
        <td style="text-align: right; font-family: var(--font-family-mono);"><strong>${this.formatCurrency(payment.amount)}</strong></td>
        <td>
          <div class="table__actions">
            <button class="table__action-btn table__action-btn--view" data-action="view-payment" data-payment-id="${payment.id}" type="button" title="Bax">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--edit" data-action="edit-payment" data-payment-id="${payment.id}" type="button" title="Redaktə">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="table__action-btn table__action-btn--delete" data-action="delete-payment" data-payment-id="${payment.id}" type="button" title="Sil">
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

    renderTypeBadge(type) {
        if (type === 'incoming') {
            return `
        <span class="payment-type-badge-sm payment-type-badge-sm--incoming">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
          Daxil
        </span>
      `;
        } else {
            return `
        <span class="payment-type-badge-sm payment-type-badge-sm--outgoing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
          Gedən
        </span>
      `;
        }
    },

    renderMethodBadge(method) {
        if (method === 'cash') {
            return '<span class="payment-method-badge payment-method-badge--cash">Nağd</span>';
        } else {
            return '<span class="payment-method-badge payment-method-badge--bank">Bank</span>';
        }
    },

    openAddModal(type) {
        this.resetModal();
        this.editingPaymentId = null;
        this.currentPaymentType = type;

        // Set type
        document.getElementById('paymentType').value = type;

        // Update badge
        const badge = document.getElementById('paymentTypeBadge');
        if (type === 'incoming') {
            badge.className = 'payment-type-badge';
            badge.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
        <span>Daxil Olan Ödəniş</span>
      `;
        } else {
            badge.className = 'payment-type-badge payment-type-badge--outgoing';
            badge.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
        <span>Gedən Ödəniş</span>
      `;
        }

        // Set today's date
        document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];

        // Generate payment number
        const nextNum = this.payments.length + 1;
        const year = new Date().getFullYear();
        document.getElementById('paymentNumber').value = `PAY-${year}-${String(nextNum).padStart(3, '0')}`;

        // Populate linked documents
        this.populateLinkedDocuments(type);

        document.getElementById('modalTitle').textContent = type === 'incoming' ? 'Yeni Daxil Olan Ödəniş' :  'Yeni Gedən Ödəniş';
        document.getElementById('paymentModal').removeAttribute('hidden');
        document.body.classList.add('modal-open');
    },

    updateAccountsList(method) {
        const select = document.getElementById('paymentAccount');
        select.innerHTML = '<option value="">Seç</option>';

        let filteredAccounts = [];
        if (method === 'cash') {
            filteredAccounts = this.accounts.filter(a => a.code === '1010');
        } else if (method === 'bank') {
            filteredAccounts = this.accounts.filter(a => a.code.startsWith('203'));
        }

        filteredAccounts.forEach(acc => {
            const option = document.createElement('option');
            option.value = acc.code;
            option.textContent = `${acc.code} - ${acc.name}`;
            option.dataset.name = acc.name;
            select.appendChild(option);
        });
    },

    populateLinkedDocuments(type) {
        const select = document.getElementById('linkedDocument');
        select.innerHTML = '<option value="">Yoxdur</option>';

        if (type === 'incoming') {
            // Load unpaid invoices
            const unpaidInvoices = this.invoices.filter(i => i.status !== 'paid');
            unpaidInvoices.forEach(inv => {
                const option = document.createElement('option');
                option.value = `invoice: ${inv.id}`;
                option.textContent = `${inv.invoice_number} - ${inv.customer.name} (${this.formatCurrency(inv.total)})`;
                select.appendChild(option);
            });
        } else {
            // Load unpaid bills
            const unpaidBills = this.bills.filter(b => b.status !== 'paid');
            unpaidBills.forEach(bill => {
                const option = document.createElement('option');
                option.value = `bill:${bill.id}`;
                option.textContent = `${bill.bill_number} - ${bill.vendor.name} (${this.formatCurrency(bill.total)})`;
                select.appendChild(option);
            });
        }
    },

    handleSubmit(event) {
        event.preventDefault();

        const accountSelect = document.getElementById('paymentAccount');
        const selectedOption = accountSelect.options[accountSelect.selectedIndex];

        const payment = {
            id: this.editingPaymentId || document.getElementById('paymentNumber').value,
            type: document.getElementById('paymentType').value,
            payment_number: document.getElementById('paymentNumber').value,
            payment_date: document.getElementById('paymentDate').value,
            amount: parseFloat(document.getElementById('amount').value),
            method: document.getElementById('paymentMethod').value,
            account: accountSelect.value,
            account_name: selectedOption.dataset.name || '',
            counterparty: {
                id: `PARTY-${Date.now()}`,
                name: document.getElementById('counterpartyName').value,
                type: document.getElementById('paymentType').value === 'incoming' ? 'customer' : 'vendor'
            },
            linked_document: this.parseLinkedDocument(document.getElementById('linkedDocument').value),
            reference:  document.getElementById('reference').value || null,
            notes: document.getElementById('paymentNotes').value || null,
            posted_to_journal: false,
            journal_entry_id: null,
            created_at: new Date().toISOString(),
            created_by: 'User'
        };

        if (this.editingPaymentId) {
            const index = this.payments.findIndex(p => p.id === this.editingPaymentId);
            if (index !== -1) {
                payment.posted_to_journal = this.payments[index].posted_to_journal;
                payment.journal_entry_id = this.payments[index].journal_entry_id;
                this.payments[index] = payment;
            }
        } else {
            this.payments.push(payment);
        }

        AurumStorage.set('payments', this.payments);

        console.log('✅ Payment saved:', payment);

        this.closeModal();
        this.renderStats();
        this.renderPayments();
    },

    parseLinkedDocument(value) {
        if (!value) return null;

        const [type, id] = value.split(': ');
        let number = '';

        if (type === 'invoice') {
            const invoice = this.invoices.find(i => i.id === id);
            number = invoice?.invoice_number || '';
        } else if (type === 'bill') {
            const bill = this.bills.find(b => b.id === id);
            number = bill?.bill_number || '';
        }

        return { type, id, number };
    },

    viewPayment(paymentId) {
        const payment = this.payments.find(p => p.id === paymentId);
        if (!payment) return;

        this.currentViewPaymentId = paymentId;

        const body = document.getElementById('viewModalBody');
        body.innerHTML = `
      <div class="payment-view-details">
        ${payment.posted_to_journal ? `
          <div class="alert-banner alert-banner--success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Bu ödəniş artıq jurnala köçürülüb (${payment.journal_entry_id})</span>
          </div>
        ` : ''}

        <div class="payment-view-amount">
          <div class="payment-view-amount__label">${payment.type === 'incoming' ? 'Daxil Olan Məbləğ' : 'Gedən Məbləğ'}</div>
          <div class="payment-view-amount__value">${this.formatCurrency(payment.amount)}</div>
        </div>

        <div class="payment-view-grid">
          <div class="payment-view-section">
            <h3>Ödəniş Məlumatı</h3>
            <dl>
              <div class="payment-view-field">
                <dt>Ödəniş №:</dt>
                <dd><strong>${payment.payment_number}</strong></dd>
              </div>
              <div class="payment-view-field">
                <dt>Tarix:</dt>
                <dd>${this.formatDate(payment.payment_date)}</dd>
              </div>
              <div class="payment-view-field">
                <dt>Növ:</dt>
                <dd>${this.renderTypeBadge(payment.type)}</dd>
              </div>
              <div class="payment-view-field">
                <dt>Metod:</dt>
                <dd>${this.renderMethodBadge(payment.method)}</dd>
              </div>
              <div class="payment-view-field">
                <dt>Hesab:</dt>
                <dd>${payment.account} - ${payment.account_name}</dd>
              </div>
            </dl>
          </div>

          <div class="payment-view-section">
            <h3>Kontragent</h3>
            <dl>
              <div class="payment-view-field">
                <dt>Ad:</dt>
                <dd><strong>${payment.counterparty.name}</strong></dd>
              </div>
              ${payment.linked_document ? `
                <div class="payment-view-field">
                  <dt>Əlaqəli Sənəd:</dt>
                  <dd>${payment.linked_document.number}</dd>
                </div>
              ` : ''}
              ${payment.reference ? `
                <div class="payment-view-field">
                  <dt>İstinad:</dt>
                  <dd>${payment.reference}</dd>
                </div>
              ` : ''}
            </dl>
          </div>
        </div>

        ${payment.notes ? `
          <div class="payment-view-section">
            <h3>Qeydlər</h3>
            <p>${this.escapeHtml(payment.notes)}</p>
          </div>
        ` : ''}
      </div>
    `;

        // Update post button
        const postBtn = document.getElementById('postToJournalBtn');
        if (postBtn) {
            if (payment.posted_to_journal) {
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
        const payment = this.payments.find(p => p.id === this.currentViewPaymentId);
        if (!payment || payment.posted_to_journal) return;

        const journalEntryId = `JE-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

        let journalEntry;

        if (payment.type === 'incoming') {
            // Incoming:  Debit Cash/Bank, Credit AR
            journalEntry = {
                id: journalEntryId,
                date: payment.payment_date,
                reference: payment.payment_number,
                description: `Daxil olan ödəniş: ${payment.counterparty.name}`,
                status: 'posted',
                created_at: new Date().toISOString(),
                created_by: 'User',
                lines: [
                    {
                        id: '1',
                        account_code: payment.account,
                        account_name: payment.account_name,
                        debit: payment.amount,
                        credit: 0,
                        memo: payment.reference || payment.counterparty.name,
                        cost_center: null
                    },
                    {
                        id: '2',
                        account_code:  '20201',
                        account_name: 'Debitor borcları',
                        debit: 0,
                        credit: payment.amount,
                        memo: payment.linked_document?.number || 'Ödəniş',
                        cost_center: null
                    }
                ]
            };
        } else {
            // Outgoing: Debit AP, Credit Cash/Bank
            journalEntry = {
                id: journalEntryId,
                date: payment.payment_date,
                reference: payment.payment_number,
                description: `Gedən ödəniş: ${payment.counterparty.name}`,
                status: 'posted',
                created_at: new Date().toISOString(),
                created_by: 'User',
                lines: [
                    {
                        id: '1',
                        account_code: '501',
                        account_name: 'Kreditor borcları',
                        debit:  payment.amount,
                        credit: 0,
                        memo: payment.linked_document?.number || 'Ödəniş',
                        cost_center: null
                    },
                    {
                        id: '2',
                        account_code:  payment.account,
                        account_name: payment.account_name,
                        debit: 0,
                        credit: payment.amount,
                        memo: payment.reference || payment.counterparty.name,
                        cost_center: null
                    }
                ]
            };
        }

        // Save journal entry
        const journalEntries = AurumStorage.get('journal_entries') || [];
        journalEntries.push(journalEntry);
        AurumStorage.set('journal_entries', journalEntries);

        // Update payment
        payment.posted_to_journal = true;
        payment.journal_entry_id = journalEntryId;

        const index = this.payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
            this.payments[index] = payment;
            AurumStorage.set('payments', this.payments);
        }

        console.log('✅ Posted to journal:', journalEntryId);

        alert(`Uğurla jurnala köçürüldü!\n\nJurnal Qeydi: ${journalEntryId}`);

        this.closeViewModal();
        this.renderPayments();
    },

    editPayment(paymentId) {
        // Similar to invoices edit
        console.log('Edit payment:', paymentId);
    },

    deletePayment(paymentId) {
        if (! confirm('Bu ödənişi silmək istədiyinizdən əminsiniz?')) {
            return;
        }

        this.payments = this.payments.filter(p => p.id !== paymentId);
        AurumStorage.set('payments', this.payments);

        console.log('✅ Payment deleted');

        this.renderStats();
        this.renderPayments();
    },

    applyFilters() {
        // Filter implementation
        console.log('Applying filters');
    },

    resetModal() {
        document.getElementById('paymentForm').reset();
    },

    closeModal() {
        document.getElementById('paymentModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.editingPaymentId = null;
    },

    closeViewModal() {
        document.getElementById('viewModal').setAttribute('hidden', '');
        document.body.classList.remove('modal-open');
        this.currentViewPaymentId = null;
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