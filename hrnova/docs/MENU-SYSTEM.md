# Dynamic Menu System with RBAC

## Overview

The sidebar menu is now **dynamically generated** from a centralized configuration with built-in Role-Based Access Control (RBAC) support.

## Menu Configuration

All menu items are defined in `src/assets/js/app/menuConfig.js`:

```javascript
{
  key: 'dashboard',           // Unique identifier
  label: 'Dashboard',         // Display name
  href: '/src/partials/dashboard.html',  // Page URL
  icon: `<svg>...</svg>`,    // Inline SVG
  requiredPermission: 'view:dashboard'  // Permission required
}
```

## Current Menu Items

1. **Dashboard** - `view:dashboard`
2. **Users** - `view:users`
3. **Company** - `view:company`
4. **Employees** - `view:employees`
5. **Migration** - `view:migration`
6. **Leave** - `view:leave`
7. **Attendance** - `view:attendance`
8. **Reports** - `view:reports`
9. **Announcements** - `view:announcements`
10. **Settings** - `view:settings`
11. **Updates** - `view:updates`

## How It Works

### 1. User Authentication
```javascript
// Mock user initialized with full permissions
const mockUser = {
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@hrnova.com',
  role: 'HR Manager',
  permissions: ['*']  // Wildcard = all access
};
```

### 2. Menu Filtering
The system automatically filters menu items based on user permissions:
- Users with `'*'` permission see all items
- Users with specific permissions only see allowed items
- Missing permissions hide menu items entirely

### 3. Dynamic Rendering
```javascript
// In boot.js
const userPermissions = AuthService.getUserPermissions();
const allowedMenuItems = filterMenuByPermissions(userPermissions);
// Render sidebar with filtered items
```

### 4. Active Page Highlighting
The system automatically highlights the current page in the sidebar based on URL matching.

## Testing the System

### Browser Console Commands

Open your browser console and try:

```javascript
// Full admin access (see all menu items)
menuDemo.admin()

// HR Manager (limited menu items)
menuDemo.hrManager()

// Regular employee (minimal access)
menuDemo.employee()

// Department manager
menuDemo.manager()

// Custom permissions
menuDemo.custom(['view:dashboard', 'view:employees', 'view:reports'])
```

### Example: HR Manager Permissions

```javascript
menuDemo.hrManager()

// Shows only:
// - Dashboard
// - Employees
// - Leave
// - Attendance
// - Reports
// - Announcements
```

### Example: Employee Permissions

```javascript
menuDemo.employee()

// Shows only:
// - Dashboard
// - Leave
// - Announcements
```

## Adding New Menu Items

### Step 1: Add to menuConfig.js

```javascript
{
  key: 'payroll',
  label: 'Payroll',
  href: '/src/partials/payroll.html',
  icon: `<svg class="sidebar__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  requiredPermission: 'view:payroll'
}
```

### Step 2: Create the Page

Create `src/pages/payroll.html` with the standard page structure.

### Step 3: Grant Permissions

Update user permissions to include `'view:payroll'`.

## Permission Checking in Code

```javascript
import { AuthService } from './services/auth.js';

// Check if user can access a feature
if (AuthService.hasPermission('view:employees')) {
  // Show employee management UI
}

// Check for any permission
if (AuthService.hasAnyPermission(['view:employees', 'edit:employees'])) {
  // User has at least one permission
}

// Check for all permissions
if (AuthService.hasAllPermissions(['view:reports', 'export:reports'])) {
  // User has all required permissions
}
```

## Production Integration

### Replace Mock Authentication

In `src/assets/js/app/boot.js`, replace:

```javascript
// BEFORE (mock)
initializeMockUser();

// AFTER (real auth)
const user = await fetchUserFromYourAPI();
AuthService.setCurrentUser({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: user.permissions  // from your backend/Supabase
});
```

### Supabase Example

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Fetch user and permissions from Supabase
const { data: { user } } = await supabase.auth.getUser();
const { data: profile } = await supabase
  .from('user_profiles')
  .select('role, permissions')
  .eq('user_id', user.id)
  .single();

AuthService.setCurrentUser({
  id: user.id,
  name: user.user_metadata.name,
  email: user.email,
  role: profile.role,
  permissions: profile.permissions
});
```

## Key Features

✅ **Centralized Configuration** - All menu items in one place
✅ **Dynamic Rendering** - Menu updates based on permissions
✅ **Active State Management** - Automatic page highlighting
✅ **RBAC Ready** - Permission-based access control
✅ **Easy Testing** - Console commands for demo
✅ **Production Ready** - Replace mock auth with real auth
✅ **Type Safety Ready** - Structure supports TypeScript

## Files Modified

- `src/assets/js/app/menuConfig.js` - Menu configuration
- `src/assets/js/app/boot.js` - Dynamic sidebar rendering
- `src/assets/js/app/navigation.js` - Active state management
- `src/assets/js/services/auth.js` - Authentication & permissions
- `src/assets/js/app/menu-demo.js` - Testing utilities

## Security Notes

⚠️ **Important**: Client-side permission checks are for UX only. Always validate permissions on the server/API level.

- Menu visibility ≠ Security
- Protect API endpoints with server-side checks
- Validate all requests on the backend
- Never store sensitive permissions in localStorage without encryption
- Use HTTPS in production
