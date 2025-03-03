module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'vue/script-setup-uses-vars': 'error',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' },
        ],
        'max-len': [
            'error',
            {
                code: 80,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreComments: true,
                ignoreUrls: true,
            },
        ],
    },
};
