import gulp from 'gulp';
import plumber from 'gulp-plumber';
import urlReplace from '../plugins/gulp-url-replace';
import variableReject from '../plugins/variableReject';
import pathAlias from 'gulp-miniprogram-path-alias';
import config from '../../config';
import alias from '../../config/alias';
import logger from '../utils/logger';

export const wxs = cb => {
    let start = new Date();
    return gulp.src('src/**/*.wxs', {
        since: gulp.lastRun(wxs)
    })
        .pipe(plumber())
        // 图片资源路径替换
        .pipe(urlReplace(config.cdnOption))
        .pipe(pathAlias(alias))
        .pipe(variableReject(config.variableReject))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('wxs', Date.now() - start);
        });
};
