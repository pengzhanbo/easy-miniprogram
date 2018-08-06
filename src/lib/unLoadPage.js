/**
 * 给当前页面实例增加页面前进和后退两个方法
 * @param {Object} pageInstance 当前页面实例
 * @param {Object} options 配置项，目前有两个方法，都在实例的同名方法之前执行
 *      {Funtion} onForward 前进方法，该方法适用于普通前进 及 原页面被替换式的重定向
 *      {Funtion} onBack 后退方法，该方法适用于普通后退 及 原页面栈页面数量大于1，清空页面栈重定向的情况
 * @return null
 */
export default function (pageInstance, options = {}) {
    // 页面前进方法
    let _forwordFn = function () {
        typeof options.onForward === 'function' && options.onForward();
        typeof pageInstance.onForward === 'function' && pageInstance.onForward();
    };
    // 页面后退方法
    let _backFn = function () {
        typeof options.onBack === 'function' && options.onBack();
        typeof pageInstance.onBack === 'function' && pageInstance.onBack();
    };
    let _pagesLength = getCurrentPages().length;
    // 生命周期函数--监听页面隐藏
    let onHide = pageInstance.onHide;
    // 生命周期函数--监听页面卸载
    let onUnload = pageInstance.onUnload;
    // 页面前进，页面长度变化可以是 等于或大于当前记录的值
    pageInstance.onHide = function () {
        onHide.call(pageInstance);
        // 发生在下次事件循环
        setTimeout(() => {
            _forwordFn();
        }, 0);
    };
    // 页面卸载，或后退，或重定向
    pageInstance.onUnload = function () {
        onUnload.call(pageInstance);
        // 发生在下次事件循环
        setTimeout(() => {
            if (getCurrentPages().length < _pagesLength) {
                // 页面后退
                _backFn();
            } else {
                // 重定向前进
                _forwordFn();
            }
        }, 0);
    };
};
