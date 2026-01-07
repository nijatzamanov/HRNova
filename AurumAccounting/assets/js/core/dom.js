export const AurumDOM = {
    qs(selector, parent = document) {
        return parent.querySelector(selector);
    },

    qsa(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    },

    delegate(parent, eventType, selector, handler) {
        parent.addEventListener(eventType, event => {
            const target = event.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, event);
            }
        });
    }
};