import gulp from 'gulp';
import plumber from 'gulp-plumber';
import config from '../../config';
import logger from '../utils/logger';
import getSubPackage from '../utils/subPackage';
import parseAppJson from '../plugins/gulp-miniprogram-appJson';

export const appJson = cb => {
    let start = new Date();
    return gulp.src(['src/app.json', 'src/project/**/views/**/*.wxml'], {
        allowEmpty: true,
        since: gulp.lastRun(appJson)
    })
        .pipe(plumber())
        .pipe(parseAppJson({
            edit: json => {
                let pages = json.pages;
                // 将 home元素提前到首位
                // 该需求后期改为通过设置权重的方式
                // 临时方案
                if (!pages) {
                    return json;
                }
                json = Object.assign(json, getSubPackage(pages, config.subPackage));
                // 兼容旧版本中扫码页面
                json.pages.push('pages/hotelOrder_scan/hotelOrder');
                return json;
            }
        }))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('appJson', Date.now() - start);
        });
};
