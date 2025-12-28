import { showModal } from '../ui/modal.js';
import { showSuccess } from '../ui/toast.js';

const reportDescriptions = {
    headcount: {
        title: 'Headcount Report',
        description: 'This report shows the total number of employees broken down by department, branch, and employment status.'
    },
    attendance: {
        title: 'Attendance Report',
        description: 'Track daily attendance patterns, work hours, late arrivals, and absences across your organization.'
    },
    leave: {
        title: 'Leave Report',
        description: 'View leave balances, usage patterns, and pending requests by employee and leave type.'
    },
    payroll: {
        title: 'Payroll Summary',
        description: 'Comprehensive payroll breakdown including salaries, bonuses, deductions, and total costs.'
    },
    turnover: {
        title: 'Turnover Analysis',
        description: 'Analyze employee retention rates, turnover trends, and departure reasons over time.'
    },
    migration: {
        title: 'Migration Report',
        description: 'Track work permits, visas, and other documents with expiry dates and renewal status.'
    }
};

window.generateReport = (reportType) => {
    const report = reportDescriptions[reportType];

    showModal({
        title: `Generate ${report.title}`,
        content: `
      <div style="padding: 16px 0;">
        <p style="margin-bottom: 24px; color: var(--color-text-secondary);">
          ${report.description}
        </p>

        <form class="form" id="generateReportForm">
          <div class="form-group">
            <label class="form-label">Report Period</label>
            <select class="form-control" name="period">
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="current_year">Current Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div class="form-group" id="customDateRange" style="display: none;">
            <label class="form-label">From</label>
            <input type="date" class="form-control" name="startDate">
            <label class="form-label" style="margin-top: 12px;">To</label>
            <input type="date" class="form-control" name="endDate">
          </div>

          ${reportType === 'headcount' || reportType === 'attendance' ? `
            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-control" name="department">
                <option value="all">All Departments</option>
                <option value="hr">Human Resources</option>
                <option value="it">IT</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">Output Format</label>
            <select class="form-control" name="format">
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV File</option>
            </select>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" name="includeCharts" checked>
              <span style="font-size: 14px;">Include charts and visualizations</span>
            </label>
          </div>
        </form>
      </div>
    `,
        confirmText: 'Generate Report',
        onConfirm: () => {
            showSuccess(`${report.title} generated successfully! Download starting...`);
            return true;
        }
    });

    setTimeout(() => {
        const periodSelect = document.querySelector('select[name="period"]');
        const dateRangeDiv = document.getElementById('customDateRange');

        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                dateRangeDiv.style.display = e.target.value === 'custom' ? 'block' : 'none';
            });
        }
    }, 100);
};

window.exportReport = () => {
    showSuccess('Report exported successfully! Download starting...');
};

console.log('Reports page loaded');
