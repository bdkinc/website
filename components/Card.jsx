import { cn } from "@/components/utils";
import { forwardRef } from "react";

export const Title = forwardRef(({ className, children, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      `text-3xl font-semibold leading-loose text-bdk-blue-darker dark:text-white`,
      className,
    )}
    {...props}
  >
    {children}
  </header>
));

export const Body = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(`mb-3 flex-1`, className)} {...props}>
    {children}
  </div>
));

export const Footer = forwardRef(({ className, children, ...props }, ref) => (
  <footer ref={ref} className={cn(className)} {...props}>
    {children}
  </footer>
));

export const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`shadow-lg overflow-hidden`, className)}
    {...props}
  >
    {children}
  </div>
));

export default Object.assign(Card, { Title, Body, Footer });
