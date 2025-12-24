import { PiTrendUp, PiShieldCheck, PiGlobeHemisphereWest } from 'react-icons/pi';
import { ServiceCard, ServiceCardGrid } from '@/components/ServiceCard';

export default function WhoThisIsFor() {
  const items = [
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
      icon: PiGlobeHemisphereWest
    }
  ];

  return (
    <section className="mb-24">
      <div className="text-center mb-12">
        <h3 className="text-foreground text-3xl font-bold font-display mb-4">Who This Is For</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          We partner best with organizations that view technology as a strategic asset.
        </p>
      </div>
      
      <ServiceCardGrid>
        {items.map((item, index) => (
          <ServiceCard key={index} delay={index * 100}>
            <div className="mb-6 p-4 rounded-full bg-primary/5 ring-1 ring-primary/20">
              <item.icon className="h-10 w-10 text-primary" aria-hidden="true" />
            </div>
            <h4 className="text-foreground mb-3 text-xl font-bold font-display">
              {item.title}
            </h4>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {item.description}
            </p>
          </ServiceCard>
        ))}
      </ServiceCardGrid>
    </section>
  );
}
