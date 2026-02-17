import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commonGlobals = {
  ...globals.browser,
  ...globals.node,
};

const jsConfig = {
  ...js.configs.recommended,
  files: ['**/*.{js,jsx,mjs,cjs}'],
  languageOptions: {
    ...(js.configs.recommended.languageOptions ?? {}),
    globals: commonGlobals,
  },
};

const astroConfigs = astro.configs['flat/recommended'];

const typescriptFiles = ['**/*.{ts,tsx}'];
const tsConfigs = tsPlugin.configs['flat/recommended'].map((config) => ({
  ...config,
  files: config.files ?? typescriptFiles,
  languageOptions: {
    ...(config.languageOptions ?? {}),
    parser: tsParser,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
      extraFileExtensions: ['.astro'],
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: commonGlobals,
  },
}));

const reactRecommended = {
  ...react.configs.flat.recommended,
  files: ['**/*.{jsx,tsx}'],
  languageOptions: {
    ...(react.configs.flat.recommended.languageOptions ?? {}),
    globals: commonGlobals,
  },
};

const reactJsxRuntime = {
  ...react.configs.flat['jsx-runtime'],
  files: ['**/*.{jsx,tsx}'],
  languageOptions: {
    ...(react.configs.flat['jsx-runtime']?.languageOptions ?? {}),
    globals: commonGlobals,
  },
};

const reactHooksConfig = {
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    'react-hooks': reactHooks,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

const jsxA11yConfig = {
  ...jsxA11y.flatConfigs.recommended,
  files: ['**/*.{jsx,tsx,astro}'],
  languageOptions: {
    ...(jsxA11y.flatConfigs.recommended.languageOptions ?? {}),
    globals: commonGlobals,
  },
  rules: {
    ...(jsxA11y.flatConfigs.recommended.rules ?? {}),
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
  },
};

export default [
  {
    ignores: ['node_modules/', 'dist/', '.astro/', '.factory/', '.vscode/'],
  },
  jsConfig,
  ...astroConfigs,
  ...tsConfigs,
  reactRecommended,
  reactJsxRuntime,
  reactHooksConfig,
  jsxA11yConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    languageOptions: {
      globals: commonGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'warn',
    },
  },
];
