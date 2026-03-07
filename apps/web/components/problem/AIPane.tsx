"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AI_MODEL_OPTIONS,
  DEFAULT_AI_MODEL_ID,
  isAIModelId,
} from "@/lib/ai/models";
import { useCurrentCode, useLangStore } from "@/lib/store/codeStore";
import { useAIChatStore } from "@/lib/store/aiChatStore";
import type { ProblemDetail } from "@/lib/types/problem";

interface AIPaneProps {
  problem: ProblemDetail;
}

const BOTTOM_THRESHOLD_PX = 96;

const getDistanceFromBottom = (element: HTMLDivElement) => {
  return element.scrollHeight - element.scrollTop - element.clientHeight;
};

const AIPane = ({ problem }: AIPaneProps) => {
  const currentCode = useCurrentCode();
  const language = useLangStore((state) => state.lang);

  const setMessagesForProblem = useAIChatStore((state) => state.setMessagesForProblem);
  const setModelForProblem = useAIChatStore((state) => state.setModelForProblem);

  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);

  const problemKey = problem.id;

  const persistedChat = useMemo(
    () => useAIChatStore.getState().chatsByProblem[problemKey],
    [problemKey]
  );

  const initialMessages = persistedChat?.messages ?? [];
  const persistedModelId = isAIModelId(persistedChat?.modelId)
    ? persistedChat.modelId
    : DEFAULT_AI_MODEL_ID;

  const [selectedModelId, setSelectedModelId] = useState<string>(persistedModelId);

  const { messages, sendMessage, status, error } = useChat({
    id: `problem-ai:${problemKey}`,
    messages: initialMessages,
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const isGenerating = status === "submitted" || status === "streaming";

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  const syncScrollState = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    setIsNearBottom(getDistanceFromBottom(container) <= BOTTOM_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    setSelectedModelId(persistedModelId);
    setInput("");
    setIsNearBottom(true);
  }, [persistedModelId, problemKey]);

  useEffect(() => {
    setMessagesForProblem(problemKey, messages);
  }, [messages, problemKey, setMessagesForProblem]);

  useEffect(() => {
    setModelForProblem(problemKey, selectedModelId);
  }, [problemKey, selectedModelId, setModelForProblem]);

  useEffect(() => {
    syncScrollState();

    if (isNearBottom) {
      scrollToBottom("auto");
    }
  }, [isNearBottom, messages, scrollToBottom, status, syncScrollState]);

  const submitMessage = useCallback(async () => {
    const nextInput = input.trim();

    if (!nextInput || isGenerating) {
      return;
    }

    await sendMessage(
      {
        text: nextInput,
      },
      {
        body: {
          modelId: selectedModelId,
          context: {
            title: problem.title,
            difficulty: problem.difficulty,
            tags: problem.tags,
            description: problem.description,
            language,
            code: currentCode,
          },
        },
      }
    );

    setInput("");
  }, [
    currentCode,
    input,
    isGenerating,
    language,
    problem.description,
    problem.difficulty,
    problem.tags,
    problem.title,
    selectedModelId,
    sendMessage,
  ]);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--app-panel)]">
      <header className="flex h-11 items-center border-b border-[var(--app-editor-border)] bg-[var(--app-chrome)] px-3.5">
        <h2 className="text-sm font-medium text-[var(--app-muted)]">AI Assistant</h2>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={syncScrollState}
          className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto px-4 py-3"
        >
          {messages.length === 0 ? (
            <div className="app-empty-state flex min-h-28 items-center justify-center rounded-lg px-3 py-6 text-sm">
              Ask for hints, complexity analysis, or debugging help.
            </div>
          ) : (
            messages.map((message) => {
              const messageText = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")
                .trim();

              if (!messageText) {
                return null;
              }

              const isUser = message.role === "user";

              return (
                <article
                  key={message.id}
                  className={`max-w-[92%] rounded-xl border px-3 py-2 text-sm leading-6 ${
                    isUser
                      ? "ml-auto border-[var(--app-accent)]/25 bg-[var(--app-accent-soft)] text-[var(--app-text)]"
                      : "mr-auto border-[var(--app-border)] bg-[var(--app-panel-muted)] text-[var(--app-text)]"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{messageText}</p>
                  ) : (
                    <div className="editorial-markdown text-[var(--app-text)]/88">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {messageText}
                      </ReactMarkdown>
                    </div>
                  )}
                </article>
              );
            })
          )}

          {isGenerating ? (
            <div className="mr-auto flex max-w-[92%] items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-3 py-2 text-xs text-[var(--app-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Streaming response...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-[var(--app-danger-text)]/35 bg-[var(--app-danger-bg)] px-3 py-2 text-xs text-[var(--app-danger-text)]">
              {error.message || "Something went wrong while generating the response."}
            </div>
          ) : null}
        </div>

        {!isNearBottom && messages.length > 0 ? (
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-4 right-4 rounded-full border border-[var(--app-border)] bg-[var(--app-panel)] p-2 text-[var(--app-muted)] shadow-[var(--app-shadow)] transition-colors hover:text-[var(--app-text)]"
            aria-label="Scroll to latest message"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submitMessage();
        }}
        className="border-t border-[var(--app-border)] px-3 py-2"
      >
        <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-panel)]">
          <div className="flex items-center gap-2 border-b border-[var(--app-border)] px-2 py-1.5">
            <span className="text-[10px] font-semibold tracking-wide text-[var(--app-muted)]">
              Model
            </span>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger className="h-7 w-[170px] border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-2 text-[11px] text-[var(--app-text)] shadow-none focus:ring-0">
                <SelectValue placeholder="Choose model" />
              </SelectTrigger>
              <SelectContent className="border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)]">
                {AI_MODEL_OPTIONS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submitMessage();
              }
            }}
            rows={3}
            placeholder="Message the assistant..."
            className="h-20 w-full resize-none border-none bg-[var(--app-panel)] px-3 py-2 text-sm text-[var(--app-text)] placeholder:text-[var(--app-muted)]/65 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-[var(--app-border)] px-2 py-1.5">
            <span className="text-[10px] text-[var(--app-muted)]">
              Press Enter to send, Shift+Enter for newline
            </span>
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="app-text-action rounded-md border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-2.5 py-1 text-[11px] font-medium disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isGenerating ? "Streaming..." : "Send"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AIPane;
