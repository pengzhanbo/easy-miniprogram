import gulp from 'gulp';
import plumber from 'gulp-plumber';
import urlReplace from '../plugins/gulp-url-replace';
import variableReject from '../plugins/variableReject';
import pathAlias from 'gulp-miniprogram-path-alias';
import config from '../../config';
import alias from '../../config/alias';
import logger from '../utils/logger';

export const js = cb => {
    let start = new Date();
    return gulp.src('src/**/*.js', {
        since: gulp.lastRun(js)
    })
        .pipe(plumber())
        // 变量注入
        .pipe(variableReject(config.variableReject))
        .pipe(pathAlias(alias))
        // 图片资源路径替换
        .pipe(urlReplace(config.cdnOption))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('js', Date.now() - start);
        });
};
