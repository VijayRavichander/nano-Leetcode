"use client";

import { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCurrentSlug } from "@/lib/store/codeStore";

const getNotesKey = (slug: string) => `litecode:notes:${slug}`;

const NotesPane = () => {
  const slug = useCurrentSlug();
  const [content, setContentState] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (!slug || typeof window === "undefined") {
      setContentState("");
      return;
    }
    try {
      setContentState(localStorage.getItem(getNotesKey(slug)) ?? "");
    } catch {
      setContentState("");
    }
  }, [slug]);

  const setContent = useCallback(
    (value: string) => {
      setContentState(value);
      if (slug) {
        try {
          localStorage.setItem(getNotesKey(slug), value);
        } catch {
          /* quota */
        }
      }
    },
    [slug]
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--app-border)] px-3.5 py-1.5">
        <button
          type="button"
          onClick={() => setMode("write")}
          className={`text-[11px] font-medium transition-colors ${
            mode === "write"
              ? "text-[var(--app-text)] underline underline-offset-4"
              : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`text-[11px] font-medium transition-colors ${
            mode === "preview"
              ? "text-[var(--app-text)] underline underline-offset-4"
              : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {mode === "write" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here... (supports Markdown)"
            spellCheck={false}
            className="h-full w-full resize-none border-none bg-[var(--app-panel)] px-4 py-3 font-mono text-[13px] leading-relaxed text-[var(--app-text)] placeholder:text-[var(--app-muted)]/60 focus:outline-none"
          />
        ) : (
          <div className="editorial-markdown h-full overflow-auto px-4 py-3 text-sm leading-relaxed text-[var(--app-text)]/88">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-[var(--app-muted)]">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NotesPane;
