module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    webextensions: true,
    es2021: true
  },

  ignorePatterns: [
    'node_modules/*',
    'dist/*',
    'dist-tsc/*',
    '.vscode/*',
    '*.js',
    '*.mjs'
  ],

  extends: [
    // 'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },

  plugins: ['@typescript-eslint'],

  rules: {
    // 'no-unused-vars': [
    //   'error',
    //   {
    //     argsIgnorePattern: '^_',
    //     destructuredArrayIgnorePattern: '^_'
    //   }
    // ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }
    ],

    '@typescript-eslint/no-non-null-assertion': 'off',

    "dot-notation": "off",
    "@typescript-eslint/dot-notation": "off",

    indent: [
      'warn',
      2,
      {
        SwitchCase: 1
      }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ]
  }
}
