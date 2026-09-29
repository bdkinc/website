import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { PiCaretDown } from 'react-icons/pi';

import { cn } from '../../lib/cn';

const hover = '@media (hover: hover)';
const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positioner: {
    position: 'absolute',
    top: '100%',
    left: 0,
    isolation: 'isolate',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'center',
  },
  popup: {
    position: 'relative',
    marginTop: 6,
    overflow: 'hidden',
    borderRadius: 'calc(var(--radius) - 2px)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)',
  },
  list: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  item: { position: 'relative' },
  trigger: {
    display: 'inline-flex',
    height: 44,
    width: 'max-content',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(var(--radius) - 2px)',
    paddingInline: 16,
    paddingBlock: 8,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    backgroundColor: {
      default: 'transparent',
      [hover]: { default: 'transparent', ':hover': 'var(--accent)' },
    },
    color: {
      default: 'inherit',
      [hover]: { default: 'inherit', ':hover': 'var(--accent-foreground)' },
      '[aria-current="page"]': 'var(--primary)',
    },
    boxShadow: {
      default: 'none',
      ':focus-visible': '0 0 0 2px var(--background), 0 0 0 4px var(--ring)',
    },
    pointerEvents: { default: 'auto', ':disabled': 'none' },
    opacity: { default: 1, ':disabled': 0.5 },
    outline: 'none',
  },
  caret: {
    position: 'relative',
    marginLeft: 4,
    width: 12,
    height: 12,
    transitionProperty: 'all',
    transitionDuration: '300ms',
  },
  content: {
    top: 0,
    left: 0,
    width: '100%',
    padding: 8,
  },
  viewport: {
    width: '100%',
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 'calc(var(--radius) - 4px)',
    padding: 8,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    boxShadow: {
      default: 'none',
      ':focus-visible': '0 0 0 2px var(--background), 0 0 0 4px var(--ring)',
    },
    transitionProperty:
      'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing',
    transitionDuration: '150ms',
    outline: 'none',
  },
});

type XStyle = { xstyle?: StyleXStyles };
function NavigationMenu({
  className,
  children,
  viewport = true,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
} & XStyle) {
  const applied = stylex.props(styles.root, xstyle);
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          {...stylex.props(styles.positioner)}
        >
          <NavigationMenuPrimitive.Popup {...stylex.props(styles.popup)}>
            {viewport ? (
              <NavigationMenuViewport />
            ) : (
              <NavigationMenuPrimitive.Content />
            )}
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  );
}
function NavigationMenuList({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List> & XStyle) {
  const applied = stylex.props(styles.list, xstyle);
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function NavigationMenuItem({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item> & XStyle) {
  const applied = stylex.props(styles.item, xstyle);
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
// Astro/legacy consumers retain the class-string export; React callers use xstyle on the trigger.
function navigationMenuTriggerStyle(
  options: { class?: string; className?: string } = {}
) {
  return cn(
    stylex.props(styles.trigger).className,
    options.class,
    options.className
  );
}
function NavigationMenuTrigger({
  className,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & XStyle) {
  const applied = stylex.props(styles.trigger, xstyle);
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      render={(renderProps, state) => (
        <button
          {...renderProps}
          data-state={state.open ? 'open' : 'closed'}
          type="button"
        />
      )}
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}{' '}
      <PiCaretDown {...stylex.props(styles.caret)} aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}
function NavigationMenuContent({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & XStyle) {
  const applied = stylex.props(styles.content, xstyle);
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function NavigationMenuViewport({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & XStyle) {
  const applied = stylex.props(styles.viewport, xstyle);
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}
function NavigationMenuLink({
  className,
  asChild = false,
  children,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  asChild?: boolean;
} & XStyle) {
  const applied = stylex.props(styles.link, xstyle);
  if (asChild && React.isValidElement(children)) {
    return (
      <NavigationMenuPrimitive.Link
        data-slot="navigation-menu-link"
        {...applied}
        className={cn(applied.className, 'bdk-navigation-link', className)}
        style={{ ...applied.style, ...style }}
        render={children}
        {...props}
      >
        {(children.props as { children?: React.ReactNode }).children}
      </NavigationMenuPrimitive.Link>
    );
  }
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      {...applied}
      className={cn(applied.className, 'bdk-navigation-link', className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );
}
function NavigationMenuIndicator() {
  return null;
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
