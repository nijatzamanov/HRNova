# HR Management Platform - Feature Breakdown

## 📋 Overview

This document provides a detailed breakdown of all features in the HR Platform Basic Version, organized by module with technical implementation notes.

---

## 🏠 LANDING PAGE

### Hero Section
**Purpose**: Capture attention and communicate value proposition  
**Components**:
- H1 title (i18n: `landing.hero_title`)
- Subtitle paragraph (i18n: `landing.hero_subtitle`)
- 2 CTA buttons:  "Start Free" and "View Demo"
- Hero illustration (SVG placeholder)

**Implementation**:
- CSS Grid layout (1 column mobile, 2 columns desktop)
- Gradient background (`linear-gradient`)
- Smooth scroll to sections on anchor click

**Files**:
- `index.html` (lines 60-95)
- `/assets/css/pages/landing.css` (.hero section)
- `/assets/js/pages/landing.js` (smooth scroll)

---

### Features Section
**Purpose**: Highlight key platform capabilities  
**Components**:
- 4 feature cards:
    1. Employee Directory
    2. Leave Management
    3. Document Storage
    4. Announcements
- Each card has icon, title, description

**Implementation**:
- CSS Grid:  1 column mobile, 2 tablet, 4 desktop
- Icons: Inline SVG (24x24, 2px stroke)
- Hover effect: subtle shadow increase

**Files**:
- `index.html` (lines 97-180)
- `/assets/css/pages/landing.css` (.features section)

---

### Pricing Section
**Purpose**: Show pricing tiers and encourage signup  
**Components**:
- 2 pricing cards:  Basic (Free) and Pro (Coming Soon)
- Feature list bullets
- CTA buttons

**Implementation**:
- CSS Grid: 1 column mobile, 2 desktop
- Pro card has "Pro" badge and blue border
- Disabled state for "Coming Soon" button

**Files**:
- `index.html` (lines 182-250)
- `/assets/css/pages/landing.css` (.pricing section)

---

### Language Switcher
**Purpose**: Allow visitors to select preferred language  
**Components**:
- Dropdown in header with 4 options (EN/AZ/RU/TR)
- Current language indicator

**Implementation**:
- Dropdown component (reusable)
- Persists selection to localStorage
- Reloads translations via `I18n.setLanguage()`

**Technical Details**:
```javascript
// Event listener in i18n.js
document.addEventListener('click', (e) => {
  const langBtn = e.target.closest('[data-lang]');
  if (langBtn) {
    const lang = langBtn.getAttribute('data-lang');
    I18n.setLanguage(lang);
  }
});
```

---

## 📊 DASHBOARD

### Summary Cards
**Purpose**: Display key HR metrics at a glance  
**Components**:
- 4 stat cards:
    1. Total Employees (24, +2 this month)
    2. Pending Leaves (3)
    3. Active Announcements (5)
    4. Total Documents (142)
- Each card has icon, label, value, optional trend

**Implementation**:
- CSS Grid: 1/2/4 columns based on breakpoint
- Icons: 24x24 SVG in colored background circle
- Trend indicator:  green (up) or red (down) with arrow

**Data Source**:
- Mock data (hardcoded in HTML for Basic v1)
- MVP: Will fetch from API endpoints

**Files**:
- `dashboard.html` (lines 120-200)
- `/assets/css/pages/dashboard.css` (.stat-card)
- `/assets/js/pages/dashboard.js` (updateStats method - for future)

---

### Quick Actions
**Purpose**: Fast access to common tasks  
**Components**:
- 3 action buttons:
    1. Add Employee → employees.html
    2. New Announcement → announcements.html
    3. Upload Document → documents.html

**Implementation**:
- Flexbox layout, wraps on mobile
- Each button has icon + text
- Links directly to target pages

**Files**:
- `dashboard.html` (lines 202-230)
- `/assets/css/pages/dashboard.css` (.quick-actions)

---

### Recent Activity Feed
**Purpose**: Show timeline of recent HR events  
**Components**:
- List of 5 most recent activities
- Each item:  icon, description, timestamp

**Data Structure**:
```json
{
  "id": "act001",
  "type": "employee_added",
  "description": "Leyla Əhmədova joined as Frontend Developer",
  "timestamp": "2025-12-18T09:30:00Z"
}
```

**Implementation**:
- Loads from `/data/activity.json`
- Renders with relative timestamps ("3h ago", "2d ago")
- Icons based on activity type

**Files**:
- `dashboard.html` (lines 232-250)
- `/assets/js/pages/dashboard.js` (loadActivity method)
- `/data/activity.json`

---

### Upcoming Events
**Purpose**: Display upcoming birthdays, meetings, reviews  
**Components**:
- List of next 3 events
- Each item: icon, title, date

**Implementation**:
- Mock data (hardcoded in JS for Basic v1)
- Date formatting localized via `Intl.DateTimeFormat`
- MVP: Will integrate with calendar module

**Files**:
- `dashboard.html` (lines 252-270)
- `/assets/js/pages/dashboard.js` (loadUpcomingEvents method)

---

## 👥 EMPLOYEES MODULE

### Employee Directory
**Purpose**: Browse and search all employees  
**Components**:
- Grid of employee cards (4 columns desktop)
- Each card: avatar, name, position, department badge
- Edit and Delete buttons

**Data Structure**:
```json
{
  "id": "emp001",
  "name": "Ayşe Əliyeva",
  "email": "ayse.aliyeva@company.com",
  "phone": "+994 50 123 4567",
  "position": "Senior Software Engineer",
  "department": "engineering",
  "hireDate": "2022-01-15",
  "status": "active",
  "avatar": "./assets/img/placeholders/avatar.svg"
}
```

**Implementation**:
- Loads from `/data/employees.json`
- Client-side filtering (no server calls)
- Responsive grid:  1/2/4 columns

**Files**:
- `employees.html` (lines 150-180)
- `/assets/js/pages/employees.js` (renderEmployees method)
- `/data/employees.json`

---

### Search & Filter
**Purpose**: Find employees quickly  
**Components**:
- Search input (filters by name, email, position)
- Department dropdown filter
- Status dropdown filter (Active/Inactive)

**Implementation**:
- Real-time search (input event listener)
- Combined filters (department AND status AND search)
- Debounce: None (instant feedback, small dataset)

**Algorithm**:
```javascript
filteredEmployees = employees.filter(emp => {
  const searchMatch = ! query || 
    emp.name. toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query) ||
    emp.position.toLowerCase().includes(query);
  
  const deptMatch = ! deptFilter || emp.department === deptFilter;
  const statusMatch = !statusFilter || emp.status === statusFilter;
  
  return searchMatch && deptMatch && statusMatch;
});
```

**Files**:
- `employees.html` (lines 120-148)
- `/assets/js/pages/employees.js` (handleSearch, applyFilters methods)

---

### Add/Edit Employee
**Purpose**: Create or modify employee records  
**Components**:
- Modal dialog with form
- 8 fields: name, email, phone, position, department, hire date, status, photo
- Validation indicators

**Validation Rules**:
- Name: Required
- Email: Required, valid format
- Phone: Optional, no validation
- Position: Required
- Department: Required, select from list
- Hire Date: Required, date format
- Status: Default "active"
- Photo:  Placeholder only (no upload in Basic v1)

**Implementation**:
- Modal opens via `Modal.get('employeeModal').open()`
- Form validation on submit
- Edit mode pre-fills form with employee data
- Save creates/updates in-memory array

**Files**:
- `employees.html` (lines 182-280, modal markup)
- `/assets/js/pages/employees.js` (saveEmployee method)
- `/assets/js/components/modal.js` (Modal class)

---

### Delete Employee
**Purpose**: Remove employee from system  
**Components**:
- Confirmation dialog (native `confirm()` for Basic v1)
- Delete button in employee card

**Implementation**:
- Click Delete → Show confirmation
- Confirm → Remove from array → Re-render grid → Show toast
- Cancel → No action

**Future Enhancement** (MVP):
- Custom confirmation modal (instead of native)
- Soft delete (mark as inactive instead of remove)
- Archive old employees

**Files**:
- `/assets/js/pages/employees. js` (deleteEmployee method)

---

## 📅 LEAVE MANAGEMENT

### Leave Balance Tracking
**Purpose**: Display employee's remaining leave days  
**Components**:
- Balance card with 3 leave types:
    1. Vacation:  15/20 days
    2. Sick Leave: 10/10 days
    3. Personal Leave: 3/5 days
- Year badge (2025)

**Implementation**:
- Hardcoded in HTML for Basic v1
- MVP:  Fetch from API per logged-in user
- Calculate:  `quota - used = remaining`

**Business Rules**:
- Vacation:  20 days/year (Azerbaijan labor law)
- Sick Leave: 10 days/year
- Personal Leave: 5 days/year
- No carry-over (resets Jan 1)

**Files**:
- `leaves.html` (lines 120-160)
- `/assets/css/pages/leaves.css` (.leave-balance-card)

---

### Leave Request Workflow
**Purpose**: Submit and approve leave requests  
**Components**:
- "New Request" button
- Modal form:  type, start date, end date, reason
- 3 tabs: Pending, Approved, Rejected

**Workflow**:
1. Employee submits request → Status:  Pending
2. Manager approves/rejects → Status changes
3. Approved requests move to Approved tab
4. Rejected requests move to Rejected tab

**Data Structure**:
```json
{
  "id": "leave001",
  "employeeId": "emp001",
  "employeeName": "Ayşe Əliyeva",
  "leaveType": "vacation",
  "startDate": "2025-12-23",
  "endDate": "2025-12-27",
  "days": 5,
  "reason": "Family vacation",
  "status": "pending",
  "requestedAt": "2025-12-15T10:30:00Z"
}
```

**Implementation**:
- Loads from `/data/leaves.json`
- Days calculated:  `Math.ceil((endDate - startDate) / 86400000) + 1`
- Actions: approve, reject (updates status in-memory)

**Files**:
- `leaves.html` (lines 162-280)
- `/assets/js/pages/leaves.js` (submitLeaveRequest, approveLeave, rejectLeave)
- `/data/leaves.json`

---

### Tabs Navigation
**Purpose**: Organize requests by status  
**Components**:
- 3 tabs:  Pending / Approved / Rejected
- Table for each tab

**Implementation**:
- Tabs component (reusable)
- Click tab → Hide all panels → Show active panel
- Keyboard:  Arrow keys navigate tabs

**Files**:
- `leaves.html` (lines 162-240)
- `/assets/js/components/tabs.js` (Tabs class)
- `/assets/css/components/tabs.css`

---

## 📄 DOCUMENTS MODULE

### Category-Based Organization
**Purpose**: Group documents by type  
**Components**:
- 5 category filters:
    1. All Documents
    2. Policies
    3. Contracts
    4. Handbooks
    5. Certificates
- Document cards with icon, name, size, date

**Data Structure**:
```json
{
  "id": "doc001",
  "name": "Employee Handbook 2025",
  "category": "handbooks",
  "uploadedBy": "HR Manager",
  "uploadedAt": "2025-12-01T10:00:00Z",
  "size": "2.4 MB",
  "fileType": "PDF",
  "expiryDate": "2026-12-01"
}
```

**Implementation**:
- Mock documents (no real files)
- Filter by category:  `docs.filter(d => d.category === selected)`
- Search combines with category filter

**Files**:
- `documents.html` (lines 120-200)
- `/assets/js/pages/documents.js` (applyFilters method)

---

### Upload Document
**Purpose**: Add new documents to repository  
**Components**:
- "Upload Document" button
- Modal form:  name, category, employee (optional), expiry, file

**Implementation**:
- File input (mock, doesn't actually upload)
- Selected filename displays below button
- Save creates document object with metadata

**Future Enhancement** (MVP):
- Real file upload to server
- File type validation (PDF, DOC, XLS only)
- Max size limit (10MB)
- Virus scanning

**Files**:
- `documents.html` (lines 202-300, modal markup)
- `/assets/js/pages/documents.js` (uploadDocument method)

---

### Download & Delete
**Purpose**: Retrieve or remove documents  
**Components**:
- Download button on each card
- Delete button with confirmation

**Implementation**:
- Download:  Shows toast (mock, no actual download)
- Delete: Confirmation → Remove from array → Re-render

**Files**:
- `/assets/js/pages/documents. js` (downloadDocument, deleteDocument)

---

## 📢 ANNOUNCEMENTS MODULE

### Announcement Feed
**Purpose**: Display company-wide communications  
**Components**:
- List of announcement cards (reverse chronological)
- Each card: title, message, priority badge, author, timestamp

**Data Structure**:
```json
{
  "id": "ann001",
  "title":  "Holiday Schedule 2026",
  "message": "Dear Team,\n\nWe are pleased to share.. .",
  "priority": "high",
  "audience": "all",
  "author": "HR Manager",
  "authorId": "emp002",
  "createdAt": "2025-12-17T14:20:00Z",
  "read": false
}
```

**Implementation**:
- Loads from `/data/announcements.json`
- Priority colors: high (red), normal (blue), low (gray)
- Message preserves line breaks (`white-space: pre-wrap`)

**Files**:
- `announcements.html` (lines 120-180)
- `/assets/js/pages/announcements.js` (renderAnnouncements)
- `/data/announcements.json`

---

### Create Announcement
**Purpose**:  Publish new company updates  
**Components**:
- "Create Announcement" button
- Modal form: title, message (textarea), priority, audience

**Implementation**:
- Title: Required, plain text
- Message: Required, preserves line breaks
- Priority:  Dropdown (Low, Normal, High)
- Audience: All Employees or specific department

**Files**:
- `announcements.html` (lines 182-260, modal markup)
- `/assets/js/pages/announcements.js` (publishAnnouncement)

---

### Mark as Read
**Purpose**: Track which announcements user has seen  
**Components**:
- "Mark as Read" button (only on unread)
- "New" badge on unread announcements

**Implementation**:
- Click → Update `read:  true` → Remove badge → Hide button
- Future (MVP): Store read status per user in database

**Files**:
- `/assets/js/pages/announcements.js` (markAsRead method)

---

## ⚙️ SETTINGS MODULE

### Company Information
**Purpose**: Configure basic company details  
**Components**:
- Company Name input
- Timezone dropdown
- Save button

**Implementation**:
- Pre-filled with mock data
- Save shows success toast (no persistence in Basic v1)
- MVP: Save to database

**Files**:
- `settings.html` (lines 120-150)
- `/assets/js/pages/settings.js` (saveCompanyInfo method)

---

### Department Management
**Purpose**: Maintain list of company departments  
**Components**:
- Table with Name, Employee Count, Actions columns
- "Add Department" button
- Modal form:  Department Name

**Business Rules**:
- Cannot delete department with employees assigned
- Department slug auto-generated from name

**Implementation**:
- Loads from `/data/departments.json`
- Add creates new dept with employeeCount = 0
- Delete checks employeeCount > 0

**Files**:
- `settings.html` (lines 152-200)
- `/assets/js/pages/settings.js` (renderDepartments, saveDepartment, deleteDepartment)
- `/data/departments.json`

---

### Leave Type Configuration
**Purpose**: Define available leave types and quotas  
**Components**:
- Table with Leave Type, Annual Quota, Actions columns
- "Add Leave Type" button
- Modal form: Type Name, Quota (days)

**Default Types**:
1. Vacation: 20 days
2. Sick Leave: 10 days
3. Personal Leave: 5 days

**Implementation**:
- Mock data in JS (not separate JSON file)
- Add creates new type
- Delete removes (no usage check in Basic v1)

**Files**:
- `settings.html` (lines 202-250)
- `/assets/js/pages/settings.js` (renderLeaveTypes, saveLeaveType, deleteLeaveType)

---

## 🧩 GLOBAL COMPONENTS

### Modal Component
**Purpose**: Reusable dialog for forms and confirmations  
**Features**:
- Backdrop with blur effect
- Smooth open/close animations
- Focus trap (TAB cycles inside)
- Close on ESC, backdrop click, X button
- Body scroll lock when open

**API**:
```javascript
const modal = Modal.get('myModalId');
modal.open();  // Opens modal
modal.close(); // Closes modal
modal.toggle(); // Toggles state
```

**Files**:
- `/assets/js/components/modal.js`
- `/assets/css/components/modal.css`

---

### Dropdown Component
**Purpose**: Reusable dropdown menus  
**Features**:
- Opens on toggle click
- Closes on outside click, ESC, item select
- aria-expanded updates
- Keyboard support (future)

**API**:
```javascript
// Auto-initializes all . dropdown elements
// No manual initialization needed
```

**Files**:
- `/assets/js/components/dropdown.js`
- `/assets/css/components/dropdown.css`

---

### Toast Notifications
**Purpose**: User feedback for actions  
**Types**:
- Success (green, checkmark)
- Error (red, X)
- Warning (yellow, exclamation)
- Info (blue, i)

**API**:
```javascript
Toast.success('Title', 'Message');
Toast.error('Title', 'Message');
Toast.warning('Title', 'Message');
Toast.info('Title', 'Message');
```

**Features**:
- Auto-dismiss after 5 seconds
- Manual close button
- Stacks multiple toasts
- Slide-in/out animations

**Files**:
- `/assets/js/components/toast. js`
- `/assets/css/components/toast.css`

---

### Tabs Component
**Purpose**:  Organize content into tabbed sections  
**Features**:
- Click tab to switch content
- Keyboard navigation (arrow keys)
- aria-selected updates
- Only one panel visible at a time

**API**:
```javascript
// Auto-initializes all .tabs elements
// Dispatches 'tabChanged' event
element.addEventListener('tabChanged', (e) => {
  console.log('Active tab index:', e.detail.index);
});
```

**Files**:
- `/assets/js/components/tabs.js`
- `/assets/css/components/tabs. css`

---

## 🌍 INTERNATIONALIZATION (i18n)

### Translation System
**Purpose**: Support multiple languages  
**Supported Languages**:
1. English (en) - Default
2. Azerbaijani (az)
3. Russian (ru)
4. Turkish (tr)

**How It Works**:
1. User selects language from dropdown
2. `I18n.setLanguage(lang)` called
3. Loads `/assets/i18n/{lang}.json`
4. Updates all elements with `data-i18n` attribute
5. Saves preference to localStorage

**Translation Keys**:
- Nested structure: `{ "employees": { "title": "Employees" } }`
- Access via dot notation: `I18n.get('employees.title')`

**Files**:
- `/assets/js/core/i18n.js`
- `/assets/i18n/en.json` (150+ keys)
- `/assets/i18n/az.json`
- `/assets/i18n/ru.json`
- `/assets/i18n/tr. json`

---

## 📊 DATA STRUCTURE

### Employees
```json
{
  "id":  "emp001",
  "name": "Ayşe Əliyeva",
  "email": "ayse.aliyeva@company.com",
  "phone":  "+994 50 123 4567",
  "position": "Senior Software Engineer",
  "department": "engineering",
  "hireDate":  "2022-01-15",
  "status": "active",
  "avatar": "./assets/img/placeholders/avatar.svg"
}
```

### Leaves
```json
{
  "id": "leave001",
  "employeeId": "emp001",
  "employeeName":  "Ayşe Əliyeva",
  "leaveType": "vacation",
  "startDate": "2025-12-23",
  "endDate": "2025-12-27",
  "days": 5,
  "reason": "Family vacation",
  "status": "pending",
  "requestedAt": "2025-12-15T10:30:00Z"
}
```

### Departments
```json
{
  "id": "dept001",
  "name": "Engineering",
  "slug": "engineering",
  "head": "emp001",
  "employeeCount": 12
}
```

### Announcements
```json
{
  "id": "ann001",
  "title": "Holiday Schedule 2026",
  "message": "Dear Team,\n\nWe are pleased.. .",
  "priority": "high",
  "audience": "all",
  "author": "HR Manager",
  "authorId":  "emp002",
  "createdAt": "2025-12-17T14:20:00Z",
  "read": false
}
```

---

## 🔒 SECURITY CONSIDERATIONS (MVP Phase)

### Authentication (Not in Basic v1)
- Login/logout
- Password hashing (bcrypt)
- Session management
- Remember me functionality

### Authorization (Not in Basic v1)
- Role-based access control (RBAC)
- Roles: Admin, Manager, Employee
- Permissions per module

### Data Protection (Not in Basic v1)
- XSS prevention (escape output)
- CSRF tokens on forms
- SQL injection prevention (PDO prepared statements)
- File upload validation
- Rate limiting

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### Current (Basic v1)
- ✅ Zero dependencies (no npm packages)
- ✅ Inline critical CSS (future)
- ✅ Lazy load images (loading="lazy")
- ✅ Minify assets (future, build step)

### Future (MVP)
- [ ] Code splitting (separate JS per page)
- [ ] Service worker (offline support)
- [ ] CDN for static assets
- [ ] Image optimization (WebP format)
- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching strategy (Redis)

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile S   | 360px | 1 column, hamburger menu |
| Mobile L   | 375px | 1 column |
| Tablet     | 768px | 2 columns, sidebar visible on toggle |
| Desktop    | 1024px | 3-4 columns, sidebar always visible |
| Large      | 1440px | Max content width, more spacing |

---

## ♿ ACCESSIBILITY FEATURES

### Current Implementation
- ✅ Semantic HTML (nav, main, section, article)
- ✅ ARIA labels on icon buttons
- ✅ Focus visible (outline)
- ✅ Keyboard navigation (TAB, SHIFT+TAB)
- ✅ Modal focus trap
- ✅ Color contrast ≥ 4.5:1
- ✅ aria-expanded on dropdowns
- ✅ Form error association

### Future Enhancements (MVP)
- [ ] Skip to content link
- [ ] Live regions for dynamic content
- [ ] Reduced motion support
- [ ] Screen reader testing
- [ ] WCAG 2.1 AAA compliance

---

## 📈 ANALYTICS HOOKS (MVP Phase)

### Events to Track
- Page views
- User registration
- Employee CRUD operations
- Leave request submissions
- Document uploads/downloads
- Announcement views
- Search queries
- Filter usage
- Language changes
- Error occurrences

### Implementation
```javascript
// Example: Track employee creation
function trackEvent(category, action, label) {
  if (window.gtag) {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
}

// Usage
trackEvent('Employees', 'create', employeeData. name);
```

---

## 🔄 STATE MANAGEMENT

### Current Approach
- Component-level state (page JS files)
- In-memory arrays (employees, leaves, etc.)
- localStorage for language preference

### Future (MVP)
- Global state management (State. js expanded)
- Vuex/Redux-like pattern
- Persistent state (database sync)

---

## 🧪 TESTING STRATEGY

### Manual Testing (Basic v1)
- See `/docs/TESTING.md` for full checklist
- Cross-browser testing
- Responsive testing
- Accessibility audit

### Automated Testing (MVP)
- Unit tests (Jest)
- Integration tests (Cypress)
- E2E tests (Playwright)
- Visual regression tests

---

## 📚 FUTURE MODULES (Pro Version)

### Payroll
- Salary management
- Payslip generation
- Tax calculations
- Bank integration

### Time Tracking
- Clock in/out
- Timesheet approval
- Overtime calculation
- Project time allocation

### Performance Reviews
- Goal setting
- 360° feedback
- Review cycles
- Performance reports

### Recruitment
- Job postings
- Applicant tracking
- Interview scheduling
- Offer management

### Training
- Course catalog
- Training assignments
- Certificates
- Progress tracking

---

**Document Version**:  1.0  
**Last Updated**: December 2025  
**Maintained By**: Development Team