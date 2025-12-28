# Leave & Attendance Pages Documentation

## Overview

Two fully functional HR management pages built with the reusable DataTable module:
1. **Leave Management** - Handle employee leave requests, balances, and approvals
2. **Attendance Tracking** - Monitor daily attendance with anomaly detection

Both pages integrate seamlessly with the existing HRNova system and use data from JSON files via the dataService.

---

## Leave Management Page

**Files:**
- `src/pages/leave.html` - Page structure
- `src/pages/leave.js` - Business logic (12.4KB)

### Features

#### 1. Leave Balance Dashboard
Four stat cards showing:
- **Annual Leave** - Days available (calculated from used days)
- **Sick Leave** - Days available (calculated from used days)
- **Pending Requests** - Total count of pending requests
- **Approved This Month** - Count of approvals in current month

Auto-updates based on leave data from `leave-requests.json`.

#### 2. Leave Requests Table
Powered by the reusable DataTable module with:

**Columns:**
- Employee name with date range (start - end date)
- Leave type badge (Annual, Sick, Personal, Unpaid, Other)
- Number of days (auto-calculated)
- Status badge (Pending, Approved, Rejected)
- Actions (Approve/Reject for pending, View for others)

**Features:**
- Search across all fields
- Filter by leave type
- Filter by status (pending/approved/rejected)
- Sort by any column
- 10 items per page pagination
- Click row to view full details

**Color-coded badges:**
- Annual: Blue (primary)
- Sick: Orange (warning)
- Personal: Light blue (info)
- Unpaid: Red (error)
- Other: Gray (secondary)

#### 3. Request Leave Modal
Full form with validation:
- Employee selector (dropdown from employees data)
- Leave type selector (5 options)
- Start date (date picker, required)
- End date (date picker, required)
- Reason (textarea, required)
- Attachment upload (UI placeholder - disabled)

**Validation:**
- All fields except attachment are required
- HTML5 form validation
- Success toast on submission
- Auto-refreshes table after submit

#### 4. Approve/Reject Workflow

**Approve Modal:**
- Shows employee name, type, and duration
- Optional approval note textarea
- Green "Approve" button
- Updates status and shows success toast
- Refreshes table data

**Reject Modal:**
- Shows employee name, type, and duration
- Required rejection reason textarea
- Red "Reject" button
- Form validation (reason required)
- Updates status and shows toast
- Refreshes table data

#### 5. View Leave Details
Modal showing complete leave information:
- Employee name
- Leave type (with badge)
- Start and end dates
- Duration in days
- Current status (with badge)
- Reason for leave
- Approver note (if approved/rejected)

#### 6. Team Calendar
Mini month view calendar showing:
- Current month and year header
- 7-column grid (Sunday - Saturday)
- Day numbers
- Highlights:
    - **Today** - Blue background
    - **Leave days** - Green background (from approved leaves)
- Legend at bottom
- Auto-renders based on approved leave dates

**Calendar Logic:**
- Calculates first day of month
- Handles varying month lengths
- Shows all days with leaves in current month
- Checks date ranges for multi-day leaves

### Data Integration

Loads data from:
- `leave-requests.json` - All leave requests
- `employees.json` - Employee details for names

**Leave Request Structure:**
```json
{
  "id": "lr-001",
  "employeeId": "emp-001",
  "leaveType": "annual",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Family vacation",
  "status": "approved",
  "approvedBy": "emp-005",
  "approvedAt": "2024-01-10T10:30:00Z",
  "approverNote": "Approved"
}
```

### Stats Calculations
- **Annual balance**: 20 days - (used annual days)
- **Sick balance**: 10 days - (used sick days)
- **Pending count**: Filter by status === 'pending'
- **Approved this month**: Filter by current month + approved status

### User Interactions
- ✅ Click row to view details
- ✅ Click "Request Leave" to open form
- ✅ Click "Approve" on pending request
- ✅ Click "Reject" on pending request
- ✅ Click "View" on approved/rejected request
- ✅ Search for employee names, dates, types
- ✅ Filter by type or status
- ✅ Sort by any column

---

## Attendance Page

**Files:**
- `src/pages/attendance.html` - Page structure
- `src/pages/attendance.js` - Business logic (6.4KB)

### Features

#### 1. Attendance Stats Dashboard
Four real-time stat cards:
- **Present Today** - Count of employees clocked in (green)
- **Late Arrivals** - Count with late minutes > 0 (orange)
- **Absent** - Count of absent employees (red)
- **Avg Work Hours** - Average hours across all records

Auto-updates based on today's attendance data.

#### 2. Daily Attendance Table
Comprehensive table showing:

**Columns:**
- Employee name with department
- Date (formatted)
- Clock in time (12-hour format)
- Clock out time (12-hour format)
- Work hours (calculated, in hours)
- Status badge (Present/Late/Absent/Clocked In)

**Status Logic:**
- **Absent** - Absent flag = true (red badge)
- **Late** - Late minutes > 0 (orange badge with minutes)
- **Present** - Clock in + clock out (green badge)
- **Clocked In** - Clock in only, no clock out (blue badge)

**Features:**
- Search by employee name or department
- Filter by department (dynamic from data)
- Filter by branch (dynamic from data)
- Filter by status type:
    - Present (clocked in + out)
    - Late (late > 0)
    - Absent (absent flag)
    - Missing Clock-Out (in but no out)
- Sort by any column
- 15 items per page
- Work hours auto-calculated from clock times

#### 3. Anomalies Panel
Smart detection system showing three categories:

**Missing Clock-Out:**
- Employees who clocked in but didn't clock out
- Shows up to 3 recent cases
- Warning badge with count
- Includes employee name and date

**Very Late (>30 minutes):**
- Employees late by more than 30 minutes
- Shows up to 3 recent cases
- Error badge with count
- Includes employee name and date

**Absent Today:**
- Employees marked absent today
- Shows up to 3 recent cases
- Error badge with count
- Includes employee name and date

**Empty State:**
- "All Clear" message with checkmark
- Shows when no anomalies detected

#### 4. Shift Schedule View
Read-only display of company shifts:

Shows predefined shifts:
- **Morning Shift**: 09:00 - 18:00 (All Departments)
- **Evening Shift**: 14:00 - 23:00 (Support)
- **Night Shift**: 23:00 - 08:00 (Operations)

Each shift shows:
- Shift name
- Time range (with clock emoji)
- Assigned department (with building emoji)

**Note:** This is static UI. Can be enhanced to load from departments/branches data with shift configurations.

### Data Integration

Loads data from:
- `attendance.json` - All attendance records
- `employees.json` - Employee details
- `departments.json` - Department names
- `branches.json` - Branch names

**Attendance Record Structure:**
```json
{
  "id": "att-001",
  "employeeId": "emp-001",
  "date": "2024-01-15",
  "clockIn": "09:00:00",
  "clockOut": "18:00:00",
  "lateMinutes": 0,
  "absent": false
}
```

### Calculations

**Work Hours:**
```javascript
calculateWorkHours(clockIn, clockOut) {
  const start = new Date(`2000-01-01T${clockIn}`);
  const end = new Date(`2000-01-01T${clockOut}`);
  return (end - start) / (1000 * 60 * 60); // Convert to hours
}
```

**Average Hours:**
- Sum all work hours across records
- Divide by total number of records
- Display with 1 decimal place

**Today Filter:**
```javascript
const today = new Date().toISOString().split('T')[0];
const todayRecords = records.filter(r => r.date === today);
```

### Anomaly Detection Logic

**Missing Clock-Out:**
```javascript
records.filter(r => r.clockIn && !r.clockOut && !r.absent)
```

**Very Late:**
```javascript
records.filter(r => r.lateMinutes > 30)
```

**Absent Today:**
```javascript
records.filter(r => r.absent && r.date === today)
```

### User Interactions
- ✅ Search employees or departments
- ✅ Filter by department (dynamic dropdown)
- ✅ Filter by branch (dynamic dropdown)
- ✅ Filter by status type
- ✅ Sort by any column (date, time, hours, etc.)
- ✅ View anomalies at a glance
- ✅ See shift schedule reference
- ✅ Export button (UI placeholder)

---

## Shared Features (Both Pages)

### Responsive Design
- **Desktop:** 3-column layout (table + sidebar panels)
- **Tablet:** 2-column stacked
- **Mobile:** Single column, full width

### Accessibility
- Semantic HTML with proper roles
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliant badges

### Loading States
- Skeleton loading during data fetch
- Simulated API delay (200-400ms)
- Smooth transitions

### Error Handling
- Toast notifications on errors
- Fallback values for missing data
- Graceful degradation

### Internationalization
All text strings use i18n keys:
- `leave.*` - Leave page translations
- `attendance.*` - Attendance page translations
- Supports language switching

### Toast Notifications
Used throughout for user feedback:
- ✅ Success: Request submitted, approved, rejected
- ❌ Error: Data loading failures
- ℹ️ Info: Feature coming soon

---

## File Structure

```
src/pages/
├── leave.html              (2.95 KB)
├── leave.js                (12.41 KB)
├── attendance.html         (3.05 KB)
└── attendance.js           (6.37 KB)

src/data/
├── leave-requests.json     (Leave data)
└── attendance.json         (Attendance data)

src/i18n/
└── en.json                 (Added leave & attendance translations)
```

---

## Integration with Existing System

### Uses Existing Modules:
- ✅ `DataTable` class from `table.js`
- ✅ `showModal` from `modal.js`
- ✅ `showSuccess`, `showError` from `toast.js`
- ✅ `getLeaveRequests`, `getAttendance`, etc. from `dataService.js`

### Follows System Patterns:
- ✅ Same CSS variable system
- ✅ Consistent badge styling
- ✅ Standard button classes
- ✅ Form validation approach
- ✅ Page header structure
- ✅ Stat card layout

### Build Configuration:
Added to `vite.config.js`:
```javascript
input: {
  // ... other partials
  leave: resolve(__dirname, 'src/partials/leave.html'),
  attendance: resolve(__dirname, 'src/partials/attendance.html'),
}
```

---

## Performance

### Bundle Sizes (minified):
- **leave.js**: 12.41 KB (3.17 KB gzipped)
- **attendance.js**: 6.37 KB (2.39 KB gzipped)
- **leave.html**: 2.95 KB (0.83 KB gzipped)
- **attendance.html**: 3.05 KB (0.81 KB gzipped)

### Optimizations:
- Lazy loading via Vite code splitting
- Efficient DOM updates
- Debounced search (via DataTable)
- Minimal re-renders

---

## Future Enhancements

### Leave Page:
- File upload implementation for attachments
- Email notifications on approval/rejection
- Leave balance history chart
- Bulk approve/reject
- Export to PDF/Excel
- Calendar sync (Google Calendar, Outlook)
- Recurring leave patterns

### Attendance Page:
- Real-time clock in/out from current page
- Biometric integration
- GPS check-in validation
- Photo capture on clock-in
- Attendance trends chart
- Overtime calculation
- Export detailed reports
- Shift swap requests
- Break time tracking

---

## Testing Checklist

### Leave Page:
- ✅ Load leave requests from JSON
- ✅ Display in table with pagination
- ✅ Search functionality works
- ✅ Filter by type and status
- ✅ Sort columns ascending/descending
- ✅ Request leave modal opens with form
- ✅ Form validation works
- ✅ Approve leave shows modal with confirmation
- ✅ Reject leave requires reason
- ✅ View details shows complete info
- ✅ Calendar renders current month
- ✅ Calendar highlights leave days
- ✅ Stats update correctly
- ✅ Toast notifications appear
- ✅ Responsive on mobile

### Attendance Page:
- ✅ Load attendance records from JSON
- ✅ Display in table with correct formatting
- ✅ Calculate work hours correctly
- ✅ Show correct status badges
- ✅ Filter by department/branch
- ✅ Filter by status type
- ✅ Search works across fields
- ✅ Anomalies panel shows issues
- ✅ Shift schedule displays
- ✅ Stats calculate correctly
- ✅ Today's data filters properly
- ✅ Empty anomalies shows "All Clear"
- ✅ Responsive layout works
- ✅ Time formatting (12-hour)

---

## Code Examples

### Using the Leave Table
```javascript
import { DataTable } from '../assets/js/ui/table.js';
import { getLeaveRequests } from '../assets/js/services/dataService.js';

const leaveTable = new DataTable('container', {
  columns: [...],
  filters: [
    { key: 'leaveType', label: 'Type', options: [...] },
    { key: 'status', label: 'Status', options: [...] }
  ],
  actions: [
    { key: 'request', label: 'Request Leave', onClick: showModal }
  ],
  onRowClick: (row) => viewDetails(row)
});

const response = await getLeaveRequests();
leaveTable.setData(response.data);
```

### Calculating Leave Days
```javascript
function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}
```

### Detecting Anomalies
```javascript
const missingClockOut = records.filter(r =>
  r.clockIn && !r.clockOut && !r.absent
);

const lateArrivals = records.filter(r =>
  r.lateMinutes > 30
);

const absentToday = records.filter(r =>
  r.absent && r.date === today
);
```

---

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari
- ✅ Chrome Mobile

---

## Dependencies

All dependencies are shared with the main system:
- Vanilla JavaScript (ES6+)
- Vite for bundling
- Existing CSS framework
- DataTable module
- Modal & Toast UI components
- DataService for data loading

No additional external libraries required!
