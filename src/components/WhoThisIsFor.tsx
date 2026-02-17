import { PiTrendUp, PiShieldCheck, PiGlobe } from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { TechCard, TechCardGrid } from '@/components/TechCard';
interface AudienceItem {
  title: string;
  description: string;
  icon: IconType;
}
interface WhoThisIsForProps {
  title?: string;
  description?: string;
  items?: AudienceItem[];
}
export default function WhoThisIsFor({
  title = 'Who This Is For',
  description = 'We partner best with organizations that view technology as a strategic asset.',
  items,
}: WhoThisIsForProps) {
  const defaultItems = [
    {
      title: 'Growth-Focused Enterprises',
      description:
        'Scaling organizations that need technology to drive revenue, not just support operations.',
      icon: PiTrendUp,
    },
    {
      title: 'Regulated Industries',
      description:
        'Healthcare, Finance, and Manufacturing sectors requiring strict compliance (HIPAA, SOC2, CMMC).',
      icon: PiShieldCheck,
    },
    {
      title: 'Distributed Workforces',
      description:
        'Companies with remote teams needing seamless, secure access to data and applications anywhere.',
      icon: PiGlobe,
    },
  ];
  const displayItems = items || defaultItems;
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h3 className="font-display text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h3>
        <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-xl">
          {description}
        </p>
      </div>
      <TechCardGrid>
        {displayItems.map((item, index) => (
          <TechCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
          >
            <div className="flex h-full flex-col items-center p-8 text-center">
              <div className="bg-primary/5 border-primary/20 group-hover:bg-primary/10 mb-6 rounded-xl border p-4 shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:scale-110">
                <item.icon
                  className="text-primary h-10 w-10"
                  aria-hidden="true"
                />
              </div>
              <h4 className="text-foreground font-display group-hover:text-primary mb-3 text-xl font-bold tracking-tight transition-colors">
                {item.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </TechCard>
        ))}
      </TechCardGrid>
    </section>
  );
}
