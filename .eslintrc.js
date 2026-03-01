module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    // Pages are single-word (index, calendar, settings) — allow it
    'vue/multi-word-component-names': 'off',
  },
}
