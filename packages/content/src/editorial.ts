import { z } from 'zod/v4';
import { pageDefinitions as originalPageDefinitions, settingsDefinition } from '../editorial/data/index.ts';
import seoFields from '../editorial/seo.json' with { type: 'json' };
import routes from '../editorial/routes.json' with { type: 'json' };
import type { SEO } from './schemas.ts';

export interface EditorialField {
  type: 'text' | 'textarea' | 'url' | 'media' | 'number' | 'boolean' | 'date' | 'strings' | 'select' | 'group';
  label: string;
  locked?: boolean;
  optional?: boolean;
  default?: unknown;
  ref?: 'seo';
  choices?: readonly string[];
  fields?: Record<string, EditorialField>;
}
export interface EditorialDefinition {
  key: string;
  kind: 'page' | 'settings';
  title: string;
  fields: Record<string, EditorialField>;
  defaults: Record<string, unknown>;
}
export type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends object ? { [K in keyof T]: Widen<T[K]> } : T;
export type PageKey = keyof typeof originalPageDefinitions;
type OriginalPageData<K extends PageKey> = Widen<(typeof originalPageDefinitions)[K]['defaults']>;
type WithSEO<T> = T extends { seo: infer S } ? Omit<T, 'seo'> & { seo: S & SEO }
  : T extends { metadata: infer M } ? Omit<T, 'metadata'> & { metadata: M & SEO }
  : T & { seo?: SEO };
export type PageData<K extends PageKey> = K extends keyof typeof routes | 'service-location' | 'industry-location' ? WithSEO<OriginalPageData<K>> : OriginalPageData<K>;

export function expandSEOFields(fields: Record<string, EditorialField>): Record<string, EditorialField> {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.type === 'group'
    ? { ...field, fields: expandSEOFields({ ...(field.ref === 'seo' ? seoFields as Record<string, EditorialField> : {}), ...field.fields }) }
    : field]));
}
export const pageDefinitions = Object.fromEntries(Object.entries(originalPageDefinitions).map(([key, definition]) => {
  const fields = definition.fields as Record<string, EditorialField>;
  if (!(key in routes) && key !== 'service-location' && key !== 'industry-location') return [key, definition];
  const group = fields.seo ? 'seo' : fields.metadata ? 'metadata' : 'seo';
  return [key, { ...definition, fields: expandSEOFields({ ...fields, [group]: { ...(fields[group] ?? { type: 'group', label: 'Search and sharing', optional: true }), ref: 'seo' } }) }];
})) as { [K in PageKey]: Omit<(typeof originalPageDefinitions)[K], 'fields'> & { fields: Record<string, EditorialField> } };
export type SiteSettings = Widen<typeof settingsDefinition.defaults> & { redirects?: string[] };

export function editorialSchema(fields: Record<string, EditorialField>): z.ZodObject {
  const shape: Record<string, z.ZodType> = {};
  for (const [key, field] of Object.entries(expandSEOFields(fields))) {
    switch (field.type) {
      case 'group':
        if (!field.fields) throw new Error(`Missing fields for ${key}`);
        shape[key] = editorialSchema(field.fields); break;
      case 'number': shape[key] = z.number(); break;
      case 'boolean': shape[key] = z.boolean(); break;
      case 'strings': shape[key] = z.array(z.string()); break;
      case 'select':
        if (!field.choices?.length) throw new Error(`Missing choices for ${key}`);
        shape[key] = z.enum(field.choices); break;
      case 'url': case 'media':
        shape[key] = z.string().refine(value => value === '' || /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(value), 'Unsafe URL'); break;
      default: shape[key] = z.string();
    }
    if (field.optional) shape[key] = shape[key].optional();
    if (Object.hasOwn(field, 'default')) shape[key] = shape[key].default(field.default);
  }
  return z.strictObject(shape);
}

// JSON is shared with PHP; parsing validates the schema/default contract on import.
export const pageSchemas = Object.fromEntries(Object.entries(pageDefinitions).map(([key, definition]) => {
  const schema = editorialSchema(definition.fields as Record<string, EditorialField>);
  schema.parse(definition.defaults);
  return [key, schema];
})) as unknown as { [K in PageKey]: z.ZodType<PageData<K>> };
export const settingsSchema = editorialSchema(settingsDefinition.fields as Record<string, EditorialField>) as unknown as z.ZodType<SiteSettings>;
settingsSchema.parse(settingsDefinition.defaults);
export { settingsDefinition };
