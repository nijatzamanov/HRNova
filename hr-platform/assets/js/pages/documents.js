(function() {
    'use strict';

    const DocumentsPage = {
        documents: [],
        filteredDocuments: [],
        currentCategory: 'all',
        modal: null,

        init:  async function() {
            this.setupSidebar();
            this.modal = Modal.get('documentModal');
            this.setupEventListeners();
            await this.loadDocuments();
            this.renderDocuments();
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
            // Upload button
            const uploadBtn = document.getElementById('uploadDocBtn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', () => this.openUploadModal());
            }

            // Category filters
            document.querySelectorAll('.document-filter').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.document-filter').forEach(b => {
                        b.classList.remove('document-filter--active');
                    });
                    e.target.classList.add('document-filter--active');

                    this.currentCategory = e.target.getAttribute('data-category');
                    this.applyFilters();
                });
            });

            // Search
            const searchInput = document.getElementById('searchDocuments');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }

            // Modal buttons
            const cancelBtn = document.getElementById('cancelDocBtn');
            const uploadModalBtn = document.getElementById('uploadBtn');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.modal.close());
            }

            if (uploadModalBtn) {
                uploadModalBtn.addEventListener('click', () => this.uploadDocument());
            }

            // File select
            const fileSelectBtn = document.getElementById('fileSelectBtn');
            const fileInput = document.getElementById('docFile');

            if (fileSelectBtn && fileInput) {
                fileSelectBtn.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', (e) => {
                    const fileName = document.getElementById('fileName');
                    if (e.target.files.length > 0) {
                        fileName.textContent = e.target.files[0].name;
                    } else {
                        fileName.textContent = 'No file selected';
                    }
                });
            }
        },

        loadDocuments: async function() {
            // Mock documents
            this.documents = [
                {
                    id: 'doc001',
                    name: 'Employee Handbook 2025',
                    category: 'handbooks',
                    uploadedBy: 'HR Manager',
                    uploadedAt: '2025-12-01T10:00:00Z',
                    size: '2.4 MB',
                    fileType: 'PDF'
                },
                {
                    id: 'doc002',
                    name: 'Data Protection Policy',
                    category: 'policies',
                    uploadedBy:  'IT Department',
                    uploadedAt: '2025-11-20T14:30:00Z',
                    size: '1.1 MB',
                    fileType:  'PDF'
                },
                {
                    id: 'doc003',
                    name: 'Employment Contract Template',
                    category: 'contracts',
                    uploadedBy: 'HR Manager',
                    uploadedAt:  '2025-11-15T09:00:00Z',
                    size:  '856 KB',
                    fileType:  'DOCX'
                },
                {
                    id: 'doc004',
                    name:  'ISO 9001 Certificate',
                    category: 'certificates',
                    uploadedBy: 'Quality Assurance',
                    uploadedAt: '2025-10-10T11:45:00Z',
                    size: '3.2 MB',
                    fileType:  'PDF',
                    expiryDate: '2026-10-10'
                },
                {
                    id: 'doc005',
                    name:  'Remote Work Policy',
                    category: 'policies',
                    uploadedBy: 'HR Manager',
                    uploadedAt:  '2025-12-10T16:20:00Z',
                    size:  '945 KB',
                    fileType:  'PDF'
                }
            ];

            this.filteredDocuments = [... this.documents];
        },

        applyFilters: function() {
            if (this.currentCategory === 'all') {
                this.filteredDocuments = [...this.documents];
            } else {
                this.filteredDocuments = this.documents.filter(doc => doc.category === this.currentCategory);
            }

            // Apply search on top
            const searchInput = document.getElementById('searchDocuments');
            if (searchInput && searchInput.value) {
                this.handleSearch(searchInput.value);
            } else {
                this.renderDocuments();
            }
        },

        handleSearch:  function(query) {
            const lowerQuery = query.toLowerCase().trim();

            if (! lowerQuery) {
                this.applyFilters();
                return;
            }

            const baseDocuments = this.currentCategory === 'all'
                ? this.documents
                : this.documents.filter(doc => doc.category === this.currentCategory);

            this.filteredDocuments = baseDocuments.filter(doc =>
                doc.name.toLowerCase().includes(lowerQuery) ||
                doc.uploadedBy.toLowerCase().includes(lowerQuery)
            );

            this.renderDocuments();
        },

        renderDocuments: function() {
            const grid = document.getElementById('documentsGrid');
            const emptyState = document.getElementById('emptyState');

            if (! grid) return;

            if (this.filteredDocuments.length === 0) {
                DOM.hide(grid);
                DOM.show(emptyState);
                return;
            }

            DOM.show(grid);
            DOM.hide(emptyState);

            grid.innerHTML = this.filteredDocuments.map(doc => `
        <div class="card document-card">
          <div class="document-card__icon">
            ${this.getFileIcon(doc.fileType)}
          </div>
          <div class="document-card__name">${doc.name}</div>
          <div class="document-card__meta">
            <span>${doc.size}</span>
            <span>•</span>
            <span>${this.formatDate(doc.uploadedAt)}</span>
          </div>
          ${doc.expiryDate ?  `<div class="document-card__meta"><span class="badge badge--warning">Expires: ${this.formatDate(doc.expiryDate)}</span></div>` : ''}
          <div class="document-card__actions">
            <button class="btn btn--sm btn--primary btn--block" data-action="download" data-id="${doc.id}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v3.33A.67.67 0 0 1 11.33 12H2.67A.67.67 0 0 1 2 11.33V8"/>
                <polyline points="9.33 5.67 7 8 4.67 5.67"/>
                <line x1="7" y1="2" x2="7" y2="8"/>
              </svg>
              Download
            </button>
            <button class="btn btn--sm btn--danger btn--icon" data-action="delete" data-id="${doc.id}" aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      `).join('');

            // Attach event listeners
            grid.querySelectorAll('[data-action="download"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.downloadDocument(id);
                });
            });

            grid.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    this.deleteDocument(id);
                });
            });
        },

        getFileIcon: function(fileType) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>`;
        },

        formatDate: function(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(I18n.currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        openUploadModal: function() {
            const form = document.getElementById('documentForm');
            if (form) form.reset();

            const fileName = document.getElementById('fileName');
            if (fileName) fileName.textContent = 'No file selected';

            this.modal.open();
        },

        uploadDocument: function() {
            const name = document.getElementById('docName').value.trim();
            const category = document.getElementById('docCategory').value;
            const file = document.getElementById('docFile').files[0];

            if (!name || !category) {
                Toast.warning('Validation Error', 'Please fill all required fields');
                return;
            }

            if (!file) {
                Toast.warning('Validation Error', 'Please select a file');
                return;
            }

            const newDoc = {
                id: 'doc' + Date.now(),
                name: name,
                category: category,
                uploadedBy: 'Current User',
                uploadedAt:  new Date().toISOString(),
                size: (file.size / 1024).toFixed(0) + ' KB',
                fileType: file.name.split('.').pop().toUpperCase()
            };

            this.documents.unshift(newDoc);
            this.applyFilters();
            this.modal.close();

            Toast.success('Success', 'Document uploaded successfully');
        },

        downloadDocument: function(id) {
            const doc = this.documents.find(d => d.id === id);
            if (doc) {
                Toast.info('Download', `Downloading ${doc.name}...`);
                // In real app, trigger actual download
            }
        },

        deleteDocument: function(id) {
            const confirmed = confirm('Are you sure you want to delete this document?');
            if (! confirmed) return;

            this.documents = this.documents.filter(d => d.id !== id);
            this.applyFilters();
            Toast.success('Deleted', 'Document deleted successfully');
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DocumentsPage.init());
    } else {
        DocumentsPage.init();
    }

})();