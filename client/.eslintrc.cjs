/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        '../.eslintrc.cjs',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    env: {
        browser: true,
        es2022: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // React 17+ JSX transform — no need to import React in every file
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off', // We use TypeScript instead
    },
};
