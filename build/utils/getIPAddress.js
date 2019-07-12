/**
 * 获取IP地址
 */
let os = require('os');
let iFaces = os.networkInterfaces();

function getIPAddress() {
    let ip = '';
    let dev = '';
    // let alias = 0;
    for (dev in iFaces) {
        // alias = 0;
        iFaces[dev].forEach(function (details) {
            if (details.family === 'IPv4' && details.address !== '127.0.0.1' && !details.internal) {
                ip = details.address;
                // ++alias;
            }
        });
    }
    return ip;
}

module.exports = getIPAddress;
