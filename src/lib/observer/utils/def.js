/**
 * Define a property.
 */
export function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
