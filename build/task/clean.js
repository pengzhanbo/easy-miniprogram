import del from 'del';
import {output} from '../../config';

export const clean = cb => {
    del([output + '/**', '*.zip'],)
    .then(() => {
        cb();
    });
};
