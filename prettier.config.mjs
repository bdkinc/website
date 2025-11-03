import * as pluginAstro from 'prettier-plugin-astro';
import * as pluginTailwind from 'prettier-plugin-tailwindcss';

export default {
  plugins: [pluginAstro, pluginTailwind],
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.astro'],
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['*.mdx'],
      options: {
        parser: 'mdx',
      },
    },
  ],
};
