import gulp from 'gulp';
import gEslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import logger from '../utils/logger';

export const eslint = cb => {
    let start = new Date();
    return gulp.src('src/**/*.js', {
        since: gulp.lastRun(eslint)
    })
        .pipe(plumber())
        .pipe(gEslint())
        .pipe(gEslint.format())
        .pipe(gEslint.results(results => {
            if (results.errorCount || results.warningCount) {
                let errorList = results.filter(item => item.errorCount || item.warningCount);
                logger.error(
                    logger.colors.bgRed(' eslint '),
                    ':',
                    logger.colors.red('error：' + results.errorCount),
                    logger.colors.red('warn: ' + results.warningCount)
                );
                errorList.map(result => {
                    console.log(
                        '          ',
                        result.filePath.match(/src.*$/)[0],
                        logger.colors.red('error: ', result.errorCount),
                        logger.colors.red('warn: ', result.warningCount)
                    );
                    result.messages.map((res => {
                        console.log(
                            '              ',
                            logger.colors.gray(res.ruleId || ''),
                            logger.colors.yellow(res.line + ':' + res.column),
                            res.message
                        );
                    }));
                });
            }
        }))
        .on('end', () => {
            logger.taskLog('eslint', Date.now() - start);
        });
};
