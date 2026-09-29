// Presentation vocabulary for the existing structured catalogs. No defaults or content fallbacks.
export interface Group {
  [key: string]: string | number | Group | undefined;
}
export function group(value: unknown): Group {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Group)
    : {};
}
export function text(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}
export function entries(value: unknown): [string, Group][] {
  return Object.entries(group(value))
    .filter(([, v]) => v && typeof v === 'object')
    .map(([k, v]) => [k, group(v)]);
}
export function heading(g: Group) {
  return [
    text(
      g.headingLead ||
        g.heading ||
        g.title ||
        g.name ||
        g.role ||
        g.label ||
        g.std ||
        g.proto
    ),
    text(g.headingAccent),
    text(g.headingEnd),
  ]
    .filter(Boolean)
    .join(' ');
}
export function body(g: Group) {
  if (g.body || g.description || g.desc)
    return text(g.body || g.description || g.desc);
  return [
    text(g.bodyBefore || g.bodyLead || g.descriptionLead),
    text(g.bodyAccent || g.bodyEmphasis || g.descriptionBrand),
    text(g.bodyAfter || g.bodyEnd || g.descriptionEnd),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+([.,;:])/g, '$1');
}
export function substitute<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === 'string')
    return value.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match) as T;
  if (Array.isArray(value)) return value.map((v) => substitute(v, vars)) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, substitute(v, vars)])
    ) as T;
  return value;
}
