import wxios from '../lib/wxios/index.js';
let http = wxios.create({
    baseURL: 'localhost:8083',
    data: {
    },
    headers: {
    }
});

/**
 * 添加 request 拦截器
 */
http.interceptors.request.use(function (config) {
    return config;
});

/**
 * 添加 response 拦截器
 */
http.interceptors.response.use(function (config) {
    return config;
});

export default http;
