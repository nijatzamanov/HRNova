const DATA_BASE_PATH = '/src/data';
const LATENCY_MIN = 200;
const LATENCY_MAX = 400;

function simulateLatency() {
    const delay = Math.floor(Math.random() * (LATENCY_MAX - LATENCY_MIN + 1)) + LATENCY_MIN;
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function fetchJSON(filename) {
    await simulateLatency();

    try {
        const response = await fetch(`${DATA_BASE_PATH}/${filename}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`Error fetching ${filename}:`, error);
        return { success: false, error: error.message, data: null };
    }
}

function normalizeResponse(data, error = null) {
    if (error) {
        return {
            success: false,
            data: null,
            error,
            timestamp: new Date().toISOString()
        };
    }

    return {
        success: true,
        data,
        error: null,
        timestamp: new Date().toISOString(),
        count: Array.isArray(data) ? data.length : 1
    };
}

export async function getUsers() {
    const result = await fetchJSON('users.json');
    return normalizeResponse(result.data, result.error);
}

export async function getEmployees(filters = {}) {
    const result = await fetchJSON('employees.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let employees = result.data;

    if (filters.departmentId) {
        employees = employees.filter(emp => emp.departmentId === filters.departmentId);
    }

    if (filters.branchId) {
        employees = employees.filter(emp => emp.branchId === filters.branchId);
    }

    if (filters.status) {
        employees = employees.filter(emp => emp.status === filters.status);
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        employees = employees.filter(emp =>
            emp.fullName.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower) ||
            emp.employeeId.toLowerCase().includes(searchLower)
        );
    }

    return normalizeResponse(employees);
}

export async function getEmployeeById(id) {
    const result = await fetchJSON('employees.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const employee = result.data.find(emp => emp.id === id || emp.employeeId === id);

    if (!employee) {
        return normalizeResponse(null, 'Employee not found');
    }

    return normalizeResponse(employee);
}

export async function getDepartments(filters = {}) {
    const result = await fetchJSON('departments.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let departments = result.data;

    if (filters.status) {
        departments = departments.filter(dept => dept.status === filters.status);
    }

    return normalizeResponse(departments);
}

export async function getDepartmentById(id) {
    const result = await fetchJSON('departments.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const department = result.data.find(dept => dept.id === id || dept.code === id);

    if (!department) {
        return normalizeResponse(null, 'Department not found');
    }

    return normalizeResponse(department);
}

export async function getBranches(filters = {}) {
    const result = await fetchJSON('branches.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let branches = result.data;

    if (filters.status) {
        branches = branches.filter(branch => branch.status === filters.status);
    }

    if (filters.type) {
        branches = branches.filter(branch => branch.type === filters.type);
    }

    if (filters.country) {
        branches = branches.filter(branch => branch.country === filters.country);
    }

    return normalizeResponse(branches);
}

export async function getBranchById(id) {
    const result = await fetchJSON('branches.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const branch = result.data.find(b => b.id === id || b.code === id);

    if (!branch) {
        return normalizeResponse(null, 'Branch not found');
    }

    return normalizeResponse(branch);
}

export async function getLeaveRequests(filters = {}) {
    const result = await fetchJSON('leave-requests.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let requests = result.data;

    if (filters.employeeId) {
        requests = requests.filter(req => req.employeeId === filters.employeeId);
    }

    if (filters.status) {
        requests = requests.filter(req => req.status === filters.status);
    }

    if (filters.leaveType) {
        requests = requests.filter(req => req.leaveType === filters.leaveType);
    }

    if (filters.department) {
        requests = requests.filter(req => req.department === filters.department);
    }

    if (filters.startDate) {
        requests = requests.filter(req => new Date(req.startDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
        requests = requests.filter(req => new Date(req.endDate) <= new Date(filters.endDate));
    }

    return normalizeResponse(requests);
}

export async function getLeaveRequestById(id) {
    const result = await fetchJSON('leave-requests.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const request = result.data.find(req => req.id === id);

    if (!request) {
        return normalizeResponse(null, 'Leave request not found');
    }

    return normalizeResponse(request);
}

export async function getAttendance(filters = {}) {
    const result = await fetchJSON('attendance.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let attendance = result.data;

    if (filters.employeeId) {
        attendance = attendance.filter(att => att.employeeId === filters.employeeId);
    }

    if (filters.date) {
        attendance = attendance.filter(att => att.date === filters.date);
    }

    if (filters.status) {
        attendance = attendance.filter(att => att.status === filters.status);
    }

    if (filters.department) {
        attendance = attendance.filter(att => att.department === filters.department);
    }

    if (filters.startDate && filters.endDate) {
        attendance = attendance.filter(att => {
            const attDate = new Date(att.date);
            return attDate >= new Date(filters.startDate) && attDate <= new Date(filters.endDate);
        });
    }

    return normalizeResponse(attendance);
}

export async function getMigrationCases(filters = {}) {
    const result = await fetchJSON('migration-cases.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let cases = result.data;

    if (filters.employeeId) {
        cases = cases.filter(c => c.employeeId === filters.employeeId);
    }

    if (filters.status) {
        cases = cases.filter(c => c.status === filters.status);
    }

    if (filters.visaStatus) {
        cases = cases.filter(c => c.visaStatus === filters.visaStatus);
    }

    if (filters.destinationCountry) {
        cases = cases.filter(c => c.destinationCountry === filters.destinationCountry);
    }

    if (filters.department) {
        cases = cases.filter(c => c.department === filters.department);
    }

    return normalizeResponse(cases);
}

export async function getMigrationCaseById(id) {
    const result = await fetchJSON('migration-cases.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const migrationCase = result.data.find(c => c.id === id);

    if (!migrationCase) {
        return normalizeResponse(null, 'Migration case not found');
    }

    return normalizeResponse(migrationCase);
}

export async function getAnnouncements(filters = {}) {
    const result = await fetchJSON('announcements.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    let announcements = result.data;

    if (filters.type) {
        announcements = announcements.filter(ann => ann.type === filters.type);
    }

    if (filters.priority) {
        announcements = announcements.filter(ann => ann.priority === filters.priority);
    }

    if (filters.status) {
        announcements = announcements.filter(ann => ann.status === filters.status);
    }

    if (filters.targetAudience) {
        announcements = announcements.filter(ann =>
            ann.targetAudience === filters.targetAudience || ann.targetAudience === 'all'
        );
    }

    if (filters.department) {
        announcements = announcements.filter(ann =>
            ann.department === filters.department || ann.targetAudience === 'all'
        );
    }

    announcements.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return normalizeResponse(announcements);
}

export async function getAnnouncementById(id) {
    const result = await fetchJSON('announcements.json');

    if (!result.success) {
        return normalizeResponse(null, result.error);
    }

    const announcement = result.data.find(ann => ann.id === id);

    if (!announcement) {
        return normalizeResponse(null, 'Announcement not found');
    }

    return normalizeResponse(announcement);
}

export async function getStats() {
    await simulateLatency();

    const [employees, departments, branches, leaveRequests, attendance] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getBranches(),
        getLeaveRequests(),
        getAttendance()
    ]);

    const stats = {
        totalEmployees: employees.data?.length || 0,
        activeEmployees: employees.data?.filter(e => e.status === 'active').length || 0,
        totalDepartments: departments.data?.length || 0,
        totalBranches: branches.data?.length || 0,
        pendingLeaves: leaveRequests.data?.filter(l => l.status === 'pending').length || 0,
        approvedLeaves: leaveRequests.data?.filter(l => l.status === 'approved').length || 0,
        todayAttendance: attendance.data?.filter(a => a.date === new Date().toISOString().split('T')[0]).length || 0
    };

    return normalizeResponse(stats);
}

export default {
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
};
