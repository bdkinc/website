import { cn } from "@/components/utils";
import { forwardRef } from "react";
import { FaCheck } from "react-icons/fa";

export default forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `text-bdk-blue w-6 h-6 rounded-full border-2 border-bdk-blue flex items-center justify-center`,
      className,
    )}
    {...props}
  >
    <FaCheck size={12} />
  </div>
));
