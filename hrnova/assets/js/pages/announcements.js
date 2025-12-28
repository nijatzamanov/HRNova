import { DataTable } from '../ui/table.js';
import { getAnnouncements } from '../services/dataService.js';
import { showModal } from '../ui/modal.js';
import { showSuccess } from '../ui/toast.js';

let announcementsTable;
let announcements = [];

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getPriorityBadge(priority) {
    const colors = {
        high: 'error',
        medium: 'warning',
        low: 'info'
    };
    const color = colors[priority] || 'secondary';
    return `<span class="badge badge-${color}">${priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Normal'}</span>`;
}

function getAudienceBadge(audience) {
    const labels = {
        all: 'All Employees',
        department: 'Department',
        branch: 'Branch',
        role: 'Role',
        custom: 'Custom'
    };
    return `<span class="badge badge-info">${labels[audience] || audience}</span>`;
}

async function loadAnnouncements() {
    announcementsTable.setLoading(true);

    const response = await getAnnouncements();

    if (response.success) {
        announcements = response.data;
        announcementsTable.setData(announcements);
    }

    announcementsTable.setLoading(false);
}

function showCreateAnnouncementModal() {
    showModal({
        title: 'Create Announcement',
        content: `
      <form class="form" id="createAnnouncementForm">
        <div class="form-group">
          <label class="form-label">Title <span style="color: var(--color-error);">*</span></label>
          <input type="text" class="form-control" name="title" required placeholder="Announcement title">
        </div>

        <div class="form-group">
          <label class="form-label">Message <span style="color: var(--color-error);">*</span></label>
          <textarea class="form-control" name="message" rows="5" required placeholder="Write your message here..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-control" name="priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Target Audience <span style="color: var(--color-error);">*</span></label>
          <select class="form-control" name="audience" id="audienceSelect" required onchange="window.handleAudienceChange(this.value)">
            <option value="all">All Employees</option>
            <option value="department">Specific Department</option>
            <option value="branch">Specific Branch</option>
            <option value="role">Specific Role</option>
            <option value="custom">Custom Selection</option>
          </select>
        </div>

        <div class="form-group" id="audienceDetails" style="display: none;">
          <label class="form-label">Select Target</label>
          <select class="form-control" name="audienceTarget">
            <option value="">Select...</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Publish Date</label>
          <input type="datetime-local" class="form-control" name="publishDate">
          <small style="color: var(--color-text-secondary); font-size: 12px;">Leave empty to publish immediately</small>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" name="sendEmail" checked>
            <span style="font-size: 14px;">Send email notification</span>
          </label>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" name="pinTop">
            <span style="font-size: 14px;">Pin to top of dashboard</span>
          </label>
        </div>
      </form>
    `,
        confirmText: 'Publish Announcement',
        onConfirm: () => {
            const form = document.getElementById('createAnnouncementForm');
            if (form.checkValidity()) {
                showSuccess('Announcement published successfully!');
                setTimeout(() => loadAnnouncements(), 500);
                return true;
            }
            form.reportValidity();
            return false;
        }
    });
}

window.handleAudienceChange = (value) => {
    const detailsDiv = document.getElementById('audienceDetails');
    const targetSelect = detailsDiv.querySelector('select');

    if (value === 'all') {
        detailsDiv.style.display = 'none';
        return;
    }

    detailsDiv.style.display = 'block';

    const options = {
        department: ['HR', 'IT', 'Sales', 'Marketing', 'Finance'],
        branch: ['Main Office', 'Branch A', 'Branch B'],
        role: ['Managers', 'Employees', 'Contractors'],
        custom: ['Custom Group 1', 'Custom Group 2']
    };

    targetSelect.innerHTML = '<option value="">Select...</option>' +
        (options[value] || []).map(opt => `<option value="${opt}">${opt}</option>`).join('');
};

function viewAnnouncementDetails(announcement) {
    showModal({
        title: announcement.title,
        content: `
      <div style="padding: 16px 0;">
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          ${getPriorityBadge(announcement.priority)}
          ${getAudienceBadge(announcement.audience)}
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 8px;">
            Published by ${announcement.author || 'Admin'} on ${formatDate(announcement.date)}
          </div>
        </div>

        <div style="padding: 16px; background: var(--color-gray-50); border-radius: 8px; line-height: 1.6; white-space: pre-wrap;">
          ${announcement.content || announcement.message || 'No content'}
        </div>

        ${announcement.attachments ? `
          <div style="margin-top: 16px;">
            <div style="font-weight: 600; margin-bottom: 8px;">Attachments:</div>
            <div style="font-size: 14px; color: var(--color-text-secondary);">
              📎 ${announcement.attachments}
            </div>
          </div>
        ` : ''}
      </div>
    `,
        showConfirm: false,
        cancelText: 'Close'
    });
}

function initializeTable() {
    announcementsTable = new DataTable('announcementsContainer', {
        columns: [
            {
                key: 'title',
                label: 'Announcement',
                sortable: true,
                render: (row) => `
          <div class="table-cell-primary">${row.title}</div>
          <div class="table-cell-secondary">${row.content?.substring(0, 80) || row.message?.substring(0, 80) || ''}...</div>
        `
            },
            {
                key: 'author',
                label: 'Author',
                sortable: true,
                render: (row) => row.author || 'Admin'
            },
            {
                key: 'date',
                label: 'Date',
                sortable: true,
                render: (row) => formatDate(row.date)
            },
            {
                key: 'priority',
                label: 'Priority',
                sortable: true,
                render: (row) => getPriorityBadge(row.priority)
            },
            {
                key: 'audience',
                label: 'Audience',
                sortable: true,
                render: (row) => getAudienceBadge(row.audience)
            }
        ],
        data: [],
        perPage: 10,
        searchable: true,
        sortable: true,
        pagination: true,
        loading: true,
        emptyState: {
            icon: '📢',
            title: 'No announcements',
            description: 'Create your first announcement to get started.'
        },
        filters: [
            {
                key: 'priority',
                label: 'Priority',
                options: [
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' }
                ]
            },
            {
                key: 'audience',
                label: 'Audience',
                options: [
                    { value: 'all', label: 'All Employees' },
                    { value: 'department', label: 'Department' },
                    { value: 'branch', label: 'Branch' },
                    { value: 'role', label: 'Role' }
                ]
            }
        ],
        actions: [
            {
                key: 'create',
                label: 'New Announcement',
                icon: '+',
                className: 'btn-primary',
                ariaLabel: 'Create announcement',
                onClick: () => showCreateAnnouncementModal()
            }
        ],
        onRowClick: (row) => viewAnnouncementDetails(row)
    });
}

async function initialize() {
    initializeTable();
    await loadAnnouncements();
}

initialize();
