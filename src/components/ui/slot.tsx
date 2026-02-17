import * as React from 'react';

import { cn } from '@/lib/utils';

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, className, style, ...props },
  forwardedRef
) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const child = children as React.ReactElement<{
    className?: string;
    style?: React.CSSProperties;
  }>;

  const childRef = (
    child as React.ReactElement & { ref?: React.Ref<HTMLElement> }
  ).ref;

  const composedRef = (node: HTMLElement | null) => {
    if (typeof childRef === 'function') {
      childRef(node);
    } else if (childRef && typeof childRef === 'object') {
      childRef.current = node;
    }

    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef && typeof forwardedRef === 'object') {
      forwardedRef.current = node;
    }
  };

  return React.cloneElement(
    child as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >,
    {
      ...props,
      className: cn(className, child.props.className),
      style: { ...style, ...child.props.style },
      ref: composedRef,
    }
  );
});

export { Slot };
