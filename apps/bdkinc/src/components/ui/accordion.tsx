import * as React from 'react';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { PiCaretDown } from 'react-icons/pi';

import { cn } from '@/lib/utils';

function Accordion({
  type,
  collapsible: _collapsible,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, 'multiple'> & {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={type === 'multiple'}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      render={(props, state) => (
        <div {...props} data-state={state.open ? 'open' : 'closed'} />
      )}
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        render={(props, state) => (
          <button
            {...props}
            data-state={state.open ? 'open' : 'closed'}
            type="button"
          />
        )}
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-open]_.accordion-caret]:rotate-180 [&[data-state=open]_.accordion-caret]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <PiCaretDown
          className="accordion-caret text-muted-foreground pointer-events-none h-4 w-4 shrink-0 transition-transform duration-200"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
