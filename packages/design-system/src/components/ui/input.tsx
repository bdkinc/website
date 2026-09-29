import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  input: {
    width: '100%',
    minWidth: 0,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--input)',
      ':focus-visible': 'var(--ring)',
      '[aria-invalid="true"]': 'var(--destructive)',
    },
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: 'transparent',
    height: 36,
    borderWidth: 1,
    paddingInline: 12,
    paddingBlock: 4,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    '--field-ring-color': {
      default: 'var(--field-focus-ring)',
      '[aria-invalid="true"]': 'var(--field-invalid-ring)',
    },
    boxShadow: {
      default: null,
      ':focus-visible': '0 0 0 3px var(--field-ring-color)',
    },
    outline: 'none',
    pointerEvents: { default: 'auto', ':disabled': 'none' },
    cursor: { default: 'auto', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
});

interface InputProps extends React.ComponentProps<'input'> {
  xstyle?: StyleXStyles;
}

function Input({ className, type, xstyle, style, ...props }: InputProps) {
  const applied = stylex.props(styles.input, xstyle);
  return (
    <input
      type={type}
      data-slot="input"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export { Input };
