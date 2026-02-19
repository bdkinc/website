import type { CollectionConfig } from 'payload';

import { triggerRebuildWebhook } from '../lib/rebuildWebhook';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true;
      }

      return {
        _status: {
          equals: 'published',
        },
      };
    },
  },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'author', 'industry', 'order', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (doc?._status !== 'published') {
          return;
        }

        if (operation !== 'create' && operation !== 'update') {
          return;
        }

        await triggerRebuildWebhook({
          req,
          entity: 'testimonials',
          operation,
          docId: doc.id,
          slug: doc.slug,
          status: doc._status,
        });
      },
    ],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'industry',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
};
