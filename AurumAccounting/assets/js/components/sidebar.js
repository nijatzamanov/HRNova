export const AurumSidebar = {
    init() {
        const toggleBtn = document.querySelector('[data-action="toggle-sidebar"]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (window.innerWidth <= 1024) {
            document.body.classList.add('sidebar-collapsed');
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                document.body.classList.remove('sidebar-open');
            }
        });

        this.handleOutsideClick();
    },

    toggle() {
        if (window.innerWidth <= 1024) {
            document.body.classList.toggle('sidebar-open');
        } else {
            document.body.classList.toggle('sidebar-collapsed');
        }
    },

    handleOutsideClick() {
        document.addEventListener('click', event => {
            const sidebar = document.querySelector('.app-sidebar');
            const toggleBtn = document.querySelector('[data-action="toggle-sidebar"]');

            if (
                window.innerWidth <= 1024 &&
                document.body.classList.contains('sidebar-open') &&
                sidebar &&
                ! sidebar.contains(event.target) &&
                ! toggleBtn.contains(event.target)
            ) {
                document.body.classList.remove('sidebar-open');
            }
        });
    }
};