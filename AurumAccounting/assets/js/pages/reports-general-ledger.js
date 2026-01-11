import { AurumStorage } from '../core/storage.js';

export default {
    journalEntries: [],
    accounts: [],
    selectedAccountCode: null,
    currentPeriod: 'month',
    ledgerTransactions: [],

    async init() {
        console.log('📒 General Ledger Report initializing...');
        await this.loadData();
        this.populateAccountDropdown();
        this.bindEvents();
    },

    async loadData() {
        try {
            // Load journal entries
            this.journalEntries = AurumStorage.get('journal_entries') || [];

            // Load accounts
            const accountsRes = await fetch('../assets/data/az_accounts_new.json');
            if (accountsRes.ok) {
                const data = await accountsRes.json();
                this.accounts = data.accounts.filter(a => ! a.is_header);
            }

            console.log('✅ General Ledger data loaded');
        } catch (error) {
            console.error('❌ Error loading ledger data:', error);
            this.journalEntries = [];
            this.accounts = [];
        }
    },

    bindEvents() {
        // Generate ledger
        document.querySelector('[data-action="generate-ledger"]')?.addEventListener('click', () => {
            this.generateLedger();
        });

        // Export CSV
        document.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Account select change
        document.getElementById('accountSelect')?.addEventListener('change', (e) => {
            this.selectedAccountCode = e.target.value;
        });

        // Period change
        document.getElementById('periodSelect')?.addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
        });
    },

    populateAccountDropdown() {
        const select = document.getElementById('accountSelect');
        if (!select) return;

        select.innerHTML = '<option value="">Hesab seçin</option>';

        // Sort accounts by code
        const sortedAccounts = [...this.accounts].sort((a, b) => a.code.localeCompare(b.code));

        sortedAccounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.code;
            option.textContent = `${account.code} - ${account.name}`;
            option.dataset.name = account.name;
            option.dataset.normalBalance = account.normal_balance;
            select.appendChild(option);
        });
    },

    generateLedger() {
        if (! this.selectedAccountCode) {
            alert('Zəhmət olmasa hesab seçin');
            return;
        }

        console.log('📒 Generating ledger for account:', this.selectedAccountCode);

        // Get account info
        const account = this.accounts.find(a => a.code === this.selectedAccountCode);
        if (!account) {
            alert('Hesab tapılmadı');
            return;
        }

        // Show account info
        document.getElementById('accountInfo').style.display = 'block';
        document.getElementById('accountCode').textContent = account.code;
        document.getElementById('accountName').textContent = account.name;

        // Filter entries by period
        const filteredEntries = this.filterByPeriod(this.journalEntries);

        // Extract transactions for this account
        this.ledgerTransactions = [];
        let runningBalance = 0;

        filteredEntries.forEach(entry => {
            entry.lines.forEach(line => {
                if (line.account_code === this.selectedAccountCode) {
                    const debit = line.debit || 0;
                    const credit = line.credit || 0;

                    // Calculate balance based on normal balance
                    if (account.normal_balance === 'debit') {
                        runningBalance += debit - credit;
                    } else {
                        runningBalance += credit - debit;
                    }

                    this.ledgerTransactions.push({
                        date: entry.date,
                        reference: entry.reference,
                        description: line.memo || entry.description,
                        debit: debit,
                        credit: credit,
                        balance: runningBalance
                    });
                }
            });
        });

        // Sort by date
        this.ledgerTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update account balance
        document.getElementById('accountBalance').textContent = this.formatCurrency(Math.abs(runningBalance));

        // Show ledger card
        document.getElementById('ledgerCard').style.display = 'block';

        this.renderLedger();
    },

    filterByPeriod(entries) {
        const now = new Date();
        let startDate, endDate;

        switch (this.currentPeriod) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = now;
                break;

            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                endDate = now;
                break;

            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = now;
                break;

            case 'all':
            default:
                return entries;
        }

        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
        });
    },

    renderLedger() {
        const tbody = document.querySelector('#ledgerTable tbody');
        if (!tbody) return;

        if (this.ledgerTransactions.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: var(--space-10); color: var(--color-text-tertiary);">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto var(--space-4); display: block;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">Bu hesabda hərəkət yoxdur</p>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        let totalDebit = 0;
        let totalCredit = 0;

        this.ledgerTransactions.forEach(transaction => {
            const row = document.createElement('tr');

            const balanceClass = transaction.balance >= 0 ? 'value-positive' : 'value-negative';

            row.innerHTML = `
        <td>${this.formatDate(transaction.date)}</td>
        <td><strong>${this.escapeHtml(transaction.reference)}</strong></td>
        <td>${this.escapeHtml(transaction.description)}</td>
        <td style="text-align:  right;">${transaction.debit > 0 ? this.formatCurrency(transaction.debit) : '—'}</td>
        <td style="text-align: right;">${transaction.credit > 0 ? this.formatCurrency(transaction.credit) : '—'}</td>
        <td style="text-align: right;" class="${balanceClass}"><strong>${this.formatCurrency(Math.abs(transaction.balance))}</strong></td>
      `;

            tbody.appendChild(row);

            totalDebit += transaction.debit;
            totalCredit += transaction.credit;
        });

        // Update footer
        const finalBalance = this.ledgerTransactions[this.ledgerTransactions.length - 1]?.balance || 0;
        const balanceClass = finalBalance >= 0 ?  'value-positive' : 'value-negative';

        document.querySelector('#ledgerTable [data-total="debit"]').textContent = this.formatCurrency(totalDebit);
        document.querySelector('#ledgerTable [data-total="credit"]').textContent = this.formatCurrency(totalCredit);

        const balanceEl = document.querySelector('#ledgerTable [data-total="balance"]');
        balanceEl.textContent = this.formatCurrency(Math.abs(finalBalance));
        balanceEl.className = balanceClass;
    },

    exportToCSV() {
        if (this.ledgerTransactions.length === 0) {
            alert('Export üçün məlumat yoxdur');
            return;
        }

        const account = this.accounts.find(a => a.code === this.selectedAccountCode);
        const headers = ['Tarix', 'Jurnal №', 'Təsvir', 'Debet', 'Kredit', 'Balans'];

        const rows = this.ledgerTransactions.map(t => [
            t.date,
            t.reference,
            t.description,
            t.debit.toFixed(2),
            t.credit.toFixed(2),
            t.balance.toFixed(2)
        ]);

        // Add totals
        const totalDebit = this.ledgerTransactions.reduce((sum, t) => sum + t.debit, 0);
        const totalCredit = this.ledgerTransactions.reduce((sum, t) => sum + t.credit, 0);
        const finalBalance = this.ledgerTransactions[this.ledgerTransactions.length - 1]?.balance || 0;

        rows.push([
            '',
            '',
            'CƏMİ',
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            finalBalance.toFixed(2)
        ]);

        const csvContent = [
            `"General Ledger - ${account.code} ${account.name}"`,
            '',
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `general-ledger-${this.selectedAccountCode}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('✅ General Ledger exported to CSV');
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