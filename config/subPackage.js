var config = {
    open: false, // 是否开启分包加载
    publicRoot: 'project',
    rules: [
        {
            module: 'demo', // 包名
            master: true, // 主包标记
            index: 'home', // 主包入口页  即 views 目录下的识图目录
            // 预加载应该细化到，进入这个页面后，根据实际使用场景，进入下一个页面的可能性来做
            preload: {
                'home': ['test']
            }
        }
    ]
}

module.exports = config;
