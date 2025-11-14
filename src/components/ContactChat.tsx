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

import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useState } from "react";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  version: {
    id: string;
    content: string;
  };
  avatar: string;
  name: string;
  isStreaming?: boolean;
};

interface ContactChatProps {}

const defaultSuggestions = [
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

export default function ContactChat({}: ContactChatProps) {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const [suggestedQuestion, setSuggestedQuestion] = useState<string | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);

  const [messages, setMessages] = useState<MessageType[]>(() => [
    {
      key: nanoid(),
      from: "assistant",
      version: {
        id: nanoid(),
        content: "Hi! How can we help you today?",
      },
      avatar: "/favicon.svg",
      name: "BDKinc",
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Prefer explicit `from` query parameter if present
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");

      if (from) {
        // Map known `from` values to tailored suggestion chips
        if (from === "services") {
          setSuggestions([
            "How can I get a quote for your IT services?",
            ...defaultSuggestions.slice(1),
          ]);
          return;
        }

        if (from === "about") {
          setSuggestions([
            "How can BDKinc support our IT strategy long-term?",
            ...defaultSuggestions.slice(1),
          ]);
          return;
        }

        if (from === "blog") {
          setSuggestions([
            "Can you help us apply these IT best practices?",
            ...defaultSuggestions.slice(1),
          ]);
          return;
        }

        if (from === "blog-post") {
          setSuggestions([
            "Can we implement the recommendations from this article?",
            ...defaultSuggestions.slice(1),
          ]);
          return;
        }

        // Service slugs (e.g. cloud-hosting, managed-it, etc.)
        const humanReadable = from
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        const question = `How can I get a quote for ${humanReadable}?`;
        setSuggestedQuestion(question);
        setSuggestions([question, ...defaultSuggestions.slice(1)]);
        return;
      }

      // Fallback: derive from document.referrer when no `from` param is set
      if (typeof document === "undefined") return;
      const referrer = document.referrer;
      if (!referrer) return;

      const url = new URL(referrer);
      const path = url.pathname;

      if (path.startsWith("/services/")) {
        const slug = path.replace("/services/", "").replace(/\/$/, "");

        if (slug) {
          const humanReadable = slug
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

          setSuggestedQuestion(
            `How can I get a quote for ${humanReadable}?`
          );
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

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

      setMessages((prev) =>
        prev.map((msg) =>
          msg.version.id === messageId ? { ...msg, isStreaming: false } : msg
        )
      );

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
          name: "BDKinc",
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

    setStatus("submitted");
    addUserMessage(message.text || "");
    setText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus("submitted");
    addUserMessage(suggestion);
  };

  return (
    <div className="bg-background rounded-xl p-4 border border-input shadow-sm">
      <div>
        <div className="relative flex h-[500px] flex-col overflow-hidden">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <Message from={message.from} key={message.key}>
                  <div className="max-w-[80%]">
                    <MessageContent
                      className="relative transition-all duration-200 ease-out max-w-none"
                    >
                      <div className="whitespace-pre-wrap">
                        {message.version.content}
                      </div>
                    </MessageContent>
                  </div>
                  <MessageAvatar name={message.name} src={message.avatar} />
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="grid shrink-0 gap-4 p-4 border-t border-input">
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
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
      </div>
    </div>
  );
}
