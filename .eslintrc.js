module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': 'off',
    'no-plusplus': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
