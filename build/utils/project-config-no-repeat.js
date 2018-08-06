/**
 * 处理 project.config.json 在合并时候导致数组元素重复的问题
 * @param {object} config
 */
function noRepeat(config) {
    config = config || {};
    let condition = config['condition'] || {};
    ['search', 'conversation', 'miniprogram', 'weapp'].forEach(function (key) {
        if (condition[key] && condition[key].list) {
            condition[key].list = arrayNoRepeat(condition[key].list);
        }
    });
    return config;
}

function arrayNoRepeat(array) {
    let result = [];
    array.forEach(function (item) {
        let hasItem = false;
        for (let i = 0, len = result.length; i < len; i++) {
            let res = result[i];
            if (Object.is(item.name, res.name) && Object.is(item.id, res.id) && Object.is(item.pathName, res.pathName) && Object.is(item.query, res.query)) {
                hasItem = true;
                break;
            }
        }
        !hasItem && result.push(item);
    });
    return result;
}

module.exports = noRepeat;
