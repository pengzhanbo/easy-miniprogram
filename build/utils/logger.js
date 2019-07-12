import chalk from 'chalk';

const logger = {
    _default(...arg) {
        console.log(
            `[${chalk.gray(dateFormat(Date.now(), 'hh:MM:ss'))}]`,
            ...arg
        );
    },
    taskLog(taskName, timestamp = 0) {
        timestamp = timestamp < 1000 ? timestamp + 'ms' : (timestamp / 1000) + 's';
        process.env.NODE_ENV === 'development' && logger._default(
            chalk.cyan(taskName),
            'after',
            chalk.magenta(timestamp)
        );
    },
    log(taskName, ...arg) {
        logger._default(
            chalk.cyan(taskName),
            ...arg
        );
    },
    colors: chalk,
    error(...arg) {
        logger._default(...arg);
    }
}

/**
 * 日期格式化函数
 * @param  {DateString}  timestamp default: 当前时间
 * @param  {formatString} fmt  default: yyyy-mm-dd  y:年 m:月 d:日 w:星期 h:小时 M:分钟 s:秒
 */
function dateFormat(timestamp, fmt) {
    let D = new Date();
    let week = '日一二三四五六';
    timestamp && D.setTime(timestamp);
    fmt = fmt || 'yyyy-mm-dd';
    let d = {
        'm+': D.getMonth() + 1,
        'd+': D.getDate(),
        'w+': week.charAt(D.getDay()),
        'h+': D.getHours(),
        'M+': D.getMinutes(),
        's+': D.getSeconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (D.getFullYear() + '').slice(-RegExp.$1.length));
    }
    Object.keys(d).forEach((key) => {
        if (new RegExp(`(${key})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? d[key] : (`00${d[key]}`).slice(('' + d[key]).length));
        }
    });
    return fmt;
};

export default logger;
