import gutil from 'gulp-util';

const logger = {
    _default(...arg) {
        console.log(
            `[${gutil.colors.gray(gutil.date('hh:mm:ss'))}]`,
            ...arg
        );
    },
    taskLog(taskname, timestamp = 0) {
        timestamp = timestamp < 1000 ? timestamp + 'ms' : (timestamp / 1000) + 's';
        process.env.NODE_ENV === 'development' && logger._default(
            gutil.colors.cyan(taskname),
            'after',
            gutil.colors.magenta(timestamp)
        );
    },
    log(taskname, ...arg) {
        logger._default(
            gutil.colors.cyan(taskname),
            ...arg
        );
    },
    colors: gutil.colors,
    error(...arg) {
        logger._default(...arg);
    }
}

export default logger;
