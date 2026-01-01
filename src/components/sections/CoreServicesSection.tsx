import React from 'react';
import { ServiceCard, ServiceCardGrid } from '@/components/ServiceCard';
import { PiHeadphones, PiShieldCheck, PiUsersThree } from 'react-icons/pi';

export default function CoreServicesSection() {
  return (
    <>
      <h3 className="text-foreground mb-12 text-center text-2xl font-bold">
        Core Services
      </h3>

      <ServiceCardGrid>
        <ServiceCard variant="technical" interactive>
          <div className="flex h-full flex-col items-center p-8 text-center">
            <div className="bg-primary/5 border-primary/20 group-hover:bg-primary/10 mb-6 rounded-lg border p-3 transition-all duration-500 group-hover:scale-110">
              <PiHeadphones
                className="text-primary h-16 w-16"
                aria-hidden="true"
              />
            </div>
            <h4 className="text-foreground group-hover:text-primary mb-4 text-2xl font-bold transition-colors">
              Service Desk & Support
            </h4>
            <div className="text-muted-foreground text-sm leading-relaxed">
              Enterprise-tier support built for speed and accuracy. Our service
              desk handles issues remotely with a 98% first-call resolution
              rate, while dedicated on-site technicians resolve complex problems
              when presence matters. Tiered escalation ensures right expertise
              reaches every ticket.
            </div>
          </div>
        </ServiceCard>

        <ServiceCard variant="technical" interactive>
          <div className="flex h-full flex-col items-center p-8 text-center">
            <div className="bg-primary/5 border-primary/20 group-hover:bg-primary/10 mb-6 rounded-lg border p-3 transition-all duration-500 group-hover:scale-110">
              <PiShieldCheck
                className="text-primary h-16 w-16"
                aria-hidden="true"
              />
            </div>
            <h4 className="text-foreground group-hover:text-primary mb-4 text-2xl font-bold transition-colors">
              Infrastructure & Security
            </h4>
            <div className="text-muted-foreground text-sm leading-relaxed">
              Continuous monitoring protects your environment around the clock.
              We detect threats before they impact operations, apply preventive
              maintenance proactively, and maintain visibility across your
              network, endpoints, and cloud workloads. Stay operational. Stay
              secure.
            </div>
          </div>
        </ServiceCard>

        <ServiceCard variant="technical" interactive>
          <div className="flex h-full flex-col items-center p-8 text-center">
            <div className="bg-primary/5 border-primary/20 group-hover:bg-primary/10 mb-6 rounded-lg border p-3 transition-all duration-500 group-hover:scale-110">
              <PiUsersThree
                className="text-primary h-16 w-16"
                aria-hidden="true"
              />
            </div>
            <h4 className="text-foreground group-hover:text-primary mb-4 text-2xl font-bold transition-colors">
              Co-Management Partnership
            </h4>
            <div className="text-muted-foreground text-sm leading-relaxed">
              Extend your internal IT team's capacity without replacing it. We
              work alongside your staff as a force multiplier—handling routine
              operations while they focus on strategic initiatives. Fill
              capability gaps, scale expertise on demand, and move faster
              together.
            </div>
          </div>
        </ServiceCard>
      </ServiceCardGrid>
    </>
  );
}
