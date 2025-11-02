import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <a href="/" className={cn("z-10 text-left", className)}>
      <div className="text-3xl font-bold font-display leading-0 mb-2 mt-4">
        <span className="font-extrabold bg-linear-to-br from-brand-primary to-brand-secondary bg-clip-text text-transparent">
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
