'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { cn } from '../../lib/cn';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { PiArrowDown } from 'react-icons/pi';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

const shadowMd =
  '0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)';
const styles = stylex.create({
  conversation: { position: 'relative', flex: 1, overflow: 'hidden' },
  scrollRoot: { width: '100%', height: '100%', overflow: 'hidden' },
  viewport: { width: '100%', height: '100%', borderRadius: 'inherit' },
  content: { padding: 16 },
  empty: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
    textAlign: 'center',
  },
  muted: { color: 'var(--muted-foreground)' },
  text: { fontSize: '.875rem', lineHeight: '1.25rem' },
  title: { fontWeight: 500 },
  // Replaces `space-y-1` on the wrapper; the description is the only following sibling.
  description: { marginTop: 4 },
  scrollButton: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '9999px',
    // The focus ring stacks with `shadow-md` rather than replacing it.
    boxShadow: {
      default: shadowMd,
      ':focus-visible': `0 0 0 2px var(--background), 0 0 0 4px var(--button-ring), ${shadowMd}`,
    },
  },
  icon: { width: 16, height: 16 },
});

// Context for scroll control
interface ConversationContextValue {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

const ConversationContext = createContext<ConversationContextValue>({
  isAtBottom: true,
  scrollToBottom: () => {},
});

export type ConversationProps = ComponentProps<typeof ScrollArea> & {
  children: ReactNode;
};

export const Conversation = ({
  className,
  children,
  xstyle,
}: ConversationProps) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    // Considered "at bottom" if within 50px
    setIsAtBottom(distanceToBottom < 50);
  };

  // Auto-scroll when children change, if we were already at bottom or close to it
  useEffect(() => {
    let timeoutId: number | undefined;

    // Simple heuristic: if we were at bottom, stay at bottom.
    // In a real chat app you might want smarter logic (e.g. don't scroll if user is reading up history)
    // For now, we'll auto-scroll on new messages for this marketing component.
    if (isAtBottom) {
      // Small timeout to allow layout to update
      timeoutId = window.setTimeout(() => {
        scrollToBottom();
      }, 100);
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [children, isAtBottom, scrollToBottom]);

  // Initial scroll
  useEffect(() => {
    // Force immediate scroll without smooth behavior for initial load
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, []);

  const applied = stylex.props(styles.conversation, xstyle);

  return (
    <ConversationContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div {...applied} className={cn(applied.className, className)}>
        {/* We use a custom implementation of ScrollArea logic to hook into scroll events */}
        <CustomScrollArea onScroll={handleScroll} viewportRef={viewportRef}>
          {children}
        </CustomScrollArea>
      </div>
    </ConversationContext.Provider>
  );
};

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

const CustomScrollArea = ({
  children,
  onScroll,
  viewportRef,
}: {
  children: ReactNode;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <ScrollAreaPrimitive.Root {...stylex.props(styles.scrollRoot)}>
      <ScrollAreaPrimitive.Viewport
        {...stylex.props(styles.viewport)}
        onScroll={onScroll}
        ref={viewportRef}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};

export type ConversationContentProps = ComponentProps<'div'> & {
  xstyle?: StyleXStyles;
};

export const ConversationContent = ({
  className,
  style,
  xstyle,
  ...props
}: ConversationContentProps) => {
  const applied = stylex.props(styles.content, xstyle);
  return (
    <div
      aria-live="polite"
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    />
  );
};

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  xstyle?: StyleXStyles;
};

export const ConversationEmptyState = ({
  className,
  style,
  xstyle,
  title = 'No messages yet',
  description = 'Start a conversation to see messages here',
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => {
  const applied = stylex.props(styles.empty, xstyle);
  return (
    <div
      {...applied}
      className={cn(applied.className, className)}
      style={{ ...applied.style, ...style }}
      {...props}
    >
      {children ?? (
        <>
          {icon && <div {...stylex.props(styles.muted)}>{icon}</div>}
          <div>
            <h3 {...stylex.props(styles.text, styles.title)}>{title}</h3>
            {description && (
              <p
                {...stylex.props(styles.text, styles.muted, styles.description)}
              >
                {description}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  xstyle,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useContext(ConversationContext);

  if (isAtBottom) return null;

  return (
    <Button
      className={className}
      xstyle={[styles.scrollButton, xstyle]}
      aria-label="Scroll to latest messages"
      onClick={scrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <PiArrowDown {...stylex.props(styles.icon)} />
    </Button>
  );
};
