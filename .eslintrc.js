module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': 'warn',
    'prefer-const': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['off'],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
