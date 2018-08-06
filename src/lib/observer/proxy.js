import {
    logger,
    hasOwn,
    noop
} from './utils/index';

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};

const proxy = (target, sourceKey, key) => {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
};

const proxyData = target => {
    const data = target.data;
    const keys = Object.keys(data);
    keys.forEach(key => {
        if (hasOwn(target, key)) {
            logger.warn(`data key '${key}' is already declared!Please use other value instead.`);
        } else {
            proxy(target, 'data', key);
        }
    });
};

export default proxyData;
