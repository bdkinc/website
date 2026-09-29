// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@astrojs/react';
import stylex from '@stylexjs/unplugin';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import markdoc from '@astrojs/markdoc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
// Static by default; Node adapter kept for contact SSR/actions and API routes.
export default defineConfig({
  site: 'https://www.bdkinc.com',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react({ compiler: true }), mdx(), sitemap(), markdoc()],

  vite: {
    // Imported only via the React compiler transform and astro:transitions/client,
    // so Vite's startup scan misses them; late discovery 504s client:only islands.
    optimizeDeps: {
      include: [
        'react/compiler-runtime',
        'astro/virtual-modules/transitions.js',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-types.js',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-swap-functions.js',
      ],
    },
    build: {
      // Required for the StyleX fallback stylesheet linked by Layout.astro.
      cssCodeSplit: false,
    },
    plugins: [
      stylex.vite({
        useCSSLayers: {
          before: ['theme', 'base', 'components'],
          after: ['utilities'],
          prefix: 'stylex',
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
