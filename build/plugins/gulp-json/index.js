let through = require('through2');
var gutil = require('gulp-util');

/**
 * option {
 *      filename: 'app.json',
 *      edit: function(content, file) {
 *          return content;
 *      }
 * }
 */

module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new gutil.PluginError('gulp-json', 'stream not supported'));
        }
        var content = file.contents.toString('utf8');
        content = parseJson(content, options || {}, file.path);
        file.contents = Buffer.from(content);
        cb(null, file);
    });
}

function parseJson(content, options, _path) {
    if (
        /\.json$/.test(_path) &&
        options.filename && (new RegExp(options.filename + '$').test(_path)) &&
        typeof options.edit === 'function'
    ) {
        let jsonContent = JSON.parse(content);
        jsonContent = options.edit(jsonContent);
        if (jsonContent) {
            content = JSON.stringify(jsonContent, null, '\t');
        }
        return content;
    } else {
        return content;
    }
}
