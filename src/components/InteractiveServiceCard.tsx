import { iconMap } from '@/lib/icons';
import { PiPackage, PiCaretRight } from 'react-icons/pi';
import { TechCard } from '@/components/TechCard';

interface InteractiveServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  index: number;
}

export default function InteractiveServiceCard({
  id,
  title,
  description,
  icon,
  index,
}: InteractiveServiceCardProps) {
  const Icon = iconMap[icon] || PiPackage;

  return (
    <TechCard
      asChild
      interactive
      variant="technical"
      delay={index * 100}
      metadata={`SERVICE_NODE_0${index + 1}`}
      className="h-full"
    >
      <a
        href={`/services/${id}`}
        className="relative z-20 flex h-full flex-col items-center p-8 text-center"
      >
        {/* Icon */}
        <div className="service-icon-wrapper mb-6">
          <div
            className="bg-primary/5 group-hover:bg-primary/10 inline-flex items-center justify-center rounded-lg p-3 transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-500 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            style={{
              viewTransitionName: `service-icon-${id}`,
            }}
          >
            <Icon className="text-primary h-8 w-8" />
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-foreground group-hover:text-primary font-display mb-3 text-2xl font-bold tracking-tight transition-colors duration-300"
          style={{
            viewTransitionName: `service-title-${id}`,
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="text-muted-foreground mb-6 grow text-sm leading-relaxed"
          style={{
            viewTransitionName: `service-description-${id}`,
          }}
        >
          {description}
        </p>

        {/* Learn More Link */}
        <div className="text-primary flex items-center gap-2 font-mono text-[10px] tracking-widest transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] duration-300 group-hover:tracking-[0.2em]">
          <span>Initialize Analysis</span>
          <PiCaretRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </a>
    </TechCard>
  );
}
