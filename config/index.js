var getIpAddress = require('../build/utils/getIPAddress');
var merge = require('../build/utils/merge');
var subPackageConfig = require('./subPackage');

var PORT = 8083;

var common = {
    output: 'dist',
    assetsSubDirectory: '/static',
    assetsPublicPath: '/',
    // 变量注入
    variableReject: {
        delimiters: ['<%', '%>'],
        variable: {
            appid: 'wx4e5614dba2dc7974',
            projectname: 'easy miniprogram'
        }
    },
    // 路径替换
    cdnOption: {
        regExp: '/static/.*?\\.(png|jpe?g|webp|gif|ico)',
        content: '/static'
    },
    // 分包配置
    subPackage: subPackageConfig
}

var config = {
    // 开发环境配置
    dev: merge(common, {
        port: PORT,
         // 变量注入
         variableReject: {
            variable: {
                env: 'dev'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':' + PORT + '/static',
            version: false
        }
    }),
    // 测试环境配置
    test: merge(common, {
        output: 'dist-test',
        // 变量注入
        variableReject: {
            variable: {
                env: 'test'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':' + PORT + '/static',
            version: true
        }
    }),
    // 生产环境配置
    prod: merge(common, {
        output: 'dist-production',
        // 变量注入
        variableReject: {
            variable: {
                env: 'production'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':' + PORT + '/static',
            version: true
        }
    })
};

var type = 'dev';
switch(process.env.NODE_ENV) {
case 'test':
    type = 'test';
    break;
case 'production':
    type = 'prod';
    break;
}
module.exports = config[type];
