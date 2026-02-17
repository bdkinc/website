import { PiCheckCircle, PiHeadphones, PiMonitor } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';
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
    <div className="not-prose mb-20 grid gap-8 md:grid-cols-2">
      {detailColumns.map((column, index) => (
        <TechCard key={index} variant="technical" interactive={false}>
          <div className="p-8">
            <div className="border-primary/20 mb-6 flex items-center gap-4 border-b pb-4">
              <div className="bg-primary/10 rounded-md p-2">
                <column.icon
                  className="text-primary h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <h4 className="font-display text-foreground text-xl font-bold tracking-wide">
                {column.title}
              </h4>
            </div>
            <ul className="space-y-4">
              {column.items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-muted-foreground flex items-start gap-3 font-sans"
                >
                  <PiCheckCircle
                    className="text-primary mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </TechCard>
      ))}
    </div>
  );
}
