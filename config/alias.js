var path = require('path');
function _join(dirname) {
    return path.join(__dirname, '..', 'src', dirname);
}
module.exports = {
    'common': _join('common'),
    'components': _join('components'),
    'services': _join('services'),
    'stylus': _join('stylus'),
    'lib': _join('lib'),
    '@@': _join('utils'),
    'utils': _join('utils'),
    'project': _join('project'),
    'filters': _join('filters')
};
