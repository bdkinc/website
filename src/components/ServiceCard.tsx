import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export function ServiceCard({
  children,
  className,
  animated = true,
  delay = 0,
}: ServiceCardProps) {
  return (
    <Card
      size="lg"
      interactive={true}
      className={cn(
        "relative overflow-hidden",
        animated
          ? "fill-mode-both animate-in fade-in slide-in-from-bottom-6 duration-600 flex flex-col items-center text-center justify-center h-full"
          : "flex flex-col items-center text-center justify-center h-full",
        className
      )}
      style={
        animated
          ? { animationDelay: `${delay}ms` }
          : undefined
      }
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#00d4ff33,transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#7c3aed2b,transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-full flex-col items-center text-foreground">
        {children}
      </div>
    </Card>
  );
}

interface ServiceCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ServiceCardGrid({ children, className }: ServiceCardGridProps) {
  const gridClass = cn(
    "grid gap-8 not-prose mb-20",
    className || "md:grid-cols-3 grid-cols-1"
  );

  // Add animation delays to children if they're ServiceCard components
  const childrenWithAnimations = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<ServiceCardProps>, {
        delay: 150 + index * 80,
      } as any);
    }
    return child;
  });

  return <div className={gridClass}>{childrenWithAnimations}</div>;
}
