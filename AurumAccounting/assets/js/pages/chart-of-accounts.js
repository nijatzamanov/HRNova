import { AurumI18n } from '../core/i18n.js';
import { AurumStorage } from '../core/storage.js';

export default {
    standardAccounts: [],
    customAccounts: [],
    allAccounts: [],
    filteredAccounts: [],
    currentSection: 'all',
    currentView: 'tree',
    searchQuery: '',
    expandedItems: new Set(),

    async init() {
        console.log('📊 Chart of Accounts (AZ New Plan) initializing...');
        await this.loadAccounts();
        this.buildAccountsTree();
        this.renderAccounts();
        this.bindEvents();
    },

    async loadAccounts() {
        try {
            // Load standard Azerbaijan accounts
            const response = await fetch('../assets/data/az_accounts_new.json');
            if (!response.ok) throw new Error('Failed to load accounts');

            const data = await response.json();
            this.standardAccounts = data.accounts;

            // Load custom accounts from localStorage
            const companyId = AurumStorage.get('company_id') || 'default';
            const customKey = `custom_accounts_${companyId}`;
            this.customAccounts = AurumStorage.get(customKey) || [];

            // Merge accounts
            this.allAccounts = [... this.standardAccounts, ...this.customAccounts];
            this.filteredAccounts = [... this.allAccounts];

            console.log('✅ Accounts loaded:', this.allAccounts.length);
        } catch (error) {
            console.error('❌ Error loading accounts:', error);
            this.standardAccounts = [];
            this.customAccounts = [];
            this.allAccounts = [];
            this.filteredAccounts = [];
        }
    },

    buildAccountsTree() {
        // Build parent-child relationships
        this.allAccounts.forEach(account => {
            account.children = this.allAccounts.filter(a => a.parent_code === account.code);
        });
    },

    bindEvents() {
        // Search
        const searchInput = document.getElementById('searchAccounts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Section filters
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-section]').forEach(b => b.classList.remove('coa-section-btn--active'));
                btn.classList.add('coa-section-btn--active');
                this.currentSection = btn.dataset.section;
                this.applyFilters();
            });
        });

        // View toggle
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('coa-view-btn--active'));
                btn.classList.add('coa-view-btn--active');
                this.currentView = btn.dataset.view;
                this.renderAccounts();
            });
        });

        // Add account button
        const addBtn = document.querySelector('[data-action="add-account"]');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        // Modal/Drawer close
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-modal-close]')) {
                this.closeModal();
            }
            if (e.target.closest('[data-drawer-close]')) {
                this.closeDrawer();
            }
        });

        // Tree interaction (event delegation)
        const treeContainer = document.getElementById('accountsTree');
        if (treeContainer) {
            treeContainer.addEventListener('click', (e) => {
                const toggleBtn = e.target.closest('.coa-tree-item__toggle');
                const viewBtn = e.target.closest('[data-action="view-account"]');
                const editBtn = e.target.closest('[data-action="edit-account"]');
                const deleteBtn = e.target.closest('[data-action="delete-account"]');

                if (toggleBtn) {
                    e.stopPropagation();
                    const item = toggleBtn.closest('.coa-tree-item');
                    this.toggleTreeItem(item.dataset.accountId);
                } else if (viewBtn) {
                    e.stopPropagation();
                    this.viewAccount(viewBtn.dataset.accountId);
                } else if (editBtn) {
                    e.stopPropagation();
                    this.editAccount(editBtn.dataset.accountId);
                } else if (deleteBtn) {
                    e.stopPropagation();
                    this.deleteAccount(deleteBtn.dataset.accountId);
                }
            });
        }

        // Form submit
        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    applyFilters() {
        let accounts = [... this.allAccounts];

        // Filter by section
        if (this.currentSection !== 'all') {
            if (this.currentSection === '4-5') {
                accounts = accounts.filter(a => a.section === 4 || a.section === 5);
            } else if (this.currentSection === '8-9') {
                accounts = accounts.filter(a => a.section === 8 || a.section === 9);
            } else {
                accounts = accounts.filter(a => a.section === parseInt(this.currentSection));
            }
        }

        // Filter by search
        if (this.searchQuery) {
            accounts = accounts.filter(a =>
                a.code.toLowerCase().includes(this.searchQuery) ||
                a.name.toLowerCase().includes(this.searchQuery) ||
                (a.name_en && a.name_en.toLowerCase().includes(this.searchQuery))
            );
        }

        this.filteredAccounts = accounts;
        this.renderAccounts();
    },

    renderAccounts() {
        const container = document.getElementById('accountsTree');
        if (!container) return;

        container.innerHTML = '';

        if (this.filteredAccounts.length === 0) {
            container.innerHTML = `
        <div class="coa-tree__empty">
          <p>Heç bir hesab tapılmadı</p>
        </div>
      `;
            return;
        }

        // Render root accounts (no parent)
        const rootAccounts = this.filteredAccounts.filter(a => ! a.parent_code);
        rootAccounts.forEach(account => {
            const element = this.renderTreeItem(account, 0);
            container.appendChild(element);
        });
    },

    renderTreeItem(account, level) {
        const item = document.createElement('div');
        item.className = 'coa-tree-item';
        item.dataset.accountId = account.id;

        if (this.expandedItems.has(account.id)) {
            item.classList.add('coa-tree-item--expanded');
        }

        const hasChildren = account.children && account.children.length > 0;

        const header = document.createElement('div');
        header.className = `coa-tree-item__header coa-tree-item__header--level-${level}`;

        header.innerHTML = `
      ${hasChildren ? `
        <button class="coa-tree-item__toggle" type="button" aria-label="Toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      ` : '<div style="width: 24px;"></div>'}
      
      <span class="coa-tree-item__code">${this.escapeHtml(account.code)}</span>
      <span class="coa-tree-item__name">${this.escapeHtml(account.name)}</span>
      
      <div class="coa-tree-item__type">
        ${this.renderTypeBadge(account.type)}
      </div>
      
      <div class="coa-tree-item__actions">
        <button class="coa-tree-item__action-btn" data-action="view-account" data-account-id="${account.id}" type="button" title="Bax">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        ${account.is_custom ? `
          <button class="coa-tree-item__action-btn" data-action="edit-account" data-account-id="${account.id}" type="button" title="Redaktə et">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="coa-tree-item__action-btn" data-action="delete-account" data-account-id="${account.id}" type="button" title="Sil">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `;

        item.appendChild(header);

        // Render children
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'coa-tree-item__children';

            account.children.forEach(child => {
                const childElement = this.renderTreeItem(child, level + 1);
                childrenContainer.appendChild(childElement);
            });

            item.appendChild(childrenContainer);
        }

        return item;
    },

    renderTypeBadge(type) {
        const typeMap = {
            'asset': { class: 'badge--primary', label: 'Aktiv' },
            'liability':  { class: 'badge--error', label: 'Öhdəlik' },
            'equity': { class: 'badge--warning', label: 'Kapital' },
            'revenue':  { class: 'badge--success', label: 'Gəlir' },
            'expense': { class: 'badge--info', label: 'Xərc' }
        };

        const typeInfo = typeMap[type] || { class: 'badge--neutral', label: type };
        return `<span class="badge badge--solid badge--sm ${typeInfo.class}">${typeInfo.label}</span>`;
    },

    toggleTreeItem(accountId) {
        if (this.expandedItems.has(accountId)) {
            this.expandedItems.delete(accountId);
        } else {
            this.expandedItems.add(accountId);
        }

        const item = document.querySelector(`[data-account-id="${accountId}"]`);
        if (item) {
            item.classList.toggle('coa-tree-item--expanded');
        }
    },

    viewAccount(accountId) {
        const account = this.allAccounts.find(a => a.id === accountId);
        if (!account) return;

        // Populate drawer
        const drawerBody = document.getElementById('drawerBody');
        if (! drawerBody) return;

        drawerBody.innerHTML = `
      <div class="account-details">
        <div class="account-details__section">
          <h3 class="account-details__heading">Əsas Məlumat</h3>
          <dl class="account-details__list">
            <div class="account-details__item">
              <dt>Hesab Kodu:</dt>
              <dd><strong>${this.escapeHtml(account.code)}</strong></dd>
            </div>
            <div class="account-details__item">
              <dt>Ad (AZ):</dt>
              <dd>${this.escapeHtml(account.name)}</dd>
            </div>
            ${account.name_en ? `
              <div class="account-details__item">
                <dt>Ad (EN):</dt>
                <dd>${this.escapeHtml(account.name_en)}</dd>
              </div>
            ` : ''}
            <div class="account-details__item">
              <dt>Növ:</dt>
              <dd>${this.renderTypeBadge(account.type)}</dd>
            </div>
            <div class="account-details__item">
              <dt>Normal Balans:</dt>
              <dd><span class="badge badge--outlined ${account.normal_balance === 'debit' ? 'badge--primary' : 'badge--success'}">${account.normal_balance === 'debit' ? 'Debet' : 'Kredit'}</span></dd>
            </div>
            <div class="account-details__item">
              <dt>Bölmə:</dt>
              <dd>${account.section}</dd>
            </div>
            ${account.parent_code ? `
              <div class="account-details__item">
                <dt>Ana Hesab:</dt>
                <dd>${account.parent_code}</dd>
              </div>
            ` : ''}
          </dl>
        </div>

        ${account.description ? `
          <div class="account-details__section">
            <h3 class="account-details__heading">Təsvir</h3>
            <p class="account-details__description">${this.escapeHtml(account.description)}</p>
          </div>
        ` : ''}

        ${account.is_custom ? `
          <div class="account-details__section">
            <div class="alert alert--info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Bu hesab şirkətiniz tərəfindən əlavə edilmişdir.</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;

        // Store current account for edit
        this.currentAccountId = accountId;

        // Show drawer
        this.openDrawer();
    },

    openDrawer() {
        const drawer = document.getElementById('accountDrawer');
        if (drawer) {
            drawer.removeAttribute('hidden');
            document.body.classList.add('drawer-open');
        }
    },

    closeDrawer() {
        const drawer = document.getElementById('accountDrawer');
        if (drawer) {
            drawer.setAttribute('hidden', '');
            document.body.classList.remove('drawer-open');
        }
        this.currentAccountId = null;
    },

    openAddModal() {
        this.resetModal();
        this.editingAccountId = null;

        // Populate parent account dropdown
        this.populateParentDropdown();

        // Set modal title
        document.getElementById('accountModalTitle').textContent = 'Yeni Hesab';

        // Show modal
        const modal = document.getElementById('accountModal');
        if (modal) {
            modal.removeAttribute('hidden');
            document.body.classList.add('modal-open');
        }
    },

    editAccount(accountId) {
        const account = this.allAccounts.find(a => a.id === accountId);
        if (!account || !account.is_custom) return;

        this.resetModal();
        this.editingAccountId = accountId;

        // Fill form
        document.getElementById('accountCode').value = account.code;
        document.getElementById('accountName').value = account.name;
        document.getElementById('accountNameEn').value = account.name_en || '';
        document.getElementById('parentAccount').value = account.parent_code || '';
        document.getElementById('accountType').value = account.type;
        document.getElementById('normalBalance').value = account.normal_balance;
        document.getElementById('accountDescription').value = account.description || '';

        // Populate parent dropdown
        this.populateParentDropdown();

        // Set modal title
        document.getElementById('accountModalTitle').textContent = 'Hesabı Redaktə Et';

        // Show modal
        const modal = document.getElementById('accountModal');
        if (modal) {
            modal.removeAttribute('hidden');
            document.body.classList.add('modal-open');
        }

        // Close drawer if open
        this.closeDrawer();
    },

    deleteAccount(accountId) {
        const account = this.allAccounts.find(a => a.id === accountId);
        if (!account || !account.is_custom) return;

        if (! confirm(`"${account.name}" hesabını silmək istədiyinizdən əminsiniz?`)) {
            return;
        }

        // Remove from custom accounts
        this.customAccounts = this.customAccounts.filter(a => a.id !== accountId);

        // Save to localStorage
        const companyId = AurumStorage.get('company_id') || 'default';
        const customKey = `custom_accounts_${companyId}`;
        AurumStorage.set(customKey, this.customAccounts);

        // Reload
        this.loadAccounts().then(() => {
            this.buildAccountsTree();
            this.applyFilters();
        });

        console.log('✅ Account deleted');
    },

    populateParentDropdown() {
        const select = document.getElementById('parentAccount');
        if (!select) return;

        // Clear existing options (except first)
        select.innerHTML = '<option value="">Yoxdur (Əsas hesab)</option>';

        // Add header accounts as options
        this.allAccounts
            .filter(a => a.is_header)
            .forEach(account => {
                const option = document.createElement('option');
                option.value = account.code;
                option.textContent = `${account.code} - ${account.name}`;
                select.appendChild(option);
            });
    },

    resetModal() {
        const form = document.getElementById('accountForm');
        if (form) form.reset();

        // Clear errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('form-group--error'));
    },

    closeModal() {
        const modal = document.getElementById('accountModal');
        if (modal) {
            modal.setAttribute('hidden', '');
            document.body.classList.remove('modal-open');
        }
        this.editingAccountId = null;
    },

    handleSubmit(event) {
        event.preventDefault();

        const formData = {
            id: this.editingAccountId || `custom_${Date.now()}`,
            code: document.getElementById('accountCode').value.trim(),
            name: document.getElementById('accountName').value.trim(),
            name_en: document.getElementById('accountNameEn').value.trim(),
            parent_code: document.getElementById('parentAccount').value || null,
            type: document.getElementById('accountType').value,
            normal_balance: document.getElementById('normalBalance').value,
            description: document.getElementById('accountDescription').value.trim(),
            section: this.determineSectionFromCode(document.getElementById('accountCode').value),
            is_header: false,
            is_custom: true
        };

        // Validation
        if (!formData.code || !formData.name || !formData.type || !formData.normal_balance) {
            alert('Zəhmət olmasa bütün tələb olunan sahələri doldurun');
            return;
        }

        // Check for duplicate code
        const existingAccount = this.allAccounts.find(a =>
            a.code === formData.code && a.id !== formData.id
        );
        if (existingAccount) {
            alert('Bu hesab kodu artıq mövcuddur');
            return;
        }

        if (this.editingAccountId) {
            // Update existing
            const index = this.customAccounts.findIndex(a => a.id === this.editingAccountId);
            if (index !== -1) {
                this.customAccounts[index] = formData;
            }
        } else {
            // Add new
            this.customAccounts.push(formData);
        }

        // Save to localStorage
        const companyId = AurumStorage.get('company_id') || 'default';
        const customKey = `custom_accounts_${companyId}`;
        AurumStorage.set(customKey, this.customAccounts);

        console.log('✅ Account saved:', formData);

        this.closeModal();

        // Reload
        this.loadAccounts().then(() => {
            this.buildAccountsTree();
            this.applyFilters();
        });
    },

    determineSectionFromCode(code) {
        const firstDigit = parseInt(code[0]);
        if (firstDigit >= 1 && firstDigit <= 9) {
            return firstDigit;
        }
        return 1; // Default
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};