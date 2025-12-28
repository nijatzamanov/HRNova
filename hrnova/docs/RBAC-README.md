# RBAC (Role-Based Access Control) Implementation

## Overview

The HRNova dashboard includes a flexible RBAC system that controls menu visibility based on user permissions. The system is ready for production use with real authentication.

## Architecture

### Files

- `src/assets/js/app/menuConfig.js` - Menu configuration with permissions
- `src/assets/js/services/auth.js` - Authentication and permission checking
- `src/assets/js/app/boot.js` - Dynamic sidebar rendering based on permissions
- `src/assets/js/app/rbac-example.js` - Demo utilities for testing RBAC

### Menu Configuration

Each menu item has:
- `key`: Unique identifier
- `label`: Display name
- `href`: Page URL
- `icon`: Inline SVG icon
- `requiredPermission`: Permission string needed to view this item

```javascript
{
  key: 'employees',
  label: 'Employees',
  href: '/src/partials/employees.html',
  icon: `<svg>...</svg>`,
  requiredPermission: 'view:employees'
}
```

## Menu Items & Permissions

| Menu Item      | Permission Key         |
|----------------|------------------------|
| Dashboard      | view:dashboard         |
| Users          | view:users             |
| Company        | view:company           |
| Employees      | view:employees         |
| Migration      | view:migration         |
| Leave          | view:leave             |
| Attendance     | view:attendance        |
| Reports        | view:reports           |
| Announcements  | view:announcements     |
| Settings       | view:settings          |
| Updates        | view:updates           |

## Permission System

### Special Permissions

- `*` - Wildcard permission, grants access to all menu items

### User Object Structure

```javascript
{
  id: 'user-001',
  name: 'Admin User',
  email: 'admin@hrnova.com',
  role: 'HR Manager',
  permissions: ['*'] // or specific permissions array
}
```

## Usage

### Setting User Permissions

```javascript
import { AuthService } from './services/auth.js';

// Set user with specific permissions
AuthService.setCurrentUser({
  id: 'user-001',
  name: 'Jane Doe',
  email: 'jane@company.com',
  role: 'HR Manager',
  permissions: [
    'view:dashboard',
    'view:employees',
    'view:leave',
    'view:attendance',
    'view:reports'
  ]
});
```

### Checking Permissions

```javascript
import { AuthService } from './services/auth.js';

// Check single permission
if (AuthService.hasPermission('view:employees')) {
  // Show employee management features
}

// Check any permission from array
if (AuthService.hasAnyPermission(['view:employees', 'view:users'])) {
  // User has at least one of these permissions
}

// Check all permissions
if (AuthService.hasAllPermissions(['view:employees', 'view:reports'])) {
  // User has all these permissions
}
```

## Testing RBAC (Development Only)

Open browser console and try these commands:

```javascript
// Full admin access
rbacDemo.admin();

// HR Manager (limited access)
rbacDemo.hrManager();

// Regular employee (minimal access)
rbacDemo.employee();

// Department manager
rbacDemo.manager();

// Custom permissions
rbacDemo.custom(['view:dashboard', 'view:reports']);
```

## Integration with Real Auth

### Replace Mock User Initialization

In `boot.js`, replace `initializeMockUser()` with your real auth:

```javascript
// Before (mock)
initializeMockUser();

// After (real auth)
const userData = await fetchCurrentUserFromAPI();
AuthService.setCurrentUser({
  id: userData.id,
  name: userData.name,
  email: userData.email,
  role: userData.role,
  permissions: userData.permissions // from your backend
});
```

### Supabase Integration Example

```javascript
import { createClient } from '@supabase/supabase-js';
import { AuthService } from './services/auth.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Fetch user permissions from your database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('permissions, role')
      .eq('user_id', user.id)
      .single();

    AuthService.setCurrentUser({
      id: user.id,
      name: user.user_metadata.name,
      email: user.email,
      role: profile.role,
      permissions: profile.permissions
    });
  }
}
```

## Adding New Menu Items

1. Add to `menuConfig.js`:

```javascript
{
  key: 'new-feature',
  label: 'New Feature',
  href: '/src/partials/new-feature.html',
  icon: `<svg>...</svg>`,
  requiredPermission: 'view:new-feature'
}
```

2. Create the page: `src/pages/new-feature.html`

3. Grant permission to users in your backend

## Security Notes

- **Never trust client-side permissions alone** - Always validate on the server
- Menu visibility is for UX only - protect API endpoints with server-side permission checks
- Store permissions securely in your database
- Implement proper session management
- Use HTTPS in production
- Validate all user inputs on the server

## Best Practices

1. **Consistent naming**: Use format `action:resource` (e.g., `view:employees`, `edit:reports`)
2. **Granular permissions**: Prefer specific permissions over broad ones
3. **Role mapping**: Map roles to permissions in your backend, not frontend
4. **Audit logging**: Log permission checks and changes
5. **Permission groups**: Consider grouping related permissions

## Example Permission Sets

### Admin
```javascript
['*']
```

### HR Manager
```javascript
[
  'view:dashboard',
  'view:users',
  'view:employees',
  'view:leave',
  'view:attendance',
  'view:reports',
  'view:announcements',
  'view:settings'
]
```

### Manager
```javascript
[
  'view:dashboard',
  'view:employees',
  'view:attendance',
  'view:reports',
  'view:announcements'
]
```

### Employee
```javascript
[
  'view:dashboard',
  'view:leave',
  'view:announcements'
]
```
