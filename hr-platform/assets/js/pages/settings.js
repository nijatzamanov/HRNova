// settings.js - Settings page
(function() {
    'use strict';

    const SettingsPage = {
        departments: [],
        leaveTypes: [],
        departmentModal: null,
        leaveTypeModal: null,

        init: async function() {
            this.setupSidebar();
            this.departmentModal = Modal.get('departmentModal');
            this.leaveTypeModal = Modal.get('leaveTypeModal');
            this.setupEventListeners();
            await this.loadData();
            this.renderDepartments();
            this.renderLeaveTypes();
        },

        setupSidebar: function() {
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('dashboard-layout__sidebar--open');
                    overlay.classList.toggle('sidebar-overlay--open');
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('dashboard-layout__sidebar--open');
                    overlay.classList.remove('sidebar-overlay--open');
                });
            }
        },

        setupEventListeners:  function() {
            // Company form
            const companyForm = document.getElementById('companyForm');
            if (companyForm) {
                companyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveCompanyInfo();
                });
            }

            // Department buttons
            const addDeptBtn = document.getElementById('addDepartmentBtn');
            const cancelDeptBtn = document.getElementById('cancelDeptBtn');
            const saveDeptBtn = document.getElementById('saveDeptBtn');

            if (addDeptBtn) {
                addDeptBtn.addEventListener('click', () => this.openDepartmentModal());
            }

            if (cancelDeptBtn) {
                cancelDeptBtn.addEventListener('click', () => this.departmentModal.close());
            }

            if (saveDeptBtn) {
                saveDeptBtn.addEventListener('click', () => this.saveDepartment());
            }

            // Department form submission
            const deptForm = document.getElementById('departmentForm');
            if (deptForm) {
                deptForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveDepartment();
                });
            }

            // Leave type buttons
            const addLeaveTypeBtn = document.getElementById('addLeaveTypeBtn');
            const cancelLeaveTypeBtn = document.getElementById('cancelLeaveTypeBtn');
            const saveLeaveTypeBtn = document.getElementById('saveLeaveTypeBtn');

            if (addLeaveTypeBtn) {
                addLeaveTypeBtn.addEventListener('click', () => this.openLeaveTypeModal());
            }

            if (cancelLeaveTypeBtn) {
                cancelLeaveTypeBtn.addEventListener('click', () => this.leaveTypeModal.close());
            }

            if (saveLeaveTypeBtn) {
                saveLeaveTypeBtn.addEventListener('click', () => this.saveLeaveType());
            }

            // Leave type form submission
            const leaveTypeForm = document.getElementById('leaveTypeForm');
            if (leaveTypeForm) {
                leaveTypeForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveLeaveType();
                });
            }
        },

        loadData: async function() {
            try {
                // Load departments from mock data
                this.departments = await API.departments.getAll();

                // Mock leave types (not in separate JSON file)
                this.leaveTypes = [
                    { id:  'lt001', name: 'Vacation', quota: 20 },
                    { id: 'lt002', name: 'Sick Leave', quota: 10 },
                    { id: 'lt003', name: 'Personal Leave', quota: 5 }
                ];
            } catch (error) {
                console.error('Failed to load settings data:', error);
                Toast.error('Error', 'Failed to load settings data');
            }
        },

        saveCompanyInfo: function() {
            const name = document.getElementById('companyName').value.trim();
            const timezone = document.getElementById('companyTimezone').value;

            if (!name) {
                Toast.warning('Validation Error', 'Company name is required');
                return;
            }

            // In real app, save to backend
            console.log('Saving company info:', { name, timezone });

            Toast.success('Success', 'Company information updated successfully');
        },

        // ========== DEPARTMENTS ==========

        renderDepartments: function() {
            const tbody = document.getElementById('departmentsTableBody');
            if (!tbody) return;

            if (this.departments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="table__empty">No departments found</td></tr>';
                return;
            }

            tbody.innerHTML = this.departments.map(dept => `
        <tr>
          <td>${dept.name}</td>
          <td>${dept.employeeCount}</td>
          <td>
            <div class="table__actions">
              <button 
                class="btn btn--sm btn--ghost btn--icon" 
                data-action="deleteDept" 
                data-id="${dept.id}" 
                aria-label="Delete department"
                title="Delete department"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

            // Attach event listeners
            tbody.querySelectorAll('[data-action="deleteDept"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.deleteDepartment(id);
                });
            });
        },

        openDepartmentModal: function() {
            const form = document.getElementById('departmentForm');
            if (form) form.reset();

            // Clear any previous errors
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('form-group--error');
            });

            this.departmentModal.open();
        },

        validateDepartmentForm: function() {
            const name = document.getElementById('deptName');
            const formGroup = name.closest('.form-group');

            if (!name.value.trim()) {
                formGroup.classList.add('form-group--error');
                return false;
            }

            formGroup.classList.remove('form-group--error');
            return true;
        },

        saveDepartment: function() {
            if (!this.validateDepartmentForm()) {
                Toast.warning('Validation Error', 'Please enter department name');
                return;
            }

            const name = document.getElementById('deptName').value.trim();

            // Check for duplicate names
            const duplicate = this.departments.find(d =>
                d.name.toLowerCase() === name.toLowerCase()
            );

            if (duplicate) {
                Toast.warning('Duplicate', 'A department with this name already exists');
                return;
            }

            const newDept = {
                id: 'dept' + Date.now(),
                name: name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                head: null,
                employeeCount: 0
            };

            this.departments.push(newDept);
            this.renderDepartments();
            this.departmentModal.close();

            Toast.success('Success', `Department "${name}" added successfully`);
        },

        deleteDepartment: function(id) {
            const dept = this.departments.find(d => d.id === id);
            if (!dept) return;

            // Check if department has employees
            if (dept.employeeCount > 0) {
                Toast.error('Cannot Delete', `Cannot delete "${dept.name}" - it has ${dept.employeeCount} employee(s) assigned`);
                return;
            }

            const confirmed = confirm(`Are you sure you want to delete the department "${dept.name}"?`);
            if (!confirmed) return;

            this.departments = this.departments.filter(d => d.id !== id);
            this.renderDepartments();

            Toast.success('Deleted', `Department "${dept.name}" deleted successfully`);
        },

        // ========== LEAVE TYPES ==========

        renderLeaveTypes: function() {
            const tbody = document.getElementById('leaveTypesTableBody');
            if (!tbody) return;

            if (this.leaveTypes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="table__empty">No leave types found</td></tr>';
                return;
            }

            tbody.innerHTML = this.leaveTypes.map(type => `
        <tr>
          <td>${type.name}</td>
          <td>${type.quota}</td>
          <td>
            <div class="table__actions">
              <button 
                class="btn btn--sm btn--ghost btn--icon" 
                data-action="deleteLeaveType" 
                data-id="${type.id}" 
                aria-label="Delete leave type"
                title="Delete leave type"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

            // Attach event listeners
            tbody.querySelectorAll('[data-action="deleteLeaveType"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.deleteLeaveType(id);
                });
            });
        },

        openLeaveTypeModal: function() {
            const form = document.getElementById('leaveTypeForm');
            if (form) form.reset();

            // Clear any previous errors
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('form-group--error');
            });

            this.leaveTypeModal.open();
        },

        validateLeaveTypeForm: function() {
            const nameInput = document.getElementById('leaveTypeName');
            const quotaInput = document.getElementById('leaveTypeQuota');

            const nameGroup = nameInput.closest('.form-group');
            const quotaGroup = quotaInput.closest('.form-group');

            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                nameGroup.classList.add('form-group--error');
                isValid = false;
            } else {
                nameGroup.classList.remove('form-group--error');
            }

            // Validate quota
            const quota = parseInt(quotaInput.value);
            if (!quota || quota < 1) {
                quotaGroup.classList.add('form-group--error');
                isValid = false;
            } else {
                quotaGroup.classList.remove('form-group--error');
            }

            return isValid;
        },

        saveLeaveType: function() {
            if (!this.validateLeaveTypeForm()) {
                Toast.warning('Validation Error', 'Please fill all fields correctly');
                return;
            }

            const name = document.getElementById('leaveTypeName').value.trim();
            const quota = parseInt(document.getElementById('leaveTypeQuota').value);

            // Check for duplicate names
            const duplicate = this.leaveTypes.find(t =>
                t.name.toLowerCase() === name.toLowerCase()
            );

            if (duplicate) {
                Toast.warning('Duplicate', 'A leave type with this name already exists');
                return;
            }

            const newType = {
                id: 'lt' + Date.now(),
                name: name,
                quota: quota
            };

            this.leaveTypes.push(newType);
            this.renderLeaveTypes();
            this.leaveTypeModal.close();

            Toast.success('Success', `Leave type "${name}" added successfully`);
        },

        deleteLeaveType: function(id) {
            const type = this.leaveTypes.find(t => t.id === id);
            if (!type) return;

            const confirmed = confirm(`Are you sure you want to delete the leave type "${type.name}"?\n\nThis will affect all employees' leave balances.`);
            if (!confirmed) return;

            this.leaveTypes = this.leaveTypes.filter(t => t.id !== id);
            this.renderLeaveTypes();

            Toast.success('Deleted', `Leave type "${type.name}" deleted successfully`);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SettingsPage.init());
    } else {
        SettingsPage.init();
    }

})();