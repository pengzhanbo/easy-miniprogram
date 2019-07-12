var PluginError = require('plugin-error');
import through from 'through';
import path from 'path';
import Vinyl from 'vinyl';

const PLUGIN_NAME = 'gulp-miniProgram-appJson';

let noop = () => {};

let defOption = {
    appJson: 'app.json',
    rootPath: 'src',
    edit: noop
};

export default function parseAppJson(option) {
    option = Object.assign({}, defOption, option || {});
    let pageList = [];
    let appContent;
    let appFile;
    function dataStream(file) {
        if (file.isNull()) {
            return this.queue(file);
        }

        if (file.isStream()) {
            return this.emit('error', new PluginError(PLUGIN_NAME, `${PLUGIN_NAME}: Streaming not supported!`));
        }
        let projectConfigPattern = new RegExp(option.appJson + '$');
        if (projectConfigPattern.test(file.path)) {
            appContent = JSON.parse(file.contents.toString('utf8'));
            appFile = file;
        } else {
            pageList = addPageList(pageList, file.path, option);
        }
    }
    function endStream() {
        if (!appContent) {
            return this.emit('end');
        }
        appContent.pages = (appContent.pages || []).concat(pageList);

        if (typeof option.edit === 'function') {
            appContent = option.edit(appContent) || appContent;
        }
        let contents = JSON.stringify(appContent, null, '\t');
        let output = new Vinyl({
            cwd: appFile.cwd,
            base: appFile.base,
            path: path.join(appFile.base, option.appJson),
            contents: Buffer.from(contents)
        });
        this.emit('data', output);
        this.emit('end');
    }
    return through(dataStream, endStream);

};

function addPageList(pageList, page, option) {
    if (!page) {
        return [];
    }
    page = path.relative(path.join(process.cwd(), option.rootPath), page)
        .replace(new RegExp('\\' + path.sep, 'g'), '/')
        .replace(/\.wxml$/, '');
    let pattern = /\/(.*)\/(\1|index)$/;
    if (pattern.test(page) && pageList.indexOf(page) === -1){
        pageList.push(page);
    }
    return pageList;
}
