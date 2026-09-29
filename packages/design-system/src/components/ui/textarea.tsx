import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

import { cn } from '../../lib/cn';

const styles = stylex.create({
  textarea: {
    display: 'flex',
    fieldSizing: 'content',
    minHeight: 64,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'var(--input)',
      ':focus-visible': 'var(--ring)',
      '[aria-invalid="true"]': 'var(--destructive)',
    },
    borderRadius: 'calc(var(--radius) - 2px)',
    backgroundColor: 'transparent',
    paddingInline: 12,
    paddingBlock: 8,
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
    cursor: { default: 'auto', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
});

interface TextareaProps extends React.ComponentProps<'textarea'> {
  xstyle?: StyleXStyles;
}

function Textarea({ className, xstyle, style, ...props }: TextareaProps) {
  const applied = stylex.props(styles.textarea, xstyle);
  return (
    <textarea
      data-slot="textarea"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
}

export { Textarea };
