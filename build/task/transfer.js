import gulp from 'gulp';
import plumber from 'gulp-plumber';
import variableReject from '../plugins/variableReject';
import config from '../../config';
import logger from '../utils/logger';

export const transfer = cb => {
    let start = new Date();
    return gulp.src(['src/**/*.json', 'src/app.wxss', '!src/**/pages.json', '!src/project.config.json'], {
        since: gulp.lastRun(transfer)
    })
        .pipe(plumber())
        // 变量注入
        .pipe(variableReject(config.variableReject))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('transfer', Date.now() - start);
        });
};
