import {AurumToast} from '../components/toast.js';

export default {
    accounts: [],

    init() {
        this.bindEvents();
        this.setDefaultDates();
    },

    bindEvents() {
        const generateBtn = document.querySelector('[data-action="generate-report"]');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReport());
        }
    },

    setDefaultDates() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startInput = document.getElementById('periodStart');
        const endInput = document.getElementById('periodEnd');

        if (startInput) startInput.value = firstDayOfMonth.toISOString().split('T')[0];
        if (endInput) endInput.value = today.toISOString().split('T')[0];
    },

    async generateReport() {
        const startDate = document.getElementById('periodStart').value;
        const endDate = document.getElementById('periodEnd').value;

        if (!startDate || !endDate) {
            AurumToast.warning('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            AurumToast.error('Start date must be before end date');
            return;
        }

        try {
            const response = await fetch('../assets/data/accounts.json');
            this.accounts = await response.json();
            this.renderReport();
            AurumToast.success('Report generated successfully');
        } catch (error) {
            console.error('Error generating report:', error);
            AurumToast.error('Failed to generate report');
        }
    },

    renderReport() {
        const tbody = document.querySelector('#trialBalanceTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        let totalDebit = 0;
        let totalCredit = 0;

        this.accounts.forEach(account => {
            const row = document.createElement('tr');
            const debit = account.balance >= 0 ? account.balance :  0;
            const credit = account.balance < 0 ?  Math.abs(account.balance) : 0;

            totalDebit += debit;
            totalCredit += credit;

            row.innerHTML = `
        <td>${account.code}</td>
        <td>${account.name}</td>
        <td>${debit > 0 ? this.formatCurrency(debit) : '—'}</td>
        <td>${credit > 0 ? this.formatCurrency(credit) : '—'}</td>
      `;
            tbody.appendChild(row);
        });

        document.querySelector('[data-total="debit"]').textContent = this.formatCurrency(totalDebit);
        document.querySelector('[data-total="credit"]').textContent = this.formatCurrency(totalCredit);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};