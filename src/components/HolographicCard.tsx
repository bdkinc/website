import { useRef, useState, useEffect, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  interactive?: boolean;
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
    <div ref={cardRef} className="group relative">
      <Card
        size={size}
        interactive={interactive}
        className={cn('relative overflow-hidden backdrop-blur-xl', className)}
      >
        {/* Mouse-tracking holographic spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(0, 212, 255, 0.4),
              rgba(124, 58, 237, 0.35) 30%,
              rgba(255, 153, 51, 0.25) 50%,
              transparent 70%)`,
          }}
        />

        {/* Border glow effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-all duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: isHovered
              ? `0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(124, 58, 237, 0.2)`
              : 'none',
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </Card>
    </div>
  );
}
