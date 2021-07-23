module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    // 'plugin:react/recommended',
    // 'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      tsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': [
      'error',
      'unix',
    ],
    indent: [
      'error',
      2,
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'newline-before-return': 'error',
    'max-len': [
      'error',
      {
        code: 80,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
      },
    ],
    'object-curly-spacing': 'error',
    'space-before-function-paren': 'off',
  },
};
