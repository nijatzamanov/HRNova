import { AuthService } from '../services/auth.js';
import { renderSidebar } from './boot.js';

export function setUserWithPermissions(permissions) {
    const user = {
        id: 'user-demo',
        name: 'Demo User',
        email: 'demo@hrnova.com',
        role: 'Custom Role',
        permissions: permissions
    };

    AuthService.setCurrentUser(user);

    const sidebarMount = document.getElementById('sidebar-mount');
    if (sidebarMount) {
        sidebarMount.innerHTML = renderSidebar();
    }

    console.log('User permissions updated:', permissions);
    console.log('Menu will now show only items matching these permissions');
}

export function demoAdminAccess() {
    setUserWithPermissions(['*']);
}

export function demoHRManagerAccess() {
    setUserWithPermissions([
        'view:dashboard',
        'view:employees',
        'view:leave',
        'view:attendance',
        'view:reports',
        'view:announcements'
    ]);
}

export function demoEmployeeAccess() {
    setUserWithPermissions([
        'view:dashboard',
        'view:leave',
        'view:announcements'
    ]);
}

export function demoManagerAccess() {
    setUserWithPermissions([
        'view:dashboard',
        'view:employees',
        'view:reports',
        'view:announcements'
    ]);
}

if (typeof window !== 'undefined') {
    window.rbacDemo = {
        admin: demoAdminAccess,
        hrManager: demoHRManagerAccess,
        employee: demoEmployeeAccess,
        manager: demoManagerAccess,
        custom: setUserWithPermissions
    };

    console.log('%cRBAC Demo Available!', 'color: #2563eb; font-weight: bold; font-size: 14px;');
    console.log('Try these commands in the console:');
    console.log('  rbacDemo.admin()      - Full access to all menu items');
    console.log('  rbacDemo.hrManager()  - HR Manager permissions');
    console.log('  rbacDemo.employee()   - Limited employee access');
    console.log('  rbacDemo.manager()    - Manager permissions');
    console.log('  rbacDemo.custom([...])- Custom permissions array');
}
