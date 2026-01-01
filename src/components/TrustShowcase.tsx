import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import { ServiceCard } from '@/components/ServiceCard';

export interface TrustShowcaseProps {
  showAllPartners?: boolean;
}

const partners = [
  {
    name: 'IBM',
    logo: '/logos/partners/ibm.svg',
    description: 'Business Partner & watsonx Specialist',
    detail: 'Legendary reliability and enterprise AI systems.',
  },
  {
    name: 'Microsoft',
    logo: '/logos/partners/microsoft.svg',
    description: 'Cloud & Productivity Solutions',
    detail: 'Seamless Azure and Microsoft 365 integration.',
  },
  {
    name: 'Cisco',
    logo: '/logos/partners/cisco.svg',
    description: 'Networking & Security Infrastructure',
    detail: "The world's most robust connectivity backbone.",
  },
  {
    name: 'Lenovo',
    logo: '/logos/partners/lenovo.svg',
    description: 'Enterprise Hardware Systems',
    detail: 'High-performance computing for modern business.',
  },
  {
    name: 'Cloudflare',
    logo: '/logos/partners/cloudflare.svg',
    description: 'Security & Performance',
    detail: 'Global edge network protection and acceleration.',
  },
  {
    name: 'VMware',
    logo: '/logos/partners/vmware.svg',
    description: 'Virtualization Leaders',
    detail: 'The foundation of modern hybrid cloud infrastructure.',
  },
];

export default function TrustShowcase({
  showAllPartners = false,
}: TrustShowcaseProps) {
  const { ref: headerRef, isIntersecting: headerInView } =
    useIntersectionObserver({
      threshold: 0.2,
      triggerOnce: true,
    });

  const { ref: gridRef, isIntersecting: gridInView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const visiblePartners = showAllPartners ? partners : partners.slice(0, 4);

  const gridColsClass =
    visiblePartners.length === 4
      ? 'lg:grid-cols-4'
      : visiblePartners.length === 6
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-3';

  return (
    <section
      id="trust-showcase"
      className="relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="via-primary/20 absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div
          ref={headerRef as any}
          className={cn(
            'mb-16 text-center transition-all duration-700 ease-out',
            headerInView
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-foreground">Powered by </span>
            <span className="from-primary to-secondary bg-linear-to-br bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl font-sans text-xl">
            Integrating{' '}
            <span className="text-accent font-semibold">best-in-class</span>{' '}
            technologies into your ecosystem.
          </p>
        </div>

        <div
          ref={gridRef as any}
          className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', gridColsClass)}
        >
          {visiblePartners.map((partner, index) => (
            <ServiceCard
              key={partner.name}
              variant="simple"
              interactive
              delay={index * 150}
              animated={gridInView}
            >
              <div className="relative z-10 flex h-full flex-col p-6 pb-12 text-left">
                <div className="flex-1">
                  <div className="mb-4 flex items-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      className={cn(
                        'h-8 w-auto max-w-[150px] opacity-80 grayscale transition-all duration-300',
                        'group-hover:opacity-100 group-hover:grayscale-0'
                      )}
                    />
                  </div>
                  <h3 className="text-foreground font-display mb-2 text-sm font-bold tracking-widest uppercase">
                    {partner.description}
                  </h3>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {partner.detail}
                  </p>
                </div>

                {/* Custom footer decoration (flipped ServiceCard footer) */}
                <div className="absolute bottom-6 left-6 flex items-center justify-start gap-2">
                  <div className="bg-secondary/20 group-hover:bg-secondary/50 h-2 w-2 rounded-full transition-colors duration-500" />
                  <div className="bg-secondary/20 group-hover:bg-secondary/50 h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20" />
                </div>
              </div>
            </ServiceCard>
          ))}
        </div>

        {/* Certifications Row */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-opacity hover:opacity-100">
          {['SOC 2 COMPLIANT', 'HIPAA READY', 'PCI-DSS CERTIFIED'].map(
            (cert) => (
              <div
                key={cert}
                className="font-display flex items-center gap-2 text-[10px] font-bold tracking-[0.2em]"
              >
                <div className="bg-primary h-1 w-1 rounded-full" />
                {cert}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
