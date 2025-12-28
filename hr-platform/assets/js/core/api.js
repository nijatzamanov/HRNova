// api.js - Mock API Client
(function(window) {
    'use strict';

    const API = {
        // Employees
        employees: {
            async getAll() {
                try {
                    const response = await fetch('./data/employees.json');
                    return await response.json();
                } catch (error) {
                    console.error('Failed to fetch employees:', error);
                    return [];
                }
            },

            async getById(id) {
                const employees = await this.getAll();
                return employees.find(emp => emp.id === id);
            },

            async create(employee) {
                // Mock create - return employee with generated ID
                return {
                    ... employee,
                    id: 'emp' + Date.now()
                };
            },

            async update(id, employee) {
                // Mock update - return updated employee
                return {
                    ...employee,
                    id: id
                };
            },

            async delete(id) {
                // Mock delete - return success
                return { success: true, id: id };
            }
        },

        // Departments
        departments: {
            async getAll() {
                try {
                    const response = await fetch('./data/departments.json');
                    return await response.json();
                } catch (error) {
                    console.error('Failed to fetch departments:', error);
                    return [];
                }
            }
        },

        // Leaves
        leaves: {
            async getAll() {
                try {
                    const response = await fetch('./data/leaves.json');
                    return await response.json();
                } catch (error) {
                    console.error('Failed to fetch leaves:', error);
                    return [];
                }
            },

            async create(leave) {
                return {
                    ...leave,
                    id: 'leave' + Date.now(),
                    requestedAt: new Date().toISOString()
                };
            },

            async updateStatus(id, status) {
                return {
                    success: true,
                    id: id,
                    status: status
                };
            }
        },

        // Activity
        activity: {
            async getRecent(limit = 5) {
                try {
                    const response = await fetch('./data/activity.json');
                    const data = await response.json();
                    return data.slice(0, limit);
                } catch (error) {
                    console.error('Failed to fetch activity:', error);
                    return [];
                }
            }
        },

        // Documents
        documents: {
            async getAll() {
                try {
                    const response = await fetch('./data/documents.json');
                    return await response.json();
                } catch (error) {
                    console.error('Failed to fetch documents:', error);
                    return [];
                }
            }
        },

        // Announcements
        announcements: {
            async getAll() {
                try {
                    const response = await fetch('./data/announcements.json');
                    return await response.json();
                } catch (error) {
                    console.error('Failed to fetch announcements:', error);
                    return [];
                }
            }
        }
    };

    window.API = API;
})(window);