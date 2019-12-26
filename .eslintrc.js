module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['standard', 'prettier'],
  plugins: ['prettier'],
  globals: {
    use: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': ['error'],
  },
};
