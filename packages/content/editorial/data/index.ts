import home from './home.json' with { type: 'json' };
import about from './about.json' with { type: 'json' };
import services from './services.json' with { type: 'json' };
import blog from './blog.json' with { type: 'json' };
import contact from './contact.json' with { type: 'json' };
import privacy from './privacy.json' with { type: 'json' };
import terms from './terms.json' with { type: 'json' };
import notFound from './not-found.json' with { type: 'json' };
import maryland from './location-maryland-eastern-shore.json' with { type: 'json' };
import delaware from './location-delaware-eastern-shore.json' with { type: 'json' };
import serviceLocation from './service-location.json' with { type: 'json' };
import industryLocation from './industry-location.json' with { type: 'json' };
import applicationDevelopment from './service-application-development.json' with { type: 'json' };
import artificialIntelligence from './service-artificial-intelligence.json' with { type: 'json' };
import businessAnalytics from './service-business-analytics.json' with { type: 'json' };
import cloudHosting from './service-cloud-hosting.json' with { type: 'json' };
import cybersecurity from './service-cybersecurity.json' with { type: 'json' };
import ediSolutions from './service-edi-solutions.json' with { type: 'json' };
import hostedErp from './service-hosted-erp.json' with { type: 'json' };
import ibmPower from './service-ibm-power.json' with { type: 'json' };
import managedIt from './service-managed-it.json' with { type: 'json' };
import settings from './settings.json' with { type: 'json' };
import campaignItConsultation from './campaign-it-consultation.json' with { type: 'json' };

export const pageDefinitions = {
  'campaign-it-consultation': campaignItConsultation,
  home,
  about,
  services,
  blog,
  contact,
  privacy,
  terms,
  'not-found': notFound,
  'location-maryland-eastern-shore': maryland,
  'location-delaware-eastern-shore': delaware,
  'service-location': serviceLocation,
  'industry-location': industryLocation,
  'service-application-development': applicationDevelopment,
  'service-artificial-intelligence': artificialIntelligence,
  'service-business-analytics': businessAnalytics,
  'service-cloud-hosting': cloudHosting,
  'service-cybersecurity': cybersecurity,
  'service-edi-solutions': ediSolutions,
  'service-hosted-erp': hostedErp,
  'service-ibm-power': ibmPower,
  'service-managed-it': managedIt,
} as const;
export const settingsDefinition = settings;
