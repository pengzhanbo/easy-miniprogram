import gulp from 'gulp';
import plumber from 'gulp-plumber';
import urlReplace from '../plugins/gulp-url-replace';
import variableReject from '../plugins/variableReject';
import postcss from 'gulp-postcss';
import stylus from 'gulp-stylus';
import rename from 'gulp-rename';
import pathAlias from 'gulp-miniprogram-path-alias';
import importWxss from '../plugins/gulp-css-import-wxss';
import config from '../../config';
import alias from '../../config/alias';
import logger from '../utils/logger';

export const css = cb => {
    let start = new Date();
    return gulp.src(['src/**/*.{wxss,styl,stylus}', '!src/stylus/**/*.{styl, stylus}', '!src/app.wxss'], {
        since: gulp.lastRun(css)
    })
        .pipe(plumber())
        // 图片资源路径替换
        .pipe(urlReplace(config.cdnOption))
        .pipe(variableReject(config.variableReject))
        .pipe(pathAlias(alias))
        .pipe(stylus())
        .pipe(postcss())
        .pipe(importWxss())
        .pipe(pathAlias(alias))
        .pipe(rename({
            extname: '.wxss'
        }))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('css', Date.now() - start);
        });
};
