import { PiTrendUp, PiShieldCheck, PiGlobe } from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { ServiceCard, ServiceCardGrid } from '@/components/ServiceCard';

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
  title = "Who This Is For", 
  description = "We partner best with organizations that view technology as a strategic asset.",
  items 
}: WhoThisIsForProps) {
  const defaultItems = [
    {
      title: "Growth-Focused Enterprises",
      description: "Scaling organizations that need technology to drive revenue, not just support operations.",
      icon: PiTrendUp
    },
    {
      title: "Regulated Industries",
      description: "Healthcare, Finance, and Manufacturing sectors requiring strict compliance (HIPAA, SOC2, CMMC).",
      icon: PiShieldCheck
    },
    {
      title: "Distributed Workforces",
      description: "Companies with remote teams needing seamless, secure access to data and applications anywhere.",
      icon: PiGlobe
    }
  ];

  const displayItems = items || defaultItems;

  return (
    <section className="mb-24">
      <div className="text-center mb-12">
        <h3 className="text-foreground text-3xl font-bold font-display mb-4">{title}</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>
      
      <ServiceCardGrid>
        {displayItems.map((item, index) => (
          <ServiceCard
            key={index}
            variant="technical"
            interactive
            delay={index * 100}
            metadata={`AUDIENCE_SEGMENT_0${index + 1}`}
          >
            <div className="p-8 flex flex-col items-center text-center h-full">
              <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                <item.icon className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
              <h4 className="text-foreground mb-3 text-xl font-bold font-display uppercase tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          </ServiceCard>
        ))}
      </ServiceCardGrid>
    </section>
  );
}
