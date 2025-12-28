import { showSuccess } from '../ui/toast.js';

const changelog = [
    {
        version: '2.5.0',
        date: '2024-12-26',
        type: 'major',
        changes: [
            { type: 'feature', text: 'Added migration case tracking with document expiry alerts' },
            { type: 'feature', text: 'New comprehensive reports and analytics dashboard' },
            { type: 'feature', text: 'Enhanced user management with role-based permissions' },
            { type: 'improvement', text: 'Improved attendance tracking with anomaly detection' },
            { type: 'improvement', text: 'Better leave request workflow with calendar view' }
        ]
    },
    {
        version: '2.4.0',
        date: '2024-11-15',
        type: 'minor',
        changes: [
            { type: 'feature', text: 'Added announcements with audience targeting' },
            { type: 'feature', text: 'Company settings for departments and branches' },
            { type: 'improvement', text: 'Enhanced employee profile with document management' },
            { type: 'fix', text: 'Fixed timezone display in attendance records' },
            { type: 'fix', text: 'Resolved leave balance calculation issues' }
        ]
    },
    {
        version: '2.3.0',
        date: '2024-10-01',
        type: 'minor',
        changes: [
            { type: 'feature', text: 'Multi-language support (English, Azerbaijani, Turkish, Russian, German)' },
            { type: 'feature', text: 'Advanced table filtering and sorting' },
            { type: 'improvement', text: 'Redesigned dashboard with modern UI' },
            { type: 'improvement', text: 'Performance optimizations for large datasets' }
        ]
    },
    {
        version: '2.2.0',
        date: '2024-09-10',
        type: 'minor',
        changes: [
            { type: 'feature', text: 'Email notifications for leave approvals' },
            { type: 'feature', text: 'Export functionality for reports' },
            { type: 'fix', text: 'Fixed search functionality in employee directory' },
            { type: 'fix', text: 'Resolved mobile responsive layout issues' }
        ]
    }
];

function renderChangelog() {
    const container = document.getElementById('changelogContainer');

    const getTypeColor = (type) => {
        const colors = {
            feature: 'success',
            improvement: 'info',
            fix: 'warning'
        };
        return colors[type] || 'secondary';
    };

    const getTypeIcon = (type) => {
        const icons = {
            feature: '✨',
            improvement: '🔧',
            fix: '🐛'
        };
        return icons[type] || '•';
    };

    const getVersionBadge = (type) => {
        const colors = {
            major: 'error',
            minor: 'primary',
            patch: 'secondary'
        };
        const color = colors[type] || 'secondary';
        return `<span class="badge badge-${color}">${type.toUpperCase()}</span>`;
    };

    let html = '<div style="position: relative;">';

    changelog.forEach((release, index) => {
        html += `
      <div class="card" style="margin-bottom: 24px; position: relative;">
        <div style="position: absolute; left: -12px; top: 24px; width: 24px; height: 24px; background: var(--color-primary-600); border-radius: 50%; border: 4px solid var(--color-bg);"></div>
        ${index < changelog.length - 1 ? `
          <div style="position: absolute; left: -2px; top: 48px; width: 4px; height: calc(100% + 12px); background: var(--color-border);"></div>
        ` : ''}

        <div class="card__header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Version ${release.version}</h2>
              <p style="font-size: 13px; color: var(--color-text-secondary);">${new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            ${getVersionBadge(release.type)}
          </div>
        </div>
        <div class="card__body">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${release.changes.map(change => `
              <div style="display: flex; gap: 12px; align-items: start;">
                <span style="font-size: 16px; flex-shrink: 0;">${getTypeIcon(change.type)}</span>
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span class="badge badge-${getTypeColor(change.type)}" style="font-size: 10px; padding: 2px 8px;">
                      ${change.type.toUpperCase()}
                    </span>
                  </div>
                  <p style="font-size: 14px; margin: 0; line-height: 1.5;">${change.text}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    });

    html += '</div>';

    container.innerHTML = html;
}

window.submitFeedback = () => {
    const form = document.getElementById('feedbackForm');

    if (form.checkValidity()) {
        showSuccess('Thank you! Your feedback has been submitted.');
        form.reset();
    } else {
        form.reportValidity();
    }
};

renderChangelog();
