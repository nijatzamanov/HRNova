import { DataTable } from '../ui/table.js';
import { getAttendance, getEmployees, getDepartments, getBranches } from '../services/dataService.js';
import { showError } from '../ui/toast.js';

let attendanceTable;
let attendanceRecords = [];
let employees = [];
let departments = [];
let branches = [];

function formatTime(timeString) {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calculateWorkHours(clockIn, clockOut) {
    if (!clockIn || !clockOut) return 0;

    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diff = (end - start) / (1000 * 60 * 60);

    return Math.max(0, diff);
}

function extractTime(timestamp) {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toTimeString().split(' ')[0];
}

function getStatusBadge(record) {
    if (record.status === 'absent' || record.absent) {
        return '<span class="badge badge-error">Absent</span>';
    }
    if (record.status === 'late' || (record.lateMinutes && record.lateMinutes > 0)) {
        const minutes = record.lateMinutes || 0;
        return `<span class="badge badge-warning">Late${minutes > 0 ? ' ' + minutes + 'm' : ''}</span>`;
    }
    if (record.status === 'present' || (record.checkIn && record.checkOut)) {
        return '<span class="badge badge-success">Present</span>';
    }
    if (record.checkIn && !record.checkOut) {
        return '<span class="badge badge-info">Clocked In</span>';
    }
    return '<span class="badge badge-secondary">-</span>';
}

async function loadAttendanceData() {
    attendanceTable.setLoading(true);

    const [attendanceResponse, employeeResponse, deptResponse, branchResponse] = await Promise.all([
        getAttendance(),
        getEmployees(),
        getDepartments(),
        getBranches()
    ]);

    if (!attendanceResponse.success) {
        showError('Failed to load attendance data: ' + attendanceResponse.error);
        attendanceTable.setLoading(false);
        return;
    }

    if (employeeResponse.success) employees = employeeResponse.data;
    if (deptResponse.success) departments = deptResponse.data;
    if (branchResponse.success) branches = branchResponse.data;

    attendanceRecords = attendanceResponse.data.map(record => {
        const employee = employees.find(e => e.id === record.employeeId);
        const department = departments.find(d => d.id === employee?.departmentId);
        const branch = branches.find(b => b.id === employee?.branchId);

        const clockIn = record.clockIn || record.checkIn;
        const clockOut = record.clockOut || record.checkOut;
        const workHours = record.workHours || calculateWorkHours(clockIn, clockOut);

        const absent = record.status === 'absent' || record.absent === true;
        const lateMinutes = record.lateMinutes || (record.status === 'late' ? 15 : 0);

        return {
            ...record,
            clockIn: extractTime(clockIn),
            clockOut: extractTime(clockOut),
            checkIn: clockIn,
            checkOut: clockOut,
            employeeName: record.employeeName || (employee ? employee.fullName : 'Unknown'),
            departmentName: record.department || (department ? department.name : '-'),
            branchName: record.location || (branch ? branch.name : '-'),
            departmentId: employee?.departmentId,
            branchId: employee?.branchId,
            workHours: workHours,
            absent: absent,
            lateMinutes: lateMinutes
        };
    });

    attendanceTable.setData(attendanceRecords);
    attendanceTable.setLoading(false);

    updateStats(attendanceRecords);
    renderAnomalies(attendanceRecords);
    renderShiftSchedule();
    updateTableFilters();
}

function updateStats(records) {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);

    const present = todayRecords.filter(r => (r.status === 'present' || (!r.absent && r.checkIn))).length;
    const late = todayRecords.filter(r => (r.status === 'late' || r.lateMinutes > 0)).length;
    const absent = todayRecords.filter(r => (r.status === 'absent' || r.absent)).length;

    const totalHours = records
        .filter(r => r.workHours > 0)
        .reduce((sum, r) => sum + r.workHours, 0);
    const avgHours = records.length > 0 ? (totalHours / records.length).toFixed(1) : 0;

    document.getElementById('statPresent').textContent = present;
    document.getElementById('statLate').textContent = late;
    document.getElementById('statAbsent').textContent = absent;
    document.getElementById('statAvgHours').textContent = `${avgHours}h`;
}

function renderAnomalies(records) {
    const panel = document.getElementById('anomaliesPanel');

    const missingClockOut = records.filter(r => r.checkIn && !r.checkOut && !r.absent && r.status !== 'absent');
    const lateArrivals = records.filter(r => (r.status === 'late' || r.lateMinutes > 30));
    const absentToday = records.filter(r => (r.status === 'absent' || r.absent) && r.date === new Date().toISOString().split('T')[0]);

    const anomalies = [
        {
            title: 'Missing Clock-Out',
            count: missingClockOut.length,
            color: 'warning',
            items: missingClockOut.slice(0, 3)
        },
        {
            title: 'Very Late (>30m)',
            count: lateArrivals.length,
            color: 'error',
            items: lateArrivals.slice(0, 3)
        },
        {
            title: 'Absent Today',
            count: absentToday.length,
            color: 'error',
            items: absentToday.slice(0, 3)
        }
    ];

    let html = '';

    if (anomalies.every(a => a.count === 0)) {
        html = `
      <div class="table-empty" style="padding: 32px 16px;">
        <div class="table-empty-icon" style="font-size: 32px;">✅</div>
        <div class="table-empty-title" style="font-size: 14px;">All Clear</div>
        <div class="table-empty-description">No anomalies detected</div>
      </div>
    `;
    } else {
        anomalies.forEach(anomaly => {
            if (anomaly.count > 0) {
                html += `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 600; font-size: 13px; color: var(--color-text);">${anomaly.title}</span>
              <span class="badge badge-${anomaly.color}">${anomaly.count}</span>
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
              ${anomaly.items.map(item => `
                <div style="padding: 4px 0; border-bottom: 1px solid var(--color-border);">
                  ${item.employeeName}
                  <span style="opacity: 0.7;">• ${formatDate(item.date)}</span>
                </div>
              `).join('')}
              ${anomaly.count > 3 ? `<div style="padding: 4px 0; font-style: italic;">+${anomaly.count - 3} more</div>` : ''}
            </div>
          </div>
        `;
            }
        });
    }

    panel.innerHTML = html;
}

function renderShiftSchedule() {
    const schedule = document.getElementById('shiftSchedule');

    const shifts = [
        { name: 'Morning', time: '09:00 - 18:00', dept: 'All Departments' },
        { name: 'Evening', time: '14:00 - 23:00', dept: 'Support' },
        { name: 'Night', time: '23:00 - 08:00', dept: 'Operations' }
    ];

    let html = '<div style="font-size: 13px;">';

    shifts.forEach((shift, index) => {
        html += `
      <div style="padding: 12px 0; ${index < shifts.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
          ${shift.name} Shift
        </div>
        <div style="color: var(--color-text-secondary); font-size: 12px; margin-bottom: 2px;">
          ⏰ ${shift.time}
        </div>
        <div style="color: var(--color-text-secondary); font-size: 12px;">
          🏢 ${shift.dept}
        </div>
      </div>
    `;
    });

    html += '</div>';

    schedule.innerHTML = html;
}

function initializeTable() {
    attendanceTable = new DataTable('attendanceTableContainer', {
        columns: [
            {
                key: 'employeeName',
                label: 'Employee',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.employeeName}</div>
          <div class="table-cell-secondary">${row.departmentName}</div>
        `
            },
            {
                key: 'date',
                label: 'Date',
                sortable: true,
                render: (row) => formatDate(row.date)
            },
            {
                key: 'clockIn',
                label: 'Clock In',
                sortable: true,
                render: (row) => formatTime(row.checkIn)
            },
            {
                key: 'clockOut',
                label: 'Clock Out',
                sortable: true,
                render: (row) => formatTime(row.checkOut)
            },
            {
                key: 'workHours',
                label: 'Hours',
                sortable: true,
                render: (row) => {
                    if (row.workHours > 0) {
                        return `<span class="table-cell-primary">${row.workHours.toFixed(1)}h</span>`;
                    }
                    return '-';
                }
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row) => getStatusBadge(row)
            }
        ],
        data: [],
        perPage: 15,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '📋',
            title: 'No attendance records',
            description: 'No attendance records found matching your filters.'
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
                key: 'statusFilter',
                label: 'Status',
                options: [
                    { value: 'present', label: 'Present' },
                    { value: 'late', label: 'Late' },
                    { value: 'absent', label: 'Absent' },
                    { value: 'missing-clockout', label: 'Missing Clock-Out' }
                ],
                filterFn: (row, value) => {
                    if (value === 'present') return row.status === 'present' || (!row.absent && row.checkIn && row.checkOut);
                    if (value === 'late') return row.status === 'late' || row.lateMinutes > 0;
                    if (value === 'absent') return row.status === 'absent' || row.absent;
                    if (value === 'missing-clockout') return row.checkIn && !row.checkOut && !row.absent && row.status !== 'absent';
                    return true;
                }
            }
        ],
        actions: [
            {
                key: 'export',
                label: 'Export',
                icon: '↓',
                className: 'btn-secondary',
                ariaLabel: 'Export attendance data',
                onClick: () => {
                    showError('Export functionality coming soon!');
                }
            }
        ]
    });
}

function updateTableFilters() {
    if (departments.length > 0) {
        attendanceTable.options.filters[0].options = departments.map(dept => ({
            value: dept.id,
            label: dept.name
        }));
    }

    if (branches.length > 0) {
        attendanceTable.options.filters[1].options = branches.map(branch => ({
            value: branch.id,
            label: branch.name
        }));
    }

    attendanceTable.refresh();
}

async function initialize() {
    initializeTable();
    await loadAttendanceData();
}

initialize();
