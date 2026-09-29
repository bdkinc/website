import { z } from 'zod/v4';
import { pageDefinitions, settingsDefinition } from '../editorial/data/index.ts';

export interface EditorialField {
  type: 'text' | 'textarea' | 'url' | 'media' | 'number' | 'boolean' | 'date' | 'strings' | 'select' | 'group';
  label: string;
  locked?: boolean;
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
export type PageKey = keyof typeof pageDefinitions;
export type PageData<K extends PageKey> = Widen<(typeof pageDefinitions)[K]['defaults']>;
export type SiteSettings = Widen<typeof settingsDefinition.defaults>;

export function editorialSchema(fields: Record<string, EditorialField>): z.ZodObject {
  const shape: Record<string, z.ZodType> = {};
  for (const [key, field] of Object.entries(fields)) {
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
export { pageDefinitions, settingsDefinition };
