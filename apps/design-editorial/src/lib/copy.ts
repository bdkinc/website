export type Copy = Record<string, unknown>;
export const object = (value: unknown): Copy => value && typeof value === 'object' && !Array.isArray(value) ? value as Copy : {};
export const text = (value: unknown): string => typeof value === 'string' ? value : '';
export const records = (value: unknown): Copy[] => Object.values(object(value)).filter(v => v && typeof v === 'object').map(object);
export const strings = (value: unknown): string[] => Object.values(object(value)).filter((v): v is string => typeof v === 'string');
export function listText(value: unknown): string[] {
  return Object.values(object(value)).map(item => typeof item === 'string' ? item : text(object(item).text || object(item).name)).filter(Boolean);
}
export function heading(value: unknown) {
  const v = object(value);
  return [text(v.heading || v.headingLead || v.title || v.name || v.role), text(v.headingAccent)].filter(Boolean).map(v => v.trim()).join(' ');
}
export function body(value: unknown) {
  const v = object(value);
  return text(v.body || v.description || v.introduction || v.subtitle || v.subheading) || [v.bodyBefore || v.bodyLead, v.bodyAccent || v.bodyEmphasis, v.bodyAfter || v.bodyEnd].map(text).filter(Boolean).map(v => v.trim()).join(' ').replace(/\s+([.,])/g, '$1');
}
export function interpolate<T>(value: T, tokens: Record<string, string>): T {
  if (typeof value === 'string') return value.replace(/\{(\w+)\}/g, (all, key: string) => tokens[key] ?? all) as T;
  if (Array.isArray(value)) return value.map(v => interpolate(v, tokens)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, interpolate(item, tokens)])) as T;
  return value;
}
