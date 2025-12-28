// fileUpload.js - File upload utility
(function(window) {
    'use strict';

    /**
     * FileUpload - Helper for file input handling
     * Note: For Basic v1, file uploads are mocked (no actual upload)
     * This provides UI feedback and validation
     */
    const FileUpload = {

        /**
         * Format file size for display
         */
        formatFileSize: function(bytes) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },

        /**
         * Validate file type
         */
        validateFileType: function(file, allowedTypes) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return allowedTypes.includes(fileExtension);
        },

        /**
         * Validate file size
         */
        validateFileSize: function(file, maxSizeMB) {
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            return file.size <= maxSizeBytes;
        },

        /**
         * Get file icon based on type
         */
        getFileIcon: function(fileName) {
            const ext = fileName.split('.').pop().toLowerCase();

            const icons = {
                pdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
                doc: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
                docx:  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
                xls: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
                xlsx: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
                default: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>'
            };

            return icons[ext] || icons.default;
        },

        /**
         * Initialize file input with validation
         */
        init: function(inputElement, options = {}) {
            const {
                allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
                maxSizeMB = 10,
                onSelect = null,
                onError = null,
                displayElement = null
            } = options;

            inputElement.addEventListener('change', (e) => {
                const file = e.target.files[0];

                if (!file) {
                    if (displayElement) {
                        displayElement.textContent = 'No file selected';
                    }
                    return;
                }

                // Validate file type
                if (! this.validateFileType(file, allowedTypes)) {
                    const error = `Invalid file type.  Allowed:  ${allowedTypes.join(', ')}`;
                    if (onError) {
                        onError(error);
                    } else {
                        alert(error);
                    }
                    inputElement.value = '';
                    return;
                }

                // Validate file size
                if (!this.validateFileSize(file, maxSizeMB)) {
                    const error = `File size exceeds ${maxSizeMB}MB limit`;
                    if (onError) {
                        onError(error);
                    } else {
                        alert(error);
                    }
                    inputElement.value = '';
                    return;
                }

                // Display file info
                if (displayElement) {
                    const icon = this.getFileIcon(file.name);
                    const size = this.formatFileSize(file.size);
                    displayElement.innerHTML = `${icon} ${file.name} (${size})`;
                }

                // Callback
                if (onSelect && typeof onSelect === 'function') {
                    onSelect({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        formattedSize: this.formatFileSize(file.size)
                    });
                }
            });
        },

        /**
         * Create file preview (for images)
         */
        createImagePreview: function(file, targetElement) {
            if (!file.type.startsWith('image/')) {
                return false;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px';
                img.style.maxHeight = '200px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = 'var(--radius)';

                targetElement.innerHTML = '';
                targetElement.appendChild(img);
            };

            reader.readAsDataURL(file);
            return true;
        },

        /**
         * Mock upload with progress (for Basic v1)
         */
        mockUpload: function(file, progressCallback, completeCallback) {
            let progress = 0;

            const interval = setInterval(() => {
                progress += 10;

                if (progressCallback) {
                    progressCallback(progress);
                }

                if (progress >= 100) {
                    clearInterval(interval);

                    if (completeCallback) {
                        completeCallback({
                            success: true,
                            fileId: 'file' + Date.now(),
                            fileName: file.name,
                            fileSize: file.size,
                            uploadedAt: new Date().toISOString()
                        });
                    }
                }
            }, 200);
        }
    };

    window.FileUpload = FileUpload;
})(window);