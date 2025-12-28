import { DataTable } from '../ui/table.js';
import { getUsers } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess, showError } from '../ui/toast.js';

let usersTable;
let users = [];

function getStatusBadge(status) {
    const colors = {
        active: 'success',
        inactive: 'error',
        pending: 'warning'
    };
    const color = colors[status] || 'secondary';
    return `<span class="badge badge-${color}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

function getRoleBadge(role) {
    const colors = {
        admin: 'error',
        hr_manager: 'primary',
        manager: 'info',
        employee: 'secondary'
    };
    const labels = {
        admin: 'Admin',
        hr_manager: 'HR Manager',
        manager: 'Manager',
        employee: 'Employee'
    };
    const color = colors[role] || 'secondary';
    const label = labels[role] || role;
    return `<span class="badge badge-${color}">${label}</span>`;
}

async function loadUsers() {
    usersTable.setLoading(true);

    const response = await getUsers();

    if (!response.success) {
        showError('Failed to load users: ' + response.error);
        usersTable.setLoading(false);
        return;
    }

    users = response.data;
    usersTable.setData(users);
    usersTable.setLoading(false);

    updateStats(users);
    renderRoles();
}

function updateStats(usersList) {
    const total = usersList.length;
    const active = usersList.filter(u => u.status === 'active').length;
    const admins = usersList.filter(u => u.role === 'admin').length;
    const inactive = usersList.filter(u => u.status === 'inactive').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statAdmins').textContent = admins;
    document.getElementById('statInactive').textContent = inactive;
}

function renderRoles() {
    const panel = document.getElementById('rolesPanel');

    const roles = [
        {
            name: 'Administrator',
            key: 'admin',
            count: users.filter(u => u.role === 'admin').length,
            color: 'error',
            permissions: ['Full system access', 'User management', 'System settings']
        },
        {
            name: 'HR Manager',
            key: 'hr_manager',
            count: users.filter(u => u.role === 'hr_manager').length,
            color: 'primary',
            permissions: ['Employee management', 'Leave approval', 'Reports']
        },
        {
            name: 'Manager',
            key: 'manager',
            count: users.filter(u => u.role === 'manager').length,
            color: 'info',
            permissions: ['Team view', 'Leave approval', 'Time tracking']
        },
        {
            name: 'Employee',
            key: 'employee',
            count: users.filter(u => u.role === 'employee').length,
            color: 'secondary',
            permissions: ['Self service', 'Leave requests', 'View profile']
        }
    ];

    let html = '<div style="font-size: 13px;">';

    roles.forEach((role, index) => {
        html += `
      <div style="padding: 16px 0; ${index < roles.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 600; color: var(--color-text);">${role.name}</span>
          <span class="badge badge-${role.color}">${role.count}</span>
        </div>
        <div style="color: var(--color-text-secondary); font-size: 12px;">
          ${role.permissions.map(perm => `
            <div style="padding: 2px 0;">• ${perm}</div>
          `).join('')}
        </div>
        <button class="btn btn-secondary btn--sm" style="margin-top: 8px; width: 100%;" onclick="window.manageRolePermissions('${role.key}')">
          Manage Permissions
        </button>
      </div>
    `;
    });

    html += '</div>';

    panel.innerHTML = html;
}

function showInviteModal() {
    showModal({
        title: 'Invite User',
        content: `
      <form class="form" id="inviteUserForm">
        <div class="form-group">
          <label class="form-label">Email Address <span style="color: var(--color-error);">*</span></label>
          <input type="email" class="form-control" name="email" required placeholder="user@example.com">
        </div>

        <div class="form-group">
          <label class="form-label">Full Name <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="fullName" required placeholder="John Doe">
        </div>

        <div class="form-group">
          <label class="form-label">Role <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="role" required>
            <option value="">Select role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="hr_manager">HR Manager</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Department</label>
          <select class="form-control" name="department">
            <option value="">Select department</option>
            <option value="hr">Human Resources</option>
            <option value="it">IT</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" name="sendEmail" checked>
            <span style="font-size: 14px;">Send invitation email</span>
          </label>
        </div>

        <div style="padding: 12px; background: var(--color-info-50); border-radius: 8px; font-size: 13px; color: var(--color-text-secondary); margin-top: 16px;">
          💡 The user will receive an email with instructions to set their password.
        </div>
      </form>
    `,
        confirmText: 'Send Invitation',
        onConfirm: () => {
            const form = document.getElementById('inviteUserForm');
            if (form.checkValidity()) {
                showSuccess('Invitation sent successfully!');
                setTimeout(() => loadUsers(), 500);
                return true;
            } else {
                form.reportValidity();
                return false;
            }
        }
    });
}

function viewUserDetails(user) {
    showModal({
        title: `User Details - ${user.fullName}`,
        content: `
      <div class="profile-section">
        <div class="profile-grid">
          <div class="profile-field">
            <span class="profile-field-label">Full Name</span>
            <span class="profile-field-value">${user.fullName}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Email</span>
            <span class="profile-field-value">${user.email}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Username</span>
            <span class="profile-field-value">${user.username}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Role</span>
            <span class="profile-field-value">${getRoleBadge(user.role)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Status</span>
            <span class="profile-field-value">${getStatusBadge(user.status)}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Last Login</span>
            <span class="profile-field-value">${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 8px;">
          <button class="btn btn-primary" onclick="window.editUser('${user.id}')">Edit User</button>
          <button class="btn btn-secondary" onclick="window.resetPassword('${user.id}')">Reset Password</button>
          ${user.status === 'active'
            ? `<button class="btn btn-secondary" onclick="window.deactivateUser('${user.id}')">Deactivate</button>`
            : `<button class="btn btn-primary" onclick="window.activateUser('${user.id}')">Activate</button>`
        }
        </div>
      </div>
    `,
        showConfirm: false,
        cancelText: 'Close'
    });
}

window.manageRolePermissions = (roleKey) => {
    showModal({
        title: `Manage Permissions - ${roleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        content: `
      <div style="padding: 16px 0; font-size: 14px;">
        <div style="margin-bottom: 24px;">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: var(--color-text);">Core Permissions</h3>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer;">
            <input type="checkbox" checked disabled>
            <span>View dashboard</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer;">
            <input type="checkbox" ${roleKey !== 'employee' ? 'checked' : ''}>
            <span>Manage employees</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer;">
            <input type="checkbox" ${roleKey === 'admin' || roleKey === 'hr_manager' ? 'checked' : ''}>
            <span>Approve leave requests</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer;">
            <input type="checkbox" ${roleKey === 'admin' ? 'checked' : ''}>
            <span>Manage users</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 0; cursor: pointer;">
            <input type="checkbox" ${roleKey === 'admin' ? 'checked' : ''}>
            <span>System settings</span>
          </label>
        </div>

        <div style="padding: 12px; background: var(--color-warning-50); border-radius: 8px; font-size: 13px; color: var(--color-text-secondary);">
          ⚠️ Permission management is a UI placeholder. Changes are not persisted.
        </div>
      </div>
    `,
        confirmText: 'Save Permissions',
        onConfirm: () => {
            showSuccess('Permissions updated (UI only)');
            return true;
        }
    });
};

window.editUser = (userId) => {
    showSuccess('Edit user functionality (UI placeholder)');
};

window.resetPassword = (userId) => {
    showSuccess('Password reset link sent (UI placeholder)');
};

window.deactivateUser = (userId) => {
    showSuccess('User deactivated (UI placeholder)');
};

window.activateUser = (userId) => {
    showSuccess('User activated (UI placeholder)');
};

function initializeTable() {
    usersTable = new DataTable('usersTableContainer', {
        columns: [
            {
                key: 'fullName',
                label: 'User',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.fullName}</div>
          <div class="table-cell-secondary">${row.email}</div>
        `
            },
            {
                key: 'username',
                label: 'Username',
                sortable: true
            },
            {
                key: 'role',
                label: 'Role',
                sortable: true,
                render: (row) => getRoleBadge(row.role)
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row) => getStatusBadge(row.status)
            },
            {
                key: 'lastLogin',
                label: 'Last Login',
                sortable: true,
                render: (row) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'
            }
        ],
        data: [],
        perPage: 15,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '👥',
            title: 'No users',
            description: 'No users found.'
        },
        filters: [
            {
                key: 'role',
                label: 'Role',
                options: [
                    { value: 'admin', label: 'Administrator' },
                    { value: 'hr_manager', label: 'HR Manager' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'employee', label: 'Employee' }
                ]
            },
            {
                key: 'status',
                label: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'pending', label: 'Pending' }
                ]
            }
        ],
        actions: [
            {
                key: 'invite',
                label: 'Invite User',
                icon: '+',
                className: 'btn-primary',
                ariaLabel: 'Invite new user',
                onClick: () => showInviteModal()
            }
        ],
        onRowClick: (row) => viewUserDetails(row)
    });
}

async function initialize() {
    initializeTable();
    await loadUsers();
}

initialize();
