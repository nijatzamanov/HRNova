import { DataTable } from '../ui/table.js';
import { getMigrationCases, getEmployees } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess, showError } from '../ui/toast.js';

let migrationTable;
let cases = [];
let employees = [];

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function getExpiryBadge(daysUntil) {
    if (daysUntil < 0) {
        return `<span class="badge badge-error">Expired</span>`;
    }
    if (daysUntil <= 30) {
        return `<span class="badge badge-error">${daysUntil} days</span>`;
    }
    if (daysUntil <= 60) {
        return `<span class="badge badge-warning">${daysUntil} days</span>`;
    }
    if (daysUntil <= 90) {
        return `<span class="badge badge-info">${daysUntil} days</span>`;
    }
    return `<span class="badge badge-success">${daysUntil} days</span>`;
}

function getStatusBadge(status) {
    const colors = {
        active: 'success',
        pending: 'warning',
        expired: 'error',
        processing: 'info'
    };
    const color = colors[status] || 'secondary';
    return `<span class="badge badge-${color}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

function getRowClass(daysUntil) {
    if (daysUntil < 0) return 'table-row-error';
    if (daysUntil <= 30) return 'table-row-error';
    if (daysUntil <= 60) return 'table-row-warning';
    if (daysUntil <= 90) return 'table-row-info';
    return '';
}

async function loadMigrationCases() {
    migrationTable.setLoading(true);

    const [casesResponse, employeeResponse] = await Promise.all([
        getMigrationCases(),
        getEmployees()
    ]);

    if (!casesResponse.success) {
        showError('Failed to load migration cases: ' + casesResponse.error);
        migrationTable.setLoading(false);
        return;
    }

    if (employeeResponse.success) {
        employees = employeeResponse.data;
    }

    cases = casesResponse.data.map(caseItem => {
        const employee = employees.find(e => e.id === caseItem.employeeId);
        const daysUntil = getDaysUntilExpiry(caseItem.expiryDate);

        return {
            ...caseItem,
            employeeName: caseItem.employeeName || (employee ? employee.fullName : 'Unknown'),
            daysUntilExpiry: daysUntil,
            rowClass: getRowClass(daysUntil)
        };
    });

    migrationTable.setData(cases);
    migrationTable.setLoading(false);

    updateStats(cases);
}

function updateStats(casesList) {
    const expiringSoon = casesList.filter(c => c.daysUntilExpiry > 0 && c.daysUntilExpiry <= 30).length;
    const upcoming = casesList.filter(c => c.daysUntilExpiry > 30 && c.daysUntilExpiry <= 60).length;
    const active = casesList.filter(c => c.status === 'active' && c.daysUntilExpiry > 60).length;
    const expired = casesList.filter(c => c.daysUntilExpiry < 0).length;

    document.getElementById('statExpiringSoon').textContent = expiringSoon;
    document.getElementById('statUpcoming').textContent = upcoming;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statExpired').textContent = expired;
}

function showAddCaseModal() {
    const employeeOptions = employees.map(emp =>
        `<option value="${emp.id}">${emp.fullName}</option>`
    ).join('');

    showModal({
        title: 'Add Migration Case',
        content: `
      <form class="form" id="addCaseForm">
        <div class="form-group">
          <label class="form-label">Employee <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="employeeId" required>
            <option value="">Select employee</option>
            ${employeeOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Document Type <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="documentType" required>
            <option value="">Select type</option>
            <option value="work_permit">Work Permit</option>
            <option value="visa">Visa</option>
            <option value="residence_permit">Residence Permit</option>
            <option value="passport">Passport</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Document Number <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="documentNumber" required>
        </div>

        <div class="form-group">
          <label class="form-label">Issue Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="issueDate" required>
        </div>

        <div class="form-group">
          <label class="form-label">Expiry Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="expiryDate" required>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" name="status">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-control" name="notes" rows="3" placeholder="Additional notes..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Attach Document <span style="color: var(--color-text-secondary);">(UI only)</span></label>
          <input type="file" class="form-control" disabled style="opacity: 0.6;">
          <small style="color: var(--color-text-secondary); font-size: 12px;">File upload placeholder</small>
        </div>
      </form>
    `,
        confirmText: 'Add Case',
        onConfirm: () => {
            const form = document.getElementById('addCaseForm');
            if (form.checkValidity()) {
                showSuccess('Migration case added successfully!');
                setTimeout(() => loadMigrationCases(), 500);
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
}

function viewCaseDetails(caseItem) {
    const employee = employees.find(e => e.id === caseItem.employeeId);

    showModal({
        title: `Migration Case - ${caseItem.employeeName}`,
        content: `
      <div class="profile-section">
        <div class="profile-grid">
          <div class="profile-field">
            <span class="profile-field-label">Employee</span>
            <span class="profile-field-value">${caseItem.employeeName}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Document Type</span>
            <span class="profile-field-value">${caseItem.documentType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-'}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Document Number</span>
            <span class="profile-field-value">${caseItem.documentNumber || '-'}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Issue Date</span>
            <span class="profile-field-value">${formatDate(caseItem.issueDate)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Expiry Date</span>
            <span class="profile-field-value">${formatDate(caseItem.expiryDate)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Days Until Expiry</span>
            <span class="profile-field-value">${getExpiryBadge(caseItem.daysUntilExpiry)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Status</span>
            <span class="profile-field-value">${getStatusBadge(caseItem.status)}</span>
          </div>
          ${caseItem.notes ? `
            <div class="profile-field full-width">
              <span class="profile-field-label">Notes</span>
              <span class="profile-field-value">${caseItem.notes}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `,
        showConfirm: false,
        cancelText: 'Close'
    });
}

window.saveReminderSettings = () => {
    showSuccess('Reminder settings saved successfully!');
};

function initializeTable() {
    migrationTable = new DataTable('migrationTableContainer', {
        columns: [
            {
                key: 'employeeName',
                label: 'Employee',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.employeeName}</div>
          <div class="table-cell-secondary">${row.documentType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-'}</div>
        `
            },
            {
                key: 'documentNumber',
                label: 'Document #',
                sortable: true
            },
            {
                key: 'expiryDate',
                label: 'Expiry Date',
                sortable: true,
                render: (row) => formatDate(row.expiryDate)
            },
            {
                key: 'daysUntilExpiry',
                label: 'Time Left',
                sortable: true,
                render: (row) => getExpiryBadge(row.daysUntilExpiry)
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row) => getStatusBadge(row.status)
            }
        ],
        data: [],
        perPage: 15,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '📄',
            title: 'No migration cases',
            description: 'No migration cases found.'
        },
        filters: [
            {
                key: 'documentType',
                label: 'Document Type',
                options: [
                    { value: 'work_permit', label: 'Work Permit' },
                    { value: 'visa', label: 'Visa' },
                    { value: 'residence_permit', label: 'Residence Permit' },
                    { value: 'passport', label: 'Passport' },
                    { value: 'other', label: 'Other' }
                ]
            },
            {
                key: 'status',
                label: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'expired', label: 'Expired' },
                    { value: 'processing', label: 'Processing' }
                ]
            },
            {
                key: 'urgency',
                label: 'Urgency',
                options: [
                    { value: 'expired', label: 'Expired' },
                    { value: 'critical', label: 'Critical (30 days)' },
                    { value: 'warning', label: 'Warning (60 days)' },
                    { value: 'notice', label: 'Notice (90 days)' }
                ],
                filterFn: (row, value) => {
                    if (value === 'expired') return row.daysUntilExpiry < 0;
                    if (value === 'critical') return row.daysUntilExpiry > 0 && row.daysUntilExpiry <= 30;
                    if (value === 'warning') return row.daysUntilExpiry > 30 && row.daysUntilExpiry <= 60;
                    if (value === 'notice') return row.daysUntilExpiry > 60 && row.daysUntilExpiry <= 90;
                    return true;
                }
            }
        ],
        actions: [
            {
                key: 'add',
                label: 'Add Case',
                icon: '+',
                className: 'btn-primary',
                ariaLabel: 'Add migration case',
                onClick: () => showAddCaseModal()
            }
        ],
        onRowClick: (row) => viewCaseDetails(row),
        rowClassName: (row) => row.rowClass
    });
}

async function initialize() {
    initializeTable();
    await loadMigrationCases();
}

initialize();
