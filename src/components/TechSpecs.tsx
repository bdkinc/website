import { PiCheckCircle, PiHeadphones, PiMonitor } from 'react-icons/pi';
import { ServiceCard } from '@/components/ServiceCard';

const detailColumns = [
  {
    title: 'Support Tiers',
    icon: PiHeadphones,
    items: [
      'Unlimited help desk covers remote and onsite incidents',
      'Dedicated account managers align roadmaps with leadership goals',
      'Lifecycle management tracks assets, warranties, and renewals',
    ],
  },
  {
    title: 'Technology Operations',
    icon: PiMonitor,
    items: [
      'Proactive monitoring prevents outages with automated remediation',
      'Quarterly reviews surface optimization and security priorities',
      'Documented runbooks keep every response consistent and auditable',
    ],
  },
];

export default function TechSpecs() {
  return (
    <div className="grid gap-8 md:grid-cols-2 mb-20 not-prose">
      {detailColumns.map((column, index) => (
        <ServiceCard 
          key={index}
          variant="technical"
          interactive={false}
          metadata={`SPEC_0${index + 1} // REVISION_A`}
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 border-b border-primary/20 pb-4">
               <div className="p-2 bg-primary/10 rounded-md">
                   <column.icon className="w-6 h-6 text-primary" aria-hidden="true" />
               </div>
               <h4 className="font-display font-bold text-xl uppercase tracking-wide text-foreground">{column.title}</h4>
            </div>
            
            <ul className="space-y-4">
              {column.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-muted-foreground font-sans">
                  <PiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ServiceCard>
      ))}
    </div>
  )
}
