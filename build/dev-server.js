import logger from './utils/logger';
var express = require('express');
var path = require('path');
var config = require('../config');
var getIPAddress = require('./utils/getIPAddress');

var app = express();

// 添加静态服务器
var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

var server;

module.exports = {
    server: function () {
        server = app.listen(config.port || 8083);
        setTimeout(() => {
            console.log(logger.colors.yellow('static server running...\nlisten: http://' + getIPAddress() + ':' + config.port));
        }, 300);
    },
    close: function () {
        server && server.close();
    }
};
