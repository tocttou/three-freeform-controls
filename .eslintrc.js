module.exports = {
  root: true,
  env: {
    "browser": true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": 0,
  }
};
