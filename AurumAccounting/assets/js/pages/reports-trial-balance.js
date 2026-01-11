import { AurumStorage } from '../core/storage.js';

export default {
    journalEntries: [],
    accounts: [],
    trialBalanceData: [],
    currentPeriod: 'month',

    async init() {
        console.log('📊 Trial Balance Report initializing...');
        await this.loadData();
        this.generateReport();
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
                this.accounts = data.accounts;
            }

            console.log('✅ Trial Balance data loaded:', this.journalEntries.length, 'entries');
        } catch (error) {
            console.error('❌ Error loading trial balance data:', error);
            this.journalEntries = [];
            this.accounts = [];
        }
    },

    bindEvents() {
        // Refresh report
        document.querySelector('[data-action="refresh-report"]')?.addEventListener('click', () => {
            this.generateReport();
        });

        // Export CSV
        document.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Period change
        document.getElementById('reportPeriod')?.addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;

            // Show/hide custom date range
            const customRange = document.getElementById('customDateRange');
            const customRangeTo = document.getElementById('customDateRangeTo');

            if (e.target.value === 'custom') {
                customRange.style.display = 'block';
                customRangeTo.style.display = 'block';
            } else {
                customRange.style.display = 'none';
                customRangeTo.style.display = 'none';
            }

            this.generateReport();
        });

        // Custom date change
        document.getElementById('dateFrom')?.addEventListener('change', () => {
            if (this.currentPeriod === 'custom') {
                this.generateReport();
            }
        });

        document.getElementById('dateTo')?.addEventListener('change', () => {
            if (this.currentPeriod === 'custom') {
                this.generateReport();
            }
        });

        // Search
        document.getElementById('searchAccount')?.addEventListener('input', (e) => {
            this.filterTable(e.target.value);
        });
    },

    generateReport() {
        console.log('📊 Generating Trial Balance...');

        // Filter entries by period
        const filteredEntries = this.filterByPeriod(this.journalEntries);

        // Calculate balances for each account
        const accountBalances = new Map();

        // Initialize all accounts with zero balances
        this.accounts.forEach(account => {
            if (!account.is_header) {
                accountBalances.set(account.code, {
                    code: account.code,
                    name: account.name,
                    type: account.type,
                    normal_balance: account.normal_balance,
                    opening:  0,
                    debit: 0,
                    credit: 0,
                    closing: 0
                });
            }
        });

        // Calculate movements
        filteredEntries.forEach(entry => {
            entry.lines.forEach(line => {
                const accountCode = line.account_code;

                if (accountBalances.has(accountCode)) {
                    const balance = accountBalances.get(accountCode);
                    balance.debit += line.debit || 0;
                    balance.credit += line.credit || 0;
                }
            });
        });

        // Calculate closing balances
        accountBalances.forEach((balance, code) => {
            const netMovement = balance.debit - balance.credit;

            if (balance.normal_balance === 'debit') {
                balance.closing = balance.opening + netMovement;
            } else {
                balance.closing = balance.opening - netMovement;
            }
        });

        // Convert to array and filter out zero balances
        this.trialBalanceData = Array.from(accountBalances.values())
            .filter(b => b.debit !== 0 || b.credit !== 0 || b.opening !== 0 || b.closing !== 0)
            .sort((a, b) => a.code.localeCompare(b.code));

        this.renderReport();
        this.updateSummary();
    },

    filterByPeriod(entries) {
        const now = new Date();
        let startDate, endDate;

        switch (this.currentPeriod) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                break;

            case 'week':
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
                startDate = new Date(now.getFullYear(), now.getMonth(), diff);
                endDate = now;
                break;

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

            case 'custom':
                const dateFrom = document.getElementById('dateFrom')?.value;
                const dateTo = document.getElementById('dateTo')?.value;

                if (dateFrom) startDate = new Date(dateFrom);
                if (dateTo) endDate = new Date(dateTo);

                if (! startDate || !endDate) return entries;
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

    renderReport() {
        const tbody = document.querySelector('#trialBalanceTable tbody');
        if (!tbody) return;

        if (this.trialBalanceData.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: var(--space-10); color: var(--color-text-tertiary);">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:  0 auto var(--space-4); display: block;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">Seçilmiş dövrdə hərəkət yoxdur</p>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = '';

        let totalOpening = 0;
        let totalDebit = 0;
        let totalCredit = 0;
        let totalClosing = 0;

        this.trialBalanceData.forEach(balance => {
            const row = document.createElement('tr');

            row.innerHTML = `
        <td>${this.escapeHtml(balance.code)}</td>
        <td>${this.escapeHtml(balance.name)}</td>
        <td style="text-align: right;">${this.formatCurrency(Math.abs(balance.opening))}</td>
        <td style="text-align: right;">${this.formatCurrency(balance.debit)}</td>
        <td style="text-align: right;">${this.formatCurrency(balance.credit)}</td>
        <td style="text-align: right;">${this.formatCurrency(Math.abs(balance.closing))}</td>
      `;

            tbody.appendChild(row);

            totalOpening += Math.abs(balance.opening);
            totalDebit += balance.debit;
            totalCredit += balance.credit;
            totalClosing += Math.abs(balance.closing);
        });

        // Update footer totals
        document.querySelector('[data-total="opening"]').textContent = this.formatCurrency(totalOpening);
        document.querySelector('[data-total="debit"]').textContent = this.formatCurrency(totalDebit);
        document.querySelector('[data-total="credit"]').textContent = this.formatCurrency(totalCredit);
        document.querySelector('[data-total="closing"]').textContent = this.formatCurrency(totalClosing);
    },

    updateSummary() {
        const totalDebit = this.trialBalanceData.reduce((sum, b) => sum + b.debit, 0);
        const totalCredit = this.trialBalanceData.reduce((sum, b) => sum + b.credit, 0);
        const diff = Math.abs(totalDebit - totalCredit);

        document.querySelector('[data-summary="total-debit"]').textContent = this.formatCurrency(totalDebit);
        document.querySelector('[data-summary="total-credit"]').textContent = this.formatCurrency(totalCredit);
        document.querySelector('[data-summary="diff"]').textContent = this.formatCurrency(diff);

        // Add visual indicator if unbalanced
        const diffElement = document.querySelector('[data-summary="diff"]');
        if (diff > 0.01) {
            diffElement.style.color = '#C85C58';
        } else {
            diffElement.style.color = '#52A385';
        }
    },

    filterTable(query) {
        const rows = document.querySelectorAll('#trialBalanceTable tbody tr');
        const searchTerm = query.toLowerCase();

        rows.forEach(row => {
            const code = row.cells[0]?.textContent.toLowerCase() || '';
            const name = row.cells[1]?.textContent.toLowerCase() || '';

            if (code.includes(searchTerm) || name.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },

    exportToCSV() {
        if (this.trialBalanceData.length === 0) {
            alert('Export üçün məlumat yoxdur');
            return;
        }

        const headers = ['Kod', 'Hesab Adı', 'Açılış Balansı', 'Debet', 'Kredit', 'Bağlanış Balansı'];
        const rows = this.trialBalanceData.map(balance => [
            balance.code,
            balance.name,
            Math.abs(balance.opening).toFixed(2),
            balance.debit.toFixed(2),
            balance.credit.toFixed(2),
            Math.abs(balance.closing).toFixed(2)
        ]);

        // Add totals row
        const totalDebit = this.trialBalanceData.reduce((sum, b) => sum + b.debit, 0);
        const totalCredit = this.trialBalanceData.reduce((sum, b) => sum + b.credit, 0);
        const totalOpening = this.trialBalanceData.reduce((sum, b) => sum + Math.abs(b.opening), 0);
        const totalClosing = this.trialBalanceData.reduce((sum, b) => sum + Math.abs(b.closing), 0);

        rows.push([
            '',
            'CƏMİ',
            totalOpening.toFixed(2),
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            totalClosing.toFixed(2)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `trial-balance-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('✅ Trial Balance exported to CSV');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('az-AZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount) + ' ₼';
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};