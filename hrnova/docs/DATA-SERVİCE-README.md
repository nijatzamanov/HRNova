# Data Service Documentation

## Overview

The DataService provides a centralized interface for fetching mock data from JSON files. All operations simulate realistic network latency (200-400ms) and return normalized response objects.

## Data Files

### Created JSON Files

Located in `src/data/`:

| File | Records | Description |
|------|---------|-------------|
| `users.json` | 5 | System users with roles and permissions |
| `employees.json` | 30 | Employee directory with full details |
| `departments.json` | 10 | Department information |
| `branches.json` | 6 | Company branches and locations |
| `leave-requests.json` | 20 | Leave/vacation requests |
| `attendance.json` | 40 | Daily attendance records |
| `migration-cases.json` | 20 | International migration/travel cases |
| `announcements.json` | 20 | Company announcements |

All data includes:
- Azerbaijani (az) and English (en) fields where applicable
- Realistic names, dates, and business logic
- Various statuses (active, pending, approved, etc.)
- Relationships via IDs (employeeId, departmentId, etc.)

## Import

```javascript
import {
  getUsers,
  getEmployees,
  getEmployeeById,
  getDepartments,
  getDepartmentById,
  getBranches,
  getBranchById,
  getLeaveRequests,
  getLeaveRequestById,
  getAttendance,
  getMigrationCases,
  getMigrationCaseById,
  getAnnouncements,
  getAnnouncementById,
  getStats
} from './services/dataService.js';

// Or import default
import dataService from './services/dataService.js';
```

## Response Format

All functions return a normalized response object:

```javascript
{
  success: true,           // boolean: operation success
  data: [...],            // array or object: the data
  error: null,            // string or null: error message
  timestamp: "ISO8601",   // string: response timestamp
  count: 30               // number: array length (if applicable)
}
```

### Error Response

```javascript
{
  success: false,
  data: null,
  error: "Error message",
  timestamp: "ISO8601"
}
```

## API Functions

### Users

#### `getUsers()`

Fetch all system users.

```javascript
const response = await getUsers();
// response.data = [{ id, username, email, role, permissions, ... }, ...]
```

### Employees

#### `getEmployees(filters?)`

Fetch employees with optional filters.

**Filters:**
- `departmentId`: Filter by department
- `branchId`: Filter by branch
- `status`: Filter by status (active, inactive, on-leave)
- `search`: Search by name, email, or employee ID

```javascript
// All employees
const response = await getEmployees();

// Filter by department
const response = await getEmployees({ departmentId: 'dept001' });

// Search employees
const response = await getEmployees({ search: 'Nigar' });

// Active employees only
const response = await getEmployees({ status: 'active' });

// Multiple filters
const response = await getEmployees({
  departmentId: 'dept002',
  status: 'active'
});
```

#### `getEmployeeById(id)`

Fetch a single employee by ID or employee ID.

```javascript
const response = await getEmployeeById('emp005');
// response.data = { id, employeeId, firstName, lastName, ... }
```

### Departments

#### `getDepartments(filters?)`

Fetch all departments with optional filters.

**Filters:**
- `status`: Filter by status (active, inactive)

```javascript
const response = await getDepartments();
const response = await getDepartments({ status: 'active' });
```

#### `getDepartmentById(id)`

Fetch a single department by ID or code.

```javascript
const response = await getDepartmentById('dept001');
const response = await getDepartmentById('HR');
```

### Branches

#### `getBranches(filters?)`

Fetch all branches with optional filters.

**Filters:**
- `status`: Filter by status
- `type`: Filter by type (headquarters, branch, representative)
- `country`: Filter by country

```javascript
const response = await getBranches();
const response = await getBranches({ type: 'branch' });
const response = await getBranches({ country: 'Türkiyə' });
```

#### `getBranchById(id)`

Fetch a single branch by ID or code.

```javascript
const response = await getBranchById('branch001');
const response = await getBranchById('BAK-HQ');
```

### Leave Requests

#### `getLeaveRequests(filters?)`

Fetch leave requests with optional filters.

**Filters:**
- `employeeId`: Filter by employee
- `status`: Filter by status (pending, approved, rejected)
- `leaveType`: Filter by type (annual, sick, personal, maternity)
- `department`: Filter by department name
- `startDate`: Filter by start date (>=)
- `endDate`: Filter by end date (<=)

```javascript
const response = await getLeaveRequests();
const response = await getLeaveRequests({ status: 'pending' });
const response = await getLeaveRequests({ employeeId: 'emp005' });
const response = await getLeaveRequests({
  leaveType: 'annual',
  status: 'approved'
});
```

#### `getLeaveRequestById(id)`

Fetch a single leave request by ID.

```javascript
const response = await getLeaveRequestById('leave001');
```

### Attendance

#### `getAttendance(filters?)`

Fetch attendance records with optional filters.

**Filters:**
- `employeeId`: Filter by employee
- `date`: Filter by specific date (YYYY-MM-DD)
- `status`: Filter by status (present, late, absent, on-leave)
- `department`: Filter by department name
- `startDate` + `endDate`: Date range filter

```javascript
const response = await getAttendance();
const response = await getAttendance({ date: '2024-12-26' });
const response = await getAttendance({ employeeId: 'emp005' });
const response = await getAttendance({
  startDate: '2024-12-25',
  endDate: '2024-12-26'
});
```

### Migration Cases

#### `getMigrationCases(filters?)`

Fetch migration/travel cases with optional filters.

**Filters:**
- `employeeId`: Filter by employee
- `status`: Filter by status (pending, approved, in-process, completed)
- `visaStatus`: Filter by visa status
- `destinationCountry`: Filter by destination
- `department`: Filter by department

```javascript
const response = await getMigrationCases();
const response = await getMigrationCases({ status: 'pending' });
const response = await getMigrationCases({ destinationCountry: 'Türkiyə' });
const response = await getMigrationCases({
  visaStatus: 'approved',
  status: 'approved'
});
```

#### `getMigrationCaseById(id)`

Fetch a single migration case by ID.

```javascript
const response = await getMigrationCaseById('mig001');
```

### Announcements

#### `getAnnouncements(filters?)`

Fetch company announcements with optional filters.

**Filters:**
- `type`: Filter by type (general, hr, it, business, training, event, etc.)
- `priority`: Filter by priority (low, medium, high)
- `status`: Filter by status (active, expired)
- `targetAudience`: Filter by audience (all, department, managers)
- `department`: Filter by department name

```javascript
const response = await getAnnouncements();
const response = await getAnnouncements({ priority: 'high' });
const response = await getAnnouncements({ type: 'hr' });
const response = await getAnnouncements({
  targetAudience: 'all',
  priority: 'high',
  status: 'active'
});
```

Results are automatically sorted by `publishedAt` (newest first).

#### `getAnnouncementById(id)`

Fetch a single announcement by ID.

```javascript
const response = await getAnnouncementById('ann001');
```

### Statistics

#### `getStats()`

Fetch aggregated statistics across all data.

```javascript
const response = await getStats();
// response.data = {
//   totalEmployees: 30,
//   activeEmployees: 29,
//   totalDepartments: 10,
//   totalBranches: 6,
//   pendingLeaves: 6,
//   approvedLeaves: 12,
//   todayAttendance: 30
// }
```

## Latency Simulation

All functions include a simulated network delay:
- **Minimum:** 200ms
- **Maximum:** 400ms
- **Random:** Each request gets a random delay within this range

This creates realistic loading states for UI development.

## Error Handling

```javascript
const response = await getEmployees();

if (response.success) {
  console.log('Data:', response.data);
  console.log('Count:', response.count);
} else {
  console.error('Error:', response.error);
}
```

## Usage Examples

### Loading Employees for a Table

```javascript
async function loadEmployeeTable() {
  const response = await getEmployees({ status: 'active' });

  if (!response.success) {
    showError(response.error);
    return;
  }

  const employees = response.data;
  renderEmployeeTable(employees);
}
```

### Filtering Leave Requests

```javascript
async function loadPendingLeaves() {
  const response = await getLeaveRequests({
    status: 'pending',
    department: 'İnsan Resursları'
  });

  if (response.success) {
    renderLeaveRequests(response.data);
  }
}
```

### Employee Search

```javascript
async function searchEmployees(query) {
  const response = await getEmployees({ search: query });

  if (response.success) {
    displaySearchResults(response.data);
  }
}
```

### Dashboard Statistics

```javascript
async function loadDashboardStats() {
  const stats = await getStats();

  if (stats.success) {
    updateDashboard(stats.data);
  }
}
```

### Detailed Employee View

```javascript
async function loadEmployeeDetails(employeeId) {
  const [employee, leaves, attendance] = await Promise.all([
    getEmployeeById(employeeId),
    getLeaveRequests({ employeeId }),
    getAttendance({ employeeId })
  ]);

  if (employee.success) {
    renderEmployeeProfile(employee.data);
    renderLeaveHistory(leaves.data);
    renderAttendanceHistory(attendance.data);
  }
}
```

## Data Relationships

Entities are linked via IDs:

```
Employee
  ├── departmentId → Department
  ├── branchId → Branch
  └── managerId → Employee (self-reference)

LeaveRequest
  └── employeeId → Employee

Attendance
  └── employeeId → Employee

MigrationCase
  └── employeeId → Employee

Announcement
  └── publishedBy → User/Employee
```

## Field Examples

### Employee Object

```javascript
{
  id: "emp005",
  employeeId: "HRN-2024-005",
  firstName: "Nigar",
  lastName: "Əliyeva",
  fullName: "Nigar Əliyeva",
  email: "nigar.aliyeva@hrnova.az",
  phone: "+994505551009",
  position: "HR Koordinator",
  positionEn: "HR Coordinator",
  departmentId: "dept001",
  department: "İnsan Resursları",
  branchId: "branch001",
  branch: "Baş Ofis Bakı",
  managerId: "emp003",
  salary: 1800,
  currency: "AZN",
  joinDate: "2021-04-10",
  birthDate: "1995-02-14",
  gender: "female",
  nationality: "Azərbaycan",
  passportNumber: "AZE5678901",
  status: "active",
  contractType: "permanent",
  workType: "full-time",
  avatar: null,
  address: "Binəqədi rayonu, Bakı",
  emergencyContact: "+994505551010",
  createdAt: "2021-04-10T08:00:00Z",
  updatedAt: "2024-12-20T10:00:00Z"
}
```

### Leave Request Object

```javascript
{
  id: "leave001",
  employeeId: "emp005",
  employeeName: "Nigar Əliyeva",
  department: "İnsan Resursları",
  leaveType: "annual",
  leaveTypeLabel: "İllik Məzuniyyət",
  startDate: "2024-12-28",
  endDate: "2025-01-06",
  days: 10,
  reason: "Ailə ilə istirahət",
  status: "approved",
  appliedAt: "2024-12-10T09:30:00Z",
  reviewedBy: "emp003",
  reviewerName: "Leyla Həsənova",
  reviewedAt: "2024-12-11T14:20:00Z",
  comments: "Təsdiq edildi"
}
```

### Attendance Object

```javascript
{
  id: "att001",
  employeeId: "emp005",
  employeeName: "Nigar Əliyeva",
  department: "İnsan Resursları",
  date: "2024-12-26",
  checkIn: "2024-12-26T08:55:00Z",
  checkOut: "2024-12-26T17:30:00Z",
  workHours: 8.58,
  status: "present",
  location: "Baş Ofis",
  notes: null
}
```

### Migration Case Object

```javascript
{
  id: "mig001",
  employeeId: "emp005",
  employeeName: "Nigar Əliyeva",
  department: "İnsan Resursları",
  destinationCountry: "Türkiyə",
  destinationCity: "İstanbul",
  purpose: "İş komandirəsi",
  purposeEn: "Business trip",
  startDate: "2025-02-15",
  endDate: "2025-02-25",
  duration: 10,
  visaType: "Business",
  visaStatus: "approved",
  applicationDate: "2024-11-20",
  approvalDate: "2024-12-05",
  status: "approved",
  documents: ["passport", "invitation_letter", "flight_ticket"],
  notes: "Tərəfdaş şirkətlə görüş",
  costs: {
    visa: 150,
    flight: 420,
    accommodation: 800,
    dailyAllowance: 600,
    total: 1970,
    currency: "USD"
  }
}
```

## Best Practices

1. **Always check `response.success`** before accessing data
2. **Use filters** to reduce client-side processing
3. **Handle loading states** during the simulated latency
4. **Cache responses** when appropriate to reduce requests
5. **Use Promise.all** for parallel requests when loading related data
6. **Display errors** to users in a user-friendly way

## Performance Notes

- All data is loaded from static JSON files
- No backend server required
- Filtering happens client-side
- Simulated latency mimics real API behavior
- Perfect for development and demos
