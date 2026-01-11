<nav class="sidebar" aria-label="Əsas naviqasiya">
    <!-- Header / Logo -->
    <div class="sidebar__header">
        <div class="sidebar__logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
            </svg>
        </div>
        <div class="sidebar__brand">
            <div class="sidebar__brand-name">Aurum</div>
            <div class="sidebar__brand-tagline">Accounting</div>
        </div>
    </div>

    <!-- İstifadəçi Məlumatı -->
    <div class="sidebar__user" id="sidebarUser">
        <div class="sidebar__user-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        </div>
        <div class="sidebar__user-info">
            <div class="sidebar__user-name" data-user="name">İstifadəçi</div>
            <div class="sidebar__user-role" data-user="role">Rol</div>
        </div>
    </div>

    <!-- Menyu (JS tərəfindən render olunacaq) -->
    <div class="sidebar__menu" id="sidebarMenu">
        <div class="sidebar__menu-loading">
            <div class="spinner spinner--sm"></div>
            <span data-i18n="common.loading">Yüklənir...</span>
        </div>
    </div>

    <!-- Footer -->
    <div class="sidebar__footer">
        <div class="sidebar__credits">
            <div class="sidebar__version">v2.0.0 MVP</div>
            <div style="margin-top: 8px;">
                <span style="opacity: 0.7;">Developed by</span>
                <strong style="display: block; margin-top: 4px;">Aildco</strong>
            </div>
        </div>
    </div>
</nav>