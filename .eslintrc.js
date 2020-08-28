module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'no-continue': 'off',
    'import/extensions': [2, 'never', { 'web.js': 'never', json: 'never' }],
    'import/prefer-default-export': 'off',
    'no-bitwise': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
