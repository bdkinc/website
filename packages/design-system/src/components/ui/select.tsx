import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { PiCheck, PiCaretDown, PiCaretUp } from 'react-icons/pi';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  trigger: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--input)',
      ':focus-visible': 'var(--ring)',
      '[aria-invalid="true"]': 'var(--destructive)',
    },
    backgroundColor: 'transparent',
    paddingInline: 12,
    paddingBlock: 8,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    whiteSpace: 'nowrap',
    '--field-ring-color': {
      default: 'var(--field-focus-ring)',
      '[aria-invalid="true"]': 'var(--field-invalid-ring)',
    },
    boxShadow: {
      default: null,
      ':focus-visible': '0 0 0 3px var(--field-ring-color)',
    },
    outline: 'none',
    cursor: { default: 'auto', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
  icon: { width: 16, height: 16, opacity: 0.5 },
  popup: {
    position: 'relative',
    zIndex: 50,
    overflowY: 'auto',
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)',
  },
  label: {
    paddingInline: 8,
    paddingBlock: 6,
    color: 'var(--muted-foreground)',
    fontSize: '.75rem',
    lineHeight: '1rem',
  },
  item: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    cursor: 'default',
    alignItems: 'center',
    gap: 8,
    borderRadius: 'calc(var(--radius) - 4px)',
    paddingLeft: 8,
    paddingBlock: 6,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    userSelect: 'none',
    pointerEvents: { default: 'auto', '[data-disabled]': 'none' },
    opacity: { default: 1, '[data-disabled]': 0.5 },
  },
  indicator: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { width: 16, height: 16 },
  separator: {
    height: 1,
    pointerEvents: 'none',
    backgroundColor: 'var(--border)',
  },
  scroll: {
    display: 'flex',
    cursor: 'default',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: 4,
  },
});

type XStyle = { xstyle?: StyleXStyles };
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}
function SelectGroup(
  props: React.ComponentProps<typeof SelectPrimitive.Group>
) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}
function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}
function SelectTrigger({
  className,
  size = 'default',
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default' | null;
} & XStyle) {
  const applied = stylex.props(styles.trigger, xstyle);
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      {...applied}
      className={cn(applied.className, 'bdk-select-trigger', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <PiCaretDown {...stylex.props(styles.icon)} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'center',
  sideOffset = 4,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> & {
  position?: 'popper' | 'item-aligned';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
} & XStyle) {
  const applied = stylex.props(styles.popup, xstyle);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={position !== 'popper'}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}
function SelectLabel({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel> & XStyle) {
  const applied = stylex.props(styles.label, xstyle);
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function SelectItem({
  className,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & XStyle) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...applied}
      className={cn(applied.className, 'bdk-select-item', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <span {...stylex.props(styles.indicator)}>
        <SelectPrimitive.ItemIndicator>
          <PiCheck {...stylex.props(styles.check)} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
function SelectSeparator({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & XStyle) {
  const applied = stylex.props(styles.separator, xstyle);
  return (
    <div
      data-slot="select-separator"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function SelectScrollUpButton({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow> & XStyle) {
  const applied = stylex.props(styles.scroll, xstyle);
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <PiCaretUp {...stylex.props(styles.check)} />
    </SelectPrimitive.ScrollUpArrow>
  );
}
function SelectScrollDownButton({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow> & XStyle) {
  const applied = stylex.props(styles.scroll, xstyle);
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <PiCaretDown {...stylex.props(styles.check)} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
