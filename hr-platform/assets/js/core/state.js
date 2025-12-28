// state.js - Simple State Management
(function(window) {
    'use strict';

    const State = {
        data: {},
        listeners: {},

        // Get state
        get: function(key, defaultValue = null) {
            return this.data.hasOwnProperty(key) ? this.data[key] : defaultValue;
        },

        // Set state
        set: function(key, value) {
            const oldValue = this.data[key];
            this.data[key] = value;

            // Trigger listeners
            if (this.listeners[key]) {
                this.listeners[key].forEach(callback => {
                    callback(value, oldValue);
                });
            }

            // Trigger global listeners
            if (this.listeners['*']) {
                this.listeners['*'].forEach(callback => {
                    callback(key, value, oldValue);
                });
            }
        },

        // Subscribe to changes
        subscribe: function(key, callback) {
            if (!this.listeners[key]) {
                this.listeners[key] = [];
            }
            this.listeners[key].push(callback);

            // Return unsubscribe function
            return () => {
                const index = this.listeners[key].indexOf(callback);
                if (index > -1) {
                    this.listeners[key].splice(index, 1);
                }
            };
        },

        // Remove state
        remove: function(key) {
            delete this.data[key];
        },

        // Clear all state
        clear: function() {
            this.data = {};
        }
    };

    window.State = State;
})(window);