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
  /**
   * Card visual treatment.
   * - default: minimal chrome (no technical border or footer)
   * - technical: technical chrome + "bar + circle" footer decoration
   * - blog: technical chrome + "circle + bar" footer decoration (Left-aligned, Secondary)
   * - simple: technical chrome but NO footer decoration
   */
  variant?: 'default' | 'technical' | 'simple' | 'blog';
  metadata?: string;
  key?: React.Key;
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
        'group focus-visible:ring-primary relative block h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        animated
          ? 'fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-600'
          : '',
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Card
        size={size}
        interactive={false} // We handle interaction ourselves
        className={cn(
          'relative flex h-full flex-col items-center justify-center overflow-hidden text-center',
          'bg-card/60 border-border/50 backdrop-blur-xl transition-all duration-300',
          (variant === 'technical' ||
            variant === 'simple' ||
            variant === 'blog') &&
            'border-primary/20',
          interactive &&
            isHovered &&
            'border-primary/40 shadow-[--shadow-glow-sm]'
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

        <div className="text-foreground relative z-20 flex h-full w-full flex-col">
          <div className="w-full flex-grow">{children}</div>

          {/* Technical Footer Decoration */}
          {variant === 'technical' && (
            <div className="mt-auto flex w-full items-center justify-end gap-2 pt-6">
              <div
                className={cn(
                  'bg-primary/20 h-1 w-12 rounded-full transition-all duration-300 ease-out',
                  isHovered && 'bg-primary/60 w-20'
                )}
              />
              <div
                className={cn(
                  'bg-primary/20 h-2 w-2 rounded-full transition-all duration-300 ease-out',
                  isHovered && 'bg-primary/60'
                )}
              />
            </div>
          )}

          {/* Blog Footer Decoration (Left-aligned, Secondary) */}
          {variant === 'blog' && (
            <div className="mt-auto flex w-full items-center justify-start gap-2 pt-6">
              <div
                className={cn(
                  'bg-secondary/20 h-2 w-2 rounded-full transition-all duration-300 ease-out',
                  isHovered && 'bg-secondary/60'
                )}
              />
              <div
                className={cn(
                  'bg-secondary/20 h-1 w-12 rounded-full transition-all duration-300 ease-out',
                  isHovered && 'bg-secondary/60 w-20'
                )}
              />
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
