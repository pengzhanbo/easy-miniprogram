import {isEmpty} from './validator';
/**
 * @method delEmptyOption 删除对象空属性
 * @param {Object} opts
 * @return {Object}
 */
export default opts => {
    opts = Object.assign({}, opts);
    for (let key in opts) {
        if (isEmpty(opts[key])) {
            delete opts[key];
        }
    }
    return opts;
};
