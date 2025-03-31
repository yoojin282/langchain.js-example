// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  bracketSameLine: true,
  tabWidth: 2,
  arrowParens: 'always',
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
