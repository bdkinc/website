import { cn } from "@/components/utils";
import { forwardRef } from "react";

export default forwardRef(({ children, className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      `text-5xl font-bold text-gray-900 dark:text-white leading-loose font-heading`,
      className,
    )}
  >
    {children}
  </h1>
));
