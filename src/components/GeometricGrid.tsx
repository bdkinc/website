import { cn } from "@/lib/utils";

interface GeometricGridProps {
  variant?: "grid" | "isometric" | "hex";
  className?: string;
}

/**
 * GeometricGrid Component
 * Displays various geometric background patterns for technical aesthetic
 */
export default function GeometricGrid({
  variant = "grid",
  className = ""
}: GeometricGridProps) {
  const variantClasses = {
    grid: "geometric-grid",
    isometric: "isometric-grid",
    hex: "hex-pattern"
  };

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
    />
  );
}
