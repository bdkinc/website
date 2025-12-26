import { cn } from '@/lib/utils';

interface CornerBracketsProps {
  isHovered?: boolean;
  active?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CornerBrackets({
  isHovered = false,
  active = true,
  className,
  size = 'md',
}: CornerBracketsProps) {
  if (!active) return null;

  const bracketSize = {
    sm: isHovered ? 'w-4 h-4' : 'w-3 h-3',
    md: isHovered ? 'w-6 h-6' : 'w-4 h-4',
    lg: isHovered ? 'w-8 h-8' : 'w-6 h-6',
  }[size];

  return (
    <>
      <div className={cn(
        "absolute top-0 left-0 border-t-2 border-l-2 border-primary transition-all duration-300 z-20 pointer-events-none",
        bracketSize,
        isHovered ? "opacity-100" : "opacity-0",
        className
      )} />
      <div className={cn(
        "absolute top-0 right-0 border-t-2 border-r-2 border-primary transition-all duration-300 z-20 pointer-events-none",
        bracketSize,
        isHovered ? "opacity-100" : "opacity-0",
        className
      )} />
      <div className={cn(
        "absolute bottom-0 left-0 border-b-2 border-l-2 border-primary transition-all duration-300 z-20 pointer-events-none",
        bracketSize,
        isHovered ? "opacity-100" : "opacity-0",
        className
      )} />
      <div className={cn(
        "absolute bottom-0 right-0 border-b-2 border-r-2 border-primary transition-all duration-300 z-20 pointer-events-none",
        bracketSize,
        isHovered ? "opacity-100" : "opacity-0",
        className
      )} />
    </>
  );
}
