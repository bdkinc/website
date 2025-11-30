import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { iconMap } from '@/lib/icons';
import { PiPackage } from 'react-icons/pi';

interface InteractiveServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function InteractiveServiceCard({
  id,
  title,
  description,
  icon,
}: InteractiveServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const Icon = iconMap[icon] || PiPackage;

  return (
    <a
      ref={cardRef}
      href={`/services/${id}`}
      className="focus-visible:ring-primary group block h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'relative flex h-full cursor-pointer flex-col justify-center overflow-hidden',
          'bg-card/60 border-border/50 backdrop-blur-xl'
        )}
      >
        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.1) 40%, transparent 60%)`,
          }}
        />

        <div className="relative z-20 flex h-full flex-col items-center p-8 text-center">
          {/* Icon */}
          <div className="service-icon-wrapper mb-6">
            <div
              className="bg-primary/5 inline-flex items-center justify-center rounded-lg p-3 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-5"
              style={{
                viewTransitionName: `service-icon-${id}`,
              }}
            >
              <Icon className="icon-lg text-primary" />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-foreground group-hover:text-primary mb-3 text-2xl font-bold transition-colors duration-300"
            style={{
              viewTransitionName: `service-title-${id}`,
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            className="text-muted-foreground mb-6 grow"
            style={{
              viewTransitionName: `service-description-${id}`,
            }}
          >
            {description}
          </p>

          {/* Learn More Link */}
          <div className="text-primary flex items-center font-medium transition-all duration-300 group-hover:gap-2">
            <span>Learn More</span>
            <svg
              className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Card>
    </a>
  );
}
