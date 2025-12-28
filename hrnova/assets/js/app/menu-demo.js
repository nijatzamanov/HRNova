import { AuthService } from '../services/auth.js';
import { renderSidebar } from './boot.js';

function updateSidebarWithPermissions(permissions) {
    const user = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@hrnova.com',
        role: 'Custom Role',
        permissions: permissions
    };

    AuthService.setCurrentUser(user);

    const sidebarMount = document.getElementById('sidebar-mount');
    if (sidebarMount) {
        sidebarMount.innerHTML = renderSidebar();

        import('../ui/sidebar.js').then(module => module.initSidebar());
        import('./navigation.js').then(module => module.initNavigation());
    }
}

if (typeof window !== 'undefined') {
    window.menuDemo = {
        admin: () => {
            console.log('Setting ADMIN permissions (full access)');
            updateSidebarWithPermissions(['*']);
        },
        hrManager: () => {
            console.log('Setting HR MANAGER permissions');
            updateSidebarWithPermissions([
                'view:dashboard',
                'view:employees',
                'view:leave',
                'view:attendance',
                'view:reports',
                'view:announcements'
            ]);
        },
        employee: () => {
            console.log('Setting EMPLOYEE permissions (limited)');
            updateSidebarWithPermissions([
                'view:dashboard',
                'view:leave',
                'view:announcements'
            ]);
        },
        manager: () => {
            console.log('Setting MANAGER permissions');
            updateSidebarWithPermissions([
                'view:dashboard',
                'view:employees',
                'view:attendance',
                'view:reports',
                'view:announcements'
            ]);
        },
        custom: (permissions) => {
            console.log('Setting CUSTOM permissions:', permissions);
            updateSidebarWithPermissions(permissions);
        }
    };

    console.log('%c🔐 Menu RBAC Demo Loaded', 'background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
    console.log('');
    console.log('Try these commands:');
    console.log('  %cmenuDemo.admin()%c      → Full access', 'color: #2563eb; font-weight: bold', 'color: inherit');
    console.log('  %cmenuDemo.hrManager()%c  → HR Manager access', 'color: #2563eb; font-weight: bold', 'color: inherit');
    console.log('  %cmenuDemo.employee()%c   → Limited employee access', 'color: #2563eb; font-weight: bold', 'color: inherit');
    console.log('  %cmenuDemo.manager()%c    → Manager access', 'color: #2563eb; font-weight: bold', 'color: inherit');
    console.log('  %cmenuDemo.custom([...])%c → Custom permissions', 'color: #2563eb; font-weight: bold', 'color: inherit');
    console.log('');
}
