import {
    def,
    logger
} from './utils/index';
import queue from './queue';

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

/* eslint-disable */
/**
 * Intercept mutating methods and emit events
 */
[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }

        // @todo: 比如仅仅是push一个数据的情况下，如何最大化精简setData传递的新数组数据
        // @todo: splice操作的情况会更复杂点，或者两数组diff找出差异性能会更高?
        queue.push({
            id: this.__ob__.keyPath,
            target: this.__ob__.wxTarget,
            updateData: {
                key: this.__ob__.keyPath,
                value: this
            },
            fn: () => {
                inserted && ob.observeArray(this);

                logger.log(`Array ${method}: [${this.__ob__.keyPath}]`, this);
            }
        });

        return result;
    });
});

export {
    arrayMethods
};
