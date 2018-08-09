import {hasOwn, isFunction} from '@@/validator';

const lifeCycle = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom',
    'onShareAppMessage', 'onPageScroll', 'onTabItemTap'];

function page(option) {
    let _opt = {};
    initMixin(_opt, option);
    initData(_opt, option);
    initMethods(_opt, option);
    initLifeCycle(_opt, option);
    extend(_opt, option);
    return _opt;
}

function initMixin(_opt, option) {
    let mixins = option.mixins || [];
    mixins.forEach(mixin => {
        initData(_opt, mixin);
        initMethods(_opt, mixin);
        initLifeCycle(_opt, mixin);
        extend(_opt, mixin);
    });
}

function initData(_opt, option) {
    let _data;
    if (isFunction(option.data)) {
        _data = option.data() || {};
    } else {
        _data = option.data || {};
    }
    _opt.data = Object.assign(_opt.data || {}, _data);
}

function initMethods(_opt, option) {
    let methods = option.methods || {};
    Object.keys(methods).forEach(key => {
        _opt[key] = methods[key];
    });
}

function initLifeCycle(_opt, option) {
    Object.keys(option).forEach(key => {
        if (lifeCycle.indexOf(key) !== -1) {
            if (!hasOwn(_opt, key)) {
                _opt[key] = option[key];
            } else {
                let method = _opt[key];
                _opt[key] = function (...arg) {
                    method.call(this, ...arg);
                    option[key].call(this, ...arg);
                };
            }
        }
    });
}

function extend(_opt, option) {
    Object.keys(option).forEach(key => {
        if (['data', 'methods'].concat(lifeCycle).indexOf(key) === -1) {
            _opt[key] = option[key];
        }
    });
}

export default page;
