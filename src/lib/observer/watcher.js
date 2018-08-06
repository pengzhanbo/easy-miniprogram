import {
    logger
} from './utils';

let uid = 0;

class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.id = ++uid;

        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            logger.warn('expOrFn should be a function now.');
        }

        this.value = this.lazy
            ? undefined
            : this.get();
    }

    get() {
    }
}

export default Watcher;
