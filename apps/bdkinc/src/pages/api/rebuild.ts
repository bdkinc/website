import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const expectedSecret = process.env.SITE_REBUILD_WEBHOOK_SECRET;

  if (expectedSecret) {
    const providedSecret = request.headers.get('x-rebuild-secret');

    if (providedSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  }

  const deployWebhookURL = process.env.DEPLOY_REBUILD_WEBHOOK_URL;

  if (!deployWebhookURL) {
    return new Response(
      JSON.stringify({
        ok: true,
        message:
          'Rebuild webhook received. Set DEPLOY_REBUILD_WEBHOOK_URL to forward this to your deploy provider.',
        receivedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (process.env.DEPLOY_REBUILD_WEBHOOK_SECRET) {
    headers['x-deploy-rebuild-secret'] =
      process.env.DEPLOY_REBUILD_WEBHOOK_SECRET;
  }

  const upstreamResponse = await fetch(deployWebhookURL, {
    method: 'POST',
    headers,
  });

  if (!upstreamResponse.ok) {
    const body = await upstreamResponse.text().catch(() => '');

    return new Response(
      JSON.stringify({
        ok: false,
        message: `Deploy webhook failed with ${upstreamResponse.status}`,
        body,
      }),
      {
        status: 502,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: 'Deploy webhook triggered',
      receivedAt: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};
