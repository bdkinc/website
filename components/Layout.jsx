import { cn } from "@/components/utils";
import { forwardRef } from "react";

export default forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        `min-h-screen bg-white dark:bg-slate-900 flex flex-col bg-left-top text-slate-900 dark:text-slate-100`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
