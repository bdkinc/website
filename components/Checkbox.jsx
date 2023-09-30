import { cn } from "@/components/utils";
import * as Checkbox from "@radix-ui/react-checkbox";
import { forwardRef } from "react";
import { RxCheck } from "react-icons/rx";

const MyCheckbox = forwardRef(({ className, ...props }, ref) => (
  <Checkbox.Root
    ref={ref}
    className={cn(
      `form-checkbox bg-slate-200 hover:bg-slate-100 relative`,
      className,
    )}
    {...props}
  >
    <Checkbox.Indicator className="bg-blue-500 absolute top-0 left-0 right-0 bottom-0 text-white flex items-center justify-center">
      <RxCheck />
    </Checkbox.Indicator>
  </Checkbox.Root>
));

const Option = forwardRef(({ className, children, value, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(`flex gap-x-2 items-center font-sans`, className)}
  >
    <MyCheckbox value={value} {...props} />
    <span className="ml-3">{children}</span>
  </label>
));

export default Object.assign(MyCheckbox, { Option });
