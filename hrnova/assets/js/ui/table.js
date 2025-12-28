export class DataTable {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        this.options = {
            columns: options.columns || [],
            data: [],
            perPage: options.perPage || 10,
            perPageOptions: options.perPageOptions || [10, 25, 50, 100],
            searchable: options.searchable !== false,
            sortable: options.sortable !== false,
            pagination: options.pagination !== false,
            emptyState: options.emptyState || {
                icon: '📋',
                title: 'No data available',
                description: 'There are no records to display.'
            },
            onRowClick: options.onRowClick || null,
            loading: options.loading || false,
            filters: options.filters || [],
            actions: options.actions || []
        };

        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchQuery = '';
        this.activeFilters = {};
        this.filteredData = [];

        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const hasData = this.options.data.length > 0;

        this.container.innerHTML = `
      <div class="table-container">
        ${this.renderHeader()}
        <div class="table-wrapper">
          ${this.options.loading ? this.renderSkeleton() : (hasData ? this.renderTable() : this.renderEmptyState())}
        </div>
        ${hasData && !this.options.loading && this.options.pagination ? this.renderFooter() : ''}
      </div>
    `;

        this.attachEventListeners();
    }

    renderHeader() {
        const hasFilters = this.options.filters.length > 0;
        const hasActions = this.options.actions.length > 0;
        const hasSearch = this.options.searchable;

        if (!hasSearch && !hasFilters && !hasActions) {
            return '';
        }

        return `
      <div class="table-header">
        ${hasSearch ? `
          <div class="table-search">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              aria-label="Search table"
              data-table-search
              value="${this.searchQuery}"
            />
          </div>
        ` : ''}

        ${hasFilters ? `
          <div class="table-filters">
            ${this.options.filters.map(filter => `
              <div class="table-filter-group">
                ${filter.label ? `<span class="table-filter-label">${filter.label}:</span>` : ''}
                <select
                  class="form-control"
                  data-filter="${filter.key}"
                  aria-label="${filter.label || filter.key}"
                >
                  <option value="">All</option>
                  ${filter.options.map(opt => `
                    <option value="${opt.value}" ${this.activeFilters[filter.key] === opt.value ? 'selected' : ''}>
                      ${opt.label}
                    </option>
                  `).join('')}
                </select>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${hasActions ? `
          <div class="table-actions">
            ${this.options.actions.map(action => `
              <button
                class="btn ${action.className || 'btn-primary'}"
                data-action="${action.key}"
                ${action.ariaLabel ? `aria-label="${action.ariaLabel}"` : ''}
              >
                ${action.icon ? `<span class="btn-icon">${action.icon}</span>` : ''}
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    }

    renderTable() {
        const data = this.getPageData();

        return `
      <table class="data-table" role="table">
        <thead>
          <tr role="row">
            ${this.options.columns.map(col => `
              <th
                role="columnheader"
                class="${col.sortable !== false && this.options.sortable ? 'sortable' : ''} ${
            this.sortColumn === col.key ? `sort-${this.sortDirection}` : ''
        }"
                ${col.sortable !== false && this.options.sortable ? `data-sort="${col.key}"` : ''}
                ${col.width ? `style="width: ${col.width}"` : ''}
              >
                ${col.label}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((row, index) => `
            <tr
              role="row"
              data-row-index="${index}"
              ${this.options.onRowClick ? 'tabindex="0"' : ''}
              ${this.options.onRowClick ? 'aria-label="Click to view details"' : ''}
            >
              ${this.options.columns.map(col => `
                <td role="cell">
                  ${col.render ? col.render(row, row[col.key]) : this.escapeHtml(row[col.key] || '')}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    }

    renderSkeleton() {
        const rows = Array(5).fill(0);
        return `
      <div class="table-skeleton" role="status" aria-label="Loading">
        ${rows.map(() => `
          <div class="table-skeleton-row">
            <div class="table-skeleton-cell"></div>
            <div class="table-skeleton-cell"></div>
            <div class="table-skeleton-cell"></div>
            <div class="table-skeleton-cell"></div>
          </div>
        `).join('')}
      </div>
    `;
    }

    renderEmptyState() {
        return `
      <div class="table-empty" role="status">
        <div class="table-empty-icon">${this.options.emptyState.icon}</div>
        <div class="table-empty-title">${this.options.emptyState.title}</div>
        <div class="table-empty-description">${this.options.emptyState.description}</div>
      </div>
    `;
    }

    renderFooter() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.perPage);
        const startIndex = (this.currentPage - 1) * this.options.perPage + 1;
        const endIndex = Math.min(this.currentPage * this.options.perPage, this.filteredData.length);

        const pageNumbers = this.getPageNumbers(totalPages);

        return `
      <div class="table-footer">
        <div class="table-info" role="status" aria-live="polite">
          Showing ${startIndex}-${endIndex} of ${this.filteredData.length} results
        </div>

        <div class="table-per-page">
          <label for="table-per-page">Per page:</label>
          <select id="table-per-page" data-per-page aria-label="Results per page">
            ${this.options.perPageOptions.map(option => `
              <option value="${option}" ${this.options.perPage === option ? 'selected' : ''}>
                ${option}
              </option>
            `).join('')}
          </select>
        </div>

        <nav class="table-pagination" role="navigation" aria-label="Table pagination">
          <button
            class="btn btn-secondary"
            data-page="prev"
            ${this.currentPage === 1 ? 'disabled' : ''}
            aria-label="Previous page"
          >
            ←
          </button>

          ${pageNumbers.map(page => {
            if (page === '...') {
                return `<span class="btn btn-secondary" disabled>...</span>`;
            }
            return `
              <button
                class="btn btn-secondary ${page === this.currentPage ? 'active' : ''}"
                data-page="${page}"
                aria-label="Page ${page}"
                ${page === this.currentPage ? 'aria-current="page"' : ''}
              >
                ${page}
              </button>
            `;
        }).join('')}

          <button
            class="btn btn-secondary"
            data-page="next"
            ${this.currentPage === totalPages ? 'disabled' : ''}
            aria-label="Next page"
          >
            →
          </button>
        </nav>
      </div>
    `;
    }

    getPageNumbers(totalPages) {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (this.currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (this.currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(this.currentPage - 1);
                pages.push(this.currentPage);
                pages.push(this.currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    }

    attachEventListeners() {
        const searchInput = this.container.querySelector('[data-table-search]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.filterAndRender();
            });
        }

        const filterSelects = this.container.querySelectorAll('[data-filter]');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const filterKey = e.target.dataset.filter;
                this.activeFilters[filterKey] = e.target.value;
                this.currentPage = 1;
                this.filterAndRender();
            });
        });

        const sortHeaders = this.container.querySelectorAll('[data-sort]');
        sortHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }
                this.filterAndRender();
            });
        });

        const paginationButtons = this.container.querySelectorAll('[data-page]');
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.dataset.page;
                const totalPages = Math.ceil(this.filteredData.length / this.options.perPage);

                if (page === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (page === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                } else if (page !== 'prev' && page !== 'next') {
                    this.currentPage = parseInt(page);
                }

                this.render();
            });
        });

        const perPageSelect = this.container.querySelector('[data-per-page]');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', (e) => {
                this.options.perPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.render();
            });
        }

        const rows = this.container.querySelectorAll('tbody tr[data-row-index]');
        rows.forEach(row => {
            if (this.options.onRowClick) {
                row.addEventListener('click', () => {
                    const index = parseInt(row.dataset.rowIndex);
                    const data = this.getPageData();
                    this.options.onRowClick(data[index]);
                });

                row.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        row.click();
                    }
                });
            }
        });

        const actionButtons = this.container.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const actionKey = button.dataset.action;
                const action = this.options.actions.find(a => a.key === actionKey);
                if (action && action.onClick) {
                    action.onClick();
                }
            });
        });
    }

    filterAndRender() {
        this.applyFilters();
        this.applySorting();
        this.render();
    }

    applyFilters() {
        let data = [...this.options.data];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            data = data.filter(row => {
                return this.options.columns.some(col => {
                    const value = row[col.key];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(query);
                });
            });
        }

        Object.keys(this.activeFilters).forEach(filterKey => {
            const filterValue = this.activeFilters[filterKey];
            if (filterValue) {
                const filter = this.options.filters.find(f => f.key === filterKey);
                if (filter && filter.filterFn) {
                    data = data.filter(row => filter.filterFn(row, filterValue));
                } else {
                    data = data.filter(row => row[filterKey] === filterValue);
                }
            }
        });

        this.filteredData = data;
    }

    applySorting() {
        if (!this.sortColumn) {
            return;
        }

        this.filteredData.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    getPageData() {
        const startIndex = (this.currentPage - 1) * this.options.perPage;
        const endIndex = startIndex + this.options.perPage;
        return this.filteredData.slice(startIndex, endIndex);
    }

    setData(data) {
        this.options.data = data;
        this.currentPage = 1;
        this.filterAndRender();
    }

    setLoading(loading) {
        this.options.loading = loading;
        this.render();
    }

    refresh() {
        this.filterAndRender();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export default DataTable;
