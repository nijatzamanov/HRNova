/**
 * orgChart.js — Interactive organizational chart (Platform Integration)
 * Features:  load JSON, render tree, search, filter, zoom, modal, collapse/expand, dropdown menu
 * Integrated with employees.php page structure
 */

(function (window) {
    'use strict';

    const OrgChart = {
        data: [],
        filteredData: [],
        departments: [],
        selectedDepartment: 'all',
        searchTerm: '',
        zoomLevel: 1,
        collapsedNodes: new Set(),
        isInitialized: false,

        // DOM elements
        els: {},

        /**
         * Initialize org chart (called when tab becomes active)
         */
        async init() {
            // Prevent double initialization
            if (this.isInitialized) {
                return;
            }

            this.cacheDOMElements();

            // Only initialize if elements exist (org-chart tab is present)
            if (!this.els.canvas) {
                console.warn('Org chart elements not found. Tab may not be active.');
                return;
            }

            this.bindEvents();
            await this.loadData();
            this.isInitialized = true;
        },

        /**
         * Cache DOM elements
         */
        cacheDOMElements() {
            this.els = {
                // States
                loading: document.getElementById('orgChartLoading'),
                error: document.getElementById('orgChartError'),
                empty: document.getElementById('orgChartEmpty'),
                canvas: document.getElementById('orgChartCanvas'),
                tree: document.getElementById('orgChart'),

                // Controls
                search: document.getElementById('orgChartSearch'),
                departmentList: document.getElementById('orgDepartmentList'),
                sidebarFilter: document.getElementById('orgChartSidebarFilter'),

                // Zoom controls
                zoomInBtn: document.getElementById('zoomInBtn'),
                zoomOutBtn: document.getElementById('zoomOutBtn'),
                zoomResetBtn: document.getElementById('zoomResetBtn'),
                viewToggleBtn: document.getElementById('viewToggleBtn'),

                // Modal (employee detail)
                modal: document.getElementById('employeeDetailModal'),
                modalOverlay: document.getElementById('employeeDetailOverlay'),
                modalCloseBtn: document.getElementById('employeeDetailCloseBtn'),

                // Retry
                retryBtn: document.getElementById('orgChartRetryBtn')
            };
        },

        /**
         * Bind event listeners
         */
        bindEvents() {
            // Search
            if (this.els.search) {
                this.els.search.addEventListener('input', (e) => {
                    this.searchTerm = e.target.value.trim().toLowerCase();
                    this.filterAndRender();
                });
            }

            // Zoom controls
            if (this.els.zoomInBtn) {
                this.els.zoomInBtn.addEventListener('click', () => this.zoom(0.1));
            }
            if (this.els.zoomOutBtn) {
                this.els.zoomOutBtn.addEventListener('click', () => this.zoom(-0.1));
            }
            if (this.els.zoomResetBtn) {
                this.els.zoomResetBtn.addEventListener('click', () => this.resetZoom());
            }

            // View toggle (vertical/horizontal layout)
            if (this.els.viewToggleBtn) {
                this.els.viewToggleBtn.addEventListener('click', () => {
                    this.toggleLayout();
                });
            }

            // Modal close
            if (this.els.modalCloseBtn) {
                this.els.modalCloseBtn.addEventListener('click', () => this.closeModal());
            }
            if (this.els.modalOverlay) {
                this.els.modalOverlay.addEventListener('click', () => this.closeModal());
            }

            // ESC key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.els.modal && this.els.modal.style.display !== 'none') {
                    this.closeModal();
                }
            });

            // Retry button
            if (this.els.retryBtn) {
                this.els.retryBtn.addEventListener('click', () => {
                    this.loadData();
                });
            }

            // Language change event
            window.addEventListener('languageChanged', () => {
                if (this.isInitialized) {
                    this.renderDepartmentList();
                }
            });
        },

        /**
         * Load employee data from JSON
         */
        async loadData() {
            this.showLoading();
            try {
                const response = await fetch('./data/org-chart.json');
                if (!response.ok) throw new Error('Network error');
                const json = await response.json();
                this.data = json.employees || [];
                this.extractDepartments();
                this.filteredData = [... this.data];
                this.render();

                // Double-check visibility
                setTimeout(() => {
                    if (this.els.canvas && this.els.canvas.style.display === 'none') {
                        console.warn('⚠️ Canvas hidden, forcing show');
                        this.showCanvas();
                    }
                }, 100);

            } catch (error) {
                console.error('Org chart data load error:', error);
                this.showError();
            }
        },

        /**
         * Extract unique departments for filter
         */
        extractDepartments() {
            const deptSet = new Set();
            this.data.forEach(emp => {
                if (emp.department) deptSet.add(emp.department);
            });
            this.departments = ['all', ...Array.from(deptSet).sort()];
            this.renderDepartmentList();
        },

        /**
         * Render department filter list
         */
        renderDepartmentList() {
            if (!this.els.departmentList) return;

            // Safe i18n check
            let allLabel = 'All Departments';
            try {
                if (window.I18n && typeof window.I18n.t === 'function') {
                    allLabel = window.I18n.t('all_departments') || 'All Departments';
                }
            } catch (e) {
                console.warn('i18n not available, using default labels');
            }

            let html = `<li><button class="org-chart-sidebar-filter__item is-active" data-department="all">${allLabel}</button></li>`;

            this.departments.slice(1).forEach(dept => {
                html += `<li><button class="org-chart-sidebar-filter__item" data-department="${dept}">${dept}</button></li>`;
            });

            this.els.departmentList.innerHTML = html;

            // Bind click events
            this.els.departmentList.querySelectorAll('.org-chart-sidebar-filter__item').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.selectDepartment(e.target.dataset.department);
                });
            });
        },

        /**
         * Select department filter
         */
        selectDepartment(dept) {
            this.selectedDepartment = dept;

            // Update active state
            if (this.els.departmentList) {
                this.els.departmentList.querySelectorAll('.org-chart-sidebar-filter__item').forEach(item => {
                    item.classList.toggle('is-active', item.dataset.department === dept);
                });
            }

            this.filterAndRender();
        },

        /**
         * Filter data by search and department
         */
        filterAndRender() {
            let filtered = this.data;

            // Department filter (case-insensitive, trim whitespace)
            if (this.selectedDepartment !== 'all') {
                filtered = filtered.filter(emp => {
                    const empDept = (emp.department || '').trim().toLowerCase();
                    const selectedDept = this.selectedDepartment.trim().toLowerCase();
                    return empDept === selectedDept;
                });

                console.log(`🔍 Filtered by department "${this.selectedDepartment}": `, filtered.length, 'employees');
            }

            // Search filter - include ancestors to maintain tree structure
            if (this.searchTerm) {
                const searchMatches = new Set();

                // Find all matching employees
                filtered.forEach(emp => {
                    const name = (emp.name || '').toLowerCase();
                    const title = (emp.title || '').toLowerCase();
                    const dept = (emp.department || '').toLowerCase();

                    if (name.includes(this.searchTerm) ||
                        title.includes(this.searchTerm) ||
                        dept.includes(this.searchTerm)) {
                        searchMatches.add(emp.id);

                        // Also add all ancestors (so tree path is visible)
                        let current = emp;
                        while (current.managerId) {
                            searchMatches.add(current.managerId);
                            current = this.data.find(e => e.id === current.managerId);
                            if (!current) break;
                        }
                    }
                });

                // Filter to only matched employees + their ancestors
                filtered = filtered.filter(emp => searchMatches.has(emp.id));

                console.log(`🔍 Search matches: `, searchMatches.size, 'employees (+ ancestors)');
            }

            this.filteredData = filtered;
            this.render();
        },

        /**
         * Render org chart tree
         */
        render() {
            if (this.filteredData.length === 0) {
                this.showEmpty();
                return;
            }

            // Build tree structure
            const tree = this.buildTree(this.filteredData);

            if (! tree) {
                this.showEmpty();
                return;
            }

            this.els.tree.innerHTML = this.renderNode(tree);
            this.showCanvas();

            // Force visibility
            if (this.els.canvas) {
                this.els.canvas.style.display = 'block';
            }
            if (this.els.tree) {
                this.els.tree.style.opacity = '1';
                this.els.tree.style.visibility = 'visible';
            }

            // Bind card clicks
            this.els.tree.querySelectorAll('.org-chart-node__card').forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const empId = card.dataset.id;
                    this.openModal(empId);
                });

                // Keyboard support
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const empId = card.dataset.id;
                        this.openModal(empId);
                    }
                });
            });

            // Bind menu button clicks
            this.els.tree.querySelectorAll('.org-chart-node__menu').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const nodeId = btn.dataset.nodeId;
                    this.toggleNodeMenu(nodeId);
                });
            });

            // Bind dropdown item clicks
            this.els.tree.querySelectorAll('.org-chart-node__dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    const nodeId = item.dataset.nodeId;
                    const empId = item.dataset.empId;

                    this.handleNodeAction(action, nodeId || empId);
                    this.closeAllNodeMenus();
                });
            });

            // Bind expand button (when collapsed)
            this.els.tree.querySelectorAll('.org-chart-node__expand-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const nodeId = btn.dataset.nodeId;
                    this.toggleCollapse(nodeId);
                });
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                this.closeAllNodeMenus();
            });
        },

        /**
         * Build hierarchical tree from flat data
         */
        buildTree(employees) {
            const map = {};
            employees.forEach(emp => {
                map[emp.id] = { ... emp, children: [] };
            });

            let root = null;
            employees.forEach(emp => {
                if (emp.managerId && map[emp.managerId]) {
                    map[emp.managerId].children.push(map[emp.id]);
                } else if (! emp.managerId) {
                    // CEO or top-level employee
                    root = map[emp.id];
                }
            });

            return root;
        },

        /**
         * Render a single node (recursive)
         */
        renderNode(node) {
            if (! node) return '';

            const hasChildren = node.children && node.children.length > 0;
            const isCollapsed = this.collapsedNodes.has(node.id);

            // Determine level for styling
            const level = this.getEmployeeLevel(node);
            const deptClass = node.department ? node.department.replace(/\s+/g, '') : 'Other';

            let html = `<div class="org-chart-node" data-id="${node.id}">`;

            // Card
            html += `
                <div class="org-chart-node__card" 
                     data-id="${node.id}" 
                     data-dept="${deptClass}"
                     data-level="${level}"
                     tabindex="0" 
                     role="button" 
                     aria-label="View ${this.escapeHtml(node.name)} details">
                    <img class="org-chart-node__avatar" 
                         src="${node.avatar}" 
                         alt="${this.escapeHtml(node.name)}" 
                         loading="lazy" />
                    <div class="org-chart-node__info">
                        <div class="org-chart-node__name">${this.highlightSearch(this.escapeHtml(node.name))}</div>
                        <div class="org-chart-node__title">${this.highlightSearch(this.escapeHtml(node.title))}</div>
                        <div class="org-chart-node__department">${this.escapeHtml(node.department)}</div>
                    </div>
                    
                    <button class="org-chart-node__menu" 
                            data-node-id="${node.id}" 
                            aria-label="Options for ${this.escapeHtml(node.name)}"
                            aria-haspopup="true">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="3" r="1.5"></circle>
                            <circle cx="8" cy="8" r="1.5"></circle>
                            <circle cx="8" cy="13" r="1.5"></circle>
                        </svg>
                    </button>
                    
                    <div class="org-chart-node__dropdown" data-node-dropdown="${node.id}" style="display: none;">
                        <button class="org-chart-node__dropdown-item" data-action="view" data-emp-id="${node.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View Details
                        </button>
                        ${hasChildren ? `
                        <button class="org-chart-node__dropdown-item" data-action="collapse" data-node-id="${node.id}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                            ${isCollapsed ? 'Expand' : 'Collapse'} Team
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Children
            if (hasChildren) {
                html += `<div class="org-chart-node__children ${isCollapsed ? 'is-collapsed' : ''}">`;
                node.children.forEach(child => {
                    html += this.renderNode(child);
                });
                html += `</div>`;

                if (isCollapsed) {
                    html += `<button class="org-chart-node__expand-btn" data-node-id="${node.id}">+${node.children.length}</button>`;
                }
            }

            html += `</div>`;
            return html;
        },

        /**
         * Get employee level (CEO, C-Suite, Manager, Individual)
         */
        getEmployeeLevel(node) {
            if (!node.managerId) return 'ceo';
            if (node.title.toLowerCase().includes('ceo') ||
                node.title.toLowerCase().includes('president') ||
                node.title.toLowerCase().includes('chief')) {
                return 'c-suite';
            }
            if (node.title.toLowerCase().includes('svp') ||
                node.title.toLowerCase().includes('vp') ||
                node.title.toLowerCase().includes('director')) {
                return 'director';
            }
            return 'individual';
        },

        /**
         * Toggle node dropdown menu
         */
        toggleNodeMenu(nodeId) {
            // Close all other menus first
            this.closeAllNodeMenus();

            const dropdown = document.querySelector(`[data-node-dropdown="${nodeId}"]`);
            if (dropdown) {
                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
            }
        },

        /**
         * Close all node dropdown menus
         */
        closeAllNodeMenus() {
            document.querySelectorAll('.org-chart-node__dropdown').forEach(dd => {
                dd.style.display = 'none';
            });
        },

        /**
         * Handle node action from dropdown
         */
        handleNodeAction(action, id) {
            console.log(`📋 Node action: ${action} for ID: ${id}`);

            switch (action) {
                case 'view':
                    this.openModal(id);
                    break;
                case 'collapse':
                    this.toggleCollapse(id);
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
        },

        /**
         * Toggle collapse state of a node
         */
        toggleCollapse(nodeId) {
            if (this.collapsedNodes.has(nodeId)) {
                this.collapsedNodes.delete(nodeId);
            } else {
                this.collapsedNodes.add(nodeId);
            }
            this.render();
        },

        /**
         * Toggle between horizontal and vertical tree layout
         */
        toggleLayout() {
            if (! this.els.tree) return;

            const isVertical = this.els.tree.classList.toggle('org-chart--vertical');

            console.log(`📐 Layout:  ${isVertical ? 'Vertical' : 'Horizontal'}`);

            // Save preference
            localStorage.setItem('orgChartLayout', isVertical ?  'vertical' : 'horizontal');
        },

        /**
         * Open employee detail modal
         */
        openModal(empId) {
            const emp = this.data.find(e => e.id === empId);
            if (!emp) return;

            // Populate modal
            const modalAvatar = document.getElementById('detailModalAvatar');
            const modalName = document.getElementById('detailModalName');
            const modalTitle = document.getElementById('detailModalTitle');
            const modalDepartment = document.getElementById('detailModalDepartment');
            const modalEmail = document.getElementById('detailModalEmail');
            const modalPhone = document.getElementById('detailModalPhone');
            const modalManagerRow = document.getElementById('detailModalManagerRow');
            const modalManager = document.getElementById('detailModalManager');
            const modalReportsRow = document.getElementById('detailModalReportsRow');
            const modalReports = document.getElementById('detailModalReports');

            if (modalAvatar) {
                modalAvatar.src = emp.avatar;
                modalAvatar.alt = emp.name;
            }
            if (modalName) modalName.textContent = emp.name;
            if (modalTitle) modalTitle.textContent = emp.title;
            if (modalDepartment) modalDepartment.textContent = emp.department;

            if (modalEmail) {
                modalEmail.textContent = emp.email;
                modalEmail.href = `mailto:${emp.email}`;
            }

            if (modalPhone) {
                modalPhone.textContent = emp.phone;
                modalPhone.href = `tel:${emp.phone}`;
            }

            // Manager
            if (emp.managerId && modalManagerRow) {
                const manager = this.data.find(e => e.id === emp.managerId);
                if (manager && modalManager) {
                    modalManager.textContent = manager.name;
                    modalManagerRow.style.display = 'flex';
                } else {
                    modalManagerRow.style.display = 'none';
                }
            } else if (modalManagerRow) {
                modalManagerRow.style.display = 'none';
            }

            // Direct reports
            const reports = this.data.filter(e => e.managerId === empId);
            if (reports.length > 0 && modalReportsRow && modalReports) {
                modalReports.textContent = reports.map(r => r.name).join(', ');
                modalReportsRow.style.display = 'flex';
            } else if (modalReportsRow) {
                modalReportsRow.style.display = 'none';
            }

            // Show modal
            if (this.els.modal) {
                this.els.modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                // Focus close button for accessibility
                if (this.els.modalCloseBtn) {
                    setTimeout(() => this.els.modalCloseBtn.focus(), 100);
                }
            }
        },

        /**
         * Close modal
         */
        closeModal() {
            if (this.els.modal) {
                this.els.modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        },

        /**
         * Zoom in/out
         */
        zoom(delta) {
            this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel + delta));
            if (this.els.tree) {
                this.els.tree.style.transform = `scale(${this.zoomLevel})`;
            }
        },

        /**
         * Reset zoom
         */
        resetZoom() {
            this.zoomLevel = 1;
            if (this.els.tree) {
                this.els.tree.style.transform = `scale(1)`;
            }
        },

        /**
         * Highlight search term in text
         */
        highlightSearch(text) {
            if (! this.searchTerm) return text;

            const regex = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },

        /**
         * Escape HTML to prevent XSS
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        /**
         * Escape regex special characters
         */
        escapeRegex(text) {
            return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        /**
         * Show loading state
         */
        showLoading() {
            if (this.els.loading) this.els.loading.style.display = 'flex';
            if (this.els.error) this.els.error.style.display = 'none';
            if (this.els.empty) this.els.empty.style.display = 'none';
            if (this.els.canvas) this.els.canvas.style.display = 'none';
        },

        /**
         * Show error state
         */
        showError() {
            if (this.els.loading) this.els.loading.style.display = 'none';
            if (this.els.error) this.els.error.style.display = 'flex';
            if (this.els.empty) this.els.empty.style.display = 'none';
            if (this.els.canvas) this.els.canvas.style.display = 'none';
        },

        /**
         * Show empty state
         */
        showEmpty() {
            if (this.els.loading) this.els.loading.style.display = 'none';
            if (this.els.error) this.els.error.style.display = 'none';
            if (this.els.empty) this.els.empty.style.display = 'flex';
            if (this.els.canvas) this.els.canvas.style.display = 'none';
        },

        /**
         * Show canvas
         */
        showCanvas() {
            console.log('🎨 showCanvas() called');

            // Hide all other states
            if (this.els.loading) this.els.loading.style.display = 'none';
            if (this.els.error) this.els.error.style.display = 'none';
            if (this.els.empty) this.els.empty.style.display = 'none';

            // Show canvas - FORCE IT!
            if (this.els.canvas) {
                this.els.canvas.style.display = 'block';
                this.els.canvas.style.visibility = 'visible';
                this.els.canvas.style.opacity = '1';

                console.log('✅ Canvas display set to block');
            }

            // Force browser repaint
            if (this.els.canvas) {
                void this.els.canvas.offsetHeight;
            }
        },

        /**
         * Public method to reinitialize (e.g., when tab becomes visible)
         */
        reinit() {
            if (this.isInitialized) {
                this.render();
            } else {
                this.init();
            }
        }
    };

    // Expose globally
    window.OrgChart = OrgChart;

    // Initialize org chart when page loads
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, setting up org chart...');

        const orgChartTab = document.querySelector('[data-tab="org-chart"]');
        const orgChartPanel = document.querySelector('[data-panel="org-chart"]');

        if (! orgChartTab) {
            console.warn('⚠️ Org chart tab not found');
            return;
        }

        console.log('✅ Org chart tab found');

        // Listen for tab clicks
        orgChartTab.addEventListener('click', function handleOrgChartTabClick() {
            console.log('🖱️ Org chart tab clicked');

            // Wait for tab animation
            setTimeout(() => {
                // Check if panel is visible
                if (orgChartPanel && orgChartPanel.classList.contains('page-tab-panel--active')) {
                    console.log('✅ Org chart panel is active');

                    if (! OrgChart.isInitialized) {
                        console.log('🚀 Initializing org chart.. .');
                        OrgChart.init();
                    } else {
                        console.log('🔄 Re-rendering org chart...');
                        OrgChart.render();
                        OrgChart.showCanvas();
                    }
                } else {
                    console.warn('⚠️ Org chart panel not active yet');
                }
            }, 200);
        });

        // Also check if org chart tab is already active on load
        if (orgChartPanel && orgChartPanel.classList.contains('page-tab-panel--active')) {
            console.log('🎯 Org chart already active on load');
            setTimeout(() => OrgChart.init(), 300);
        }
    });

})(window);