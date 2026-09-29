'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(xstyle);
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  xstyle,
  style,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel> & {
  xstyle?: StyleXStyles;
}) {
  const applied = stylex.props(xstyle);
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
