import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
  size?: 'default' | 'sm' | 'lg';
  interactive?: boolean;
}

interface MousePosition {
  x: number;
  y: number;
}

export function ServiceCard({
  children,
  className,
  animated = true,
  delay = 0,
  size = 'lg',
  interactive = true,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 50,
    y: 50,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={cn(
        'relative h-full',
        animated
          ? 'fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-600'
          : ''
      )}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        size={size}
        interactive={interactive}
        className={cn(
          'relative flex h-full flex-col items-center justify-center text-center overflow-hidden',
          'bg-card/60 border-border/50 backdrop-blur-xl',
          className
        )}
      >
        {/* Technical Scanline Overlay */}
        <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03]" />

        {/* Mouse-tracking spotlight */}
        {interactive && (
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.15), rgba(124, 58, 237, 0.1) 40%, transparent 60%)`,
            }}
          />
        )}

        {/* Corner accents */}
        <div className={cn(
          "absolute top-0 right-0 h-8 w-8 transition-opacity duration-300",
          (isHovered || !interactive) ? "opacity-100" : "opacity-0" // Always show on non-interactive or on hover
        )}>
          <div className="absolute top-2 right-2 h-px w-4 bg-primary/40" />
          <div className="absolute top-2 right-2 h-4 w-px bg-primary/40" />
        </div>
        <div className={cn(
          "absolute bottom-0 left-0 h-8 w-8 transition-opacity duration-300",
          (isHovered || !interactive) ? "opacity-100" : "opacity-0"
        )}>
          <div className="absolute bottom-2 left-2 h-px w-4 bg-primary/40" />
          <div className="absolute bottom-2 left-2 h-4 w-px bg-primary/40" />
        </div>

        <div className="text-foreground relative z-20 flex w-full flex-col items-center">
          {children}
        </div>
      </Card>
    </div>
  );
}

interface ServiceCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ServiceCardGrid({ children, className }: ServiceCardGridProps) {
  const gridClass = cn(
    'grid gap-8 not-prose mb-20',
    className || 'md:grid-cols-3 grid-cols-1'
  );

  // Add animation delays to children if they're ServiceCard components
  const childrenWithAnimations = React.Children.map(
    children,
    (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<ServiceCardProps>,
          {
            delay: 150 + index * 80,
          } as any
        );
      }
      return child;
    }
  );

  return <div className={gridClass}>{childrenWithAnimations}</div>;
}
