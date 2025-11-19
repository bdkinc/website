import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <a href="/" className={cn('z-10 text-left', className)}>
      <div className="font-display mt-4 mb-2 text-3xl leading-0 font-bold">
        <span className="from-brand-primary to-brand-secondary bg-linear-to-br bg-clip-text font-extrabold text-transparent">
          BDK
        </span>
        <span>inc</span>
      </div>
      <div>
        <span className="text-xs leading-0">IT Made Simple</span>
      </div>
    </a>
  );
}
