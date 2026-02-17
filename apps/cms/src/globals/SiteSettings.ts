import type { GlobalConfig } from 'payload';

import { triggerRebuildWebhook } from '../lib/rebuildWebhook';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        await triggerRebuildWebhook({
          req,
          entity: 'site-settings',
          operation: 'update',
        });
      },
    ],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'BDKinc',
    },
    {
      name: 'primaryCTA',
      type: 'text',
    },
    {
      name: 'primaryCTALink',
      type: 'text',
    },
  ],
};
