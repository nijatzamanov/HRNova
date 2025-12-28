import { StorageService } from './storage.js';

export class AuthService {
    static getCurrentUser() {
        return StorageService.get('currentUser', null);
    }

    static setCurrentUser(user) {
        return StorageService.set('currentUser', user);
    }

    static getUserPermissions() {
        const user = this.getCurrentUser();
        return user?.permissions || [];
    }

    static hasPermission(permission) {
        const permissions = this.getUserPermissions();
        if (permissions.includes('*')) return true;
        return permissions.includes(permission);
    }

    static hasAnyPermission(permissionsToCheck = []) {
        const userPermissions = this.getUserPermissions();
        if (userPermissions.includes('*')) return true;
        return permissionsToCheck.some(permission => userPermissions.includes(permission));
    }

    static hasAllPermissions(permissionsToCheck = []) {
        const userPermissions = this.getUserPermissions();
        if (userPermissions.includes('*')) return true;
        return permissionsToCheck.every(permission => userPermissions.includes(permission));
    }

    static login(userData) {
        this.setCurrentUser(userData);
        return true;
    }

    static logout() {
        StorageService.remove('currentUser');
        return true;
    }

    static isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}

export function initializeMockUser() {
    const existingUser = AuthService.getCurrentUser();
    if (!existingUser) {
        const mockUser = {
            id: 'user-001',
            name: 'Admin User',
            email: 'admin@hrnova.com',
            role: 'HR Manager',
            permissions: [
                '*'
            ]
        };
        AuthService.setCurrentUser(mockUser);
    }
}
