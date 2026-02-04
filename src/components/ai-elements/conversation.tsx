'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
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

export const Conversation = ({ className, children }: ConversationProps) => {
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
    // Simple heuristic: if we were at bottom, stay at bottom.
    // In a real chat app you might want smarter logic (e.g. don't scroll if user is reading up history)
    // For now, we'll auto-scroll on new messages for this marketing component.
    if (isAtBottom) {
      // Small timeout to allow layout to update
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [children, isAtBottom, scrollToBottom]);

  // Initial scroll
  useEffect(() => {
    // Force immediate scroll without smooth behavior for initial load
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, []);

  return (
    <ConversationContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div className={cn('relative flex-1 overflow-hidden', className)}>
        {/* We use a custom implementation of ScrollArea logic to hook into scroll events */}
        <CustomScrollArea onScroll={handleScroll} viewportRef={viewportRef}>
          {children}
        </CustomScrollArea>
      </div>
    </ConversationContext.Provider>
  );
};

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';

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
    <ScrollAreaPrimitive.Root className="h-full w-full overflow-hidden">
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit]"
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

export type ConversationContentProps = ComponentProps<'div'>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <div aria-live="polite" className={cn('p-4', className)} {...props} />
);

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = 'No messages yet',
  description = 'Start a conversation to see messages here',
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      'flex size-full flex-col items-center justify-center gap-3 p-8 text-center',
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useContext(ConversationContext);

  if (isAtBottom) return null;

  return (
    <Button
      className={cn(
        'absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full shadow-md',
        className
      )}
      aria-label="Scroll to latest messages"
      onClick={scrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <PiArrowDown className="size-4" />
    </Button>
  );
};
