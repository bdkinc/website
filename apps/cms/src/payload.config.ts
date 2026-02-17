import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import dotenv from 'dotenv';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Pages } from './collections/Pages';
import { healthEndpoint } from './endpoints/health';
import { triggerRebuildEndpoint } from './endpoints/triggerRebuild';
import { Users } from './collections/Users';
import { SiteSettings } from './globals/SiteSettings';
import { ensureInitialContent } from './lib/seedContent';

dotenv.config();

const dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendURL = process.env.FRONTEND_URL ?? 'http://localhost:4321';
const payloadSecret =
  process.env.PAYLOAD_SECRET ?? 'dev-only-change-this-secret';
const databaseURI =
  process.env.DATABASE_URI ?? 'mongodb://127.0.0.1:27017/bdkinc_cms';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3001',
  secret: payloadSecret,
  editor: lexicalEditor(),
  sharp,
  db: mongooseAdapter({
    url: databaseURI,
  }),
  admin: {
    user: Users.slug,
  },
  cors: [frontendURL],
  csrf: [frontendURL],
  endpoints: [
    {
      path: '/ops/health',
      method: 'get',
      handler: healthEndpoint,
    },
    {
      path: '/ops/trigger-rebuild',
      method: 'post',
      handler: triggerRebuildEndpoint,
    },
  ],
  collections: [Users, Pages],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    if (process.env.SEED_ON_INIT === 'true') {
      await ensureInitialContent(payload);
      payload.logger.info('Initial CMS content ensured');
    }
  },
});
