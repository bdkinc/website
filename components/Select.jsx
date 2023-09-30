import { cn } from "@/components/utils";
import * as Select from "@radix-ui/react-select";
import { forwardRef } from "react";
import { RxCheck, RxChevronDown, RxChevronUp } from "react-icons/rx";

const MySelect = forwardRef(
  (
    { className, label, placeholder, children, items, onChange, ...props },
    ref,
  ) => {
    return (
      <Select.Root ref={ref} {...props}>
        <Select.Trigger
          className={cn(
            `inline-flex items-center justify-center px-3 text-base leading-none h-[42px] gap-1 border border-slate-300 bg-slate-100 w-full outline-none focus:ring-blue-400 focus:ring-2 focus:ring-opacity-50 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-900 shadow data-[placeholder]:text-gray-500`,
            className,
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="ml-auto">
            <RxChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-900 overflow-hidden rounded shadow">
            <Select.SelectScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-slate-800 cursor-default">
              <RxChevronUp />
            </Select.SelectScrollUpButton>
            <Select.Viewport className="p-4">
              {items
                ? items.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))
                : children}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-slate-800 cursor-default">
              <RxChevronDown />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  },
);

const Option = forwardRef(({ children, className, ...props }, ref) => (
  <Select.Item
    ref={ref}
    className={`rounded text-base leading-none flex items-center h-6 px-6 relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-white ${
      className || ""
    }`}
    {...props}
  >
    <Select.ItemText>{children}</Select.ItemText>
    <Select.ItemIndicator className="absolute left-0 w-6 mr-4 inline-flex items-center justify-center">
      <RxCheck />
    </Select.ItemIndicator>
  </Select.Item>
));

export default Object.assign(MySelect, {
  Group: Select.Group,
  Separator: Select.Separator,
  Option,
});
