import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '../../lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { UIMessage } from 'ai';
import {
  createContext,
  useContext,
  type ComponentProps,
  type HTMLAttributes,
} from 'react';

import { PiUser } from 'react-icons/pi';

const styles = stylex.create({
  message: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: '.5rem',
    paddingBlock: '1rem',
  },
  assistant: { flexDirection: 'row-reverse' },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
    overflow: 'hidden',
    borderRadius: 'var(--radius)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
  },
  bubble: { maxWidth: '80%', paddingInline: '1rem', paddingBlock: '.75rem' },
  containedUser: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  containedAssistant: {
    backgroundColor: 'var(--secondary)',
    color: 'var(--foreground)',
  },
  flatUser: { backgroundColor: 'var(--secondary)', color: 'var(--foreground)' },
  flatAssistant: { color: 'var(--foreground)' },
  avatar: {
    // `ring-1 ring-border` via Tailwind's ring/shadow vars so caller ring-* and shadow-* utilities still compose.
    '--tw-ring-color': 'var(--border)',
    '--tw-ring-shadow':
      'var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width, 0px)) var(--tw-ring-color, currentcolor)',
    boxShadow:
      'var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
  },
  avatarImage: { marginTop: 0, marginBottom: 0 },
  icon: { width: '1rem', height: '1rem' },
});

// Replaces Tailwind `group-[.is-*]` selectors: content reads its role from the enclosing Message.
const MessageRoleContext = createContext<UIMessage['role'] | undefined>(
  undefined
);

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
  xstyle?: StyleXStyles;
};

export const Message = ({
  className,
  style,
  xstyle,
  from,
  ...props
}: MessageProps) => {
  const applied = stylex.props(
    styles.message,
    from !== 'user' && styles.assistant,
    xstyle
  );
  return (
    <MessageRoleContext.Provider value={from}>
      <div
        {...applied}
        className={cn(
          applied.className,
          'group',
          from === 'user' ? 'is-user' : 'is-assistant',
          className
        )}
        style={{ ...applied.style, ...style }}
        {...props}
      />
    </MessageRoleContext.Provider>
  );
};

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'contained' | 'flat' | null;
  xstyle?: StyleXStyles;
};

export const MessageContent = ({
  children,
  className,
  style,
  xstyle,
  variant = 'contained',
  ...props
}: MessageContentProps) => {
  const role = useContext(MessageRoleContext);
  const isUser = role === 'user';
  const isAssistant = role !== undefined && !isUser;
  const applied = stylex.props(
    styles.content,
    variant === 'contained' && [
      styles.bubble,
      isUser && styles.containedUser,
      isAssistant && styles.containedAssistant,
    ],
    variant === 'flat' && [
      isUser && [styles.bubble, styles.flatUser],
      isAssistant && styles.flatAssistant,
    ],
    xstyle
  );
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  xstyle,
  ...props
}: MessageAvatarProps) => (
  <Avatar className={className} xstyle={[styles.avatar, xstyle]} {...props}>
    <AvatarImage alt="" src={src} xstyle={styles.avatarImage} />
    <AvatarFallback>
      {name === 'You' ? (
        <PiUser {...stylex.props(styles.icon)} />
      ) : (
        name?.slice(0, 2) || 'ME'
      )}
    </AvatarFallback>
  </Avatar>
);
