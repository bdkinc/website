'use client';

import * as stylex from '@stylexjs/stylex';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from './ai-elements/conversation';
import { Message, MessageAvatar, MessageContent } from './ai-elements/message';
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from './ui/input-group';

import { Suggestion, Suggestions } from './ai-elements/suggestion';
import { cn } from '../lib/cn';

import { nanoid } from 'nanoid';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import {
  PiPaperPlaneRight,
  PiSparkle,
  PiSpinner,
  PiSquare,
} from 'react-icons/pi';

type ChatStatus = 'submitted' | 'streaming' | 'ready';

type MessageType = {
  key: string;
  from: 'user' | 'assistant';
  version: {
    id: string;
    content: string;
  };
  avatar: string;
  name: string;
  isStreaming?: boolean;
};

import type { PageData } from '@bdkinc/content';

interface ContactChatProps {
  copy: PageData<'contact'>['chat'];
  initialSuggestions?: string[];
}

type AnalyticsParams = Record<string, unknown>;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: AnalyticsParams[];
    gtag?: Gtag;
  }
}

function track(event: string, params?: AnalyticsParams) {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event, ...params });
  window.gtag?.('event', event, params);
}

const hoverMedia = '@media (hover: hover)';
const transitionInteractive =
  'color, background-color, border-color, box-shadow, opacity, transform, width, gap, letter-spacing';
const shadowSm = '0 1px 2px 0 rgb(0 0 0 / .05)';
// Hairlines default to white overlays tuned for dark surfaces; light themes
// override them with --chat-frame / --chat-divider.
const frameColor = 'var(--chat-frame, rgb(255 255 255 / .1))';
const dividerColor = 'var(--chat-divider, rgb(255 255 255 / .05))';
// `shadow-2xl` stacked with the `ring-1 ring-white/5` outline, resolved to
// the box-shadow Tailwind emits for that combination.
const shadowCard = `0 0 0 1px ${dividerColor}, 0 25px 50px -12px rgb(0 0 0 / .25)`;

const spinKeyframes = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  section: {
    position: 'relative',
    marginInline: 'auto',
    width: '100%',
    maxWidth: '48rem',
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: frameColor,
    boxShadow: shadowCard,
  },
  // Marker: `glass` supplies its CSS rule.
  // Marker: `gradient-mesh` supplies its CSS rule.
  mesh: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.3,
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: dividerColor,
    backgroundColor: 'color-mix(in oklab, var(--background) 20%, transparent)',
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
    backdropFilter: 'blur(4px)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '.75rem' },
  headerIcon: {
    display: 'flex',
    width: '2rem',
    height: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '.5rem',
    backgroundColor: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    color: 'var(--primary)',
  },
  headerIconGlyph: { width: 16, height: 16 },
  headerTitle: {
    color: 'var(--foreground)',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
  },
  chatArea: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: 600,
    backgroundColor: 'color-mix(in oklab, var(--background) 5%, transparent)',
  },
  // Original `flex-1` matches the Conversation base; only the vertical
  // scroll override lives here.
  conversation: { flex: 1, overflowY: 'auto' },
  // Replaces `space-y-6` with a flex column gap (sibling-margin utilities
  // have no single-element StyleX equivalent); padding overrides the base.
  conversationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: 24,
  },
  message: { alignItems: 'flex-start', gap: 0, flexDirection: 'row' },
  messageAssistant: { justifyContent: 'flex-start' },
  messageUser: { justifyContent: 'flex-end' },
  // Size, shape and shrink come from the Avatar base (`h-8 w-8 shrink-0
  // rounded-full` equivalents); only the outline and role margins live here.
  // The elevation is set via `--tw-shadow` so the MessageAvatar ring
  // composite (ring-1 ring-border + shadow) keeps composing instead of
  // being replaced by a flat box-shadow.
  avatar: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: frameColor,
    '--tw-shadow': shadowSm,
  },
  avatarAssistant: { marginRight: '.5rem' },
  avatarUser: { order: 9999, marginLeft: '.5rem' },
  // The flat assistant variant is chromeless (no base padding), so the
  // caller supplies the original `px-4 py-3` for both roles here.
  messageBubble: {
    borderRadius: '1rem',
    paddingInline: '1rem',
    paddingBlock: '.75rem',
    lineHeight: '1.625',
    boxShadow: shadowSm,
    backdropFilter: 'blur(4px)',
  },
  bubbleAssistant: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: dividerColor,
    backgroundColor: 'color-mix(in oklab, var(--card) 50%, transparent)',
    color: 'var(--foreground)',
  },
  bubbleUser: {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  inputArea: {
    backgroundColor: 'color-mix(in oklab, var(--background) 10%, transparent)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: dividerColor,
    padding: 16,
    backdropFilter: 'blur(4px)',
  },
  suggestions: { marginBottom: 16 },
  suggestion: {
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border)',
    borderRadius: '.5rem',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--muted) 20%, transparent)',
      [hoverMedia]: {
        default: 'color-mix(in oklab, var(--muted) 20%, transparent)',
        ':hover': 'var(--muted)',
      },
    },
    color: {
      default: 'var(--muted-foreground)',
      [hoverMedia]: {
        default: 'var(--muted-foreground)',
        ':hover': 'var(--foreground)',
      },
    },
    paddingInline: '1rem',
    paddingBlock: '.5rem',
    fontSize: '.75rem',
    lineHeight: '1rem',
    whiteSpace: 'nowrap',
    transitionProperty: transitionInteractive,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  // The form owns the visible border/background/ring; the inner InputGroup
  // is zeroed via `xstyle` (see promptGroup) because StyleX cannot
  // express the old `[&_[data-slot=input-group]]:*` ancestor selectors.
  promptForm: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--input)',
    borderRadius: '.75rem',
    backgroundColor: 'color-mix(in oklab, var(--muted) 50%, transparent)',
    boxShadow: {
      default: 'none',
      ':focus-within':
        '0 0 0 0 var(--background), 0 0 0 2px color-mix(in oklab, var(--primary) 50%, transparent)',
    },
    transitionProperty: transitionInteractive,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
  promptGroup: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    boxShadow: {
      default: 'none',
      ':has([data-slot="input-group-control"]:focus-visible)': 'none',
    },
  },
  // `py-3` and `focus:outline-none` match the InputGroupTextarea/primitive
  // defaults, so only the height, inline padding, size and placeholder live
  // here. `.875rem` / `1.25rem` are the rem equivalents of `text-sm`.
  promptTextarea: {
    minHeight: 50,
    maxHeight: '12rem',
    paddingInline: 16,
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    backgroundColor: 'transparent',
    color: {
      default: null,
      '::placeholder':
        'color-mix(in oklab, var(--muted-foreground) 50%, transparent)',
    },
  },
  // Match the former block-end addon without its redundant button semantics.
  promptFooter: {
    display: 'flex',
    width: '100%',
    order: 9999,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingInline: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  icon: { width: 16, height: 16 },
  spin: {
    animationName: spinKeyframes,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  // `h-8 w-8` matches the `icon-sm` InputGroupButton size; radius, tinted
  // colors and disabled colors are overridden on the ghost variant.
  submit: {
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    backgroundColor: {
      default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
      [hoverMedia]: {
        default: 'color-mix(in oklab, var(--primary) 10%, transparent)',
        ':hover': 'color-mix(in oklab, var(--primary) 20%, transparent)',
      },
      ':disabled': 'transparent',
    },
    color: {
      default: 'var(--primary)',
      ':disabled': 'var(--muted-foreground)',
    },
    transitionProperty: transitionInteractive,
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(.4, 0, .2, 1)',
  },
});

export default function ContactChat({
  copy,
  initialSuggestions,
}: ContactChatProps) {
  const hasStartedRef = useRef(false);
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<ChatStatus>('ready');
  // The ref closes the gap before React renders disabled controls.
  const statusRef = useRef<ChatStatus>('ready');
  const mountedRef = useRef(true);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composingRef = useRef(false);
  const busy = status === 'submitted' || status === 'streaming';

  const [suggestions] = useState<string[]>(
    initialSuggestions || [
      copy.componentSuggestions.managedServices,
      copy.componentSuggestions.cloud,
      copy.componentSuggestions.security,
      copy.componentSuggestions.ibm,
    ]
  );

  const [messages, setMessages] = useState<MessageType[]>(() => [
    {
      key: nanoid(),
      from: 'assistant',
      version: {
        id: nanoid(),
        content: copy.greeting,
      },
      avatar: copy.avatar,
      name: copy.assistantName,
    },
  ]);

  useEffect(() => {
    mountedRef.current = true;
    track('contact_chat_view', { component: 'ContactChat' });
    return () => {
      mountedRef.current = false;
      if (replyTimerRef.current !== null) {
        clearTimeout(replyTimerRef.current);
        replyTimerRef.current = null;
      }
    };
  }, []);

  const ensureStarted = useCallback((source: 'typed' | 'suggestion') => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    track('contact_chat_started', { source });
  }, []);

  const acceptMessage = useCallback(
    (value: string, source: 'typed' | 'suggestion') => {
      const content = value.trim();
      if (!content || !mountedRef.current || statusRef.current !== 'ready') {
        return false;
      }

      statusRef.current = 'submitted';
      setStatus('submitted');
      ensureStarted(source);
      track('contact_chat_message_sent', {
        method: source,
        char_count: content.length,
      });

      const userId = nanoid();
      setMessages((prev) => [
        ...prev,
        {
          key: userId,
          from: 'user',
          version: { id: userId, content },
          avatar: '',
          name: copy.userName,
        },
      ]);

      // Only one reply can be active, and every delay has the same cleanup owner.
      replyTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        statusRef.current = 'streaming';
        setStatus('streaming');
        const assistantId = nanoid();
        const mockResponses = [
          copy.simulatedReplies.architect,
          copy.simulatedReplies.engineering,
          copy.simulatedReplies.leadership,
        ];
        const words =
          mockResponses[Math.floor(Math.random() * mockResponses.length)].split(
            ' '
          );
        setMessages((prev) => [
          ...prev,
          {
            key: assistantId,
            from: 'assistant',
            version: { id: assistantId, content: '' },
            avatar: copy.avatar,
            name: copy.assistantName,
            isStreaming: true,
          },
        ]);

        let wordIndex = 0;
        let currentContent = '';
        const streamNextWord = () => {
          if (!mountedRef.current) return;
          if (wordIndex === words.length) {
            replyTimerRef.current = null;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.version.id === assistantId
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            );
            statusRef.current = 'ready';
            setStatus('ready');
            return;
          }

          currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex++];
          // Capture each word snapshot before React runs the updater.
          const streamedContent = currentContent;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.version.id === assistantId
                ? {
                    ...msg,
                    version: { ...msg.version, content: streamedContent },
                  }
                : msg
            )
          );
          replyTimerRef.current = setTimeout(
            streamNextWord,
            Math.random() * 50 + 30
          );
        };
        streamNextWord();
      }, 600);
      return true;
    },
    [copy, ensureStarted]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (acceptMessage(text, 'typed')) setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    acceptMessage(suggestion, 'suggestion');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      composingRef.current ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <section aria-label={copy.assistantLabel} {...stylex.props(styles.section)}>
      <div className={cn(stylex.props(styles.card).className, 'glass')}>
        <div
          className={cn(stylex.props(styles.mesh).className, 'gradient-mesh')}
        />

        {/* Header bar */}
        <div {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.headerLeft)}>
            <div {...stylex.props(styles.headerIcon)}>
              <PiSparkle {...stylex.props(styles.headerIconGlyph)} />
            </div>
            <div>
              <div {...stylex.props(styles.headerTitle)}>
                {copy.assistantLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div {...stylex.props(styles.chatArea)}>
          <Conversation xstyle={styles.conversation}>
            <ConversationContent xstyle={styles.conversationContent}>
              {messages.map((message) => (
                <Message
                  from={message.from}
                  key={message.key}
                  xstyle={[
                    styles.message,
                    message.from === 'assistant'
                      ? styles.messageAssistant
                      : styles.messageUser,
                  ]}
                >
                  <MessageAvatar
                    name={message.name}
                    src={message.avatar}
                    xstyle={
                      message.from === 'assistant'
                        ? [styles.avatar, styles.avatarAssistant]
                        : [styles.avatar, styles.avatarUser]
                    }
                  />
                  <MessageContent
                    variant={message.from === 'user' ? 'contained' : 'flat'}
                    xstyle={[
                      styles.messageBubble,
                      message.from === 'assistant'
                        ? styles.bubbleAssistant
                        : styles.bubbleUser,
                    ]}
                  >
                    {message.version.content}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Input area */}
          <div {...stylex.props(styles.inputArea)}>
            <Suggestions xstyle={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={busy}
                  suggestion={suggestion}
                  xstyle={styles.suggestion}
                />
              ))}
            </Suggestions>

            <form onSubmit={handleSubmit} {...stylex.props(styles.promptForm)}>
              <InputGroup xstyle={styles.promptGroup}>
                <InputGroupTextarea
                  name="message"
                  onChange={(event) => setText(event.target.value)}
                  onCompositionStart={() => {
                    composingRef.current = true;
                  }}
                  onCompositionEnd={() => {
                    composingRef.current = false;
                  }}
                  onKeyDown={handleKeyDown}
                  value={text}
                  aria-label={copy.messageLabel}
                  placeholder={copy.placeholder}
                  xstyle={styles.promptTextarea}
                />
                <div
                  data-align="block-end"
                  {...stylex.props(styles.promptFooter)}
                >
                  <InputGroupButton
                    type="submit"
                    aria-label="Submit"
                    disabled={!text.trim() || busy}
                    variant="ghost"
                    size="icon-sm"
                    xstyle={styles.submit}
                  >
                    {status === 'submitted' ? (
                      <PiSpinner
                        aria-hidden="true"
                        {...stylex.props(styles.icon, styles.spin)}
                      />
                    ) : status === 'streaming' ? (
                      <PiSquare
                        aria-hidden="true"
                        {...stylex.props(styles.icon)}
                      />
                    ) : (
                      <PiPaperPlaneRight
                        aria-hidden="true"
                        {...stylex.props(styles.icon)}
                      />
                    )}
                  </InputGroupButton>
                </div>
              </InputGroup>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
