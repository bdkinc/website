import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { PiCaretDown } from 'react-icons/pi';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  item: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border)',
  },
  header: { display: 'flex' },
  trigger: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingBlock: 16,
    textAlign: 'left',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    transitionProperty: 'all',
    transitionDuration: '150ms',
    outline: 'none',
    borderColor: { default: 'transparent', ':focus-visible': 'var(--ring)' },
    boxShadow: {
      default: 'none',
      ':focus-visible':
        '0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent)',
    },
    pointerEvents: { default: 'auto', ':disabled': 'none' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
  caret: {
    color: 'var(--muted-foreground)',
    pointerEvents: 'none',
    height: 16,
    width: 16,
    flexShrink: 0,
    transitionProperty: 'transform',
    transitionDuration: '200ms',
  },
  panel: { overflow: 'hidden', fontSize: '.875rem', lineHeight: '1.25rem' },
  inner: { paddingBottom: 16 },
});

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
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      render={(props, state) => (
        <div {...props} data-state={state.open ? 'open' : 'closed'} />
      )}
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.trigger, xstyle);
  return (
    <AccordionPrimitive.Header {...stylex.props(styles.header)}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        render={(props, state) => (
          <button
            {...props}
            data-state={state.open ? 'open' : 'closed'}
            type="button"
          />
        )}
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
        {...props}
      >
        {children}
        <PiCaretDown {...stylex.props(styles.caret)} aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(styles.inner, xstyle);
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      {...stylex.props(styles.panel)}
      {...props}
    >
      <div
        {...applied}
        className={cn(applied.className, className)}
        style={{ ...applied.style, ...style }}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
