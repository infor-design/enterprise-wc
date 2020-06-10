module.exports = {
  env: {
    browser: true,
    es6: true // All source code is at least ES6 friendly
  },
  extends: [
    // Import some AirBNB rules and some web component and jsdoc rules
    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules
    'airbnb-base',
    'plugin:wc/recommended',
    'plugin:jsdoc/recommended'
  ],
  globals: {
  },
  parser: 'babel-eslint',
  plugins: [
    'import'
  ],
  // Add `ecmaVersion: 9` for Object spread syntax
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module'
  },
  rules: {
    // Dont force a new line after comments
    'jsdoc/newline-after-description': 0,
    // require trailing commas in multiline object literals
    'comma-dangle': ['off', {
      arrays: 'never',
      objects: 'never',
      imports: 'never',
      exports: 'never',
      functions: 'never'
    }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // Allow clases to be set on the web components
    'wc/no-self-class': 0,
    // Allow methods to return static content
    // https://eslint.org/docs/rules/class-methods-use-this
    'class-methods-use-this': ['error', { exceptMethods: ['template', 'settings'] }],
    // Allow Ids Imports to be unsed in index.js files
    'no-unused-vars': ['error', { varsIgnorePattern: '[Ids]' }]
  }
};
