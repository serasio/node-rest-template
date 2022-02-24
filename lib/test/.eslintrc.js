const baseLintConfig = require('../../.eslintrc');

module.exports = {
  ...baseLintConfig,
  env: {
    jest: true,
  },
  globals: {
    def: 'readonly',
    get: 'readonly',
    subject: 'readonly',
  },
  rules: {
    ...baseLintConfig.rules,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
