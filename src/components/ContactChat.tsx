"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  version: {
    id: string;
    content: string;
  };
  avatar: string;
  name: string;
};

const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: "assistant",
    version: {
      id: nanoid(),
      content: "Hi! How can we help you today?",
    },
    avatar: "/favicon.svg",
    name: "BDK Inc",
  },
];

const suggestions = [
  "How can I get a quote for IT services?",
  "I need help with network infrastructure",
  "What managed IT services do you offer?",
  "Tell me about your cloud services",
];

const mockResponses = [
  "Thanks for reaching out! Our team will respond shortly. You can also call us at (800) 309-0004 for immediate assistance.",
  "Great question! We'd love to help you with that. One of our experts will get back to you soon, or feel free to call (800) 309-0004.",
  "Thank you for your interest! We're here to help. Our team will be in touch shortly, or you can reach us directly at (800) 309-0004.",
];

export default function ContactChat() {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus("streaming");

      const words = content.split(" ");
      let currentContent = "";

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? " " : "") + words[i];

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

      setStatus("ready");
    },
    []
  );

  const addUserMessage = useCallback(
    (content: string) => {
      const userMessage: MessageType = {
        key: `user-${Date.now()}`,
        from: "user",
        version: {
          id: `user-${Date.now()}`,
          content,
        },
        avatar: "https://github.com/shadcn.png",
        name: "You",
      };

      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const assistantMessageId = `assistant-${Date.now()}`;
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const assistantMessage: MessageType = {
          key: `assistant-${Date.now()}`,
          from: "assistant",
          version: {
            id: assistantMessageId,
            content: "",
          },
          avatar: "/favicon.svg",
          name: "BDK Inc",
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

    setStatus("submitted");
    addUserMessage(message.text || "");
    setText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus("submitted");
    addUserMessage(suggestion);
  };

  return (
    <div className="relative flex h-[500px] flex-col overflow-hidden glass rounded-xl">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message from={message.from} key={message.key}>
              <div>
                <MessageContent>
                  <Response>{message.version.content}</Response>
                </MessageContent>
              </div>
              <MessageAvatar name={message.name} src={message.avatar} />
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 p-4 border-t border-input">
        {messages.length === 1 && (
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        )}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(event) => setText(event.target.value)}
              value={text}
              placeholder="Type your message..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              disabled={!text.trim() || status === "streaming"}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
