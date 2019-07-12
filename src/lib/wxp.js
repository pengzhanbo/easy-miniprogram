/**
 *
 * @module wxp 对 wx 实例的二次封装
 * 修改调用方式支持promise，并检查该方法是否在该版本库中存在且可被调用
 *
 * @method 实例上挂载了 wx上的所有方法，并同时支持原API调用方式以及 promise调用方式
 * @method wxp本身也是一个方法 ps： wxp('request', {url: 'localhost:8080//api'}).then(res => console.log(res));
 *         该方法会检测调用的方法是否存在于wx上，且是否在当前版本库中可调用，是则调用wxp.request 方法
 *         否则抛出 Promise.reject({status: -200, message: 'request is not Found'});
 *         建议使用此方式调用。
 * @author pengzhanbo
 */
import {isFunction, hasOwn, isEmpty, isObject} from '@@/validator';
let _wx;
let noop = function () {};

/**
 * @func getWx 判断 wx是否存在， 以及 _wx 是否已完成赋值，
 *             如果在调用阶段 小程序还未注入 wx，则抛出一个错误
 */
function getWx() {
    if (!_wx || isEmpty(_wx)) {
        if (typeof wx !== 'undefined') {
            _wx = wx;
            initWxp();
        } else {
            _wx = {};
            throw new Error('wx is not found !');
        }
    }
}

/**
 * @func initWxp 初始化 wxp实例上的方法，在 wx对象上挂载的方法clone到 wxp实例上
 */
function initWxp() {
    Object.keys(_wx).forEach(handleName => {
        // 判断 handleName是否是方法
        // 对非方法类直接赋值
        if (!isFunction(_wx[handleName])) {
            wxp[handleName] = _wx[handleName];
        } else {
            // 挂载方法
            // 添加promise调用方式支持
            wxp[handleName] = function (option) {
                if (!option.promise) {
                    return _wx[handleName](option);
                }
                return new Promise((resolve, reject) => {
                    // 保留 success、fail 引用
                    let _success = option.success;
                    let _fail = option.fail;
                    // 重写 success
                    option.success = function (...args) {
                        // 同时支持原wx方法调用以及promise方式调用
                        isFunction(_success) && _success.apply(null, args);
                        resolve.apply(null, args);
                    };
                    // 重写 fail
                    option.fail = function (...args) {
                        isFunction(_fail) && _fail.apply(null, args);
                        reject.apply(null, args);
                    };
                    _wx[handleName](option);
                });
            };
        }
    });
}

/**
 * @func wxp
 * @param {string|Object<any>} handleName 类型为string时，作为调用的方法名，
 *                                        类型为object时，为 option， handleName为 option.handleName
 * @param {object<any>} option 配置
 *                      option.promise 默认：true 返回一个promise 否则返回原wx方法
 */
function wxp(handleName, option) {
    // 由于不确定 wx 在什么阶段完成注入，小程序并没有提供相关的判断依据
    // 有考虑过轮询的方式内部检测wx是否注入，并将注入前的接口调用放到队列中处理
    // 但是轮询会引入新的问题，同时队列也会引入新的问题，比如，在交互过程中，wx的注入时机比想象中的晚，
    // 但是用户的界面已经加载完成渲染完成界面，队列里面存在了 showLoading 和 hideLoading，
    // 用户在交互的过程中突然看到加载弹框一闪而过，从体验上来说十分不友好，
    // 所以只在每次调用前做一次判断即可
    option = option || {};
    getWx();
    if (isObject(handleName)) {
        handleName = handleName.handleName;
        delete handleName.handleName;
        option = handleName;
    }
    if (!hasOwn(option, 'promise')) {
        option.promise = true;
    }
    if (!handleName) {
        throw new Error('wxp need handleName');
    }
    // canIUse可以判断在当前基础库版本中是否可以使用某个API
    let canIUse = _wx.canIUse || noop;
    let has = hasOwn(_wx, handleName);
    // 某些api在低版本的基础库中并没有实现，在调用前做一次判断，减少调用报错的问题。
    let canI = canIUse(handleName);
    if (has && canI) {
        return wxp[handleName](option);
    } else {
        if (option.promise) {
            if (!has) {
                return new Error({status: -300, error: handleName + ' is not found'});
            } else if (!canI) {
                return new Error({status: -200, error: handleName + ' can\'t use'});
            }
        } else {
            return false;
        }
    }
}

// 默认初始化调用一次
getWx();
export default wxp;
