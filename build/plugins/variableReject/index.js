var replace = require('gulp-replace');

/**
 * 变量注入
 * @param {Object} option 配置
 */
module.exports = function variableReject(option) {
    var delimiters = option.delimiters || ['', ''];
    var variable = option.variable || {};
    var pattern = new RegExp(delimiters[0] + '(' + Object.keys(variable).join('|') + ')' + delimiters[1], 'g');
    return replace(pattern, function (match, subMatch) {
        return variable[subMatch];
    });
};
