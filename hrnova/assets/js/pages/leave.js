import { DataTable } from '../ui/table.js';
import { getLeaveRequests, getEmployees } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess, showError } from '../ui/toast.js';

let leaveTable;
let leaveRequests = [];
let employees = [];
let currentLeaveRequest = null;

const leaveTypeColors = {
    annual: 'primary',
    sick: 'warning',
    personal: 'info',
    unpaid: 'error',
    other: 'secondary'
};

const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error'
};

function getStatusBadge(status) {
    const color = statusColors[status] || 'secondary';
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="badge badge-${color}">${label}</span>`;
}

function getLeaveTypeBadge(type) {
    const color = leaveTypeColors[type] || 'secondary';
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    return `<span class="badge badge-${color}">${label}</span>`;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

async function loadLeaveRequests() {
    leaveTable.setLoading(true);

    const [leaveResponse, employeeResponse] = await Promise.all([
        getLeaveRequests(),
        getEmployees()
    ]);

    if (!leaveResponse.success) {
        showError('Failed to load leave requests: ' + leaveResponse.error);
        leaveTable.setLoading(false);
        return;
    }

    if (employeeResponse.success) {
        employees = employeeResponse.data;
    }

    leaveRequests = leaveResponse.data.map(leave => {
        const employee = employees.find(e => e.id === leave.employeeId);
        return {
            ...leave,
            employeeName: leave.employeeName || (employee ? employee.fullName : 'Unknown'),
            days: leave.days || calculateDays(leave.startDate, leave.endDate),
            approverNote: leave.comments || leave.approverNote
        };
    });

    leaveTable.setData(leaveRequests);
    leaveTable.setLoading(false);

    updateStats(leaveRequests);
    renderCalendar(leaveRequests);
}

function updateStats(leaves) {
    const currentUser = employees[0];

    const annualLeaveUsed = leaves.filter(l =>
        l.employeeId === currentUser?.id &&
        l.leaveType === 'annual' &&
        l.status === 'approved'
    ).reduce((sum, l) => sum + l.days, 0);

    const sickLeaveUsed = leaves.filter(l =>
        l.employeeId === currentUser?.id &&
        l.leaveType === 'sick' &&
        l.status === 'approved'
    ).reduce((sum, l) => sum + l.days, 0);

    const pending = leaves.filter(l => l.status === 'pending').length;

    const currentMonth = new Date().getMonth();
    const approved = leaves.filter(l => {
        const approvedDate = new Date(l.approvedAt || l.startDate);
        return l.status === 'approved' && approvedDate.getMonth() === currentMonth;
    }).length;

    document.getElementById('balanceAnnual').textContent = Math.max(0, 20 - annualLeaveUsed);
    document.getElementById('balanceSick').textContent = Math.max(0, 10 - sickLeaveUsed);
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
}

function renderCalendar(leaves) {
    const calendar = document.getElementById('leaveCalendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const approvedLeaves = leaves.filter(l => l.status === 'approved');

    const hasLeaveOnDay = (day) => {
        const checkDate = new Date(year, month, day);
        return approvedLeaves.some(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            return checkDate >= start && checkDate <= end;
        });
    };

    let html = `
    <div style="text-align: center; margin-bottom: 16px; font-weight: 600; color: var(--color-text);">
      ${monthNames[month]} ${year}
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; font-size: 11px;">
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Su</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Mo</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Tu</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">We</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Th</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Fr</div>
      <div style="text-align: center; font-weight: 600; padding: 8px 0; color: var(--color-text-secondary);">Sa</div>
  `;

    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        const hasLeave = hasLeaveOnDay(day);

        let dayStyle = 'text-align: center; padding: 8px 4px; border-radius: 4px;';

        if (isToday) {
            dayStyle += ' background: var(--color-primary); color: white; font-weight: 600;';
        } else if (hasLeave) {
            dayStyle += ' background: var(--color-success-100); color: var(--color-success-700); font-weight: 600;';
        } else {
            dayStyle += ' color: var(--color-text);';
        }

        html += `<div style="${dayStyle}">${day}</div>`;
    }

    html += '</div>';

    html += `
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-border); font-size: 11px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <div style="width: 12px; height: 12px; background: var(--color-success-100); border-radius: 2px;"></div>
        <span style="color: var(--color-text-secondary);">Leave day</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 12px; height: 12px; background: var(--color-primary); border-radius: 2px;"></div>
        <span style="color: var(--color-text-secondary);">Today</span>
      </div>
    </div>
  `;

    calendar.innerHTML = html;
}

function initializeTable() {
    leaveTable = new DataTable('leaveTableContainer', {
        columns: [
            {
                key: 'employeeName',
                label: 'Employee',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.employeeName}</div>
          <div class="table-cell-secondary">${formatDate(row.startDate)} - ${formatDate(row.endDate)}</div>
        `
            },
            {
                key: 'leaveType',
                label: 'Type',
                sortable: true,
                render: (row) => getLeaveTypeBadge(row.leaveType)
            },
            {
                key: 'days',
                label: 'Days',
                sortable: true,
                render: (row) => `<span class="table-cell-primary">${row.days}</span>`
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row) => getStatusBadge(row.status)
            },
            {
                key: 'actions',
                label: 'Actions',
                sortable: false,
                render: (row) => {
                    if (row.status === 'pending') {
                        return `
              <div class="table-cell-actions">
                <button class="btn btn-secondary" onclick="window.approveLeave('${row.id}')">
                  Approve
                </button>
                <button class="btn btn-secondary" onclick="window.rejectLeave('${row.id}')">
                  Reject
                </button>
              </div>
            `;
                    }
                    return `<div class="table-cell-actions">
            <button class="btn btn-secondary" onclick="window.viewLeave('${row.id}')">View</button>
          </div>`;
                }
            }
        ],
        data: [],
        perPage: 10,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '🏖️',
            title: 'No leave requests',
            description: 'No leave requests found matching your filters.'
        },
        filters: [
            {
                key: 'leaveType',
                label: 'Type',
                options: [
                    { value: 'annual', label: 'Annual' },
                    { value: 'sick', label: 'Sick' },
                    { value: 'personal', label: 'Personal' },
                    { value: 'unpaid', label: 'Unpaid' },
                    { value: 'other', label: 'Other' }
                ]
            },
            {
                key: 'status',
                label: 'Status',
                options: [
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' }
                ]
            }
        ],
        actions: [
            {
                key: 'request',
                label: 'Request Leave',
                icon: '+',
                className: 'btn-primary',
                ariaLabel: 'Request new leave',
                onClick: () => showLeaveRequestModal()
            }
        ],
        onRowClick: (row) => viewLeaveDetails(row)
    });
}

function showLeaveRequestModal() {
    const employeeOptions = employees.map(emp =>
        `<option value="${emp.id}">${emp.fullName}</option>`
    ).join('');

    showModal({
        title: 'Request Leave',
        content: `
      <form class="form" id="leaveRequestForm">
        <div class="form-group">
          <label class="form-label">Employee <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="employeeId" required>
            <option value="">Select employee</option>
            ${employeeOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Leave Type <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="leaveType" required>
            <option value="">Select type</option>
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
            <option value="unpaid">Unpaid Leave</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Start Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="startDate" required>
        </div>

        <div class="form-group">
          <label class="form-label">End Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="endDate" required>
        </div>

        <div class="form-group">
          <label class="form-label">Reason <span style="color: var(--color-error);">*</span></label>
          <textarea class="form-control" name="reason" rows="4" required placeholder="Please provide a reason for your leave request..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Attachment <span style="color: var(--color-text-secondary);">(UI only)</span></label>
          <input type="file" class="form-control" name="attachment" disabled style="opacity: 0.6;">
          <small style="color: var(--color-text-secondary); font-size: 12px;">File upload UI placeholder</small>
        </div>
      </form>
    `,
        confirmText: 'Submit Request',
        onConfirm: () => {
            const form = document.getElementById('leaveRequestForm');
            if (form.checkValidity()) {
                showSuccess('Leave request submitted successfully!');
                setTimeout(() => loadLeaveRequests(), 500);
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
}

function viewLeaveDetails(leave) {
    const employee = employees.find(e => e.id === leave.employeeId);

    showModal({
        title: `Leave Request - ${leave.employeeName}`,
        content: `
      <div class="profile-section">
        <div class="profile-grid">
          <div class="profile-field">
            <span class="profile-field-label">Employee</span>
            <span class="profile-field-value">${leave.employeeName}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Leave Type</span>
            <span class="profile-field-value">${getLeaveTypeBadge(leave.leaveType)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Start Date</span>
            <span class="profile-field-value">${formatDate(leave.startDate)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">End Date</span>
            <span class="profile-field-value">${formatDate(leave.endDate)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Duration</span>
            <span class="profile-field-value">${leave.days} days</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Status</span>
            <span class="profile-field-value">${getStatusBadge(leave.status)}</span>
          </div>
          <div class="profile-field full-width">
            <span class="profile-field-label">Reason</span>
            <span class="profile-field-value">${leave.reason || '-'}</span>
          </div>
          ${leave.approverNote ? `
            <div class="profile-field full-width">
              <span class="profile-field-label">Approver Note</span>
              <span class="profile-field-value">${leave.approverNote}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `,
        showConfirm: false,
        cancelText: 'Close'
    });
}

window.viewLeave = (id) => {
    const leave = leaveRequests.find(l => l.id === id);
    if (leave) {
        viewLeaveDetails(leave);
    }
};

window.approveLeave = (id) => {
    const leave = leaveRequests.find(l => l.id === id);
    if (!leave) return;

    showModal({
        title: `Approve Leave Request - ${leave.employeeName}`,
        content: `
      <div style="margin-bottom: 16px;">
        <p><strong>Employee:</strong> ${leave.employeeName}</p>
        <p><strong>Type:</strong> ${leave.leaveType}</p>
        <p><strong>Duration:</strong> ${formatDate(leave.startDate)} - ${formatDate(leave.endDate)} (${leave.days} days)</p>
      </div>
      <form class="form" id="approveForm">
        <div class="form-group">
          <label class="form-label">Approval Note</label>
          <textarea class="form-control" name="note" rows="3" placeholder="Optional note for the employee..."></textarea>
        </div>
      </form>
    `,
        confirmText: 'Approve',
        onConfirm: () => {
            showSuccess(`Leave request approved for ${leave.employeeName}!`);
            setTimeout(() => loadLeaveRequests(), 500);
            return true;
        }
    });
};

window.rejectLeave = (id) => {
    const leave = leaveRequests.find(l => l.id === id);
    if (!leave) return;

    showModal({
        title: `Reject Leave Request - ${leave.employeeName}`,
        content: `
      <div style="margin-bottom: 16px;">
        <p><strong>Employee:</strong> ${leave.employeeName}</p>
        <p><strong>Type:</strong> ${leave.leaveType}</p>
        <p><strong>Duration:</strong> ${formatDate(leave.startDate)} - ${formatDate(leave.endDate)} (${leave.days} days)</p>
      </div>
      <form class="form" id="rejectForm">
        <div class="form-group">
          <label class="form-label">Reason for Rejection <span style="color: var(--color-error);">*</span></label>
          <textarea class="form-control" name="reason" rows="3" required placeholder="Please provide a reason for rejection..."></textarea>
        </div>
      </form>
    `,
        confirmText: 'Reject',
        confirmClass: 'btn-error',
        onConfirm: () => {
            const form = document.getElementById('rejectForm');
            if (form.checkValidity()) {
                showSuccess(`Leave request rejected for ${leave.employeeName}.`);
                setTimeout(() => loadLeaveRequests(), 500);
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
};

async function initialize() {
    initializeTable();
    await loadLeaveRequests();
}

initialize();
