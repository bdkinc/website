import { useRef, useState, useEffect, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  interactive?: boolean;
  metadata?: string;
}

/**
 * HolographicCard with mouse-tracking spotlight effect
 * Creates a professional holographic gradient that follows the cursor
 */
export default function HolographicCard({
  children,
  className,
  size = 'lg',
  interactive = true,
  metadata,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="group relative h-full">
      <Card
        size={size}
        interactive={false}
        className={cn(
          'relative h-full flex flex-col overflow-hidden backdrop-blur-xl rounded-none border-primary/30 transition-all duration-300',
          isHovered && 'border-primary/60 shadow-[0_0_30px_rgba(0,212,255,0.2)]',
          className
        )}
      >
        {/* Technical Overlays */}
        <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="circuit-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

        {/* Mouse-tracking holographic spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(0, 212, 255, 0.25),
              rgba(124, 58, 237, 0.2) 30%,
              rgba(255, 153, 51, 0.15) 50%,
              transparent 70%)`,
          }}
        />

        {/* 4 Corner Brackets - Technical Style */}
        <div className={cn(
          "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary transition-all duration-300 z-30",
          (isHovered || !interactive) ? "w-6 h-6 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary transition-all duration-300 z-30",
          (isHovered || !interactive) ? "w-6 h-6 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary transition-all duration-300 z-30",
          (isHovered || !interactive) ? "w-6 h-6 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary transition-all duration-300 z-30",
          (isHovered || !interactive) ? "w-6 h-6 opacity-100" : "opacity-0"
        )} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {children}
          
          {/* Technical Footer Decoration */}
          <div className="mt-auto pt-6 w-full flex justify-between items-end p-6">
            <div className="text-[9px] font-mono tracking-widest text-primary/60 uppercase">
              {metadata || 'HOLO_PROTOCOL_V2.0'}
            </div>
            <div className={cn(
              "h-1 w-12 bg-primary/30 transition-all duration-500",
              isHovered && "w-20 bg-primary/70 shadow-[0_0_10px_var(--color-primary)]"
            )} />
          </div>
        </div>
      </Card>
    </div>
  );
}
