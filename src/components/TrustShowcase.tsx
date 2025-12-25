import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { ServiceCard } from '@/components/ServiceCard';
import TechnicalSection from './TechnicalSection';

const partners = [
  { 
    name: 'IBM', 
    description: 'Business Partner & watsonx Specialist',
    detail: 'Legendary reliability and enterprise AI systems.',
    metadata: 'IBM_PARTNER_NODE_01'
  },
  { 
    name: 'Microsoft', 
    description: 'Cloud & Productivity Solutions',
    detail: 'Seamless Azure and Microsoft 365 integration.',
    metadata: 'MSFT_PARTNER_NODE_02'
  },
  { 
    name: 'Cisco', 
    description: 'Networking & Security Infrastructure',
    detail: 'The world\'s most robust connectivity backbone.',
    metadata: 'CSCO_PARTNER_NODE_03'
  },
  { 
    name: 'Lenovo', 
    description: 'Enterprise Hardware Systems',
    detail: 'High-performance computing for modern business.',
    metadata: 'LNV_PARTNER_NODE_04'
  }
];

export default function TrustShowcase() {
  const { ref: headerRef, isIntersecting: headerInView } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <TechnicalSection client:visible id="trust-showcase" overlayOpacity="opacity-10">
      <div
        ref={headerRef as any}
        className={cn(
          'mb-16 text-center transition-all duration-700 ease-out',
          headerInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <h2 className="mb-4 text-3xl font-bold font-display uppercase tracking-wider text-muted-foreground">
          Trusted by Industry Giants
        </h2>
        <div className="mx-auto h-1 w-20 bg-primary/40" />
      </div>

      <div
        ref={gridRef as any}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {partners.map((partner, index) => (
          <ServiceCard
            key={partner.name}
            variant="technical"
            interactive
            delay={index * 150}
            metadata={partner.metadata}
            animated={gridInView}
          >
            <div className="relative z-10 p-6 text-left">
              <div className="mb-4 text-3xl font-bold font-display tracking-tighter text-primary group-hover:shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all">
                {partner.name}
              </div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-foreground font-display">
                {partner.description}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                {partner.detail}
              </p>
            </div>
          </ServiceCard>
        ))}
      </div>

      {/* Certifications Row */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-opacity hover:opacity-100">
        {['SOC 2 COMPLIANT', 'HIPAA READY', 'PCI-DSS CERTIFIED'].map((cert) => (
          <div key={cert} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] font-display">
            <div className="h-1 w-1 rounded-full bg-primary" />
            {cert}
          </div>
        ))}
      </div>
    </TechnicalSection>
  );
}
