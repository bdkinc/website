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
    ref?: React.Ref<HTMLElement>;
  }>;

  const composedRef = (node: HTMLElement | null) => {
    if (typeof child.props.ref === 'function') {
      child.props.ref(node);
    } else if (child.props.ref && typeof child.props.ref === 'object') {
      child.props.ref.current = node;
    }

    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef && typeof forwardedRef === 'object') {
      forwardedRef.current = node;
    }
  };

  return React.cloneElement(child, {
    ...props,
    className: cn(className, child.props.className),
    style: { ...style, ...child.props.style },
    ref: composedRef,
  });
});

export { Slot };
