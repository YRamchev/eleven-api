module.exports = {
    env: {
        commonjs: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-console': 'error',
    },
}
