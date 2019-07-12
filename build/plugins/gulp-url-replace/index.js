let path = require('path');
let parseVersion = require('./parseVersion');
let readFile = require('./readFile');
let through = require('through2');
var PluginError = require('plugin-error');

let defaultOptions = {
    regExp: '', // Match path
    content: '',
    replace: '',
    version: true
};

let versionTree = {};
let prefix = /^(https?\:?)?\/\//;
let prefixSource = prefix.source.substr(1);
let pattern;

function replace(options, content) {
    if (options.regExp) {
        let regExp = options.regExp;
        if (!prefix.test(regExp)) {
            regExp = '(' + prefixSource + '.*?|)' + regExp;
        }
        pattern = pattern || new RegExp(regExp, 'g');

        content = content.replace(pattern, function (match,) {
            if (prefix.test(match)) {
                return match;
            }
            // console.log(excludeRegExp, excludeRegExp.test(match), match);
            let excludeRegExp = options.exclude ? new RegExp(options.exclude, 'g') : null;
            if (excludeRegExp && excludeRegExp.test(match)) {
                return match;
            } else {
                let version = '';
                if (/^\/static/.test(match) && options.version) {
                    let imgPath = path.join(process.cwd(), match);
                    if (!versionTree[imgPath]) {
                        version = parseVersion(readFile(imgPath), 'hash7');
                        versionTree[imgPath] = version;
                    } else {
                        version = versionTree[imgPath];
                    }
                }
                if (options.content) {
                    match = match.replace(new RegExp(options.content), options.replace);
                } else {
                    match = options.replace + match;
                }
                return match + (version ? ('?' + version) : '');
            }
        });
    }
    return content;
}

module.exports = function (options) {
    options = Object.assign({}, defaultOptions, options);
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new PluginError('gulp-url-replace', 'stream not supported'));
        }
        var content = file.contents.toString('utf8');
        content = replace(options, content);
        file.contents = Buffer.from(content);
        cb(null, file);
    });
};
