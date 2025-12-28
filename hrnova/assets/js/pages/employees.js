import { DataTable } from '../ui/table.js';
import { getEmployees, getDepartments, getBranches } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess, showError } from '../ui/toast.js';

let employeeTable;
let currentEmployee = null;
let departments = [];
let branches = [];

function getStatusBadge(status) {
    const statusMap = {
        active: { class: 'success', label: 'Active' },
        'on-leave': { class: 'warning', label: 'On Leave' },
        inactive: { class: 'error', label: 'Inactive' }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return `<span class="badge badge-${statusInfo.class}">${statusInfo.label}</span>`;
}

function getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirst(str) {
    if (!str) return '-';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadEmployees() {
    employeeTable.setLoading(true);

    const response = await getEmployees();

    if (!response.success) {
        showError('Failed to load employees: ' + response.error);
        employeeTable.setLoading(false);
        return;
    }

    employeeTable.setData(response.data);
    employeeTable.setLoading(false);

    updateStats(response.data);
}

function updateStats(employees) {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onLeave = employees.filter(e => e.status === 'on-leave').length;
    const inactive = employees.filter(e => e.status === 'inactive').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statOnLeave').textContent = onLeave;
    document.getElementById('statInactive').textContent = inactive;
}

async function loadDepartmentsAndBranches() {
    const [deptResponse, branchResponse] = await Promise.all([
        getDepartments(),
        getBranches()
    ]);

    if (deptResponse.success) {
        departments = deptResponse.data;
    }

    if (branchResponse.success) {
        branches = branchResponse.data;
    }
}

function initializeTable() {
    employeeTable = new DataTable('employeeTableContainer', {
        columns: [
            {
                key: 'fullName',
                label: 'Employee',
                sortable: true,
                render: (row) => `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: var(--color-primary);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 14px;
            ">${getInitials(row.fullName)}</div>
            <div>
              <div class="table-cell-primary">${row.fullName}</div>
              <div class="table-cell-secondary">${row.employeeId}</div>
            </div>
          </div>
        `
            },
            {
                key: 'position',
                label: 'Position',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.position}</div>
        `
            },
            {
                key: 'department',
                label: 'Department',
                sortable: true
            },
            {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (row) => `
          <a href="mailto:${row.email}" style="color: var(--color-primary); text-decoration: none;">
            ${row.email}
          </a>
        `
            },
            {
                key: 'joinDate',
                label: 'Join Date',
                sortable: true,
                render: (row) => formatDate(row.joinDate)
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row) => getStatusBadge(row.status)
            }
        ],
        data: [],
        perPage: 10,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '👥',
            title: 'No employees found',
            description: 'Try adjusting your filters or search query.'
        },
        filters: [
            {
                key: 'departmentId',
                label: 'Department',
                options: [],
                filterFn: (row, value) => row.departmentId === value
            },
            {
                key: 'branchId',
                label: 'Branch',
                options: [],
                filterFn: (row, value) => row.branchId === value
            },
            {
                key: 'status',
                label: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'on-leave', label: 'On Leave' },
                    { value: 'inactive', label: 'Inactive' }
                ]
            }
        ],
        actions: [
            {
                key: 'add',
                label: 'Add Employee',
                icon: '+',
                className: 'btn-primary',
                ariaLabel: 'Add new employee',
                onClick: () => showAddEmployeeModal()
            },
            {
                key: 'import',
                label: 'Import',
                icon: '↓',
                className: 'btn-secondary',
                ariaLabel: 'Import employees',
                onClick: () => showSuccess('Import functionality coming soon!')
            },
            {
                key: 'export',
                label: 'Export',
                icon: '↑',
                className: 'btn-secondary',
                ariaLabel: 'Export employees',
                onClick: () => showSuccess('Export functionality coming soon!')
            }
        ],
        onRowClick: (row) => showEmployeeDrawer(row)
    });
}

function updateTableFilters() {
    if (departments.length > 0) {
        employeeTable.options.filters[0].options = departments.map(dept => ({
            value: dept.id,
            label: dept.name
        }));
    }

    if (branches.length > 0) {
        employeeTable.options.filters[1].options = branches.map(branch => ({
            value: branch.id,
            label: branch.name
        }));
    }

    employeeTable.refresh();
}

function showEmployeeDrawer(employee) {
    currentEmployee = employee;

    document.getElementById('field-employeeId').textContent = employee.employeeId || '-';
    document.getElementById('field-fullName').textContent = employee.fullName || '-';
    document.getElementById('field-email').textContent = employee.email || '-';
    document.getElementById('field-phone').textContent = employee.phone || '-';
    document.getElementById('field-birthDate').textContent = formatDate(employee.birthDate);
    document.getElementById('field-gender').textContent = capitalizeFirst(employee.gender);
    document.getElementById('field-nationality').textContent = employee.nationality || '-';
    document.getElementById('field-passportNumber').textContent = employee.passportNumber || '-';
    document.getElementById('field-address').textContent = employee.address || '-';
    document.getElementById('field-emergencyContact').textContent = employee.emergencyContact || '-';

    document.getElementById('field-position').textContent = employee.position || '-';
    document.getElementById('field-department').textContent = employee.department || '-';
    document.getElementById('field-branch').textContent = employee.branch || '-';

    const manager = employee.managerId ? 'View Manager' : 'No Manager';
    document.getElementById('field-manager').textContent = manager;

    document.getElementById('field-joinDate').textContent = formatDate(employee.joinDate);
    document.getElementById('field-contractType').textContent = capitalizeFirst(employee.contractType);
    document.getElementById('field-workType').textContent = capitalizeFirst(employee.workType);
    document.getElementById('field-status').innerHTML = getStatusBadge(employee.status);

    const salaryText = employee.salary ? `${employee.salary.toLocaleString()}` : '-';
    document.getElementById('field-salary').textContent = salaryText;
    document.getElementById('field-currency').textContent = employee.currency || '-';

    document.getElementById('drawerTitle').textContent = employee.fullName;

    openDrawer();
}

function openDrawer() {
    const drawer = document.getElementById('employeeDrawer');
    const overlay = document.getElementById('employeeDrawerOverlay');

    drawer.classList.add('open');
    overlay.classList.add('open');

    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    const drawer = document.getElementById('employeeDrawer');
    const overlay = document.getElementById('employeeDrawerOverlay');

    drawer.classList.remove('open');
    overlay.classList.remove('open');

    document.body.style.overflow = '';

    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.click();
    }
}

function initializeDrawer() {
    const closeBtn = document.getElementById('closeDrawer');
    const closeBtnFooter = document.getElementById('closeDrawerBtn');
    const overlay = document.getElementById('employeeDrawerOverlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    if (closeBtnFooter) {
        closeBtnFooter.addEventListener('click', closeDrawer);
    }

    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('employeeDrawer');
            if (drawer && drawer.classList.contains('open')) {
                closeDrawer();
            }
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    const editBtn = document.getElementById('editEmployeeBtn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (currentEmployee) {
                showEditEmployeeModal(currentEmployee);
            }
        });
    }
}

function showAddEmployeeModal() {
    const departmentOptions = departments.map(dept =>
        `<option value="${dept.id}">${dept.name}</option>`
    ).join('');

    const branchOptions = branches.map(branch =>
        `<option value="${branch.id}">${branch.name}</option>`
    ).join('');

    showModal({
        title: 'Add New Employee',
        content: `
      <form class="form" id="addEmployeeForm">
        <div class="form-group">
          <label class="form-label">First Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="firstName" required placeholder="Enter first name">
        </div>

        <div class="form-group">
          <label class="form-label">Last Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="lastName" required placeholder="Enter last name">
        </div>

        <div class="form-group">
          <label class="form-label">Email <span style="color: var(--color-error);">*</span></label>
          <input type="email" class="form-control" name="email" required placeholder="employee@hrnova.az">
        </div>

        <div class="form-group">
          <label class="form-label">Phone <span style="color: var(--color-error);">*</span></label>
          <input type="tel" class="form-control" name="phone" required placeholder="+994505551234">
        </div>

        <div class="form-group">
          <label class="form-label">Position <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="position" required placeholder="Job title">
        </div>

        <div class="form-group">
          <label class="form-label">Department <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="departmentId" required>
            <option value="">Select department</option>
            ${departmentOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Branch <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="branchId" required>
            <option value="">Select branch</option>
            ${branchOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Join Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="joinDate" required>
        </div>
      </form>
    `,
        confirmText: 'Add Employee',
        onConfirm: () => {
            const form = document.getElementById('addEmployeeForm');
            if (form.checkValidity()) {
                showSuccess('Employee added successfully!');
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
}

function showEditEmployeeModal(employee) {
    const departmentOptions = departments.map(dept =>
        `<option value="${dept.id}" ${dept.id === employee.departmentId ? 'selected' : ''}>${dept.name}</option>`
    ).join('');

    const branchOptions = branches.map(branch =>
        `<option value="${branch.id}" ${branch.id === employee.branchId ? 'selected' : ''}>${branch.name}</option>`
    ).join('');

    showModal({
        title: `Edit Employee: ${employee.fullName}`,
        content: `
      <form class="form" id="editEmployeeForm">
        <div class="form-group">
          <label class="form-label">First Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="firstName" value="${employee.firstName}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Last Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="lastName" value="${employee.lastName}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Email <span style="color: var(--color-error);">*</span></label>
          <input type="email" class="form-control" name="email" value="${employee.email}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Phone <span style="color: var(--color-error);">*</span></label>
          <input type="tel" class="form-control" name="phone" value="${employee.phone}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Position <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="position" value="${employee.position}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Department <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="departmentId" required>
            <option value="">Select department</option>
            ${departmentOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Branch <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="branchId" required>
            <option value="">Select branch</option>
            ${branchOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Status <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="status" required>
            <option value="active" ${employee.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="on-leave" ${employee.status === 'on-leave' ? 'selected' : ''}>On Leave</option>
            <option value="inactive" ${employee.status === 'inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </form>
    `,
        confirmText: 'Save Changes',
        onConfirm: () => {
            const form = document.getElementById('editEmployeeForm');
            if (form.checkValidity()) {
                showSuccess('Employee updated successfully!');
                closeDrawer();
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
}

async function initialize() {
    initializeTable();
    initializeDrawer();

    await loadDepartmentsAndBranches();
    updateTableFilters();

    await loadEmployees();
}

initialize();
