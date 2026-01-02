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

import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { PiShieldCheck, PiPulse, PiSparkle } from 'react-icons/pi';

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

export default function ContactChat({ initialSuggestions }: ContactChatProps) {
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
    const hasText = Boolean(message.text);

    if (!hasText) return;

    setStatus('submitted');
    addUserMessage(message.text || '');
    setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus('submitted');
    addUserMessage(suggestion);
  };

  return (
    <section aria-label="BDKinc Strategic Assistant" className="relative">
      {/* Outer shell: premium glass appliance */}
      <div className="border-primary/20 bg-background/35 relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl">
        {/* Decorative corner glow + scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="bg-brand-primary/20 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-[90px]" />
          <div className="bg-brand-secondary/20 absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-[90px]" />
        </div>
        <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.035]" />

        {/* Header bar */}
        <div className="border-primary/15 bg-background/30 relative z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="border-primary/20 bg-primary/10 relative flex h-9 w-9 items-center justify-center rounded-xl border">
              <PiSparkle className="text-brand-primary h-4 w-4" />
              <span className="ring-background/60 absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2" />
            </div>
            <div className="leading-tight">
              <div className="text-foreground text-sm font-semibold">
                BDKinc Strategic Assistant
              </div>
              <div className="text-muted-foreground text-xs">
                Secure intake • Engineer-routed • Response within 1 business day
              </div>
            </div>
          </div>

          <div className="text-muted-foreground hidden items-center gap-3 text-xs sm:flex">
            <div className="border-primary/15 bg-background/20 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <PiShieldCheck className="text-brand-primary h-4 w-4" />
              <span>Encrypted channel</span>
            </div>
            <div className="border-primary/15 bg-background/20 flex items-center gap-2 rounded-full border px-3 py-1.5">
              <PiPulse className="h-4 w-4 text-emerald-500" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="relative z-10 flex h-[600px] flex-col">
          <Conversation>
            <ConversationContent className="p-6">
              {messages.map((message) => (
                <Message from={message.from} key={message.key} className="mb-6">
                  <MessageAvatar
                    name={message.name}
                    src={message.avatar}
                    className="border-primary/15 bg-background/60 h-8 w-8 border shadow-sm"
                  />
                  <div className="max-w-[85%]">
                    <MessageContent className="border-primary/10 bg-card/70 text-foreground/90 rounded-2xl border px-5 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-md">
                      {message.version.content}
                    </MessageContent>
                  </div>
                </Message>
              ))}
            </ConversationContent>

            <ConversationScrollButton />
          </Conversation>

          {/* Input + suggestions dock */}
          <div className="border-primary/15 bg-background/35 border-t p-4 backdrop-blur-xl">
            <Suggestions className="mb-4">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                  className="border-primary/10 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground rounded-full border px-4 py-2 text-xs font-medium transition-all"
                />
              ))}
            </Suggestions>

            <PromptInput
              onSubmit={handleSubmit}
              className="border-primary/20 bg-background/40 focus-within:ring-primary/20 overflow-hidden rounded-xl border shadow-sm transition-all focus-within:ring-2"
            >
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                  placeholder="Describe your environment, scope, and timeline…"
                  className="max-h-[200px] min-h-[54px] bg-transparent px-4 py-3 text-sm focus:outline-none"
                />
              </PromptInputBody>

              <PromptInputFooter className="px-3 pb-3">
                <PromptInputTools />
                <PromptInputSubmit
                  disabled={!text.trim() || status === 'streaming'}
                  status={status}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                />
              </PromptInputFooter>
            </PromptInput>

            <p className="text-muted-foreground mt-3 text-xs">
              Tip: Include compliance requirements (SOC 2/HIPAA), current
              vendors, and desired SLA.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
