import { getDepartments, getBranches } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess } from '../ui/toast.js';

let departments = [];
let branches = [];

async function loadData() {
    const [deptResponse, branchResponse] = await Promise.all([
        getDepartments(),
        getBranches()
    ]);

    if (deptResponse.success) {
        departments = deptResponse.data;
        renderDepartments();
    }

    if (branchResponse.success) {
        branches = branchResponse.data;
        renderBranches();
    }

    renderSchedules();
    renderHolidays();
}

function renderDepartments() {
    const container = document.getElementById('departmentsContainer');

    if (departments.length === 0) {
        container.innerHTML = `
      <div class="table-empty" style="padding: 32px 16px;">
        <div class="table-empty-icon">🏢</div>
        <div class="table-empty-title">No departments</div>
      </div>
    `;
        return;
    }

    let html = '<div style="font-size: 14px;">';

    departments.forEach((dept, index) => {
        html += `
      <div style="padding: 12px 0; ${index < departments.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
              ${dept.name}
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
              ${dept.description || 'No description'}
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn--sm" onclick="window.editDepartment('${dept.id}')">Edit</button>
            <button class="btn btn-secondary btn--sm" onclick="window.deleteDepartment('${dept.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderBranches() {
    const container = document.getElementById('branchesContainer');

    if (branches.length === 0) {
        container.innerHTML = `
      <div class="table-empty" style="padding: 32px 16px;">
        <div class="table-empty-icon">📍</div>
        <div class="table-empty-title">No branches</div>
      </div>
    `;
        return;
    }

    let html = '<div style="font-size: 14px;">';

    branches.forEach((branch, index) => {
        html += `
      <div style="padding: 12px 0; ${index < branches.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
              ${branch.name}
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
              ${branch.address || branch.location || 'No location'}
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn--sm" onclick="window.editBranch('${branch.id}')">Edit</button>
            <button class="btn btn-secondary btn--sm" onclick="window.deleteBranch('${branch.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderSchedules() {
    const container = document.getElementById('schedulesContainer');

    const schedules = [
        { name: 'Standard Schedule', days: 'Mon-Fri', hours: '09:00 - 18:00' },
        { name: 'Flexible Schedule', days: 'Mon-Fri', hours: '10:00 - 19:00' },
        { name: 'Shift A', days: 'Mon-Sun', hours: '08:00 - 16:00' }
    ];

    let html = '<div style="font-size: 14px;">';

    schedules.forEach((schedule, index) => {
        html += `
      <div style="padding: 12px 0; ${index < schedules.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
              ${schedule.name}
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
              ${schedule.days} • ${schedule.hours}
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn--sm" onclick="window.editSchedule('${schedule.name}')">Edit</button>
          </div>
        </div>
      </div>
    `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderHolidays() {
    const container = document.getElementById('holidaysContainer');

    const holidays = [
        { name: 'New Year', date: '2025-01-01' },
        { name: 'Independence Day', date: '2025-05-28' },
        { name: 'Victory Day', date: '2025-11-08' }
    ];

    let html = '<div style="font-size: 14px;">';

    holidays.forEach((holiday, index) => {
        html += `
      <div style="padding: 12px 0; ${index < holidays.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--color-text); margin-bottom: 4px;">
              ${holiday.name}
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);">
              ${new Date(holiday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn--sm" onclick="window.deleteHoliday('${holiday.name}')">Delete</button>
          </div>
        </div>
      </div>
    `;
    });

    html += '</div>';
    container.innerHTML = html;
}

window.showAddDepartmentModal = () => {
    showModal({
        title: 'Add Department',
        content: `
      <form class="form" id="addDeptForm">
        <div class="form-group">
          <label class="form-label">Department Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" name="description" rows="3"></textarea>
        </div>
      </form>
    `,
        confirmText: 'Add Department',
        onConfirm: () => {
            const form = document.getElementById('addDeptForm');
            if (form.checkValidity()) {
                showSuccess('Department added (UI only)');
                return true;
            }
            form.reportValidity();
            return false;
        }
    });
};

window.showAddBranchModal = () => {
    showModal({
        title: 'Add Branch',
        content: `
      <form class="form" id="addBranchForm">
        <div class="form-group">
          <label class="form-label">Branch Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control" name="location">
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <textarea class="form-control" name="address" rows="2"></textarea>
        </div>
      </form>
    `,
        confirmText: 'Add Branch',
        onConfirm: () => {
            const form = document.getElementById('addBranchForm');
            if (form.checkValidity()) {
                showSuccess('Branch added (UI only)');
                return true;
            }
            form.reportValidity();
            return false;
        }
    });
};

window.showAddScheduleModal = () => {
    showModal({
        title: 'Add Work Schedule',
        content: `
      <form class="form" id="addScheduleForm">
        <div class="form-group">
          <label class="form-label">Schedule Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Work Days</label>
          <select class="form-control" name="days">
            <option value="mon-fri">Monday - Friday</option>
            <option value="mon-sat">Monday - Saturday</option>
            <option value="mon-sun">Monday - Sunday</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Start Time</label>
          <input type="time" class="form-control" name="startTime" value="09:00">
        </div>
        <div class="form-group">
          <label class="form-label">End Time</label>
          <input type="time" class="form-control" name="endTime" value="18:00">
        </div>
      </form>
    `,
        confirmText: 'Add Schedule',
        onConfirm: () => {
            showSuccess('Schedule added (UI only)');
            return true;
        }
    });
};

window.showAddHolidayModal = () => {
    showModal({
        title: 'Add Holiday',
        content: `
      <form class="form" id="addHolidayForm">
        <div class="form-group">
          <label class="form-label">Holiday Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">Date <span style="color: var(--color-error);">*</span></label>
          <input type="date" class="form-control" name="date" required>
        </div>
        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" checked>
            <span style="font-size: 14px;">Recurring annually</span>
          </label>
        </div>
      </form>
    `,
        confirmText: 'Add Holiday',
        onConfirm: () => {
            const form = document.getElementById('addHolidayForm');
            if (form.checkValidity()) {
                showSuccess('Holiday added (UI only)');
                return true;
            }
            form.reportValidity();
            return false;
        }
    });
};

window.editDepartment = (id) => showSuccess('Edit department (UI only)');
window.deleteDepartment = (id) => showSuccess('Delete department (UI only)');
window.editBranch = (id) => showSuccess('Edit branch (UI only)');
window.deleteBranch = (id) => showSuccess('Delete branch (UI only)');
window.editSchedule = (name) => showSuccess('Edit schedule (UI only)');
window.deleteHoliday = (name) => showSuccess('Delete holiday (UI only)');

loadData();
