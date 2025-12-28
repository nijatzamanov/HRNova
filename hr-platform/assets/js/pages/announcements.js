(function() {
    'use strict';

    const AnnouncementsPage = {
        announcements: [],
        modal: null,

        init:  async function() {
            this.setupSidebar();
            this.modal = Modal.get('announcementModal');
            this.setupEventListeners();
            await this.loadAnnouncements();
            this.renderAnnouncements();
        },

        setupSidebar: function() {
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');

            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('dashboard-layout__sidebar--open');
                    overlay.classList.toggle('sidebar-overlay--open');
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('dashboard-layout__sidebar--open');
                    overlay.classList.remove('sidebar-overlay--open');
                });
            }
        },

        setupEventListeners: function() {
            // Create button
            const createBtn = document.getElementById('createAnnouncementBtn');
            if (createBtn) {
                createBtn.addEventListener('click', () => this.openCreateModal());
            }

            // Modal buttons
            const cancelBtn = document.getElementById('cancelAnnouncementBtn');
            const publishBtn = document.getElementById('publishAnnouncementBtn');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.modal.close());
            }

            if (publishBtn) {
                publishBtn.addEventListener('click', () => this.publishAnnouncement());
            }

            // Form submission
            const form = document.getElementById('announcementForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.publishAnnouncement();
                });
            }
        },

        loadAnnouncements: async function() {
            try {
                const response = await fetch('./data/announcements.json');
                this.announcements = await response.json();
            } catch (error) {
                console.error('Failed to load announcements:', error);
                Toast.error('Error', 'Failed to load announcements');
            }
        },

        renderAnnouncements:  function() {
            const feed = document.getElementById('announcementsFeed');
            const emptyState = document.getElementById('emptyState');

            if (! feed) return;

            if (this.announcements.length === 0) {
                DOM.hide(feed);
                DOM.show(emptyState);
                return;
            }

            DOM.show(feed);
            DOM.hide(emptyState);

            feed.innerHTML = this.announcements.map(announcement => `
        <div class="card announcement-card announcement-card--${announcement.priority}">
          <div class="announcement-card__header">
            <div class="announcement-card__title-group">
              <h3 class="announcement-card__title">
                ${announcement.title}
                ${announcement.priority === 'high' ? '<span class="badge badge--danger">High Priority</span>' : ''}
              </h3>
              <div class="announcement-card__meta">
                <span>${this.formatDate(announcement.createdAt)}</span>
                <span>•</span>
                <span>${this.getAudienceLabel(announcement.audience)}</span>
                ${! announcement.read ? '<span class="badge badge--primary">New</span>' : ''}
              </div>
            </div>
            <div class="announcement-card__actions">
              <button class="btn btn--sm btn--ghost btn--icon" data-action="delete" data-id="${announcement.id}" aria-label="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="announcement-card__message">${announcement.message}</div>
          
          <div class="announcement-card__footer">
            <div class="announcement-card__author">
              <img src="./assets/img/placeholders/avatar.svg" alt="${announcement.author}" class="announcement-card__author-avatar">
              <span>${announcement.author}</span>
            </div>
            ${! announcement.read ? `<button class="btn btn--sm btn--ghost" data-action="markRead" data-id="${announcement.id}">Mark as Read</button>` : ''}
          </div>
        </div>
      `).join('');

            // Attach event listeners
            feed.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.deleteAnnouncement(id);
                });
            });

            feed.querySelectorAll('[data-action="markRead"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.markAsRead(id);
                });
            });
        },

        getAudienceLabel: function(audience) {
            if (audience === 'all') return 'All Employees';
            const labels = {
                engineering: 'Engineering',
                hr: 'Human Resources',
                marketing: 'Marketing',
                sales: 'Sales',
                finance: 'Finance',
                operations: 'Operations'
            };
            return labels[audience] || audience;
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;

            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;

            return date.toLocaleDateString(I18n.currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        openCreateModal: function() {
            const form = document.getElementById('announcementForm');
            if (form) form.reset();
            this.modal.open();
        },

        validateForm: function() {
            const form = document.getElementById('announcementForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');

                if (! field.value.trim()) {
                    formGroup.classList.add('form-group--error');
                    isValid = false;
                } else {
                    formGroup.classList.remove('form-group--error');
                }
            });

            return isValid;
        },

        publishAnnouncement: function() {
            if (!this.validateForm()) {
                Toast.warning('Validation Error', 'Please fill all required fields');
                return;
            }

            const newAnnouncement = {
                id: 'ann' + Date.now(),
                title: document.getElementById('announcementTitle').value.trim(),
                message: document.getElementById('announcementMessage').value.trim(),
                priority: document.getElementById('announcementPriority').value,
                audience: document.getElementById('announcementAudience').value,
                author: 'Current User',
                authorId: 'emp001',
                createdAt:  new Date().toISOString(),
                read: false
            };

            this.announcements.unshift(newAnnouncement);
            this.renderAnnouncements();
            this.modal.close();

            Toast.success('Success', 'Announcement published successfully');
        },

        markAsRead: function(id) {
            const announcement = this.announcements.find(a => a.id === id);
            if (announcement) {
                announcement.read = true;
                this.renderAnnouncements();
                Toast.info('Marked as read', '');
            }
        },

        deleteAnnouncement: function(id) {
            const confirmed = confirm('Are you sure you want to delete this announcement?');
            if (! confirmed) return;

            this.announcements = this.announcements.filter(a => a.id !== id);
            this.renderAnnouncements();
            Toast.success('Deleted', 'Announcement deleted successfully');
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AnnouncementsPage.init());
    } else {
        AnnouncementsPage.init();
    }

})();