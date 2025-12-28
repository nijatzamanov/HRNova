// dashboard.js - Dashboard Page Logic
(function() {
    'use strict';

    const DashboardPage = {

        init: async function() {
            this.setupSidebar();
            this.updateCurrentDate();
            this.setupInfoBanner();
            await this.loadActivity();
            await this.loadUpcomingEvents();

            // Render heatmap
            if (window.Heatmap) {
                Heatmap.render('attendanceHeatmap');
            }

            // Render task list
            if (window.TaskList) {
                TaskList.render('taskList');
            }
        },

        setupSidebar: function() {
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            if (menuToggle && sidebar && overlay) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('dashboard-layout__sidebar--open');
                    overlay.classList.toggle('sidebar-overlay--open');
                });

                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('dashboard-layout__sidebar--open');
                    overlay.classList.remove('sidebar-overlay--open');
                });
            }
        },

        updateCurrentDate: function() {
            const dateElement = document.getElementById('currentDate');
            if (!dateElement) return;

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            const currentDate = new Date().toLocaleDateString(I18n.currentLang || 'en', options);
            dateElement.textContent = currentDate;
        },

        setupInfoBanner: function() {
            const infoBanner = document.querySelector('.info-banner');
            const closeBtn = infoBanner?.querySelector('.info-banner__close');

            if (closeBtn && infoBanner) {
                closeBtn.addEventListener('click', () => {
                    infoBanner.style.display = 'none';
                    Storage.set('infoBannerClosed', true);
                });

                // Check if previously closed
                if (Storage.get('infoBannerClosed')) {
                    infoBanner.style.display = 'none';
                }
            }
        },

        loadActivity: async function() {
            const container = document.getElementById('activityList');
            if (!container) return;

            try {
                const activities = await API.activity.getRecent(5);

                if (activities.length === 0) {
                    container.innerHTML = '<p class="text-muted">No recent activity</p>';
                    return;
                }

                container.innerHTML = activities.map(activity => `
          <div class="activity-item">
            <div class="activity-item__icon">
              ${this.getActivityIcon(activity.type)}
            </div>
            <div class="activity-item__content">
              <div class="activity-item__title">${activity.description}</div>
              <div class="activity-item__time">${this.formatTimeAgo(activity.timestamp)}</div>
            </div>
          </div>
        `).join('');
            } catch (error) {
                console.error('Failed to load activity:', error);
                container.innerHTML = '<p class="text-muted text-danger">Failed to load activity</p>';
            }
        },

        loadUpcomingEvents:  async function() {
            const container = document.getElementById('eventsList');
            if (!container) return;

            // Mock upcoming events (Backend-də gələcək)
            const events = [
                {
                    id: 1,
                    title: 'Team Meeting',
                    date: new Date(Date.now() + 86400000 * 1).toISOString(),
                    type: 'meeting'
                },
                {
                    id: 2,
                    title: 'Ayşə Əliyeva Birthday',
                    date: new Date(Date.now() + 86400000 * 3).toISOString(),
                    type: 'birthday'
                },
                {
                    id:  3,
                    title: 'Performance Review',
                    date: new Date(Date.now() + 86400000 * 5).toISOString(),
                    type: 'review'
                }
            ];

            if (events.length === 0) {
                container.innerHTML = '<p class="text-muted">No upcoming events</p>';
                return;
            }

            container.innerHTML = events.map(event => `
        <div class="event-item">
          <div class="event-item__icon">
            ${this.getEventIcon(event.type)}
          </div>
          <div class="event-item__content">
            <div class="event-item__title">${event.title}</div>
            <div class="event-item__date">${this.formatDate(event.date)}</div>
          </div>
        </div>
      `).join('');
        },

        getActivityIcon: function(type) {
            const icons = {
                employee_added: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
                leave_approved: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
                document_uploaded: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
                announcement_created: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                default: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
            };
            return icons[type] || icons.default;
        },

        getEventIcon: function(type) {
            const icons = {
                meeting: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
                birthday: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
                review: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
                default: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
            };
            return icons[type] || icons.default;
        },

        formatTimeAgo: function(timestamp) {
            const now = Date.now();
            const date = new Date(timestamp);
            const diff = now - date.getTime();

            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            return `${days}d ago`;
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            return date.toLocaleDateString(I18n.currentLang || 'en', options);
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DashboardPage.init());
    } else {
        DashboardPage.init();
    }

})();