import { cn } from "@/components/utils";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { forwardRef, useId } from "react";

const RadioGroup = forwardRef(({ children, className, ...props }, ref) => (
  <RadixRadioGroup.Root
    ref={ref}
    className={cn(`form-radio-group`, className)}
    {...props}
  >
    {children}
  </RadixRadioGroup.Root>
));

const Item = forwardRef(
  (
    {
      value,
      className,
      children,
      disabled = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div className={`flex items-center ${className || ""}`}>
        <RadixRadioGroup.Item
          ref={ref}
          id={id}
          className="form-radio rounded-full shadow w-4 h-4 bg-slate-200 hover:bg-slate-100"
          value={value}
          disabled={disabled}
          required={required}
        >
          <RadixRadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-500" />
        </RadixRadioGroup.Item>
        <label htmlFor={id} className="w-full">
          {children}
        </label>
      </div>
    );
  },
);

export default Object.assign(RadioGroup, { Item });
