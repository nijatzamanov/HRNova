/**
 * Route Normalization Helper
 * Ensures consistent active route detection across different path formats
 * @version 1.0.0
 */

export class RouteHelper {
    /**
     * Normalize a path for comparison
     * Removes leading/trailing slashes, query params, and hash
     * @param {string} path - Path to normalize
     * @returns {string} Normalized path
     */
    static normalizePath(path) {
        if (!path || typeof path !== 'string') return '';

        // Remove query string and hash
        let normalized = path.split('?')[0].split('#')[0];

        // Remove leading and trailing slashes
        normalized = normalized.replace(/^\/+|\/+$/g, '');

        // Convert to lowercase for case-insensitive comparison
        normalized = normalized.toLowerCase();

        return normalized;
    }

    /**
     * Extract filename from path
     * @param {string} path - Full path
     * @returns {string} Filename without extension
     */
    static getFilename(path) {
        if (!path || typeof path !== 'string') return '';

        const normalized = this.normalizePath(path);

        // Get last segment (filename)
        const segments = normalized.split('/');
        const filename = segments[segments.length - 1];

        // Remove .php extension
        return filename.replace(/\.php$/i, '');
    }

    /**
     * Check if two paths match
     * @param {string} path1 - First path
     * @param {string} path2 - Second path
     * @returns {boolean} True if paths match
     */
    static pathsMatch(path1, path2) {
        const file1 = this.getFilename(path1);
        const file2 = this.getFilename(path2);

        return file1 === file2;
    }

    /**
     * Get current page identifier
     * @returns {string} Current page identifier (filename without extension)
     */
    static getCurrentPage() {
        const pathname = window.location.pathname;
        return this.getFilename(pathname);
    }

    /**
     * Check if a route is active
     * @param {string} route - Route from navigation item
     * @returns {boolean} True if route is currently active
     */
    static isRouteActive(route) {
        const currentPage = this.getCurrentPage();
        const routePage = this.getFilename(route);

        return currentPage === routePage;
    }

    /**
     * Build absolute path from relative route
     * @param {string} route - Relative route
     * @returns {string} Absolute path
     */
    static buildAbsolutePath(route) {
        if (!route) return '';

        // If already starts with /, return as is
        if (route.startsWith('/')) return route;

        // Otherwise, prepend /app/
        return `/app/${route}`;
    }

    /**
     * Extract page data-attribute value
     * @returns {string} Value from data-page attribute or derived from path
     */
    static getPageAttribute() {
        // Try to get from body data-page
        const dataPage = document.body.dataset.page;
        if (dataPage && dataPage !== '[page-name]') {
            return dataPage;
        }

        // Fall back to current page
        return this.getCurrentPage();
    }

    /**
     * Check if current path matches any of the provided routes
     * @param {string[]} routes - Array of routes to check
     * @returns {boolean} True if any route matches
     */
    static matchesAnyRoute(routes) {
        if (!Array.isArray(routes)) return false;

        const currentPage = this.getCurrentPage();

        return routes.some(route => {
            const routePage = this.getFilename(route);
            return currentPage === routePage;
        });
    }

    /**
     * Debug info
     * @returns {Object} Debug information
     */
    static getDebugInfo() {
        return {
            currentUrl: window.location.href,
            pathname: window.location.pathname,
            normalizedPath: this.normalizePath(window.location.pathname),
            currentPage: this.getCurrentPage(),
            dataPageAttribute: this.getPageAttribute()
        };
    }
}

// Convenience exports
export const {
    normalizePath,
    getFilename,
    pathsMatch,
    getCurrentPage,
    isRouteActive,
    buildAbsolutePath,
    getPageAttribute,
    matchesAnyRoute,
    getDebugInfo
} = RouteHelper;

export default RouteHelper;