module.exports = {
  plugins: [
    'prettier',
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json"
  },
  settings: {
    react: {},
  },
  rules: {
    'prettier/prettier': 'error',
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 0 // It's not working as expected
  },
}
