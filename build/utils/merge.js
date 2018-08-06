function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
        return;
    }

    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
        } else {
            result[key] = val;
        }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
    }
    return result;
}

module.exports = merge;
