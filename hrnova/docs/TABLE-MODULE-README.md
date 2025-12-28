# Data Table Module Documentation

## Overview

A reusable, feature-rich table component built for the HRNova HR management system. The module provides client-side pagination, sorting, searching, filtering, and more with full accessibility support.

## Files Created

### Core Module
- **src/assets/js/ui/table.js** - Main DataTable class (10KB)
- **src/assets/css/components/table-advanced.css** - Complete styling (7KB)

### Implementation
- **src/pages/employees.html** - Full employee management page with drawer UI
- **src/pages/employees.js** - Employee page logic with table integration (26KB)

## DataTable Class

### Basic Usage

```javascript
import { DataTable } from '../assets/js/ui/table.js';

const table = new DataTable('containerId', {
  columns: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', render: (row) => `<span class="badge">${row.status}</span>` }
  ],
  data: [],
  perPage: 10,
  searchable: true,
  sortable: true,
  pagination: true
});
```

### Features

#### 1. Client-Side Pagination
- Configurable items per page (default: 10)
- Multiple page size options (10, 25, 50, 100)
- Smart page number display with ellipsis
- Previous/Next navigation
- Keyboard accessible

```javascript
perPage: 10,
perPageOptions: [10, 25, 50, 100],
pagination: true
```

#### 2. Column Sorting
- Click column headers to sort
- Ascending/descending toggle
- Visual sort indicators (↑ ↓)
- Sort by any column with `sortable: true`

```javascript
columns: [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: false }
]
```

#### 3. Search & Filtering
- Global search across all columns
- Custom filter dropdowns
- Multiple filters support
- Custom filter functions

```javascript
searchable: true,
filters: [
  {
    key: 'department',
    label: 'Department',
    options: [
      { value: 'eng', label: 'Engineering' },
      { value: 'sales', label: 'Sales' }
    ],
    filterFn: (row, value) => row.departmentId === value
  }
]
```

#### 4. Custom Cell Rendering
- HTML rendering support
- Custom render functions per column
- Access to full row data

```javascript
columns: [
  {
    key: 'fullName',
    label: 'Employee',
    render: (row) => `
      <div class="employee-cell">
        <div class="avatar">${getInitials(row.fullName)}</div>
        <div>
          <div class="name">${row.fullName}</div>
          <div class="id">${row.employeeId}</div>
        </div>
      </div>
    `
  }
]
```

#### 5. Action Buttons
- Header-level actions (Add, Import, Export)
- Custom button styling
- Click handlers

```javascript
actions: [
  {
    key: 'add',
    label: 'Add Employee',
    icon: '+',
    className: 'btn-primary',
    ariaLabel: 'Add new employee',
    onClick: () => showAddModal()
  }
]
```

#### 6. Row Click Handler
- Click entire row to view details
- Keyboard navigation (Enter/Space)
- Custom action on row click

```javascript
onRowClick: (row) => {
  console.log('Clicked row:', row);
  showDetailDrawer(row);
}
```

#### 7. Loading Skeleton
- Animated loading state
- 5 skeleton rows
- Gradient animation effect

```javascript
table.setLoading(true);
// ... load data
table.setLoading(false);
```

#### 8. Empty State
- Custom icon, title, and description
- Shown when no data matches filters

```javascript
emptyState: {
  icon: '👥',
  title: 'No employees found',
  description: 'Try adjusting your filters or search query.'
}
```

#### 9. Accessibility
- Full ARIA support
- Keyboard navigation
- Screen reader friendly
- Semantic HTML (thead, tbody, th, td)
- Role attributes

### API Methods

#### `setData(data)`
Update table data and refresh

```javascript
const employees = await getEmployees();
table.setData(employees.data);
```

#### `setLoading(loading)`
Toggle loading state

```javascript
table.setLoading(true);
```

#### `refresh()`
Re-render table with current data

```javascript
table.refresh();
```

### Configuration Options

```javascript
{
  columns: [],              // Column definitions
  data: [],                 // Data array
  perPage: 10,             // Items per page
  perPageOptions: [10, 25, 50, 100],  // Page size options
  searchable: true,         // Enable search
  sortable: true,           // Enable sorting
  pagination: true,         // Enable pagination
  loading: false,           // Initial loading state
  filters: [],             // Filter definitions
  actions: [],             // Action buttons
  onRowClick: null,        // Row click handler
  emptyState: {            // Empty state config
    icon: '📋',
    title: 'No data',
    description: 'No records to display'
  }
}
```

## Employee Page Implementation

### Features Implemented

#### 1. Employee List Table
- **30 employees** from `employees.json`
- **Search** by name, email, or employee ID
- **Filters**: Department, Branch, Status
- **Sorting** on all columns
- **Pagination** with 10 items per page
- Click row to view details

#### 2. Stats Dashboard
- Total Employees
- Active Employees
- On Leave
- Inactive
- Auto-updates based on data

#### 3. Action Buttons
- **Add Employee** - Opens modal with form
- **Import** - UI placeholder (shows toast)
- **Export** - UI placeholder (shows toast)

#### 4. Employee Drawer (Slide-out Panel)
- Opens from right side
- 600px width (full width on mobile)
- Close via X button, footer button, overlay click, or ESC key
- Smooth animations

#### 5. Drawer Tabs
- **Overview** - Personal information (10 fields)
- **Job Details** - Position, department, branch, manager, compensation
- **Documents** - Empty state placeholder
- **Notes** - Empty state placeholder

#### 6. Profile Display
All employee data displayed in organized sections:
- Personal: ID, name, email, phone, birth date, gender, nationality, passport, address, emergency contact
- Job: Position, department, branch, manager, join date, contract type, work type, status
- Compensation: Salary, currency

#### 7. Add/Edit Forms
- **Add Employee Modal** with validation
    - First Name (required)
    - Last Name (required)
    - Email (required)
    - Phone (required)
    - Position (required)
    - Department (required - dropdown from dataService)
    - Branch (required - dropdown from dataService)
    - Join Date (required)

- **Edit Employee Modal** - Pre-filled with current data
    - All add fields plus Status dropdown

- HTML5 validation with `required` attributes
- Form validation before submission
- Success toast on save

#### 8. Toast Notifications
- Success: "Employee added successfully!"
- Success: "Employee updated successfully!"
- Info: "Import functionality coming soon!"
- Info: "Export functionality coming soon!"
- Error: If data loading fails

### Data Integration

All data loaded via `dataService.js`:

```javascript
import { getEmployees, getDepartments, getBranches } from '../assets/js/services/dataService.js';

// Load employees
const response = await getEmployees();
table.setData(response.data);

// Load filters
const depts = await getDepartments();
const branches = await getBranches();
```

### Accessibility Features

#### Table
- `role="table"`, `role="row"`, `role="columnheader"`, `role="cell"`
- Sortable columns keyboard accessible
- Row click with Enter/Space key support
- ARIA labels on all interactive elements
- `aria-selected`, `aria-current` on pagination
- `aria-live="polite"` on results count

#### Drawer
- Proper tab navigation
- `role="tab"`, `role="tabpanel"`
- `aria-selected` on active tab
- `aria-label` on close button
- ESC key to close
- Focus management

#### Forms
- Label associations
- Required field indicators
- HTML5 validation with helpful messages
- `aria-label` on form controls

### Mobile Responsive

- **Table**: Horizontal scroll on small screens
- **Drawer**: Full width on mobile (<768px)
- **Stats**: Stack to single column
- **Filters**: Wrap and stack
- **Actions**: Full width buttons

### Styling

Modern, clean design with:
- Smooth transitions and animations
- Hover states on interactive elements
- Loading skeleton animation
- Badge components for status
- Professional typography
- Consistent spacing (8px grid system)
- CSS custom properties for theming

### Performance

- Client-side operations (no backend calls for sort/filter/search)
- Efficient DOM updates
- Simulated latency (200-400ms) for realistic UX
- Lazy loading of department/branch data
- Single event delegation where possible

## CSS Components

### Table Container
`.table-container` - Main wrapper with border and radius

### Table Header
`.table-header` - Filters, search, and actions
- `.table-search` - Search input container
- `.table-filters` - Filter dropdowns container
- `.table-actions` - Action buttons container

### Data Table
`.data-table` - Main table element
- `.sortable` - Sortable column headers with indicators
- `tbody tr:hover` - Row hover effect

### Pagination
`.table-footer` - Footer with info and pagination
- `.table-pagination` - Page buttons
- `.table-per-page` - Items per page selector

### Drawer
`.drawer` - Slide-out panel
- `.drawer-overlay` - Background overlay
- `.drawer-header` - Title and close button
- `.drawer-body` - Scrollable content
- `.drawer-footer` - Action buttons

### Tabs
`.tabs` - Tab navigation
- `.tab-button` - Individual tab
- `.tab-button.active` - Active tab with border
- `.tab-content` - Tab panel content

### Profile Display
`.profile-section` - Section wrapper
- `.profile-grid` - 2-column grid
- `.profile-field` - Individual field
- `.profile-field-label` - Field label (uppercase, small)
- `.profile-field-value` - Field value (bold)

### Loading & Empty States
`.table-skeleton` - Animated loading skeleton
`.table-empty` - Empty state with icon and message

## Usage in Other Pages

The DataTable module is fully reusable. Example for a Users page:

```javascript
import { DataTable } from '../assets/js/ui/table.js';

const usersTable = new DataTable('usersTableContainer', {
  columns: [
    {
      key: 'username',
      label: 'Username',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => `<span class="badge badge-${row.role}">${row.role}</span>`
    }
  ],
  data: [],
  searchable: true,
  sortable: true,
  pagination: true,
  filters: [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    }
  ],
  actions: [
    {
      key: 'add',
      label: 'Add User',
      className: 'btn-primary',
      onClick: () => showAddUserModal()
    }
  ],
  onRowClick: (row) => showUserDetails(row)
});

// Load data
const users = await getUsers();
usersTable.setData(users.data);
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

None! Pure vanilla JavaScript and CSS.

## File Sizes

- table.js: 10.2 KB (minified: ~4 KB)
- table-advanced.css: 6.9 KB (minified: ~3 KB)
- employees.js: 25.6 KB (minified: ~10 KB)

## Performance Notes

- No virtual scrolling (suitable for datasets < 1000 rows)
- Client-side filtering/sorting (instant response)
- Efficient re-renders (only updates changed parts)
- Smooth 60fps animations

## Future Enhancements

Potential additions:
- Column resizing
- Column visibility toggle
- Export to CSV/Excel
- Bulk actions (select multiple rows)
- Inline editing
- Virtual scrolling for large datasets
- Server-side pagination option
- Column pinning/freezing
- Advanced filtering (date ranges, multi-select)
