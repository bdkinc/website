import type { PayloadHandler } from 'payload';

import { triggerRebuildWebhook } from '../lib/rebuildWebhook';

export const triggerRebuildEndpoint: PayloadHandler = async (req) => {
  const requiredSecret = process.env.CMS_OPS_SECRET;

  if (requiredSecret) {
    const providedSecret = req.headers.get('x-cms-ops-secret');

    if (providedSecret !== requiredSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const result = await triggerRebuildWebhook({
    req,
    entity: 'manual',
    operation: 'manual',
  });

  return Response.json(
    {
      ok: result.ok,
      message: result.message,
    },
    {
      status: result.ok ? 200 : 500,
    }
  );
};
