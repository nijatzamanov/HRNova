// dom.js - DOM Utility Functions
(function(window) {
    'use strict';

    const DOM = {
        // Query selector
        query: function(selector, context = document) {
            return context.querySelector(selector);
        },

        queryAll: function(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

        // Create element
        create: function(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);

            Object.keys(attributes).forEach(key => {
                if (key === 'className') {
                    element.className = attributes[key];
                } else if (key === 'dataset') {
                    Object.keys(attributes[key]).forEach(dataKey => {
                        element.dataset[dataKey] = attributes[key][dataKey];
                    });
                } else {
                    element.setAttribute(key, attributes[key]);
                }
            });

            if (content) {
                if (typeof content === 'string') {
                    element.innerHTML = content;
                } else {
                    element.appendChild(content);
                }
            }

            return element;
        },

        // Show/Hide
        show: function(element) {
            if (element) {
                element.removeAttribute('hidden');
                element.style.display = '';
            }
        },

        hide: function(element) {
            if (element) {
                element.setAttribute('hidden', '');
            }
        },

        toggle: function(element) {
            if (element) {
                if (element.hasAttribute('hidden')) {
                    this.show(element);
                } else {
                    this.hide(element);
                }
            }
        },

        // Add/Remove class
        addClass: function(element, className) {
            if (element) {
                element.classList.add(className);
            }
        },

        removeClass: function(element, className) {
            if (element) {
                element.classList.remove(className);
            }
        },

        toggleClass: function(element, className) {
            if (element) {
                element.classList.toggle(className);
            }
        },

        // Get/Set attribute
        getAttr: function(element, attr) {
            return element ?  element.getAttribute(attr) : null;
        },

        setAttr: function(element, attr, value) {
            if (element) {
                element.setAttribute(attr, value);
            }
        },

        removeAttr: function(element, attr) {
            if (element) {
                element.removeAttribute(attr);
            }
        },

        // Insert
        append: function(parent, child) {
            if (parent && child) {
                parent.appendChild(child);
            }
        },

        prepend:  function(parent, child) {
            if (parent && child) {
                parent.insertBefore(child, parent.firstChild);
            }
        },

        // Remove
        remove: function(element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        },

        // Empty
        empty: function(element) {
            if (element) {
                element.innerHTML = '';
            }
        },

        // Event delegation
        on: function(parent, eventType, selector, handler) {
            parent.addEventListener(eventType, function(event) {
                const target = event.target.closest(selector);
                if (target) {
                    handler.call(target, event);
                }
            });
        }
    };

    window.DOM = DOM;
})(window);