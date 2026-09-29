const placeholders = new Set(['serviceTitle', 'industryTitle', 'locationName', 'state', 'region', 'counties']);

/** Interpolate plain text only; Astro remains responsible for escaping output. */
export function interpolateCopy(text: string, values: Partial<Record<'serviceTitle' | 'industryTitle' | 'locationName' | 'state' | 'region' | 'counties', string>>): string {
  return text.replace(/\{([^{}]+)\}/g, (_, key: string) => {
    if (!placeholders.has(key) || !Object.prototype.hasOwnProperty.call(values, key)) {
      throw new Error(`Unsupported page-copy placeholder: {${key}}`);
    }
    return values[key as keyof typeof values]!;
  });
}
