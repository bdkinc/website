import type { PayloadRequest } from 'payload';

type RebuildEntity = 'pages' | 'site-settings' | 'manual';

interface TriggerRebuildWebhookArgs {
  req: PayloadRequest;
  entity: RebuildEntity;
  operation: 'create' | 'update' | 'manual';
  docId?: number | string;
  slug?: string;
  status?: string;
}

const WEBHOOK_URL = process.env.SITE_REBUILD_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.SITE_REBUILD_WEBHOOK_SECRET;
const WEBHOOK_SECRET_HEADER =
  process.env.SITE_REBUILD_WEBHOOK_SECRET_HEADER ?? 'x-rebuild-secret';
const WEBHOOK_TIMEOUT_MS = Number(
  process.env.SITE_REBUILD_WEBHOOK_TIMEOUT_MS ?? 5000
);

export async function triggerRebuildWebhook({
  req,
  entity,
  operation,
  docId,
  slug,
  status,
}: TriggerRebuildWebhookArgs): Promise<{ ok: boolean; message: string }> {
  if (!WEBHOOK_URL) {
    const message =
      'SITE_REBUILD_WEBHOOK_URL is not set; skipping rebuild trigger';
    req.payload.logger.warn(`[rebuild-webhook] ${message}`);
    return { ok: false, message };
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (WEBHOOK_SECRET) {
    headers[WEBHOOK_SECRET_HEADER] = WEBHOOK_SECRET;
  }

  const body = {
    source: 'payload-cms',
    entity,
    operation,
    docId,
    slug,
    status,
    triggeredAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      const message = `Webhook failed (${response.status} ${response.statusText})${responseText ? `: ${responseText}` : ''}`;
      req.payload.logger.error(`[rebuild-webhook] ${message}`);
      return { ok: false, message };
    }

    req.payload.logger.info('[rebuild-webhook] Triggered successfully');
    return { ok: true, message: 'Triggered successfully' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    req.payload.logger.error(`[rebuild-webhook] Request error: ${message}`);
    return { ok: false, message };
  }
}
