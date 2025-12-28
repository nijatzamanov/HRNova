// employees.js - Employees Page Logic
(function() {
    'use strict';

    const EmployeesPage = {
        employees: [],
        filteredEmployees: [],
        employeeModal: null,
        currentEmployee: null,

        init: async function() {
            this.setupSidebar();
            this.employeeModal = Modal.get('employeeModal');
            this.setupEventListeners();
            this.setupPageTabs();
            await this.loadEmployees();
            this.renderEmployees();

            // Render org chart
            /*if (window.OrgChart) {
                OrgChart.render('orgChart');
            }*/

            // New way - with department grouping option
            if (window.OrgChart) {
                OrgChart.render('orgChart', {
                    groupByDepartment:  true  // true etsən şəkil 6 kimi department qrupları olur
                });
            }
        },

        setupSidebar: function() {
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            if (menuToggle && sidebar && overlay) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('dashboard-layout__sidebar--open');
                    overlay.classList.toggle('sidebar-overlay--open');
                });

                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('dashboard-layout__sidebar--open');
                    overlay.classList.remove('sidebar-overlay--open');
                });
            }
        },

        setupPageTabs: function() {
            const tabs = document.querySelectorAll('.page-tabs__tab');
            const panels = document.querySelectorAll('.page-tab-panel');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetPanel = tab.getAttribute('data-tab');

                    // Remove active from all
                    tabs.forEach(t => t.classList.remove('page-tabs__tab--active'));
                    panels.forEach(p => p.classList.remove('page-tab-panel--active'));

                    // Add active to clicked
                    tab.classList.add('page-tabs__tab--active');
                    const panel = document.querySelector(`[data-panel="${targetPanel}"]`);
                    if (panel) {
                        panel.classList.add('page-tab-panel--active');
                    }
                });
            });
        },

        setupEventListeners: function() {
            // Add employee button
            const addEmployeeBtn = document.getElementById('addEmployeeBtn');
            if (addEmployeeBtn) {
                addEmployeeBtn.addEventListener('click', () => this.openAddModal());
            }

            // Export CSV button
            const exportCSVBtn = document.getElementById('exportCSVBtn');
            if (exportCSVBtn) {
                exportCSVBtn.addEventListener('click', () => this.exportToCSV());
            }

            // Search input
            const searchInput = document.getElementById('searchEmployees');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
            }

            // Filter apply button
            const applyFiltersBtn = document.getElementById('applyFiltersBtn');
            if (applyFiltersBtn) {
                applyFiltersBtn.addEventListener('click', () => {
                    this.applyFilters();
                    // Close dropdown
                    const filterDropdown = document.getElementById('filterDropdown');
                    if (filterDropdown) {
                        const menu = filterDropdown.querySelector('.dropdown__menu');
                        if (menu) menu.classList.remove('dropdown__menu--open');
                    }
                });
            }

            // Clear filters button
            const clearFiltersBtn = document.getElementById('clearFiltersBtn');
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', () => {
                    document.getElementById('filterDepartment').value = '';
                    document.getElementById('filterStatus').value = '';
                    this.applyFilters();
                });
            }

            // Sort items
            document.querySelectorAll('[data-sort]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const sortType = btn.getAttribute('data-sort');
                    this.sortEmployees(sortType);
                });
            });

            // Modal buttons
            const cancelBtn = document.getElementById('cancelBtn');
            const saveBtn = document.getElementById('saveEmployeeBtn');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.employeeModal.close());
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveEmployee());
            }

            // Form submission
            const employeeForm = document.getElementById('employeeForm');
            if (employeeForm) {
                employeeForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveEmployee();
                });
            }
        },

        loadEmployees: async function() {
            try {
                this.employees = await API.employees.getAll();
                this.filteredEmployees = [... this.employees];
            } catch (error) {
                console.error('Failed to load employees:', error);
                Toast.error('Error', 'Failed to load employees');
            }
        },

        renderEmployees: function() {
            const grid = document.getElementById('employeesGrid');
            const emptyState = document.getElementById('emptyState');

            if (! grid) return;

            if (this.filteredEmployees.length === 0) {
                grid.innerHTML = '';
                if (emptyState) DOM.show(emptyState);
                return;
            }

            if (emptyState) DOM.hide(emptyState);

            grid.innerHTML = this.filteredEmployees.map(employee => `
        <div class="employee-card" data-employee-id="${employee.id}">
          <img src="${employee.avatar}" alt="${employee.name}" class="employee-card__avatar">
          <h3 class="employee-card__name">${employee.name}</h3>
          <p class="employee-card__position">${employee.position}</p>
          <span class="employee-card__department">${this.getDepartmentName(employee.department)}</span>
          <div class="employee-card__actions">
            <button class="btn btn--sm btn--secondary" data-action="edit" data-id="${employee.id}" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn btn--sm btn--danger" data-action="delete" data-id="${employee.id}" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      `).join('');

            // Attach event listeners
            grid.querySelectorAll('[data-action="edit"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    this.openEditModal(id);
                });
            });

            grid.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    this.deleteEmployee(id);
                });
            });

            // Card click (future:  open detail page)
            grid.querySelectorAll('.employee-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-employee-id');
                    // Future: window.location.href = `./employee-detail.html?id=${id}`;
                    Toast.info('Info', 'Employee detail page - Coming in MVP');
                });
            });
        },

        handleSearch: function(query) {
            const lowerQuery = query.toLowerCase().trim();

            if (! lowerQuery) {
                this.filteredEmployees = [...this.employees];
            } else {
                this.filteredEmployees = this.employees.filter(emp => {
                    return emp.name.toLowerCase().includes(lowerQuery) ||
                        emp.email.toLowerCase().includes(lowerQuery) ||
                        emp.position.toLowerCase().includes(lowerQuery);
                });
            }

            this.renderEmployees();
        },

        applyFilters: function() {
            const department = document.getElementById('filterDepartment')?.value;
            const status = document.getElementById('filterStatus')?.value;

            this.filteredEmployees = this.employees.filter(emp => {
                const deptMatch = ! department || emp.department === department;
                const statusMatch = !status || emp.status === status;
                return deptMatch && statusMatch;
            });

            this.renderEmployees();
            Toast.info('Filtered', `Showing ${this.filteredEmployees.length} employees`);
        },

        sortEmployees: function(sortType) {
            switch(sortType) {
                case 'name-asc':
                    this.filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    this.filteredEmployees.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'date-asc':
                    this.filteredEmployees.sort((a, b) => new Date(a.hireDate) - new Date(b.hireDate));
                    break;
                case 'date-desc':
                    this.filteredEmployees.sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate));
                    break;
            }

            this.renderEmployees();
            Toast.info('Sorted', 'Employee list sorted');
        },

        openAddModal: function() {
            this.currentEmployee = null;
            const form = document.getElementById('employeeForm');
            const modalTitle = document.getElementById('modalTitle');

            if (form) form.reset();
            if (modalTitle) modalTitle.textContent = 'Add Employee';

            // Clear errors
            form?.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('form-group--error');
            });

            this.employeeModal.open();
        },

        openEditModal: function(id) {
            const employee = this.employees.find(emp => emp.id === id);
            if (!employee) return;

            this.currentEmployee = employee;
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Edit Employee';

            // Fill form
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeePhone').value = employee.phone || '';
            document.getElementById('employeePosition').value = employee.position;
            document.getElementById('employeeDepartment').value = employee.department;
            document.getElementById('employeeHireDate').value = employee.hireDate;
            document.getElementById('employeeStatus').value = employee.status;

            this.employeeModal.open();
        },

        validateForm: function() {
            const form = document.getElementById('employeeForm');
            const requiredFields = ['employeeName', 'employeeEmail', 'employeePosition', 'employeeDepartment', 'employeeHireDate'];

            let isValid = true;

            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                const formGroup = field.closest('.form-group');

                if (!field.value.trim()) {
                    formGroup.classList.add('form-group--error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('form-group--error');
                }
            });

            // Email validation
            const email = document.getElementById('employeeEmail');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                email.closest('.form-group').classList.add('form-group--error');
                isValid = false;
            }

            return isValid;
        },

        saveEmployee: function() {
            if (!this.validateForm()) {
                Toast.warning('Validation Error', 'Please fill all required fields correctly');
                return;
            }

            const employeeData = {
                id: document.getElementById('employeeId').value || 'emp' + Date.now(),
                name: document.getElementById('employeeName').value.trim(),
                email: document.getElementById('employeeEmail').value.trim(),
                phone: document.getElementById('employeePhone').value.trim(),
                position: document.getElementById('employeePosition').value.trim(),
                department: document.getElementById('employeeDepartment').value,
                hireDate: document.getElementById('employeeHireDate').value,
                status: document.getElementById('employeeStatus').value,
                avatar: './assets/img/placeholders/avatar.svg'
            };

            if (this.currentEmployee) {
                // Update existing
                const index = this.employees.findIndex(emp => emp.id === this.currentEmployee.id);
                if (index !== -1) {
                    this.employees[index] = employeeData;
                }
                Toast.success('Success', 'Employee updated successfully');
            } else {
                // Add new
                this.employees.push(employeeData);
                Toast.success('Success', 'Employee added successfully');
            }

            this.filteredEmployees = [...this.employees];
            this.renderEmployees();
            this.employeeModal.close();
        },

        deleteEmployee:  function(id) {
            const employee = this.employees.find(emp => emp.id === id);
            if (!employee) return;

            const confirmed = confirm(`Are you sure you want to delete ${employee.name}?`);
            if (!confirmed) return;

            this.employees = this.employees.filter(emp => emp.id !== id);
            this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== id);

            this.renderEmployees();
            Toast.success('Deleted', `${employee.name} has been deleted`);
        },

        exportToCSV: function() {
            // CSV header
            const headers = ['Name', 'Email', 'Phone', 'Position', 'Department', 'Hire Date', 'Status'];

            // CSV rows
            const rows = this.filteredEmployees.map(emp => [
                emp.name,
                emp.email,
                emp.phone || '',
                emp.position,
                this.getDepartmentName(emp.department),
                emp.hireDate,
                emp.status
            ]);

            // Combine
            let csvContent = headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
            });

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Toast.success('Success', `Exported ${this.filteredEmployees.length} employees to CSV`);
        },

        getDepartmentName: function(slug) {
            const names = {
                engineering: 'Engineering',
                hr: 'Human Resources',
                marketing: 'Marketing',
                sales: 'Sales',
                finance: 'Finance',
                operations: 'Operations'
            };
            return names[slug] || slug;
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EmployeesPage.init());
    } else {
        EmployeesPage.init();
    }

})();