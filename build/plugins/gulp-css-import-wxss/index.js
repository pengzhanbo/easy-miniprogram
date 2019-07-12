/**
 * 文件路径依赖别名
 */
let through = require('through2');
var PluginError = require('plugin-error');

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new PluginError('gulp-css-import-wxss', 'stream not supported'));
        }
        var content = file.contents.toString('utf8');
        var pattern = /\.import\s+{\s+url:\s['"](.*?)['"];\s}/g;
        content = content.replace(pattern, function(match, subMatch) {
            return '@import "' + subMatch + '";';
        });
        file.contents = Buffer.from(content);
        cb(null, file);
    });
}
