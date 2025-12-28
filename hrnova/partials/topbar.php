<header class="topbar">
    <div class="topbar__left">
        <button class="topbar__menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <h1 class="topbar__title" id="pageTitle">Dashboard</h1>
    </div>

    <div class="topbar__right">
        <div class="topbar__search">
            <input
                type="search"
                class="topbar__search-input"
                placeholder="Search employees, documents..."
                id="globalSearch"
            >
            <svg class="topbar__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        <div class="topbar__actions">
            <button class="btn btn-primary btn--sm" data-modal-target="addEmployeeModal" aria-label="Add employee">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span data-i18n="topbar.addEmployee">Add Employee</span>
            </button>

            <div class="dropdown" data-dropdown="language">
                <button class="topbar__action" data-dropdown-toggle="language" aria-label="Select language" aria-expanded="false">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                </button>
                <div class="dropdown__menu" data-dropdown-menu="language" role="menu">
                    <button class="dropdown__item" data-lang="az" role="menuitem">
                        <span class="dropdown__icon">🇦🇿</span>
                        <span data-i18n="language.az">Azərbaycanca</span>
                    </button>
                    <button class="dropdown__item" data-lang="en" role="menuitem">
                        <span class="dropdown__icon">🇬🇧</span>
                        <span data-i18n="language.en">English</span>
                    </button>
                    <button class="dropdown__item" data-lang="ru" role="menuitem">
                        <span class="dropdown__icon">🇷🇺</span>
                        <span data-i18n="language.ru">Русский</span>
                    </button>
                    <button class="dropdown__item" data-lang="tr" role="menuitem">
                        <span class="dropdown__icon">🇹🇷</span>
                        <span data-i18n="language.tr">Türkçe</span>
                    </button>
                    <button class="dropdown__item" data-lang="de" role="menuitem">
                        <span class="dropdown__icon">🇩🇪</span>
                        <span data-i18n="language.de">Deutsch</span>
                    </button>
                </div>
            </div>

            <div class="dropdown" data-dropdown="notifications">
                <button class="topbar__action" data-dropdown-toggle="notifications" aria-label="Notifications" aria-expanded="false">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="topbar__badge">3</span>
                </button>
                <div class="dropdown__menu dropdown__menu--wide" data-dropdown-menu="notifications" role="menu">
                    <div class="dropdown__header">
                        <h3 class="dropdown__title" data-i18n="notifications.title">Notifications</h3>
                        <button class="dropdown__link" data-i18n="notifications.markAllRead">Mark all as read</button>
                    </div>
                    <div class="dropdown__body">
                        <button class="notification-item notification-item--unread" role="menuitem">
                            <div class="notification-item__icon notification-item__icon--primary">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div class="notification-item__content">
                                <div class="notification-item__title">New leave request from John Doe</div>
                                <div class="notification-item__time">5 minutes ago</div>
                            </div>
                        </button>
                        <button class="notification-item notification-item--unread" role="menuitem">
                            <div class="notification-item__icon notification-item__icon--success">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="notification-item__content">
                                <div class="notification-item__title">Document approved for Sarah Smith</div>
                                <div class="notification-item__time">1 hour ago</div>
                            </div>
                        </button>
                        <button class="notification-item notification-item--unread" role="menuitem">
                            <div class="notification-item__icon notification-item__icon--warning">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="notification-item__content">
                                <div class="notification-item__title">Work permit expiring in 30 days</div>
                                <div class="notification-item__time">2 hours ago</div>
                            </div>
                        </button>
                    </div>
                    <div class="dropdown__footer">
                        <a href="../pages/announcements.html" class="dropdown__link" data-i18n="notifications.viewAll">View all notifications</a>
                    </div>
                </div>
            </div>

            <div class="dropdown" data-dropdown="messages">
                <button class="topbar__action" data-dropdown-toggle="messages" aria-label="Messages" aria-expanded="false">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>
                <div class="dropdown__menu dropdown__menu--wide" data-dropdown-menu="messages" role="menu">
                    <div class="dropdown__header">
                        <h3 class="dropdown__title" data-i18n="messages.title">Messages</h3>
                    </div>
                    <div class="dropdown__body">
                        <button class="message-item" role="menuitem">
                            <div class="message-item__avatar">JD</div>
                            <div class="message-item__content">
                                <div class="message-item__header">
                                    <div class="message-item__name">John Doe</div>
                                    <div class="message-item__time">10m</div>
                                </div>
                                <div class="message-item__preview">Can you review my leave request?</div>
                            </div>
                        </button>
                        <button class="message-item" role="menuitem">
                            <div class="message-item__avatar">SS</div>
                            <div class="message-item__content">
                                <div class="message-item__header">
                                    <div class="message-item__name">Sarah Smith</div>
                                    <div class="message-item__time">1h</div>
                                </div>
                                <div class="message-item__preview">Thanks for approving my document!</div>
                            </div>
                        </button>
                    </div>
                    <div class="dropdown__footer">
                        <a href="#" class="dropdown__link" data-i18n="messages.viewAll">View all messages</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="dropdown" data-dropdown="profile">
            <button class="topbar__user" data-dropdown-toggle="profile" aria-label="User menu" aria-expanded="false">
                <div class="topbar__avatar">AD</div>
                <div class="topbar__user-info">
                    <div class="topbar__user-name">Admin User</div>
                    <div class="topbar__user-role">HR Manager</div>
                </div>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div class="dropdown__menu dropdown__menu--right" data-dropdown-menu="profile" role="menu">
                <div class="dropdown__header">
                    <div class="dropdown__user">
                        <div class="dropdown__user-avatar">AD</div>
                        <div class="dropdown__user-info">
                            <div class="dropdown__user-name">Admin User</div>
                            <div class="dropdown__user-email">admin@hrnova.com</div>
                        </div>
                    </div>
                </div>
                <div class="dropdown__body">
                    <a href="../pages/settings.php" class="dropdown__item" role="menuitem">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span data-i18n="profile.myProfile">My Profile</span>
                    </a>
                    <a href="../pages/settings.php" class="dropdown__item" role="menuitem">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span data-i18n="profile.settings">Settings</span>
                    </a>
                    <div class="dropdown__divider"></div>
                    <button class="dropdown__item" id="logoutBtnTop" role="menuitem">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span data-i18n="profile.logout">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</header>
