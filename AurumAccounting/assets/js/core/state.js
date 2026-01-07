export const AurumState = {
    store: {},
    listeners: {},

    set(key, value) {
        this.store[key] = value;
        this.notify(key, value);
    },

    get(key) {
        return this.store[key];
    },

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);

        return () => {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        };
    },

    notify(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
    },

    clear() {
        this.store = {};
        this.listeners = {};
    }
};