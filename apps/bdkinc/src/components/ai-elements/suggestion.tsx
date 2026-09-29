'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import { Button, ScrollBar, cn } from '@bdkinc/design-system';
import type { ComponentProps } from 'react';

const styles = stylex.create({
  root: { position: 'relative', width: '100%' },
  viewport: { width: '100%', height: '100%', borderRadius: 'inherit' },
  track: {
    display: 'flex',
    width: 'max-content',
    alignItems: 'center',
    gap: '.5rem',
    paddingBottom: '1rem',
  },
  suggestion: {
    cursor: 'pointer',
    borderRadius: 'var(--radius)',
    paddingInline: '1rem',
  },
});

export type SuggestionsProps = ComponentProps<
  typeof ScrollAreaPrimitive.Root
> & {
  xstyle?: StyleXStyles;
};

export const Suggestions = ({
  className,
  style,
  xstyle,
  children,
  ...props
}: SuggestionsProps) => {
  const applied = stylex.props(styles.root, xstyle);
  // Base UI also accepts a state => style function; keep it and layer it over StyleX inline styles.
  const mergedStyle: SuggestionsProps['style'] =
    typeof style === 'function'
      ? (state) => ({ ...applied.style, ...style(state) })
      : { ...applied.style, ...style };
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      className={cn(applied.className, className)}
      style={mergedStyle}
    >
      <ScrollAreaPrimitive.Viewport {...stylex.props(styles.viewport)}>
        <div {...stylex.props(styles.track)}>{children}</div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};

export type SuggestionProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  xstyle,
  variant = 'outline',
  size = 'sm',
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  return (
    <Button
      className={className}
      xstyle={[styles.suggestion, xstyle]}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  );
};
