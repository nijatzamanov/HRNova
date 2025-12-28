// datePicker.js - Simple date picker utility (optional, uses native HTML5 date input)
(function(window) {
    'use strict';

    /**
     * DatePicker - Helper for HTML5 date inputs with validation and formatting
     * Note: For Basic v1, we use native <input type="date">
     * This file provides utility functions for date manipulation
     */
    const DatePicker = {

        /**
         * Format date for input (YYYY-MM-DD)
         */
        formatForInput: function(date) {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        },

        /**
         * Format date for display (localized)
         */
        formatForDisplay: function(dateString, locale = 'en') {
            const date = new Date(dateString);
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        /**
         * Get today's date in YYYY-MM-DD format
         */
        getToday: function() {
            return this.formatForInput(new Date());
        },

        /**
         * Set minimum date for input
         */
        setMinDate: function(inputElement, minDate) {
            if (typeof minDate === 'string') {
                inputElement.min = minDate;
            } else {
                inputElement.min = this.formatForInput(minDate);
            }
        },

        /**
         * Set maximum date for input
         */
        setMaxDate: function(inputElement, maxDate) {
            if (typeof maxDate === 'string') {
                inputElement.max = maxDate;
            } else {
                inputElement.max = this.formatForInput(maxDate);
            }
        },

        /**
         * Calculate days between two dates
         */
        daysBetween: function(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays + 1; // Include both start and end date
        },

        /**
         * Validate date range
         */
        validateRange: function(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return { valid: false, error: 'Invalid date format' };
            }

            if (end < start) {
                return { valid: false, error: 'End date must be after start date' };
            }

            return { valid: true };
        },

        /**
         * Check if date is weekend
         */
        isWeekend: function(dateString) {
            const date = new Date(dateString);
            const day = date.getDay();
            return day === 0 || day === 6; // Sunday or Saturday
        },

        /**
         * Get working days between dates (excludes weekends)
         */
        getWorkingDays: function(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            let count = 0;

            const current = new Date(start);
            while (current <= end) {
                const day = current.getDay();
                if (day !== 0 && day !== 6) {
                    count++;
                }
                current.setDate(current.getDate() + 1);
            }

            return count;
        },

        /**
         * Add days to date
         */
        addDays: function(dateString, days) {
            const date = new Date(dateString);
            date.setDate(date.getDate() + days);
            return this.formatForInput(date);
        },

        /**
         * Initialize date input with constraints
         */
        init: function(inputElement, options = {}) {
            const {
                minDate = null,
                maxDate = null,
                defaultValue = null,
                onChange = null
            } = options;

            if (minDate) {
                this.setMinDate(inputElement, minDate);
            }

            if (maxDate) {
                this.setMaxDate(inputElement, maxDate);
            }

            if (defaultValue) {
                inputElement.value = this.formatForInput(defaultValue);
            }

            if (onChange && typeof onChange === 'function') {
                inputElement.addEventListener('change', (e) => {
                    onChange(e.target.value);
                });
            }
        }
    };

    window.DatePicker = DatePicker;
})(window);