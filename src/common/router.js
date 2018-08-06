import {encodeQuery} from '@@/query';
import delEmptyOption from '@@/delEmptyOption';
import wxp from 'lib/wxp';

let Router = {
    // route: '',
    /**
     * wx.navigateTo 封装
     * @param {object} option _getURL 入参规则
     */
    go(option) {
        wxp('navigateTo', {url: _getURL(option)});
    },
    /**
     * wx.redirectTo 封装
     * @param {object} option _getURL 入参规则
     */
    redirect(option) {
        wxp('redirectTo', {url: _getURL(option)});
    },
    /**
     * wx.reLaunch 封装
     * @param {object} option _getURL 入参规则
     */
    reLaunch(option) {
        wxp('reLaunch', {url: _getURL(option)});
    },
    /**
     * wx.switchTab 封装
     * @param {object} option _getURL 入参规则
     */
    switchTab(option) {
        wxp('switchTab', {url: _getURL(option)});
    },
    /**
     * 页面后退
     * @param {number} delta
     */
    back(delta) {
        delta = delta || 1;
        wxp('navigateBack', {delta});
    },
    /**
     * 生成小程序页面链接
     */
    getURL: _getURL
};

/**
 * 生成页面链接
 * @param {string} module 子模块名称
 * @param {string} route 页面名称
 * @param {string} filename 文件名，有些模块的文件名可能会是index或者其它
 * @param {object} query 链接入参
 * @return {string}
 */
function _getURL({module = 'home', route = 'home', filename, query = {}}) {
    let url = `/project/${module}/views/${route}/${filename || route}`;
    let queryString = encodeQuery(delEmptyOption(query));
    return queryString ? url + '?' + queryString : url;
}

export default Router;
