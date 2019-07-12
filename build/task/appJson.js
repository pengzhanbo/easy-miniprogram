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
                if (!pages) {
                    return json;
                }
                json = Object.assign(json, getSubPackage(pages, config.subPackage));
                return json;
            }
        }))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('appJson', Date.now() - start);
        });
};
