const _toString = Object.prototype.toString;

export function isFunction(fn) {
    return typeof fn === 'function';
}

export function isArray(array) {
    return _toString.call(array) === '[object Array]';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}

// can we use __proto__?
export const hasProto = '__proto__' in {};

/**
 * Check whether the object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

export function noop() {
}

/**
 * Remove an item from an array
 */
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
