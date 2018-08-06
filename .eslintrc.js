// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html',
        'promise'
    ],
    globals: {
        'App': true,
        'Page': true,
        'Component': true,
        'wx': true,
        'getApp': true,
        'getCurrentPages': true,
        'getRegExp': true,
        'getDate': true
    },
    // add your custom rules here
    rules: {
        'indent': ['error', 4],
        'space-before-function-paren': ["error", {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "ignore"
        }],
        'eqeqeq': 'off',
        'semi': ['error', 'always'],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-useless-call': 0
    }
}
