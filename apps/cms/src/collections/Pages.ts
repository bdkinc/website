import type { CollectionConfig } from 'payload';

import { triggerRebuildWebhook } from '../lib/rebuildWebhook';

export const Pages: CollectionConfig = {
  slug: 'pages',
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
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
          entity: 'pages',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'heroHeading',
      type: 'text',
    },
    {
      name: 'heroBody',
      type: 'textarea',
    },
    {
      name: 'seoTitle',
      type: 'text',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
    {
      name: 'aboutValuesHeading',
      type: 'text',
    },
    {
      name: 'aboutValuesSubheading',
      type: 'text',
    },
    {
      name: 'aboutValues',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: ['Target', 'Lightbulb', 'Shield', 'Users', 'Award', 'Clock'],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'aboutJourneyHeading',
      type: 'text',
    },
    {
      name: 'aboutJourneySubheading',
      type: 'text',
    },
    {
      name: 'aboutMilestones',
      type: 'array',
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'aboutCTATitle',
      type: 'text',
    },
    {
      name: 'aboutCTADescription',
      type: 'textarea',
    },
    {
      name: 'aboutCTAButtonText',
      type: 'text',
    },
    {
      name: 'aboutCTAButtonHref',
      type: 'text',
    },
  ],
};
