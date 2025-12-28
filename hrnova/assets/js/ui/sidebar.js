let sidebarOpen = false;

export function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    window.addEventListener('resize', handleResize);
}

export function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    updateSidebarState();
}

export function openSidebar() {
    sidebarOpen = true;
    updateSidebarState();
}

export function closeSidebar() {
    sidebarOpen = false;
    updateSidebarState();
}

function updateSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar || !overlay) return;

    if (sidebarOpen) {
        sidebar.classList.add('sidebar--open');
        overlay.classList.add('sidebar__overlay--visible');
    } else {
        sidebar.classList.remove('sidebar--open');
        overlay.classList.remove('sidebar__overlay--visible');
    }
}

function handleResize() {
    if (window.innerWidth > 1024) {
        closeSidebar();
    }
}
