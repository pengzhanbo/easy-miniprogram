import gulp from 'gulp';
import ora from 'ora';
import logger from './utils/logger';
import {
    clean,
    css,
    eslint,
    js,
    wxml,
    wxs,
    transfer,
    server,
    mergerJson,
    mergerConfig
} from './task';

let spinner = ora(`building for ${process.env.CHANNEL_NAME}-${process.env.NODE_ENV} package... \n`);
let buildTime = 0;
const oraLog = cb => {
    buildTime = Date.now();
    spinner.start();
    cb();
};

gulp.task(clean);

gulp.task('dev',
    gulp.series(
        devLog,
        mergerConfig,
        gulp.parallel(wxml, wxs, css, gulp.series(eslint, js), mergerJson, transfer),
        server,
        watch
    )
);

gulp.task('build',
    gulp.series(
        oraLog,
        mergerConfig,
        clean,
        gulp.parallel(wxml, wxs, css, gulp.series(eslint, js), mergerJson, transfer),
        cb => {
            spinner.stop();
            buildTime = (Date.now() - buildTime) / 1000;
            logger.log(
                `Build ${process.env.CHANNEL_NAME}-${process.env.NODE_ENV}`,
                'package complete in',
                logger.colors.magenta(`${buildTime}s`)
            );
            cb();
        }
    )
);

gulp.task('reload',
    gulp.parallel(server, watch)
);

function devLog(cb) {
    logger.log('dev', 'running...');
    cb();
}

function watch(cb) {
    let start = new Date();
    [
        gulp.watch('src/**/*.wxml', wxml),
        gulp.watch('src/**/*.wxs', wxs),
        gulp.watch(['src/**/*.{wxss,styl,stylus}', '!src/stylus/**/*.{styl, stylus}', '!src/app.wxss'], css),
        gulp.watch('src/**/*.js', gulp.parallel(eslint, js)),
        gulp.watch(['src/**/*.json', 'src/app.wxss'], transfer),
        gulp.watch(['src/app.json', 'src/project/*/pages.json'], mergerJson)
    ].forEach(watcher => {
        watcher.on('change', watcherChange);
        watcher.on('add', watcherAdd);
        watcher.on('unlink', watcherUnlink);
    });
    logger.taskLog('watch', Date.now() - start);
    cb();
}

function watcherChange(path, stats) {
    logger.log('changed', 'File:', path);
    // console.log(logger.colors.yellow(`File: ${path} was changed`));
}

function watcherUnlink(path, stats) {
    // console.log(logger.colors.red(`File: ${path} was remove`));
    logger.log('removed', 'File:', path);
}

function watcherAdd(path, stats) {
    // console.log(logger.colors.green(`File: ${path} was add`));
    logger.log('added', 'File:', path);
}
