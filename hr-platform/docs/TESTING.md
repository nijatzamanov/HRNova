# Complete Testing Checklist - HR Platform Basic v1

## 🧪 Test Environment Setup

```bash
# Start local server
python3 -m http.server 8000

# OR
php -S localhost:8000

# Open browser
http://localhost:8000
```

---

## ✅ LANDING PAGE (`index.html`)

### Layout & Design
- [ ] Hero section displays correctly (title, subtitle, CTA buttons)
- [ ] Feature cards (4 items) render properly with icons
- [ ] Pricing section shows 2 plans (Basic/Pro)
- [ ] Footer displays with links and social icons
- [ ] Header sticky/fixed on scroll
- [ ] All spacing consistent and professional

### Responsive
- [ ] Mobile (360px): Single column, hamburger menu
- [ ] Tablet (768px): 2-column grid for features
- [ ] Desktop (1024px+): Full layout with 4-column grid

### Interactions
- [ ] Language dropdown opens on click
- [ ] Language dropdown closes on outside click
- [ ] Language dropdown closes on ESC key
- [ ] Smooth scroll to #features section
- [ ] Smooth scroll to #pricing section
- [ ] CTA buttons link to dashboard. html
- [ ] Hover states on all buttons and cards

### Multi-Language
- [ ] Switch to Azerbaijani (AZ) - all text updates
- [ ] Switch to Russian (RU) - all text updates
- [ ] Switch to Turkish (TR) - all text updates
- [ ] Switch back to English (EN) - all text updates
- [ ] Language preference persists after page refresh
- [ ] Current language displays in dropdown toggle

---

## ✅ DASHBOARD PAGE (`dashboard.html`)

### Layout
- [ ] Header displays with logo and user dropdown
- [ ] Sidebar shows navigation menu (5 main items + settings)
- [ ] Main content area shows summary cards (4 cards)
- [ ] Quick actions section displays (3 buttons)
- [ ] Recent activity list shows (5 items)
- [ ] Upcoming events list shows (3 items)

### Sidebar Navigation
- [ ] Mobile (<1024px): Sidebar hidden by default
- [ ] Mobile:  Menu button toggles sidebar
- [ ] Mobile: Overlay appears when sidebar open
- [ ] Mobile: Click overlay closes sidebar
- [ ] Desktop (≥1024px): Sidebar always visible
- [ ] Active page highlighted in sidebar
- [ ] Badge shows "3" on Leave Management link

### Summary Cards
- [ ] Cards display correct labels (i18n keys)
- [ ] Numbers/statistics visible
- [ ] Icons render correctly
- [ ] Hover effect on cards
- [ ] Responsive:  1 column mobile, 2 tablet, 4 desktop

### Interactions
- [ ] Language switcher works
- [ ] User dropdown opens/closes properly
- [ ] User dropdown closes on ESC
- [ ] User dropdown closes on outside click
- [ ] Quick action buttons link to correct pages
- [ ] Activity feed loads from mock data
- [ ] Events list displays correctly
- [ ] Sidebar links navigate properly

---

## ✅ EMPLOYEES PAGE (`employees.html`)

### Display
- [ ] Page title "Employees" displays
- [ ] "Add Employee" button visible
- [ ] Search input renders
- [ ] Filter dropdowns render (Department, Status)
- [ ] Employee cards display in grid (4 columns desktop)
- [ ] Empty state shows when no results

### Employee Cards
- [ ] Avatar displays
- [ ] Name shows correctly
- [ ] Position shows
- [ ] Department badge displays
- [ ] Edit button (pencil icon) visible
- [ ] Delete button (trash icon) visible
- [ ] Hover effect on cards

### Search & Filter
- [ ] Search filters employees in real-time
- [ ] Search by name works
- [ ] Search by email works
- [ ] Search by position works
- [ ] Department filter works (Engineering, HR, Sales, Marketing)
- [ ] Status filter works (Active, Inactive)
- [ ] Combined filters work together
- [ ] Clear search shows all employees again

### Add Employee Modal
- [ ] Click "Add Employee" opens modal
- [ ] Modal backdrop appears
- [ ] Modal animates in smoothly
- [ ] Form fields display:
    - [ ] Name (required)
    - [ ] Email (required)
    - [ ] Phone
    - [ ] Position (required)
    - [ ] Department dropdown (required)
    - [ ] Hire Date (required)
    - [ ] Status dropdown (Active/Inactive)

### Modal Interactions
- [ ] Click backdrop closes modal
- [ ] Click X button closes modal
- [ ] ESC key closes modal
- [ ] Click Cancel closes modal
- [ ] Focus trap works (TAB cycles inside modal)
- [ ] Focus returns to trigger button after close

### Form Validation
- [ ] Empty required fields show error on submit
- [ ] Invalid email format shows error
- [ ] Error messages display in red
- [ ] Error border appears on invalid fields
- [ ] Valid submission clears errors

### CRUD Operations
- [ ] Submit valid form creates new employee
- [ ] New employee appears in grid
- [ ] Toast notification shows on success
- [ ] Click Edit opens modal with data pre-filled
- [ ] Update employee saves changes
- [ ] Updated data reflects in grid
- [ ] Click Delete shows confirmation
- [ ] Confirm delete removes employee
- [ ] Cancel delete keeps employee

---

## ✅ LEAVE MANAGEMENT PAGE (`leaves.html`)

### Display
- [ ] Page title "Leave Management" displays
- [ ] "New Request" button visible
- [ ] Leave balance card shows (3 leave types)
- [ ] Balance displays:  remaining / total days
- [ ] Tabs render (Pending, Approved, Rejected)
- [ ] Default tab "Pending" is active

### Leave Balance Card
- [ ] Vacation:  15 / 20 days
- [ ] Sick Leave: 10 / 10 days
- [ ] Personal Leave: 3 / 5 days
- [ ] Year badge shows "2025"

### Tabs Navigation
- [ ] Click "Approved" switches to approved tab
- [ ] Click "Rejected" switches to rejected tab
- [ ] Click "Pending" returns to pending tab
- [ ] Active tab highlighted
- [ ] Tab content switches correctly
- [ ] Keyboard arrow keys navigate tabs

### Pending Requests Table
- [ ] Table displays with columns:  Employee, Type, Start, End, Days, Reason, Actions
- [ ] Mock data loads (3 pending requests)
- [ ] Approve button (green) visible
- [ ] Reject button (red) visible
- [ ] Empty state shows if no pending

### Approved/Rejected Tables
- [ ] Approved tab shows approved requests
- [ ] Rejected tab shows rejected requests
- [ ] No action buttons on these tabs
- [ ] Badge colors:  green (approved), red (rejected)

### New Leave Request Modal
- [ ] Click "New Request" opens modal
- [ ] Form fields display:
    - [ ] Leave Type dropdown (required)
    - [ ] Start Date (required)
    - [ ] End Date (required)
    - [ ] Reason textarea
- [ ] Date inputs have min=today

### Leave Request Actions
- [ ] Submit valid request creates leave
- [ ] New request appears in Pending tab
- [ ] Toast shows success message
- [ ] Click Approve changes status to approved
- [ ] Approved request moves to Approved tab
- [ ] Click Reject prompts for reason
- [ ] Rejected request moves to Rejected tab

### Validation
- [ ] Empty leave type shows error
- [ ] Empty dates show error
- [ ] End date before start date shows error
- [ ] Valid form clears errors

---

## ✅ DOCUMENTS PAGE (`documents.html`)

### Display
- [ ] Page title "Documents" displays
- [ ] "Upload Document" button visible
- [ ] Category filters display (All, Policies, Contracts, Handbooks, Certificates)
- [ ] Search input renders
- [ ] Document cards display in grid
- [ ] Empty state shows when no results

### Category Filters
- [ ] "All Documents" active by default
- [ ] Click "Policies" filters to policies only
- [ ] Click "Contracts" filters to contracts
- [ ] Click "Handbooks" filters to handbooks
- [ ] Click "Certificates" filters to certificates
- [ ] Active filter highlighted (blue background)

### Document Cards
- [ ] File icon displays
- [ ] Document name shows
- [ ] File size shows
- [ ] Upload date shows
- [ ] Download button visible
- [ ] Delete button visible
- [ ] Hover effect on cards

### Search
- [ ] Search filters documents by name
- [ ] Search filters by uploader
- [ ] Search works with category filter
- [ ] Clear search shows filtered category documents

### Upload Document Modal
- [ ] Click "Upload Document" opens modal
- [ ] Form fields display:
    - [ ] Document Name (required)
    - [ ] Category dropdown (required)
    - [ ] Assign to Employee (optional)
    - [ ] Expiry Date (optional)
    - [ ] File picker
- [ ] "Choose File" button works
- [ ] Selected file name displays
- [ ] File type hint shows (PDF, DOC, DOCX, XLS, XLSX)

### Document Actions
- [ ] Click "Upload" validates form
- [ ] Valid upload creates document
- [ ] New document appears in grid
- [ ] Toast shows success
- [ ] Click "Download" shows download toast (mock)
- [ ] Click Delete confirms deletion
- [ ] Confirm removes document

---

## ✅ ANNOUNCEMENTS PAGE (`announcements.html`)

### Display
- [ ] Page title "Announcements" displays
- [ ] "Create Announcement" button visible
- [ ] Announcements feed displays (5 mock items)
- [ ] Empty state shows if no announcements

### Announcement Cards
- [ ] Title displays
- [ ] Message shows (formatted with line breaks)
- [ ] Priority badge shows for high priority
- [ ] "New" badge shows for unread
- [ ] Author avatar displays
- [ ] Author name shows
- [ ] Timestamp shows (relative:  "3h ago", "2d ago")
- [ ] Audience label shows
- [ ] Delete button visible
- [ ] "Mark as Read" button for unread items
- [ ] Color-coded left border (high=red, normal=blue, low=gray)

### Create Announcement Modal
- [ ] Click "Create Announcement" opens modal
- [ ] Form fields display:
    - [ ] Title (required)
    - [ ] Message textarea (required)
    - [ ] Priority dropdown (Low, Normal, High)
    - [ ] Audience dropdown (All Employees, Departments)
- [ ] Default priority:  Normal
- [ ] Default audience: All Employees

### Announcement Actions
- [ ] Submit valid form creates announcement
- [ ] New announcement appears at top of feed
- [ ] Toast shows success
- [ ] Click "Mark as Read" removes "New" badge
- [ ] Click Delete confirms deletion
- [ ] Confirm removes announcement

---

## ✅ SETTINGS PAGE (`settings.html`)

### Display
- [ ] Page title "Settings" displays
- [ ] "Company Information" section shows
- [ ] "Departments" section shows
- [ ] "Leave Types" section shows

### Company Information
- [ ] Company Name input pre-filled
- [ ] Timezone dropdown shows options
- [ ] "Save Changes" button visible
- [ ] Click Save shows success toast

### Departments Section
- [ ] "Add Department" button visible
- [ ] Table displays departments (6 mock items)
- [ ] Columns: Name, Employee Count, Actions
- [ ] Delete button in each row

### Departments Modal
- [ ] Click "Add Department" opens modal
- [ ] Department Name input displays
- [ ] Submit empty name shows error
- [ ] Submit valid name creates department
- [ ] New department appears in table
- [ ] Delete department confirms
- [ ] Cannot delete department with employees

### Leave Types Section
- [ ] "Add Leave Type" button visible
- [ ] Table displays leave types (3 items:  Vacation, Sick, Personal)
- [ ] Columns: Leave Type, Annual Quota, Actions
- [ ] Delete button in each row

### Leave Types Modal
- [ ] Click "Add Leave Type" opens modal
- [ ] Form fields:
    - [ ] Leave Type Name (required)
    - [ ] Annual Quota (required, min=1)
- [ ] Submit empty fields shows error
- [ ] Submit valid data creates leave type
- [ ] New type appears in table
- [ ] Delete leave type confirms

---

## ✅ GLOBAL COMPONENTS

### Header
- [ ] Logo links to dashboard
- [ ] Language dropdown works on all pages
- [ ] User dropdown works on all pages
- [ ] Menu toggle button (mobile) works
- [ ] Header fixed/sticky on scroll

### Sidebar
- [ ] All navigation links work
- [ ] Active page highlighted
- [ ] Badge updates dynamically
- [ ] Smooth transitions
- [ ] Scroll behavior if content overflows

### Modals (All Pages)
- [ ] Open animation smooth
- [ ] Close on backdrop click
- [ ] Close on ESC key
- [ ] Close on X button
- [ ] Close on Cancel button
- [ ] Focus trap active
- [ ] Focus restored after close
- [ ] Body scroll locked when open
- [ ] Multiple modals don't conflict

### Dropdowns (All Pages)
- [ ] Open on click
- [ ] Close on outside click
- [ ] Close on ESC key
- [ ] Close on item select
- [ ] Arrow icon rotates when open
- [ ] aria-expanded updates

### Toasts (All Pages)
- [ ] Success toast (green border, check icon)
- [ ] Error toast (red border, X icon)
- [ ] Warning toast (yellow border, warning icon)
- [ ] Info toast (blue border, i icon)
- [ ] Auto-dismiss after 5 seconds
- [ ] Close button works
- [ ] Slide-in animation
- [ ] Slide-out animation
- [ ] Multiple toasts stack correctly

### Forms (All Pages)
- [ ] Required field indicator (red asterisk)
- [ ] Validation on submit
- [ ] Error messages display
- [ ] Error borders on invalid fields
- [ ] Clear errors on fix
- [ ] Disable submit during processing
- [ ] Enter key submits form

---

## ✅ ACCESSIBILITY

### Keyboard Navigation
- [ ] TAB moves focus forward
- [ ] SHIFT+TAB moves focus backward
- [ ] Focus visible (outline)
- [ ] Skip links work
- [ ] Modal focus trap works
- [ ] Dropdown keyboard support (arrows, ESC, ENTER)
- [ ] Tabs keyboard navigation (arrows)

### Screen Readers
- [ ] All images have alt text
- [ ] Icon buttons have aria-label
- [ ] Modals have role="dialog"
- [ ] Dropdowns have aria-expanded
- [ ] Form errors associated with inputs
- [ ] Landmarks (nav, main, footer) present

### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Color not sole indicator (icons + text)

---

## ✅ MULTI-LANGUAGE (i18n)

### Language Switching
- [ ] EN → AZ:  All text updates
- [ ] EN → RU: All text updates
- [ ] EN → TR: All text updates
- [ ] Language persists after refresh
- [ ] Language persists across pages
- [ ] Placeholders translate
- [ ] aria-labels translate
- [ ] Date formats localize

### Translation Coverage
- [ ] Landing page fully translated
- [ ] Dashboard fully translated
- [ ] Employees page fully translated
- [ ] Leaves page fully translated
- [ ] Documents page fully translated
- [ ] Announcements page fully translated
- [ ] Settings page fully translated
- [ ] All modals translated
- [ ] All toasts translated
- [ ] All form labels translated

---

## ✅ PERFORMANCE

### Load Times
- [ ] Landing page loads < 2s
- [ ] Dashboard loads < 2s
- [ ] Page transitions smooth
- [ ] No layout shift (CLS)
- [ ] Images optimized

### Interactions
- [ ] Modals open/close smoothly
- [ ] Dropdowns respond instantly
- [ ] Search filters in real-time (no lag)
- [ ] Tables render quickly (<100 items)
- [ ] Animations 60fps

---

## ✅ BROWSER COMPATIBILITY

### Desktop Browsers
- [ ] Chrome 90+ (Windows/Mac/Linux)
- [ ] Firefox 88+
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+

### Mobile Browsers
- [ ] iOS Safari 14+
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

### Responsive Breakpoints
- [ ] 360px (small mobile)
- [ ] 375px (iPhone SE)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)
- [ ] 1440px (large desktop)

---

## ✅ EDGE CASES

### Empty States
- [ ] No employees:  empty state shows
- [ ] No leaves: empty state shows
- [ ] No documents: empty state shows
- [ ] No announcements: empty state shows
- [ ] No search results: empty state shows

### Long Content
- [ ] Long employee names truncate
- [ ] Long announcement messages scroll
- [ ] Long document names wrap
- [ ] Long form errors display properly

### Rapid Interactions
- [ ] Double-click doesn't create duplicates
- [ ] Rapid modal open/close stable
- [ ] Fast typing in search doesn't break
- [ ] Multiple quick filter changes work

---

## 🐛 Known Issues / Limitations (Basic v1)

- [ ] No backend (all data mock/client-side)
- [ ] No real authentication
- [ ] No data persistence (localStorage only for language)
- [ ] File uploads are mocked (no actual upload)
- [ ] Download actions are mocked
- [ ] Date pickers use native browser input
- [ ] No pagination (all data loads at once)
- [ ] No email notifications
- [ ] No real-time updates
- [ ] No dark mode (structure ready for MVP)

---

## ✅ FINAL SIGN-OFF

- [ ] All critical paths tested
- [ ] All modals open/close properly
- [ ] All forms validate correctly
- [ ] All CRUD operations work
- [ ] Multi-language fully functional
- [ ] Mobile responsive works
- [ ] Accessibility baseline met
- [ ] No console errors
- [ ] No broken links
- [ ] Ready for MVP phase

---

**Tested by:** _______________  
**Date:** _______________  
**Version:** Basic v1.0  
**Status:** ☐ Pass  ☐ Fail  ☐ Needs Revision