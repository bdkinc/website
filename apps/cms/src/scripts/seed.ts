import config from '../payload.config';

import { getPayload } from 'payload';

import { ensureInitialContent } from '../lib/seedContent';

async function run() {
  const payload = await getPayload({ config });

  await ensureInitialContent(payload);

  payload.logger.info('Seed complete');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
