import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Unified Card Variants
 * Supports size variants (sm/default/lg/xl) with consistent padding
 * hover effects (border, scale, shadow) with fill-mode-both for animations
 * and interactive vs static variants for different use cases
 */
export const cardVariants = cva(
  "glass rounded-xl border border-border/50 text-card-foreground transition-all duration-300 fill-mode-both",
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      interactive: {
        true: "hover:border-primary/50 hover:scale-105 hover:shadow-[--shadow-glow-sm] focus-visible:border-primary/50 focus-visible:scale-105 focus-visible:shadow-[--shadow-glow-sm] focus-visible:outline-none",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      interactive: true,
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariants {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ size, interactive }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
