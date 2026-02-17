import type { PayloadHandler } from 'payload';

export const healthEndpoint: PayloadHandler = async () => {
  return Response.json(
    {
      ok: true,
      service: 'bdkinc-cms',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
};
