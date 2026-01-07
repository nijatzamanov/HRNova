export const AurumStorage = {
    prefix: 'aurum_',

    set(key, value) {
        try {
            const prefixedKey = this.prefix + key;
            const serialized = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serialized);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get(key) {
        try {
            const prefixedKey = this.prefix + key;
            const serialized = localStorage.getItem(prefixedKey);
            return serialized ? JSON.parse(serialized) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    remove(key) {
        try {
            const prefixedKey = this.prefix + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};