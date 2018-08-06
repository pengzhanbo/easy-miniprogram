var getIpAddress = require('../build/utils/getIPAddress');
var merge = require('../build/utils/merge');

var common = {
    output: 'dist',
    assetsSubDirectory: '/static',
    assetsPublicPath: '/',
    // 变量注入
    variableReject: {
        delimiters: ['<%', '%>'],
        variable: {
            appid: 'wx4e5614dba2dc7974',
        }
    },
    // 路径替换
    cdnOption: {
        regExp: '/static/.*?\\.(png|jpe?g|webp|gif|ico)',
        content: '/static'
    }
}

var config = {
    // 开发环境配置
    dev: merge(common, {
        port: 8083,
         // 变量注入
         variableReject: {
            variable: {
                env: 'dev',
                projectname: 'easy miniprogram'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':8083/static',
            version: false
        }
    }),
    // 测试环境配置
    test: merge(common, {
        output: 'dist-test',
        // 变量注入
        variableReject: {
            variable: {
                env: 'test',
                projectname: 'easy miniprogram'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':8083/static',
            version: true
        }
    }),
    // 生产环境配置
    prod: merge(common, {
        output: 'dist-production',
        // 变量注入
        variableReject: {
            variable: {
                env: 'production',
                projectname: 'easy miniprogram'
            }
        },
        // 路径替换
        cdnOption: {
            replace: 'http://' + getIpAddress() + ':8083/static',
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
