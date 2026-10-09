// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { getNoindexPaths } from '@bdkinc/content/seo';

import react from '@astrojs/react';
import stylex from '@stylexjs/unplugin';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import markdoc from '@astrojs/markdoc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { parse } = createRequire(import.meta.resolve('astro'))('devalue');
/** @type {URL | undefined} */
let snapshotUrl;
/** @type {Promise<Set<string>> | undefined} */
let noindexPaths;

const sitemapSnapshot = {
  name: 'sitemap-published-snapshot',
  hooks: {
    /** @param {{ config: import('astro').AstroConfig }} options */
    'astro:config:done': ({ config }) => {
      snapshotUrl = new URL('data-store.json', config.cacheDir);
      noindexPaths = undefined;
    },
  },
};

async function readNoindexPaths() {
  const resolvedSnapshotUrl = snapshotUrl;
  if (!resolvedSnapshotUrl)
    throw new Error('Sitemap content snapshot cacheDir has not been resolved.');
  const store = await readFile(resolvedSnapshotUrl, 'utf8')
    .then((serialized) => parse(serialized))
    .catch((cause) => {
      throw new Error(
        `Cannot read sitemap published content snapshot: ${resolvedSnapshotUrl.href}`,
        { cause }
      );
    });
  /** @param {string} key */
  function collection(key) {
    const entries = store.get(key);
    if (!(entries instanceof Map))
      throw new Error(
        `Sitemap published content snapshot is missing collection: ${key}`
      );
    return entries;
  }
  /** @param {string} collectionKey @param {string} id */
  function entry(collectionKey, id) {
    const value = collection(collectionKey).get(id);
    if (!value)
      throw new Error(
        `Sitemap published content snapshot is missing entry: ${collectionKey}/${id}`
      );
    return value;
  }
  return getNoindexPaths({
    async getCollection(key) {
      return [...collection(key).values()].map((value) => ({
        id: value.id,
        data: value.data,
        body: value.rendered?.html ?? value.body,
      }));
    },
    async getPage(key) {
      return entry('marketingPages', key).data.data;
    },
    async getSettings() {
      return entry('siteSettings', 'site').data;
    },
  });
}

/** @param {import('@astrojs/sitemap').SitemapItem} item */
async function serializeSitemapItem(item) {
  noindexPaths ??= readNoindexPaths();
  const pathname = new URL(item.url).pathname.replace(/\/+$/, '') || '/';
  return (await noindexPaths).has(pathname) ? undefined : item;
}

// https://astro.build/config
// Static by default; Node adapter kept for contact SSR/actions and API routes.
export default defineConfig({
  site: 'https://www.bdkinc.com',
  security: {
    // Trust forwarded HTTPS only for the public hosts behind the private Traefik backend.
    allowedDomains: [
      { hostname: 'www.bdkinc.com', protocol: 'https' },
      { hostname: 'bdkinc.com', protocol: 'https' },
    ],
  },
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react({ compiler: true }),
    mdx(),
    sitemapSnapshot,
    sitemap({ serialize: serializeSitemapItem }),
    markdoc(),
  ],

  vite: {
    // Client-only islands, compiler transforms and transitions can escape startup scanning.
    // Preoptimize their imports so late discovery does not invalidate active module URLs.
    optimizeDeps: {
      include: [
        'react/compiler-runtime',
        'react-icons/pi',
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
