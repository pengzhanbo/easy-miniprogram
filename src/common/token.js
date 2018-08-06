
const TOKEN = 'cacheToken'; // 需要跟旧版字段一致
const MEMBER = 'wxMember'; // 用户信息
let cache;

/**
 * 读取小于60分钟的token 缓存
 */
export function getToken() {
    var cacheToken = cache || wx.getStorageSync(TOKEN);
    if (cacheToken && Date.now() - parseInt(cacheToken.timestamp) < 3600000) {
        // console.log('读取token缓存', cacheToken);
        return cacheToken.data.token;
    } else {
        // console.log('读取token缓存为空');
        return '';
    }
};
/**
 * 设置带时间戳的token缓存
 * 传入登录接口返回的data，包含用户信息、token
 * {"timestamp":1512524111035,"data":{"idCard":"653222198204028937","innId":"451","memberId":181683239,"memberName":"milan","memberType":1,"phone":"13211114682","sid":"272254","token":"xxxx"}}
 */
export function setToken(loginData) {
    cache = {
        'timestamp': new Date().getTime(),
        'data': loginData
    };
    wx.setStorageSync(TOKEN, cache);
    getApp().event.emit('NEW_MEMBER_SUCCESS', true);
};

/**
 * 删除token
 */
export function removeToken() {
    cache = null;
    try {
        wx.removeStorageSync(TOKEN);
        wx.removeStorageSync(MEMBER);
    } catch (e) {
        // Do something when catch error
    }
}

export default {
    set: setToken,
    get: getToken,
    remove: removeToken
};
