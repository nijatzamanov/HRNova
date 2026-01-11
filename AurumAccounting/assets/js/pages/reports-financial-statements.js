import { AurumStorage } from '../core/storage.js';

export default {
    journalEntries: [],
    accounts: [],
    currentPeriod: 'month',
    balanceSheet: null,
    incomeStatement: null,

    async init() {
        console.log('📈 Financial Statements initializing...');
        await this.loadData();
        this.generateStatements();
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

            console.log('✅ Financial Statements data loaded');
        } catch (error) {
            console.error('❌ Error loading statements data:', error);
            this.journalEntries = [];
            this.accounts = [];
        }
    },

    bindEvents() {
        // Generate statements
        document.querySelector('[data-action="generate-statements"]')?.addEventListener('click', () => {
            this.generateStatements();
        });

        // Export
        document.querySelector('[data-action="export-statements"]')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Period change
        document.getElementById('statementPeriod')?.addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
        });

        // Statement type change
        document.getElementById('statementType')?.addEventListener('change', (e) => {
            const type = e.target.value;
            const balanceSheet = document.getElementById('balanceSheetCard');
            const incomeStatement = document.getElementById('incomeStatementCard');

            if (type === 'balance-sheet') {
                balanceSheet.style.display = 'block';
                incomeStatement.style.display = 'none';
            } else if (type === 'income-statement') {
                balanceSheet.style.display = 'none';
                incomeStatement.style.display = 'block';
            } else {
                balanceSheet.style.display = 'block';
                incomeStatement.style.display = 'block';
            }
        });
    },

    generateStatements() {
        console.log('📈 Generating Financial Statements...');

        // Filter entries by period
        const filteredEntries = this.filterByPeriod(this.journalEntries);

        // Calculate account balances
        const accountBalances = this.calculateAccountBalances(filteredEntries);

        // Generate Balance Sheet
        this.balanceSheet = this.generateBalanceSheet(accountBalances);
        this.renderBalanceSheet();

        // Generate Income Statement (P&L)
        this.incomeStatement = this.generateIncomeStatement(accountBalances);
        this.renderIncomeStatement();

        // Update dates
        const periodText = this.getPeriodText();
        document.getElementById('balanceSheetDate').textContent = periodText;
        document.getElementById('incomeStatementDate').textContent = periodText;
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

    calculateAccountBalances(entries) {
        const balances = new Map();

        // Initialize
        this.accounts.forEach(account => {
            if (!account.is_header) {
                balances.set(account.code, {
                    ... account,
                    debit: 0,
                    credit: 0,
                    balance: 0
                });
            }
        });

        // Calculate movements
        entries.forEach(entry => {
            entry.lines.forEach(line => {
                if (balances.has(line.account_code)) {
                    const balance = balances.get(line.account_code);
                    balance.debit += line.debit || 0;
                    balance.credit += line.credit || 0;
                }
            });
        });

        // Calculate final balances
        balances.forEach((balance, code) => {
            const netMovement = balance.debit - balance.credit;

            if (balance.normal_balance === 'debit') {
                balance.balance = netMovement;
            } else {
                balance.balance = -netMovement;
            }
        });

        return balances;
    },

    generateBalanceSheet(accountBalances) {
        const balanceSheet = {
            assets: {
                current: [],
                nonCurrent: [],
                totalCurrent: 0,
                totalNonCurrent: 0,
                total: 0
            },
            liabilities: {
                current:  [],
                nonCurrent: [],
                totalCurrent: 0,
                totalNonCurrent: 0,
                total:  0
            },
            equity: {
                items: [],
                total: 0
            }
        };

        accountBalances.forEach((balance, code) => {
            if (Math.abs(balance.balance) < 0.01) return; // Skip zero balances

            if (balance.type === 'asset') {
                if (balance.section === 2) {
                    // Current assets (section 2)
                    balanceSheet.assets.current.push(balance);
                    balanceSheet.assets.totalCurrent += Math.abs(balance.balance);
                } else {
                    // Non-current assets (section 1)
                    balanceSheet.assets.nonCurrent.push(balance);
                    balanceSheet.assets.totalNonCurrent += Math.abs(balance.balance);
                }
            } else if (balance.type === 'liability') {
                if (balance.section === 5) {
                    // Current liabilities (section 5)
                    balanceSheet.liabilities.current.push(balance);
                    balanceSheet.liabilities.totalCurrent += Math.abs(balance.balance);
                } else {
                    // Non-current liabilities (section 4)
                    balanceSheet.liabilities.nonCurrent.push(balance);
                    balanceSheet.liabilities.totalNonCurrent += Math.abs(balance.balance);
                }
            } else if (balance.type === 'equity') {
                balanceSheet.equity.items.push(balance);
                balanceSheet.equity.total += Math.abs(balance.balance);
            }
        });

        balanceSheet.assets.total = balanceSheet.assets.totalCurrent + balanceSheet.assets.totalNonCurrent;
        balanceSheet.liabilities.total = balanceSheet.liabilities.totalCurrent + balanceSheet.liabilities.totalNonCurrent;

        return balanceSheet;
    },

    generateIncomeStatement(accountBalances) {
        const incomeStatement = {
            revenue: {
                items: [],
                total: 0
            },
            expenses: {
                operating: [],
                financial: [],
                totalOperating: 0,
                totalFinancial: 0,
                total: 0
            },
            netIncome: 0
        };

        accountBalances.forEach((balance, code) => {
            if (Math.abs(balance.balance) < 0.01) return;

            if (balance.type === 'revenue') {
                incomeStatement.revenue.items.push(balance);
                incomeStatement.revenue.total += Math.abs(balance.balance);
            } else if (balance.type === 'expense') {
                if (balance.section === 9) {
                    // Financial expenses
                    incomeStatement.expenses.financial.push(balance);
                    incomeStatement.expenses.totalFinancial += Math.abs(balance.balance);
                } else {
                    // Operating expenses
                    incomeStatement.expenses.operating.push(balance);
                    incomeStatement.expenses.totalOperating += Math.abs(balance.balance);
                }
            }
        });

        incomeStatement.expenses.total = incomeStatement.expenses.totalOperating + incomeStatement.expenses.totalFinancial;
        incomeStatement.netIncome = incomeStatement.revenue.total - incomeStatement.expenses.total;

        return incomeStatement;
    },

    renderBalanceSheet() {
        const tbody = document.getElementById('balanceSheetBody');
        if (!tbody) return;

        const bs = this.balanceSheet;
        let html = '';

        // ASSETS
        html += `
      <tr class="statement-section-header">
        <td colspan="2">AKTİVLƏR</td>
      </tr>
    `;

        // Current Assets
        if (bs.assets.current.length > 0) {
            html += `
        <tr class="statement-section-header" style="background:  rgba(108, 145, 194, 0.05);">
          <td>Dövriyyə Aktivləri</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            bs.assets.current.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Dövriyyə Aktivləri</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(bs.assets.totalCurrent)}</strong></td>
        </tr>
      `;
        }

        // Non-Current Assets
        if (bs.assets.nonCurrent.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Qeyri-dövriyyə Aktivləri</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            bs.assets.nonCurrent.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Qeyri-dövriyyə Aktivləri</td>
          <td style="text-align:  right;"><strong>${this.formatCurrency(bs.assets.totalNonCurrent)}</strong></td>
        </tr>
      `;
        }

        html += `
      <tr class="statement-total">
        <td>CƏMİ AKTİVLƏR</td>
        <td style="text-align: right;"><strong>${this.formatCurrency(bs.assets.total)}</strong></td>
      </tr>
    `;

        // LIABILITIES & EQUITY
        html += `
      <tr class="statement-section-header">
        <td colspan="2">ÖHDƏLİKLƏR VƏ KAPİTAL</td>
      </tr>
    `;

        // Current Liabilities
        if (bs.liabilities.current.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Qısamüddətli Öhdəliklər</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            bs.liabilities.current.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Qısamüddətli Öhdəliklər</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(bs.liabilities.totalCurrent)}</strong></td>
        </tr>
      `;
        }

        // Non-Current Liabilities
        if (bs.liabilities.nonCurrent.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Uzunmüddətli Öhdəliklər</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            bs.liabilities.nonCurrent.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Uzunmüddətli Öhdəliklər</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(bs.liabilities.totalNonCurrent)}</strong></td>
        </tr>
      `;
        }

        // Equity
        if (bs.equity.items.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Kapital</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            bs.equity.items.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Kapital</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(bs.equity.total)}</strong></td>
        </tr>
      `;
        }

        html += `
      <tr class="statement-total">
        <td>CƏMİ ÖHDƏLİKLƏR VƏ KAPİTAL</td>
        <td style="text-align: right;"><strong>${this.formatCurrency(bs.liabilities.total + bs.equity.total)}</strong></td>
      </tr>
    `;

        tbody.innerHTML = html;
    },

    renderIncomeStatement() {
        const tbody = document.getElementById('incomeStatementBody');
        if (!tbody) return;

        const is = this.incomeStatement;
        let html = '';

        // REVENUE
        html += `
      <tr class="statement-section-header">
        <td colspan="2">GƏLİRLƏR</td>
      </tr>
    `;

        if (is.revenue.items.length > 0) {
            is.revenue.items.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Gəlirlər</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(is.revenue.total)}</strong></td>
        </tr>
      `;
        }

        // EXPENSES
        html += `
      <tr class="statement-section-header">
        <td colspan="2">XƏRCLƏR</td>
      </tr>
    `;

        // Operating Expenses
        if (is.expenses.operating.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Əməliyyat Xərcləri</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            is.expenses.operating.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Əməliyyat Xərcləri</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(is.expenses.totalOperating)}</strong></td>
        </tr>
      `;
        }

        // Financial Expenses
        if (is.expenses.financial.length > 0) {
            html += `
        <tr class="statement-section-header" style="background: rgba(108, 145, 194, 0.05);">
          <td>Maliyyə Xərcləri</td>
          <td style="text-align: right;"></td>
        </tr>
      `;
            is.expenses.financial.forEach(item => {
                html += `
          <tr class="statement-item">
            <td>${this.escapeHtml(item.name)}</td>
            <td style="text-align: right;">${this.formatCurrency(Math.abs(item.balance))}</td>
          </tr>
        `;
            });
            html += `
        <tr class="statement-subtotal">
          <td>Cəmi Maliyyə Xərcləri</td>
          <td style="text-align: right;"><strong>${this.formatCurrency(is.expenses.totalFinancial)}</strong></td>
        </tr>
      `;
        }

        html += `
      <tr class="statement-subtotal">
        <td>Cəmi Xərclər</td>
        <td style="text-align: right;"><strong>${this.formatCurrency(is.expenses.total)}</strong></td>
      </tr>
    `;

        // NET INCOME
        const netIncomeClass = is.netIncome >= 0 ? 'value-positive' : 'value-negative';
        const netIncomeLabel = is.netIncome >= 0 ? 'XALİS MƏNFƏƏT' : 'XALİS ZƏRƏR';

        html += `
      <tr class="statement-total">
        <td>${netIncomeLabel}</td>
        <td style="text-align: right;" class="${netIncomeClass}"><strong>${this.formatCurrency(Math.abs(is.netIncome))}</strong></td>
      </tr>
    `;

        tbody.innerHTML = html;
    },

    getPeriodText() {
        const now = new Date();

        switch (this.currentPeriod) {
            case 'month':
                return now.toLocaleDateString('az-AZ', { year: 'numeric', month: 'long' });
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3) + 1;
                return `${now.getFullYear()} - ${quarter}-ci rüb`;
            case 'year':
                return `${now.getFullYear()}`;
            case 'all':
                return 'Bütün dövr';
            default:
                return '-';
        }
    },

    exportToCSV() {
        // Export both statements to CSV
        console.log('✅ Financial Statements exported');
        alert('CSV export funksiyası tezliklə əlavə ediləcək');
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