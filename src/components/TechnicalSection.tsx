import React from 'react';
import { cn } from '@/lib/utils';
import { CornerBrackets } from './CornerBrackets';

interface TechnicalSectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  overlayOpacity?: string;
  showBrackets?: boolean;
  id?: string;
}

export default function TechnicalSection({
  children,
  className,
  containerClassName,
  overlayOpacity = "opacity-20",
  showBrackets = true,
  id,
}: TechnicalSectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "relative overflow-hidden w-full py-24 sm:py-32",
        className
      )}
    >
      {/* Full-width Circuit Overlay Class */}
      <div className={cn("circuit-overlay absolute inset-0 pointer-events-none", overlayOpacity)} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div 
          className={cn(
            "relative bg-background/95 backdrop-blur-sm border border-primary/10 p-8 md:p-16 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]",
            containerClassName
          )}
        >
          {showBrackets && <CornerBrackets isHovered={true} size="lg" className="z-20 opacity-60" />}
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
