import gulp from 'gulp';
import plumber from 'gulp-plumber';
import mergeJson from '../plugins/gulp-merge-json';
import noRepeat from '../utils/project-config-no-repeat';
import config from '../../config';
import logger from '../utils/logger';

export const mergerConfig = cb => {
    let start = new Date();
    return gulp.src(['src/project.config.json', config.output + '/project.config.json'], {
        allowEmpty: true
    })
        .pipe(plumber())
        .pipe(mergeJson({
            fileName: 'project.config.json',
            concatArrays: true,
            beforeMerge: json => {
                json = noRepeat(json);
                var variable = config.variableReject.variable;
                Object.keys(variable).forEach(function (key) {
                    if (key in json) {
                        json[key] = variable[key];
                    }
                });
                return json;
            }
        }))
        .pipe(gulp.dest(config.output))
        .on('end', () => {
            logger.taskLog('mergerConfig', Date.now() - start);
        });
};
