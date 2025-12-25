import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Slot } from '@radix-ui/react-slot';

interface ServiceCardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
  size?: 'default' | 'sm' | 'lg';
  interactive?: boolean;
  variant?: 'default' | 'technical';
  metadata?: string;
  asChild?: boolean;
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
  variant = 'technical',
  metadata,
  asChild = false,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 50,
    y: 50,
  });

  const Component = asChild ? Slot : 'div';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <Component
      className={cn(
        'relative h-full group block focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        animated
          ? 'fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-600'
          : '',
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        size={size}
        interactive={false} // We handle interaction ourselves
        className={cn(
          'relative flex h-full flex-col items-center justify-center text-center overflow-hidden',
          'bg-card/60 border-border/50 backdrop-blur-xl transition-all duration-300',
          variant === 'technical' && 'border-primary/20',
          interactive && isHovered && 'border-primary/40 shadow-[--shadow-glow-sm]'
        )}
      >
        {/* Technical Overlays */}
        <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.03]" />

        {/* Mouse-tracking spotlight */}
        {interactive && (
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.08) 40%, transparent 60%)`,
            }}
          />
        )}

        <div className="text-foreground relative z-20 flex w-full flex-col h-full">
          <div className="flex-grow w-full">
            {children}
          </div>
          
          {/* Technical Footer Decoration */}
          {variant === 'technical' && (
            <div className="mt-auto pt-6 w-full flex justify-between items-end">
              <div className="text-[9px] font-mono tracking-widest text-primary/40 uppercase">
                {metadata || 'TECH_PROTOCOL_V1.0'}
              </div>
              <div className={cn(
                "h-1 w-12 bg-primary/20 transition-all duration-500",
                isHovered && "w-20 bg-primary/50"
              )} />
            </div>
          )}
        </div>
      </Card>
    </Component>
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
