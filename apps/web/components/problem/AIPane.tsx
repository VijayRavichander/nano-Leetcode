"use client";

import { useChat } from "@ai-sdk/react";
import { SendHorizontal, ArrowDown, Loader2, LogIn, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useAppSession } from "@/lib/auth/client-session";
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

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "class",
  "new",
  "try",
  "catch",
  "finally",
  "import",
  "from",
  "export",
  "default",
  "public",
  "private",
  "protected",
  "static",
  "void",
  "int",
  "float",
  "double",
  "string",
  "boolean",
  "true",
  "false",
  "null",
  "undefined",
  "None",
  "def",
  "async",
  "await",
]);

const highlightCode = (source: string) => {
  const lines = source.split("\n");

  return lines.map((line, lineIndex) => {
    const tokens = line.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$|#.*$|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|./gmu) ?? [line];

    return (
      <Fragment key={`line-${lineIndex}`}>
        {tokens.map((token, index) => {
          let className = "text-[var(--app-text)]";

          if (/^(\/\/|#)/.test(token)) {
            className = "text-[#6a9955]";
          } else if (/^("|'|`).*("|'|`)$/u.test(token)) {
            className = "text-[#ce9178]";
          } else if (/^\d/u.test(token)) {
            className = "text-[#b5cea8]";
          } else if (KEYWORDS.has(token)) {
            className = "text-[#569cd6]";
          }

          return (
            <span key={`token-${lineIndex}-${index}`} className={className}>
              {token}
            </span>
          );
        })}
        {lineIndex < lines.length - 1 ? "\n" : null}
      </Fragment>
    );
  });
};

const AIPane = ({ problem }: AIPaneProps) => {
  const router = useRouter();
  const session = useAppSession();
  const currentCode = useCurrentCode();
  const language = useLangStore((state) => state.lang);

  const chatsByProblem = useAIChatStore((state) => state.chatsByProblem);
  const createSession = useAIChatStore((state) => state.createSession);
  const setActiveSession = useAIChatStore((state) => state.setActiveSession);
  const setMessagesForSession = useAIChatStore(
    (state) => state.setMessagesForSession
  );
  const setModelForSession = useAIChatStore((state) => state.setModelForSession);

  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);

  const problemKey = problem.id;
  const canUseAI = Boolean(session.data);
  const showLoginGate = !session.isPending && !session.data;

  const problemChat = canUseAI ? chatsByProblem[problemKey] : undefined;
  const activeSession = useMemo(() => {
    if (!problemChat || !problemChat.activeSessionId) {
      return undefined;
    }

    return problemChat.sessions.find(
      (chatSession) => chatSession.id === problemChat.activeSessionId
    );
  }, [problemChat]);

  const activeSessionId = activeSession?.id;

  const [selectedModelId, setSelectedModelId] = useState<string>(
    activeSession && isAIModelId(activeSession.modelId)
      ? activeSession.modelId
      : DEFAULT_AI_MODEL_ID
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `problem-ai:${problemKey}:${session.data?.session.userId ?? "guest"}:${activeSessionId ?? "session"}`,
    messages: activeSession?.messages ?? [],
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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
    if (!canUseAI || problemChat?.sessions.length) {
      return;
    }

    createSession(problemKey);
  }, [canUseAI, createSession, problemChat?.sessions.length, problemKey]);

  useEffect(() => {
    setSelectedModelId(
      activeSession && isAIModelId(activeSession.modelId)
        ? activeSession.modelId
        : DEFAULT_AI_MODEL_ID
    );
    setInput("");
    setIsNearBottom(true);

    if (activeSessionId) {
      inputRef.current?.focus();
    }
  }, [activeSession, activeSessionId, problemKey]);

  useEffect(() => {
    if (!canUseAI || !activeSessionId) {
      return;
    }

    setMessagesForSession(problemKey, activeSessionId, messages);
  }, [
    activeSessionId,
    canUseAI,
    messages,
    problemKey,
    setMessagesForSession,
  ]);

  useEffect(() => {
    if (!canUseAI || !activeSessionId) {
      return;
    }

    setModelForSession(problemKey, activeSessionId, selectedModelId);
  }, [
    activeSessionId,
    canUseAI,
    problemKey,
    selectedModelId,
    setModelForSession,
  ]);

  useEffect(() => {
    syncScrollState();

    if (isNearBottom) {
      scrollToBottom("auto");
    }
  }, [isNearBottom, messages, scrollToBottom, status, syncScrollState]);

  const submitMessage = useCallback(async () => {
    const nextInput = input.trim();

    if (!canUseAI || !activeSessionId || !nextInput || isGenerating) {
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
    activeSessionId,
    canUseAI,
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
      <header className="flex h-11 items-center justify-between border-b border-[var(--app-editor-border)] bg-[var(--app-chrome)] px-3.5">
        <h2 className="text-sm font-medium text-[var(--app-muted)]">AI Assistant</h2>
        {!showLoginGate ? (
          <button
            type="button"
            onClick={() => {
              createSession(problemKey);
            }}
            className="app-text-action rounded-md border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-2 py-1 text-[11px]"
          >
            <Plus className="h-3.5 w-3.5" />
            New chat
          </button>
        ) : null}
      </header>

      {!showLoginGate && problemChat?.sessions.length ? (
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--app-border)] px-2 py-1.5">
          {problemChat.sessions.map((chatSession) => {
            const isActive = chatSession.id === activeSessionId;

            return (
              <button
                key={chatSession.id}
                type="button"
                onClick={() => {
                  setActiveSession(problemKey, chatSession.id);
                }}
                className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                  isActive
                    ? "border-[var(--app-accent)]/40 bg-[var(--app-accent-soft)] text-[var(--app-text)]"
                    : "border-[var(--app-border)] bg-[var(--app-panel-muted)] text-[var(--app-muted)] hover:text-[var(--app-text)]"
                }`}
              >
                {chatSession.title}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={syncScrollState}
          className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto px-4 py-3"
        >
          {messages.length === 0 ? (
            <div className="app-empty-state flex min-h-28 items-center justify-center rounded-lg px-3 py-6 text-center text-sm">
              {showLoginGate
                ? "Sign in to ask for hints, debugging help, and complexity guidance."
                : "Ask for hints, complexity analysis, or debugging help."}
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
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre({ children }) {
                            return <>{children}</>;
                          },
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");

                            if (match) {
                              return (
                                <pre className="rounded-xl border border-[var(--app-border)] bg-[#0f172a] p-3 text-xs leading-6 text-slate-100">
                                  <code className="whitespace-pre-wrap" {...props}>
                                    {highlightCode(String(children).replace(/\n$/, ""))}
                                  </code>
                                </pre>
                              );
                            }

                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {messageText}
                      </ReactMarkdown>
                    </div>
                  )}
                </article>
              );
            })
          )}

          {canUseAI && error ? (
            <div className="rounded-lg border border-[var(--app-danger-text)]/35 bg-[var(--app-danger-bg)] px-3 py-2 text-xs text-[var(--app-danger-text)]">
              {error.message || "Something went wrong while generating the response."}
            </div>
          ) : null}
        </div>

        {!showLoginGate && !isNearBottom && messages.length > 0 ? (
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
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
              disabled={!canUseAI || session.isPending}
            >
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
            ref={inputRef}
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
            disabled={!canUseAI || session.isPending}
            placeholder={
              showLoginGate ? "Sign in to message the assistant..." : "Message the assistant..."
            }
            className="h-20 w-full resize-none border-none bg-[var(--app-panel)] px-3 py-2 text-sm text-[var(--app-text)] placeholder:text-[var(--app-muted)]/65 focus:outline-none disabled:cursor-not-allowed disabled:text-[var(--app-muted)]"
          />

          <div className="flex items-center justify-between border-t border-[var(--app-border)] px-2 py-1.5">
            {showLoginGate ? (
              <>
                <span className="text-[10px] text-[var(--app-muted)]">
                  Sign in to unlock AI help for this problem.
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="app-text-action rounded-md border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-2.5 py-1 text-[11px] font-medium"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in
                </button>
              </>
            ) : (
              <>
                <span className="text-[10px] text-[var(--app-muted)]">
                  Press Enter to send, Shift+Enter for newline
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating || !canUseAI || !activeSessionId}
                  aria-label={
                    isGenerating ? "Assistant is streaming response" : "Send message"
                  }
                  className="app-text-action rounded-md border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-2.5 py-1 text-[11px] font-medium disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-3.5 w-3.5" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default AIPane;
