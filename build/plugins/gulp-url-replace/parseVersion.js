var crypto = require('crypto');

function getHex(content, type) {
    type = type === 'md5' ? type : 'sha1';
    return crypto.createHash(type).update(content).digest('hex');
}

module.exports = function getVersion(content, version) {
    if (version) {
        if (/hash\d*/.test(version)) { // hash值
            var len = version.match(/\d*$/)[0] || false;
            var hex = getHex(content);
            if (len) hex = hex.slice(0, len);
            return hex;
        } else {
            return version;
        }
    } else {
        return '';
    }
};
