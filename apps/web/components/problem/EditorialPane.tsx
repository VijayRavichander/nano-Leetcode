"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProblemDetail } from "@/lib/types/problem";

interface EditorialPaneProps {
  problem: ProblemDetail;
}

const EditorialPane = ({ problem }: EditorialPaneProps) => {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain px-4 py-3">
      <header className="border-b border-[var(--app-border)] pb-3">
        <h1 className="text-lg font-semibold leading-6 text-[var(--app-text)]">
          {problem.title}
        </h1>
        <p className="mt-1 text-xs text-[var(--app-muted)]">Editorial</p>
      </header>

      <div className="py-3 text-sm leading-6 text-[var(--app-muted)]">
        <div className="editorial-markdown text-[var(--app-text)]/88">
          {problem.editorial.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.editorial}
            </ReactMarkdown>
          ) : (
            <p className="text-[var(--app-muted)]">Editorial not available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialPane;
