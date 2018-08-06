import {
    logger,
    isObject,
    isPlainObject,
    hasProto,
    hasOwn,
    def
} from './utils/index';
import {arrayMethods} from './array';
import proxyData from './proxy';
import {Queue} from './queue';
// import Dep from './dep';

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
let uid = 0;

class Observer {
    constructor(value, keyPath, wxTarget) {
        this.id = ++uid;
        this.value = value;
        // this.dep = new Dep();
        this.keyPath = keyPath || ''; // 访问路径
        this.wxTarget = wxTarget;
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    walk(value) {
        const keys = Object.keys(value);
        for (let i = 0, length = keys.length; i < length; i++) {
            defineReactive(value, keys[i], value[keys[i]], null, false, this.keyPath);
        }
    }

    observeArray(array) {
        for (let i = 0, length = array.length; i < length; i++) {
            observe(array[i], `${this.keyPath}[${i}]`, this.wxTarget);
        }
    }

    static observeWxAppData(target) {
        // 必须确保队列是唯一的，一个目标独立一个任务队列实例
        if (target.__queue__) {
            throw new Error(`'__queue__' has already exist!`);
        } else {
            target.__queue__ = new Queue();
            /* eslint no-new:0 */
            new Observer(target.data, '', target);
            proxyData(target);
        }

        // 增加$nextTick函数
        target.$nextTick = fn => {
            setTimeout(() => {
                fn && fn();
            }, 0);
        };

        return new Promise(resolve => target.$nextTick(resolve));
    }
}

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src, keys) {
    /* eslint no-proto:0 */
    target.__proto__ = src;
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        def(target, key, src[key]);
    }
}

const observe = (value, keyPath, target) => {
    if (!isObject(value)) {
        return;
    }
    let ob = null;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if ((Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
        ob = new Observer(value, keyPath, target);
    }
    return ob;
};

const defineReactive = (obj, key, value, customSetter, shallow, keyPath) => {
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }

    // save original 'getter' and 'setter'
    const getter = property && property.get;
    const setter = property && property.set;

    const target = obj.__ob__.wxTarget;
    const newKeyPath = (keyPath ? (keyPath + '.') : '') + key;
    !shallow && observe(value, newKeyPath, target);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            // const currentValue = getter ? getter.call(obj) : value;
            // if (Dep) {
            //     logger.log(`${key} get: ${currentValue}`);
            // }
            // return currentValue;
            return getter ? getter.call(obj) : value;
        },
        set(newValue) {
            const currentValue = getter ? getter.call(obj) : value;
            if (newValue === currentValue) {
                return;
            }

            if (setter) {
                setter.call(obj, newValue);
            } else {
                value = newValue;
            }

            target.__queue__.push({
                id: newKeyPath,
                target: target,
                updateData: {
                    key: newKeyPath,
                    value: newValue
                },
                fn: () => {
                    !shallow && observe(value, newKeyPath, target);

                    logger.log(`set [${newKeyPath}]:`, currentValue, ' --> ', value);
                }
            });
        }
    });
};

export default Observer;
