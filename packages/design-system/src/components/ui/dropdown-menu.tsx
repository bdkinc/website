import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { Menu as DropdownMenuPrimitive } from '@base-ui/react/menu';
import { PiCheck, PiCaretRight, PiCircle } from 'react-icons/pi';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  popup: {
    zIndex: 50,
    overflowY: 'auto',
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)',
  },
  subPopup: {
    overflow: 'hidden',
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)',
  },
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'default',
    alignItems: 'center',
    gap: 8,
    borderRadius: 'calc(var(--radius) - 4px)',
    paddingInline: 8,
    paddingBlock: 6,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    userSelect: 'none',
    pointerEvents: { default: 'auto', '[data-disabled]': 'none' },
    opacity: { default: 1, '[data-disabled]': 0.5 },
  },
  checkItem: { paddingLeft: 32, paddingRight: 0 },
  indicator: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  checkIcon: { width: 16, height: 16 },
  circleIcon: { fill: 'currentColor' },
  label: {
    paddingInline: 8,
    paddingBlock: 6,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  separator: {
    height: 1,
    backgroundColor: 'var(--border)',
  },
  shortcut: {
    marginLeft: 'auto',
    color: 'var(--muted-foreground)',
    fontSize: '.75rem',
    lineHeight: '1rem',
    letterSpacing: '.1em',
  },
  caret: { marginLeft: 'auto', width: 16, height: 16 },
});

type XStyle = { xstyle?: StyleXStyles };
function DropdownMenu(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>
) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
function DropdownMenuPortal(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>
) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}
function DropdownMenuTrigger({
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild && React.isValidElement(children)) {
    return (
      <DropdownMenuPrimitive.Trigger
        data-slot="dropdown-menu-trigger"
        render={children}
        {...props}
      >
        {(children.props as { children?: React.ReactNode }).children}
      </DropdownMenuPrimitive.Trigger>
    );
  }
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      render={(renderProps, state) => (
        <button
          {...renderProps}
          data-state={state.open ? 'open' : 'closed'}
          type="button"
        />
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}
function DropdownMenuContent({
  className,
  side,
  align,
  sideOffset = 4,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
} & XStyle) {
  const applied = stylex.props(styles.popup, xstyle);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <DropdownMenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          render={(renderProps, state) => (
            <div
              {...renderProps}
              data-state={state.open ? 'open' : 'closed'}
              data-side={state.side}
            />
          )}
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
}
function DropdownMenuGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>
) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  onSelect,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
} & XStyle) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      {...applied}
      className={cn(applied.className, 'bdk-menu-item', className)}
      style={{ ...applied.style, ...style }}
      onClick={(event) => {
        onSelect?.(event);
        props.onClick?.(event);
      }}
      {...props}
    />
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & XStyle) {
  const applied = stylex.props(styles.item, styles.checkItem, xstyle);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      {...applied}
      className={cn(applied.className, 'bdk-menu-item', className)}
      style={{ ...applied.style, ...style }}
      checked={checked}
      {...props}
    >
      <span {...stylex.props(styles.indicator)}>
        <DropdownMenuPrimitive.CheckboxItemIndicator>
          <PiCheck {...stylex.props(styles.checkIcon)} />
        </DropdownMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}
function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}
function DropdownMenuRadioItem({
  className,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & XStyle) {
  const applied = stylex.props(styles.item, styles.checkItem, xstyle);
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      {...applied}
      className={cn(applied.className, 'bdk-menu-item', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      <span {...stylex.props(styles.indicator)}>
        <DropdownMenuPrimitive.RadioItemIndicator>
          <PiCircle {...stylex.props(styles.circleIcon)} />
        </DropdownMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}
function DropdownMenuLabel({
  className,
  inset,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.GroupLabel> & {
  inset?: boolean;
} & XStyle) {
  const applied = stylex.props(styles.label, xstyle);
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DropdownMenuSeparator({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'div'> & XStyle) {
  const applied = stylex.props(styles.separator, xstyle);
  return (
    <div
      data-slot="dropdown-menu-separator"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DropdownMenuShortcut({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<'span'> & XStyle) {
  const applied = stylex.props(styles.shortcut, xstyle);
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function DropdownMenuSub(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuRoot>
) {
  return (
    <DropdownMenuPrimitive.SubmenuRoot
      data-slot="dropdown-menu-sub"
      {...props}
    />
  );
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuTrigger> & {
  inset?: boolean;
} & XStyle) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <DropdownMenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      {...applied}
      className={cn(applied.className, 'bdk-menu-item', className)}
      style={{ ...applied.style, ...style }}
      render={(renderProps, state) => (
        <div
          {...renderProps}
          data-open={state.open ? '' : undefined}
          data-state={state.open ? 'open' : 'closed'}
        />
      )}
      {...props}
    >
      {children}
      <PiCaretRight {...stylex.props(styles.caret)} />
    </DropdownMenuPrimitive.SubmenuTrigger>
  );
}
function DropdownMenuSubContent({
  className,
  side,
  align,
  sideOffset = 4,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
} & XStyle) {
  const applied = stylex.props(styles.popup, styles.subPopup, xstyle);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <DropdownMenuPrimitive.Popup
          data-slot="dropdown-menu-sub-content"
          {...applied}
          className={cn(applied.className, className)}
          style={{ ...applied.style, ...style }}
          {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
