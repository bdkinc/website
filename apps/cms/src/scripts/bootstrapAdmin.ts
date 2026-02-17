import { getPayload } from 'payload';

import config from '../payload.config';

async function run() {
  const email = process.env.CMS_ADMIN_EMAIL;
  const password = process.env.CMS_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'Missing CMS_ADMIN_EMAIL or CMS_ADMIN_PASSWORD in environment'
    );
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
    depth: 0,
  });

  if (existingUsers.totalDocs > 0) {
    payload.logger.info(
      'Admin bootstrap skipped: at least one user already exists'
    );
    process.exit(0);
  }

  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
    },
  });

  payload.logger.info(`Admin user created: ${email}`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
