var fs = require('fs');
// 返回路径下的文件的文件流
module.exports = function readFile(path) {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path).toString();
    } else {
        return '';
    }
};
