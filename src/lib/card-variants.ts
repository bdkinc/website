import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-lg border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border hover:border-primary/50",
        feature: "border-2 border-primary hover:shadow-[--shadow-glow-sm]",
        glass: "glass border-input",
      },
      size: {
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        scale: "hover:scale-105",
        glow: "hover:shadow-[--shadow-glow-sm]",
        both: "hover:scale-105 hover:shadow-[--shadow-glow-sm]",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "both",
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
