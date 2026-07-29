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

// ---------------------
// Word Utilities
// ---------------------

export function getPlural(string: string) : string {
    if (string.endsWith("y")) {
        return string.slice(0, -1) + "ies";
    }
    return string + "s";
}

export function changeSingular(string: string, plural: boolean) {
    return plural ? getPlural(string) : string;
}

// ---------------------
// Version Utilities
// ---------------------

export interface Version {
    major: number;
    minor: number;
    patch: number;
    tag?: string;
}

export function getVersionAsString(version: Version): string {
    if (version.major === Infinity) {
        return version.tag === undefined ? '' : version.tag;
    }
    return version.major + '.' + version.minor + '.' + version.patch + (version.tag === undefined ? '' : version.tag);
}

const versionPattern = /(?:(\d+)\.(\d+)(?:\.(\d+))?)?(.*)/i;
export function parseVersion(version: string): Version {
    const matches = versionPattern.exec(version);
    if (!matches) {
        throw new Error();
    }
    return extractVersionFromMatches(matches);
}

const versionInStringPattern = /.*?(\d+)\.(\d+)(?:\.(\d+))?(.*)/i;
export function parseVersionInString(version: string): Version | null {
    const matches = versionInStringPattern.exec(version);
    if (!matches) {
        return null;
    }
    return extractVersionFromMatches(matches);
}

function extractVersionFromMatches(matches: RegExpExecArray): Version {
    return {
        major: matches[1] === undefined ? Infinity : parseInt(matches[1]),
        minor: matches[2] === undefined ? Infinity : parseInt(matches[2]),
        patch: matches[3] === undefined ? 0 : parseInt(matches[3]),
        tag: matches[4],
    }
}

/**
 * @return Whether <code>a</code> is less than, equal to, or greater than <code>b</code>.
 * Expressed as -1, 0, or 1 respectively.
 */
export function compareVersions(a: Version, b: Version, descending?: boolean) : number {
    if (a.major !== Infinity) {
        if (b.major == Infinity) { // "b" is not really a version, so "a" is first
            return -1;
        }
        if (a.major > b.major) {
            return descending ? -1 : 1;
        } else if (a.major < b.major) {
            return descending ? 1 : -1;
        } else if (a.minor > b.minor) {
            return descending ? -1 : 1;
        } else if (a.minor < b.minor) {
            return descending ? 1 : -1;
        } else if (a.patch > b.patch) {
            return descending ? -1 : 1;
        } else if (a.patch < b.patch) {
            return descending ? 1 : -1;
        }
    } else if (b.major !== Infinity) { // "a" is not really a version, so "b" is first
        return 1;
    }

    if (a.tag) {
        if (b.tag) { // both have tags
            return a.tag.localeCompare(b.tag) * (descending ? 1 : -1);
        }
        return 1; // "a" has a tag but "b" does not
    } else if (b.tag) { // "b" has a tag but "a" does not
        return -1;
    }

    return 0;
}
