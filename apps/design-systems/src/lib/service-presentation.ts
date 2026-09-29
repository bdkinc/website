import type { IconName } from '@/components/Icon.astro';
export const serviceIcons: Partial<Record<string, IconName>> = {
  'managed-it': 'server',
  'cloud-hosting': 'cloud',
  cybersecurity: 'shield-check',
  'application-development': 'code',
  'ibm-power': 'cpu',
  'business-analytics': 'chart-bar',
  'edi-solutions': 'plugs-connected',
  'hosted-erp': 'database',
  'artificial-intelligence': 'brain',
};

// Developer-owned concept photography, independent of editorial content.
export const serviceImages: Partial<Record<string, { src: string; position: string }>> = {
  'managed-it': { src: '/images/concept/managed-it-network.webp', position: '50% 50%' },
  'cloud-hosting': { src: '/images/concept/it-infrastructure-hero.webp', position: '65% 50%' },
  'cybersecurity': { src: '/images/concept/managed-it-network.webp', position: '30% 50%' },
  'ibm-power': { src: '/images/concept/it-infrastructure-hero.webp', position: '75% 50%' },
  'hosted-erp': { src: '/images/concept/business-platforms.webp', position: '50% 50%' },
  'edi-solutions': { src: '/images/concept/business-platforms.webp', position: '65% 50%' },
  'application-development': { src: '/images/concept/software-data.webp', position: '50% 50%' },
  'business-analytics': { src: '/images/concept/software-data.webp', position: '70% 50%' },
  'artificial-intelligence': { src: '/images/concept/software-data.webp', position: '35% 50%' },
};
