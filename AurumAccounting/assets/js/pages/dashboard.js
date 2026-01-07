const DashboardModule = {
    async init() {
        console.log('=== DASHBOARD INIT START ===');

        try {
            // Load summary
            const summaryData = await this.loadSummary();
            this.renderSummary(summaryData);

            // Load transactions
            const transactions = await this.loadTransactions();
            this.renderTransactions(transactions);

            console.log('=== DASHBOARD INIT COMPLETE ===');
        } catch (error) {
            console.error('=== DASHBOARD INIT ERROR ===', error);
        }
    },

    async loadSummary() {
        try {
            const response = await fetch('../assets/data/dashboard-summary.json');

            if (!response.ok) {
                return {
                    revenue: 20000,
                    expenses: 11980,
                    profit: 8020,
                    accounts: 66
                };
            }

            return await response.json();
        } catch (error) {
            console.error('Error loading summary:', error);
            return {
                revenue: 20000,
                expenses: 11980,
                profit: 8020,
                accounts: 66
            };
        }
    },

    async loadTransactions() {
        try {
            const response = await fetch('../assets/data/transactions.json');

            if (!response.ok) {
                return [];
            }

            return await response.json();
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    },

    renderSummary(data) {
        const elements = {
            revenue: document.querySelector('[data-stat="revenue"]'),
            expenses: document.querySelector('[data-stat="expenses"]'),
            profit: document.querySelector('[data-stat="profit"]'),
            accounts: document.querySelector('[data-stat="accounts"]')
        };

        if (elements.revenue) {
            elements.revenue.textContent = this.formatCurrency(data.revenue);
        }

        if (elements.expenses) {
            elements.expenses.textContent = this.formatCurrency(data.expenses);
        }

        if (elements.profit) {
            elements.profit.textContent = this.formatCurrency(data.profit);
        }

        if (elements.accounts) {
            elements.accounts.textContent = data.accounts;
        }
    },

    renderTransactions(transactions) {
        const tbody = document.querySelector('#recentTransactions tbody');

        if (!tbody) {
            console.error('tbody not found! ');
            return;
        }

        if (! transactions || transactions.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="table__empty">No recent transactions</div>
          </td>
        </tr>
      `;
            return;
        }

        // Get last 10 transactions
        const recentTransactions = transactions.slice(-10).reverse();

        tbody.innerHTML = '';

        recentTransactions.forEach((transaction) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${this.formatDate(transaction.date)}</td>
        <td>${this.escapeHtml(transaction.description)}</td>
        <td>${this.escapeHtml(transaction.account_name)}</td>
        <td class="table__cell--numeric">${transaction.debit > 0 ? this.formatCurrency(transaction.debit) : '—'}</td>
        <td class="table__cell--numeric">${transaction.credit > 0 ? this.formatCurrency(transaction.credit) : '—'}</td>
      `;
            tbody.appendChild(row);
        });
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatDate(dateString) {
        // FIXED VERSION - Simple and reliable
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

export default DashboardModule;