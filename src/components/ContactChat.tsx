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
  'Transmission received. A Strategic Architect has been notified and will analyze your inquiry. Expect a response within the designated protocol window.',
  'Inquiry logged. Our engineering team is reviewing your requirements for feasibility and strategic alignment. Stand by for initial assessment.',
  'Data packet received. We are routing your request to the appropriate technical lead. You will receive a diagnostic response shortly.',
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
      'How can I get a quote for IT services?',
      'I need help with network infrastructure',
      'What managed IT services do you offer?',
      'Tell me about your cloud services',
    ]
  );

  const [messages, setMessages] = useState<MessageType[]>(() => [
    {
      key: nanoid(),
      from: 'assistant',
      version: {
        id: nanoid(),
        content: 'Diagnostic Interface Initialized. Please state your inquiry for strategic analysis.',
      },
      avatar: '/favicon.svg',
      name: 'BDK Architect',
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
          setTimeout(resolve, Math.random() * 100 + 50)
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
        avatar: 'https://github.com/shadcn.png',
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
          name: 'BDK Architect',
          isStreaming: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        streamResponse(assistantMessageId, randomResponse);
      }, 500);
    },
    [streamResponse]
  );

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    setStatus('submitted');
    addUserMessage(message.text || '');
    setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus('submitted');
    addUserMessage(suggestion);
  };

  return (
    <div className="bg-background border-primary/20 rounded-none border p-4 shadow-2xl relative">
      <div className="absolute inset-0 scanlines opacity-[0.02] pointer-events-none" />
      <div>
        <div className="relative flex h-[500px] flex-col overflow-hidden">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <Message from={message.from} key={message.key}>
                  <div className="max-w-[80%]">
                    <MessageContent className="relative max-w-none transition-all duration-200 ease-out border border-primary/10 rounded-none bg-card/40 backdrop-blur-sm shadow-sm group-hover:border-primary/30 transition-all duration-300">
                      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {message.version.content}
                      </div>
                    </MessageContent>
                  </div>
                  <MessageAvatar name={message.name} src={message.avatar} className="border border-primary/20 rounded-none bg-primary/5" />
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="border-primary/10 grid shrink-0 gap-4 border-t p-4 bg-muted/5">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                  className="rounded-none border-primary/20 bg-background/50 hover:bg-primary/10 hover:border-primary/40 font-mono text-[10px] uppercase tracking-wider transition-all duration-300"
                />
              ))}
            </Suggestions>
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                  placeholder="&gt; INPUT_INQUIRY_PARAMS..."
                  className="font-mono text-sm border-none bg-transparent focus:ring-0"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit
                  disabled={!text.trim() || status === 'streaming'}
                  status={status}
                  className="rounded-none shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
