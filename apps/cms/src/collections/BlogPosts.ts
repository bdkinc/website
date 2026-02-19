import type { CollectionConfig } from 'payload';

import { triggerRebuildWebhook } from '../lib/rebuildWebhook';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
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
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
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
          entity: 'blog-posts',
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
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: 'BDKinc',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['Infrastructure', 'Security', 'Development', 'AI'],
      required: true,
      defaultValue: 'Infrastructure',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Markdown content for the post body.',
      },
    },
  ],
};
