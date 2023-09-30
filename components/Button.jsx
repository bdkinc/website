import { cn } from "@/components/utils";
import { forwardRef } from "react";

const Button = forwardRef(
  ({ className, children, as: Component = "button", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        `bg-bdk-blue dark:bg-slate-900 inline-flex items-center justify-center px-4 py-2 text-white border-2 border-bdk-blue hover:ring-1 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  ),
);

export default Button;
