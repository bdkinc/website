import type { ContentReader, ContentRecord } from '@/lib/content';

export type Location = ContentRecord<'locations'>['data'];

/** Collection IDs, not editable display names, are the public route identity. */
export async function getLocationBySlug(slug: string, reader: ContentReader) {
  return (await reader.getCollection('locations')).find((entry) => entry.id === slug)?.data;
}

/** Rank same-state communities by their CMS coordinates. */
export async function getNearbyLocations(slug: string, reader: ContentReader) {
  const locations = await reader.getCollection('locations');
  const origin = locations.find((entry) => entry.id === slug);
  if (!origin) return [];
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const distance = (location: Location) => {
    const a = origin.data.coordinates;
    const b = location.coordinates;
    return Math.sin(radians(b.lat - a.lat) / 2) ** 2 +
      Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) *
      Math.sin(radians(b.lng - a.lng) / 2) ** 2;
  };
  return locations.filter((entry) => entry.id !== slug && entry.data.state === origin.data.state)
    .sort((a, b) => distance(a.data) - distance(b.data)).slice(0, 3);
}
