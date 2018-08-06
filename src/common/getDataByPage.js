/**
 * 由于小程序的声明周期没有提供页面注册时的钩子，无法通过事件系统做异步数据共享
 * 该方法为便于获取页面栈中某一页面的数据
 * 但是用该方法，请确保获取的数据是同步的
 * 在当前页面获取上个页面的数据时，请确保上个页面的数据已请求完毕，否则可能导致获取的数据不同步
 * 同时该方法获取的数据为页面 data对象的引用，不建议操作对该data进行写的操作。
 * @param {array|string} data 需要获取的 data key 默认返回整个data对象
 * @param {string|number} page 页面名称|往前第几个页面 默认上一个页面
 * @return {any} data
 */
export default function getDataByPage(data, page) {
    let pageList = getCurrentPages();
    page = page || 1;
    // 如果页面栈只有一个页面，直接返回空对象
    if (pageList.length === 1) {
        return {};
    }
    if (typeof page === 'string') {
        page = pageList.map(p => p.route.match(/\/([a-zA-Z0-9]+?)$/)[1]).lastIndexOf(page);
        // 找不到页面或者页面栈为当前页面，直接返回空对象
        if (page === -1 || page === pageList.length - 1) {
            return {};
        }
        page = pageList.length - page - 1;
    }
    // 超过页面栈数量，直接返回空对象
    if (page > pageList.length) {
        return {};
    }
    let targetData = pageList[pageList.length - page - 1].data;
    // 如果没有指定获取某些数据，则返回所有数据
    if (!data) {
        return targetData;
    }
    // 如果获取单个数据，则直接返回该数据的值；
    if (typeof data === 'string') {
        return targetData[data];
    }
    let result = {};
    data.forEach(key => {
        result[key] = targetData[key];
    });
    return result;
}
