import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  site: 'https://www.bdkinc.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [react({ compiler: true })],
  vite: {
    optimizeDeps: { include: ['react/compiler-runtime'] },
    build: {
      // Required for the StyleX fallback stylesheet linked by Shell.astro.
      cssCodeSplit: false,
    },
    plugins: [
      stylex.vite({ useCSSLayers: { before: ['base'], prefix: 'stylex' } }),
    ],
  },
  server: { host: '127.0.0.1', port: 4323 },
});
