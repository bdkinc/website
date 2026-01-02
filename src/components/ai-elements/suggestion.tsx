'use client';

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export type SuggestionsProps = ComponentProps<typeof ScrollAreaPrimitive.Root>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <ScrollAreaPrimitive.Root
    className={cn('relative w-full', className)}
    type="auto"
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      <div className="flex w-max items-center gap-2 pb-4">{children}</div>
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
);

export type SuggestionProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
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
      className={cn('cursor-pointer rounded-lg px-4', className)}
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
