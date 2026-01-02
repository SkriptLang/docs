// ---------------------
// URL Search Parameters Utilities
// ---------------------

/**
 * Gets the single value of a query parameter from the URL.
 * @param key The key of the query parameter.
 */
export function getParam(key: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

/**
 * Adds a query parameter to the URL.
 * @param key The key of the query parameter to add.
 * @param value The value of the query parameter to add.
 */
export function setParam(key: string, value: string) {
    if (value === '') {
        deleteParam(key);
        return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    const newUrl = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', newUrl);
}

/**
 * Deletes a query parameter from the URL.
 * @param key The key of the query parameter to delete.
 */
export function deleteParam(key: string) {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    const paramsString = params.toString();
    const newUrl = window.location.pathname + (paramsString === '' ? '' : ('?' + paramsString));
    window.history.replaceState({}, '', newUrl);
}

/**
 * Clears all query parameters from the URL.
 */
export function clearParams() {
    window.history.replaceState({}, '', window.location.pathname);
}
