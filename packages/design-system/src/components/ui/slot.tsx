import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  xstyle?: StyleXStyles;
};

const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, className, style, xstyle, ...props },
  forwardedRef
) {
  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
  >;
  const applied = stylex.props(xstyle);
  const composedRef = (node: HTMLElement | null) => {
    for (const ref of [child.props.ref, forwardedRef]) {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }
  };

  return React.cloneElement(child, {
    ...props,
    className: cn(applied.className, className, child.props.className),
    style: { ...applied.style, ...style, ...child.props.style },
    ref: composedRef,
  });
});

export { Slot };
