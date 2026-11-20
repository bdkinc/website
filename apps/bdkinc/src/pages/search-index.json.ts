import type { APIRoute } from 'astro';
import { createAppContentReader } from '@/lib/content';
import { buildSearchIndex } from '@/lib/search';

// Static asset built from the published store; fetched by /search only when a query runs.
export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildSearchIndex(createAppContentReader())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
