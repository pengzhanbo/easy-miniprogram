import {
    hasOwn,
    isArray
} from './validator';

/**
 * @method encodeQuery 编码query对象为 queryString
 * @param {Object} queryObj query对象
 * @return {queryString} query字符串
 */
export function encodeQuery(queryObj = {}) {
    let queryString = '';
    for (let key in queryObj) {
        if (hasOwn(queryObj, key)) {
            if (isArray(queryObj[key])) {
                queryObj[key] = queryObj[key].join(',');
            }
            queryString += `${key}=${queryObj[key]}&`;
        }
    }
    return queryString.slice(0, -1);
}

/**
 * @method queryString 通过 key 获取 文本上的 参数
 * @param {String} key  键名
 * @return {queryString}
 */
export function queryString(str = '', key = '') {
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    let r = str.match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return '';
    }
}
