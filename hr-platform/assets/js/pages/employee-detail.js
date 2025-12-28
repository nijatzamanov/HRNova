// employee-detail.js - Employee detail page
(function() {
    'use strict';

    const EmployeeDetailPage = {
        employeeId: null,
        employee: null,

        init:  async function() {
            this.setupSidebar();
            this.getEmployeeIdFromURL();

            if (!this.employeeId) {
                Toast.error('Error', 'Employee ID not found');
                setTimeout(() => {
                    window.location.href = '../../../employees.php';
                }, 2000);
                return;
            }

            await this.loadEmployee();
            this.renderEmployee();
            await this.loadLeaveHistory();
            await this.loadEmployeeDocuments();
        },

        setupSidebar:  function() {
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

        getEmployeeIdFromURL: function() {
            // Get employee ID from URL query string:  ?id=emp001
            const urlParams = new URLSearchParams(window.location.search);
            this.employeeId = urlParams.get('id');
        },

        loadEmployee:  async function() {
            try {
                this.employee = await API.employees.getById(this.employeeId);

                if (!this.employee) {
                    throw new Error('Employee not found');
                }
            } catch (error) {
                console.error('Failed to load employee:', error);
                Toast.error('Error', 'Failed to load employee details');
                setTimeout(() => {
                    window.location.href = '../../../employees.php';
                }, 2000);
            }
        },

        renderEmployee:  function() {
            if (!this.employee) return;

            // Avatar
            const avatar = document.getElementById('employeeAvatar');
            if (avatar) {
                avatar.src = this.employee.avatar || './assets/img/placeholders/avatar.svg';
                avatar.alt = this.employee.name;
            }

            // Name
            const name = document.getElementById('employeeName');
            if (name) {
                name.textContent = this.employee.name;
            }

            // Status
            const status = document.getElementById('employeeStatus');
            if (status) {
                status.textContent = this.employee.status === 'active' ? 'Active' : 'Inactive';
                status.className = this.employee.status === 'active' ? 'badge badge--success' : 'badge badge--neutral';
            }

            // Position
            const position = document.getElementById('employeePosition');
            if (position) {
                position.textContent = this.employee.position;
            }

            // Email
            const email = document.getElementById('employeeEmail');
            if (email) {
                email.textContent = this.employee.email;
            }

            // Phone
            const phone = document.getElementById('employeePhone');
            if (phone) {
                phone.textContent = this.employee.phone || 'N/A';
            }

            // Department
            const department = document.getElementById('employeeDepartment');
            if (department) {
                department.textContent = this.getDepartmentName(this.employee.department);
            }

            // Hire Date
            const hireDate = document.getElementById('employeeHireDate');
            if (hireDate) {
                hireDate.textContent = this.formatDate(this.employee.hireDate);
            }
        },

        loadLeaveHistory: async function() {
            const tbody = document.getElementById('leaveHistoryTable');
            if (!tbody) return;

            try {
                // Load all leaves and filter by this employee
                const response = await fetch('./data/leaves.json');
                const allLeaves = await response.json();

                const employeeLeaves = allLeaves.filter(leave =>
                    leave.employeeId === this.employeeId
                );

                if (employeeLeaves.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="table__empty">No leave history</td></tr>';
                    return;
                }

                tbody.innerHTML = employeeLeaves.map(leave => `
          <tr>
            <td><span class="badge badge--neutral">${this.getLeaveTypeLabel(leave.leaveType)}</span></td>
            <td>${this.formatDate(leave.startDate)}</td>
            <td>${this.formatDate(leave.endDate)}</td>
            <td>${leave.days}</td>
            <td>${this.getStatusBadge(leave.status)}</td>
          </tr>
        `).join('');
            } catch (error) {
                console.error('Failed to load leave history:', error);
                tbody.innerHTML = '<tr><td colspan="5" class="table__empty">Failed to load leave history</td></tr>';
            }
        },

        loadEmployeeDocuments: async function() {
            const container = document.getElementById('employeeDocuments');
            if (!container) return;

            try {
                // Load all documents and filter by this employee
                const response = await fetch('./data/documents.json');
                const allDocuments = await response.json();

                const employeeDocuments = allDocuments.filter(doc =>
                    doc.assignedTo === this.employeeId
                );

                if (employeeDocuments.length === 0) {
                    container.innerHTML = '<p class="text-muted">No documents assigned to this employee.</p>';
                    return;
                }

                container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${employeeDocuments.map(doc => `
              <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius);">
                <div style="flex-shrink: 0;">
                  ${this.getFileIcon(doc.fileType)}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: var(--font-weight-medium);">${doc.name}</div>
                  <div style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${doc.size} • ${this.formatDate(doc.uploadedAt)}</div>
                </div>
                <button class="btn btn--sm btn--ghost">Download</button>
              </div>
            `).join('')}
          </div>
        `;
            } catch (error) {
                console.error('Failed to load employee documents:', error);
                container.innerHTML = '<p class="text-muted text-danger">Failed to load documents</p>';
            }
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
        },

        getLeaveTypeLabel: function(type) {
            const labels = {
                vacation: I18n.get('leaves.vacation', 'Vacation'),
                sick: I18n.get('leaves.sick', 'Sick Leave'),
                personal: I18n.get('leaves.personal', 'Personal Leave')
            };
            return labels[type] || type;
        },

        getStatusBadge: function(status) {
            const badges = {
                pending: '<span class="badge badge--warning">Pending</span>',
                approved: '<span class="badge badge--success">Approved</span>',
                rejected: '<span class="badge badge--danger">Rejected</span>'
            };
            return badges[status] || status;
        },

        getFileIcon: function(fileType) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>`;
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(I18n.currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EmployeeDetailPage.init());
    } else {
        EmployeeDetailPage.init();
    }

})();