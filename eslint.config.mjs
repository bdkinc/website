import js from '@eslint/js';
import astro from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', '.astro/', '.factory/', '.vscode/'],
  },
];
