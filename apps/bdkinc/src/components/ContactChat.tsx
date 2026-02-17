'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';

import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { cn } from '@/lib/utils';

import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PiSparkle } from 'react-icons/pi';

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

const mockResponses = [
  'Thank you for reaching out. A Senior Architect has been notified of your inquiry and will review your requirements shortly.',
  "We've received your message. Our engineering team is currently reviewing similar projects and will contact you within one business day.",
  "Thanks for the details. I've routed this to our technical leadership team. You can expect a follow-up email to schedule a consultation.",
];

interface ContactChatProps {
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

export default function ContactChat({ initialSuggestions }: ContactChatProps) {
  const hasStartedRef = useRef(false);
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');

  const [suggestions] = useState<string[]>(
    initialSuggestions || [
      'I need a quote for managed services',
      'We are looking to migrate to the cloud',
      'Help us with cybersecurity compliance',
      'Questions about IBM Power systems',
    ]
  );

  const [messages, setMessages] = useState<MessageType[]>(() => [
    {
      key: nanoid(),
      from: 'assistant',
      version: {
        id: nanoid(),
        content:
          'Hello—tell us what you’re building, what you’re replacing, and what “success” looks like. We’ll route this to the right engineer.',
      },
      avatar: '/favicon.svg',
      name: 'BDKinc',
    },
  ]);

  useEffect(() => {
    track('contact_chat_view', { component: 'ContactChat' });
  }, []);

  const ensureStarted = useCallback((source: 'typed' | 'suggestion') => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    track('contact_chat_started', { source });
  }, []);

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus('streaming');

      const words = content.split(' ');
      let currentContent = '';

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.version.id === messageId) {
              return {
                ...msg,
                version: { ...msg.version, content: currentContent },
              };
            }
            return msg;
          })
        );

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 50 + 30)
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.version.id === messageId ? { ...msg, isStreaming: false } : msg
        )
      );

      setStatus('ready');
    },
    []
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const userMessage: MessageType = {
        key: `user-${Date.now()}`,
        from: 'user',
        version: {
          id: `user-${Date.now()}`,
          content,
        },
        avatar: '',
        name: 'You',
      };

      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const assistantMessageId = `assistant-${Date.now()}`;
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const assistantMessage: MessageType = {
          key: `assistant-${Date.now()}`,
          from: 'assistant',
          version: {
            id: assistantMessageId,
            content: '',
          },
          avatar: '/favicon.svg',
          name: 'BDKinc',
          isStreaming: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        streamResponse(assistantMessageId, randomResponse);
      }, 600);
    },
    [streamResponse]
  );

  const handleSubmit = (message: PromptInputMessage) => {
    const rawText = message.text?.trim() ?? '';
    if (!rawText) return;

    ensureStarted('typed');
    track('contact_chat_message_sent', {
      method: 'typed',
      char_count: rawText.length,
    });

    setStatus('submitted');
    addUserMessage(rawText);
    setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    ensureStarted('suggestion');
    track('contact_chat_message_sent', {
      method: 'suggestion',
      char_count: suggestion.length,
    });

    setStatus('submitted');
    addUserMessage(suggestion);
  };

  return (
    <section
      aria-label="BDK Assistant"
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="glass relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-1 ring-white/5">
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />

        {/* Header bar */}
        <div className="bg-background/20 relative flex items-center justify-between border-b border-white/5 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <PiSparkle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-foreground text-sm font-medium">
                BDK Assistant
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-background/5 relative flex h-[600px] flex-col">
          <Conversation className="flex-1 overflow-y-auto">
            <ConversationContent className="space-y-6 p-6">
              {messages.map((message) => (
                <Message
                  from={message.from}
                  key={message.key}
                  className={cn(
                    'items-start gap-0',
                    message.from === 'assistant'
                      ? 'flex-row justify-start'
                      : 'flex-row justify-end'
                  )}
                >
                  <MessageAvatar
                    name={message.name}
                    src={message.avatar}
                    className={cn(
                      'h-8 w-8 shrink-0 rounded-full border border-white/10 shadow-sm',
                      message.from === 'assistant' ? 'mr-2' : 'order-last ml-2'
                    )}
                  />
                  <MessageContent
                    variant={message.from === 'user' ? 'contained' : 'flat'}
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-sm',
                      message.from === 'assistant'
                        ? 'bg-card/50 text-foreground border border-white/5'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {message.version.content}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Input area */}
          <div className="bg-background/10 border-t border-white/5 p-4 backdrop-blur-sm">
            <Suggestions className="mb-4">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                  className="text-muted-foreground hover:text-foreground border-border bg-muted/20 hover:bg-muted shrink-0 rounded-lg border px-4 py-2 text-xs whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing]"
                />
              ))}
            </Suggestions>

            <PromptInput
              onSubmit={handleSubmit}
              className="ring-offset-background focus-within:ring-primary/50 border-input bg-muted/50 relative overflow-hidden rounded-xl border transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing] focus-within:ring-2 [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:!ring-0"
            >
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                  aria-label="Message"
                  placeholder="How can we help… e.g., migrate ERP to cloud"
                  className="placeholder:text-muted-foreground/50 min-h-[50px] bg-transparent px-4 py-3 text-sm focus:outline-none"
                />
              </PromptInputBody>
              <PromptInputFooter className="flex justify-between px-3 pb-3">
                <PromptInputTools />
                <PromptInputSubmit
                  disabled={!text.trim() || status === 'streaming'}
                  status={status}
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    'h-8 w-8 rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform,width,gap,letter-spacing]',
                    'bg-primary/10 text-primary hover:bg-primary/20',
                    'disabled:text-muted-foreground disabled:bg-transparent'
                  )}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </section>
  );
}
