import { cn } from "@/components/utils";
import * as Label from "@radix-ui/react-label";
import { forwardRef } from "react";

export default forwardRef(({ className, children, ...props }, ref) => (
  <Label.Root
    className={cn(`block text-gray-800 dark:text-blue-200 mb-2`, className)}
    ref={ref}
    {...props}
  >
    {children}
  </Label.Root>
));
