import { cn } from "@/components/utils";
import { forwardRef } from "react";

const Textarea = forwardRef(({ className, children, ...props }, ref) => (
  <textarea
    cols="30"
    rows="10"
    className={cn(
      `form-textarea w-full border border-slate-300 outline-none bg-slate-100 focus:ring-blue-400 focus:ring-2 focus:ring-opacity-50 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-900`,
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
  </textarea>
));

export default Textarea;
