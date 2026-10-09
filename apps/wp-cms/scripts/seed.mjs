#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { load } from 'js-yaml';
import { marked } from 'marked';
import { collectionSchemas } from '../../../packages/content/src/schemas.ts';
import { editorialSchema } from '../../../packages/content/src/editorial.ts';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const credentials = JSON.parse(await readFile(new URL('./.local/credentials.json', import.meta.url), 'utf8'));
const definitions = JSON.parse(await readFile(path.join(root, 'packages/content/editorial/collections.json'), 'utf8'));
const base = `${credentials.url.replace(/\/$/, '')}/wp-json/wp/v2/`;
const authorization = `Basic ${Buffer.from(`${credentials.username}:${credentials.applicationPassword}`).toString('base64')}`;
async function request(endpoint, method = 'GET', body) {
  const response = await fetch(new URL(endpoint, base), {
    method, headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, redirect: 'error', signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Seed ${method} ${endpoint.split('?')[0]}: HTTP ${response.status} (${error.code ?? 'unknown'}).`);
  }
  return response.json();
}

function proseBlocks(markdown) {
  return marked.lexer(markdown).filter(token => token.type !== 'space').map(token => {
    const names = { paragraph: 'paragraph', heading: 'heading', list: 'list', blockquote: 'quote', code: 'code', hr: 'separator' };
    const name = names[token.type];
    if (!name) throw new Error(`Unsupported Markdown token ${token.type}; migrate explicitly rather than lose markup.`);
    const attributes = token.type === 'heading' ? { level: token.depth } : token.type === 'list' ? { ordered: token.ordered } : {};
    let html = marked.parser([token]).trim();
    if (name === 'heading') html = html.replace(/^<h([1-6])>/, '<h$1 class="wp-block-heading">');
    if (name === 'list') html = html.replace(/^<(ul|ol)([^>]*)>/, '<$1$2 class="wp-block-list">').replace(/<li>/g, '<!-- wp:list-item -->\n<li>').replace(/<\/li>/g, '</li>\n<!-- /wp:list-item -->');
    if (name === 'code') html = html.replace('<pre>', '<pre class="wp-block-code">');
    if (name === 'separator') html = '<hr class="wp-block-separator has-alpha-channel-opacity"/>';
    if (name === 'quote') html = html.replace('<blockquote>', '<blockquote class="wp-block-quote">').replace(/<p>/g, '<!-- wp:paragraph -->\n<p>').replace(/<\/p>/g, '</p>\n<!-- /wp:paragraph -->');
    return `<!-- wp:${name} ${JSON.stringify(attributes)} -->\n${html}\n<!-- /wp:${name} -->`;
  }).join('\n\n');
}

async function ensure(endpoint, slug, payload) {
  // Include trashed records: a routine seed must not resurrect a marketer's removal.
  const existing = await request(`${endpoint}?slug=${encodeURIComponent(`${slug},${slug}__trashed`)}&status=publish,draft,pending,private,future,trash&context=edit`);
  if (existing.length > 1) throw new Error(`Ambiguous existing slug ${slug}`);
  if (existing.length) {
    // Explicit additive schema migration, never replacement of existing values.
    if (process.argv.includes('--add-missing-fields')) {
      // Candidates are descriptor defaults for fixed copy, retained migration
      // input for collections. Only the server can compare all actual stores.
      const creationDefaults = Object.values(definitions).find(definition => definition.endpoint === endpoint)?.creationDefaults;
      let options;
      try {
        options = await request(`${endpoint}/${existing[0].id}`, 'OPTIONS');
      } catch (error) {
        throw new Error(`Cannot verify bdk_missing_fields migration support; upgrade the CMS plugin before migrating. ${error.message}`);
      }
      if (!options.schema?.properties?.bdk_missing_fields) {
        throw new Error(`Seed OPTIONS ${endpoint}/${existing[0].id}: server lacks bdk_missing_fields migration support; upgrade the CMS plugin before migrating.`);
      }
      const record = await request(`${endpoint}/${existing[0].id}`, 'POST', {
        bdk_missing_fields: { ...creationDefaults, ...payload.bdk_data },
      });
      const additions = record.bdk_missing_fields;
      if (!additions) throw new Error(`Seed POST ${endpoint}/${existing[0].id}: server lacks bdk_missing_fields migration response; upgrade the CMS plugin before migrating.`);
      const changed = Object.values(additions).some(paths => paths.length > 0);
      console.log(`${endpoint}/${existing[0].id}: ${changed ? 'added missing fields' : 'unchanged (idempotent)'} ${JSON.stringify(additions)}`);
    }
    return { id: existing[0].id, created: false };
  }
  // Fixed copy on an already published record is deliberately staged. Create
  // new fixed records as drafts so their validated copy exists before publication.
  const fixed = endpoint === 'marketing-pages' || endpoint === 'site-settings';
  const record = await request(endpoint, 'POST', { ...payload, ...(fixed ? { status: 'draft' } : {}), slug });
  if (fixed && payload.status === 'publish') await request(`${endpoint}/${record.id}`, 'POST', { status: 'publish' });
  return { id: record.id, created: true };
}

const summary = {};
for (const [name, definition] of Object.entries(definitions)) {
  const directory = path.join(root, 'apps/bdkinc/src/content', name);
  const files = (await readdir(directory)).filter(file => !file.startsWith('_') && /\.(json|md|mdx)$/.test(file)).sort();
  const results = [];
  for (const file of files) {
    const source = await readFile(path.join(directory, file), 'utf8');
    let data, markdown;
    if (file.endsWith('.json')) data = JSON.parse(source);
    else {
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
      if (!match) throw new Error(`Missing frontmatter: ${file}`);
      data = load(match[1]); markdown = match[2];
      if (typeof data.pubDate === 'string') data.pubDate = new Date(data.pubDate);
    }
    data = collectionSchemas[name].parse(data);
    const slug = file.replace(/\.(json|md|mdx)$/, '');
    const payload = { status: data.draft ? 'draft' : 'publish', title: data.title ?? data.name ?? data.author, bdk_data: data };
    if (markdown !== undefined) payload.bdk_original_markdown = markdown;
    if (name === 'blog') {
      payload.date = data.pubDate.toISOString().replace(/Z$/, '');
      payload.date_gmt = payload.date;
      payload.content = proseBlocks(markdown);
      payload.excerpt = data.description;
      // Native taxonomies mirror normalized string fields for editorial discoverability.
      for (const [taxonomy, names] of [['categories', [data.category]], ['tags', data.tags ?? []]]) {
        payload[taxonomy] = [];
        for (const label of names) {
          const matches = await request(`${taxonomy}?search=${encodeURIComponent(label)}&per_page=100`);
          const term = matches.find(item => item.name === label) ?? await request(taxonomy, 'POST', { name: label });
          payload[taxonomy].push(term.id);
        }
      }
    }
    results.push(await ensure(definition.endpoint, slug, payload));
  }
  summary[name] = { count: results.length, created: results.filter(result => result.created).length, ids: results.map(result => result.id) };
}
const editorialDirectory = path.join(root, 'packages/content/editorial/data');
for (const file of (await readdir(editorialDirectory)).filter(file => file.endsWith('.json')).sort()) {
  const definition = JSON.parse(await readFile(path.join(editorialDirectory, file), 'utf8'));
  const data = editorialSchema(definition.fields).parse(definition.defaults);
  const endpoint = definition.kind === 'page' ? 'marketing-pages' : 'site-settings';
  const result = await ensure(endpoint, definition.key, { title: definition.title, status: 'publish', bdk_data: data });
  summary[`${definition.kind}:${definition.key}`] = result;
}
console.log(JSON.stringify(summary, null, 2));
