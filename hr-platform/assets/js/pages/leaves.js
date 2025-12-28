(function() {
    'use strict';

    const LeavesPage = {
        leaves: [],
        modal: null,

        init:  async function() {
            this.setupSidebar();
            this.modal = Modal.get('leaveModal');
            this.setupEventListeners();
            await this.loadLeaves();
            this.renderLeaves();
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

        setupEventListeners: function() {
            // New leave button
            const newLeaveBtn = document.getElementById('newLeaveBtn');
            if (newLeaveBtn) {
                newLeaveBtn.addEventListener('click', () => this.openNewLeaveModal());
            }

            // Modal buttons
            const cancelBtn = document.getElementById('cancelLeaveBtn');
            const submitBtn = document.getElementById('submitLeaveBtn');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.modal.close());
            }

            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.submitLeaveRequest());
            }

            // Form submission
            const form = document.getElementById('leaveForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.submitLeaveRequest();
                });
            }
        },

        loadLeaves: async function() {
            try {
                const response = await fetch('./data/leaves.json');
                this.leaves = await response.json();
            } catch (error) {
                console.error('Failed to load leaves:', error);
                Toast.error('Error', 'Failed to load leave requests');
            }
        },

        renderLeaves:  function() {
            this.renderPending();
            this.renderApproved();
            this.renderRejected();
        },

        renderPending: function() {
            const tbody = document.getElementById('pendingTableBody');
            if (! tbody) return;

            const pending = this.leaves.filter(l => l.status === 'pending');

            if (pending.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="table__empty">No pending requests</td></tr>';
                return;
            }

            tbody.innerHTML = pending.map(leave => `
        <tr>
          <td>${leave.employeeName}</td>
          <td><span class="badge badge--neutral">${this.getLeaveTypeLabel(leave.leaveType)}</span></td>
          <td>${this.formatDate(leave.startDate)}</td>
          <td>${this.formatDate(leave.endDate)}</td>
          <td>${leave.days}</td>
          <td>${leave.reason || '-'}</td>
          <td>
            <div class="table__actions">
              <button class="btn btn--sm btn--success" data-action="approve" data-id="${leave.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span data-i18n="leaves.approve">Approve</span>
              </button>
              <button class="btn btn--sm btn--danger" data-action="reject" data-id="${leave.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span data-i18n="leaves.reject">Reject</span>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

            // Attach event listeners
            tbody.querySelectorAll('[data-action="approve"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.approveLeave(id);
                });
            });

            tbody.querySelectorAll('[data-action="reject"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.rejectLeave(id);
                });
            });
        },

        renderApproved: function() {
            const tbody = document.getElementById('approvedTableBody');
            if (!tbody) return;

            const approved = this.leaves.filter(l => l.status === 'approved');

            if (approved.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="table__empty">No approved requests</td></tr>';
                return;
            }

            tbody.innerHTML = approved.map(leave => `
        <tr>
          <td>${leave.employeeName}</td>
          <td><span class="badge badge--success">${this.getLeaveTypeLabel(leave.leaveType)}</span></td>
          <td>${this.formatDate(leave.startDate)}</td>
          <td>${this.formatDate(leave.endDate)}</td>
          <td>${leave.days}</td>
          <td>${leave.reason || '-'}</td>
        </tr>
      `).join('');
        },

        renderRejected: function() {
            const tbody = document.getElementById('rejectedTableBody');
            if (!tbody) return;

            const rejected = this.leaves.filter(l => l.status === 'rejected');

            if (rejected.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="table__empty">No rejected requests</td></tr>';
                return;
            }

            tbody.innerHTML = rejected.map(leave => `
        <tr>
          <td>${leave.employeeName}</td>
          <td><span class="badge badge--danger">${this.getLeaveTypeLabel(leave.leaveType)}</span></td>
          <td>${this.formatDate(leave.startDate)}</td>
          <td>${this.formatDate(leave.endDate)}</td>
          <td>${leave.days}</td>
          <td>${leave.reason || '-'}</td>
        </tr>
      `).join('');
        },

        getLeaveTypeLabel: function(type) {
            const labels = {
                vacation: I18n.get('leaves.vacation', 'Vacation'),
                sick: I18n.get('leaves.sick', 'Sick Leave'),
                personal: I18n.get('leaves.personal', 'Personal Leave')
            };
            return labels[type] || type;
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(I18n.currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        openNewLeaveModal: function() {
            const form = document.getElementById('leaveForm');
            if (form) form.reset();

            // Set min date to today
            const startInput = document.getElementById('leaveStartDate');
            const endInput = document.getElementById('leaveEndDate');
            const today = new Date().toISOString().split('T')[0];

            if (startInput) startInput.min = today;
            if (endInput) endInput.min = today;

            this.modal.open();
        },

        validateForm: function() {
            const form = document.getElementById('leaveForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');

                if (! field.value.trim()) {
                    formGroup.classList.add('form-group--error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('form-group--error');
                }
            });

            // Validate date range
            const startDate = document.getElementById('leaveStartDate').value;
            const endDate = document.getElementById('leaveEndDate').value;

            if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                const endGroup = document.getElementById('leaveEndDate').closest('.form-group');
                endGroup.classList.add('form-group--error');
                isValid = false;
            }

            return isValid;
        },

        submitLeaveRequest: async function() {
            if (!this.validateForm()) {
                Toast.warning('Validation Error', 'Please fill all required fields correctly');
                return;
            }

            const startDate = new Date(document.getElementById('leaveStartDate').value);
            const endDate = new Date(document.getElementById('leaveEndDate').value);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            const newLeave = {
                id: 'leave' + Date.now(),
                employeeId: 'emp001', // Mock current user
                employeeName: 'Current User',
                leaveType: document.getElementById('leaveType').value,
                startDate: document.getElementById('leaveStartDate').value,
                endDate: document.getElementById('leaveEndDate').value,
                days: days,
                reason: document.getElementById('leaveReason').value.trim(),
                status: 'pending',
                requestedAt: new Date().toISOString()
            };

            this.leaves.unshift(newLeave);
            this.renderLeaves();
            this.modal.close();

            Toast.success('Success', 'Leave request submitted successfully');
        },

        approveLeave: function(id) {
            const leave = this.leaves.find(l => l.id === id);
            if (!leave) return;

            leave.status = 'approved';
            leave.approvedAt = new Date().toISOString();

            this.renderLeaves();
            Toast.success('Success', `Leave request for ${leave.employeeName} approved`);
        },

        rejectLeave: function(id) {
            const leave = this.leaves.find(l => l.id === id);
            if (!leave) return;

            const reason = prompt('Rejection reason (optional):');

            leave.status = 'rejected';
            leave.rejectedAt = new Date().toISOString();
            if (reason) leave.rejectionReason = reason;

            this.renderLeaves();
            Toast.info('Rejected', `Leave request for ${leave.employeeName} rejected`);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LeavesPage.init());
    } else {
        LeavesPage.init();
    }

})();