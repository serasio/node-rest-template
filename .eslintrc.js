module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': ['error'],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['_templates/**'] },
    ],
  },
};
