module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
    request: true
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  extends: 'standard',
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 2
  }
};
