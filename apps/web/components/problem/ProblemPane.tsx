"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProblemDetail } from "@/lib/types/problem";

interface ProblemPaneProps {
  problem: ProblemDetail;
}

const ProblemPane = ({ problem }: ProblemPaneProps) => {
  const [activeTab, setActiveTab] = useState<"problem" | "editorial">("problem");

  useEffect(() => {
    setActiveTab("problem");
  }, [problem.id]);

  return (
    <section className="flex h-full flex-col overflow-y-auto px-4 py-3">
      <header className="border-b border-[var(--app-border)] pb-3">
        <h1 className="text-lg font-semibold leading-6 text-[var(--app-text)]">{problem.title}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              problem.difficulty === "Easy"
                ? "app-status-success"
                : problem.difficulty === "Medium"
                  ? "app-status-warning"
                  : "app-status-danger"
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.tags.map((tag) => (
            <span key={tag} className="app-chip rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="flex gap-3 border-b border-[var(--app-border)] py-2">
        <button
          type="button"
          onClick={() => setActiveTab("problem")}
          className={`px-0 py-0 text-[10px] font-medium ${
            activeTab === "problem"
              ? "app-text-action text-[var(--app-text)] underline"
              : "app-text-action app-text-action-muted"
          }`}
        >
          Problem
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("editorial")}
          className={`px-0 py-0 text-[10px] font-medium ${
            activeTab === "editorial"
              ? "app-text-action text-[var(--app-text)] underline"
              : "app-text-action app-text-action-muted"
          }`}
        >
          Editorial
        </button>
      </div>

      <div className="space-y-5 py-3 text-sm leading-6 text-[var(--app-muted)]">
        {activeTab === "problem" ? (
          <>
            <article className="whitespace-pre-wrap text-[var(--app-text)]/88">
              {problem.description}
            </article>

            <div>
              <h2 className="mb-2 text-sm font-medium text-[var(--app-text)]">
                Examples
              </h2>
              <div className="space-y-2.5">
                {problem.visibleTestCases.map((testCase, index) => (
                  <div
                    key={`${index}-${testCase.input}-${testCase.output}`}
                    className="rounded-lg border border-[var(--app-border)] bg-[var(--app-panel-muted)] p-3 font-mono text-[11px] leading-5 text-[var(--app-text)]/88"
                  >
                    <div>
                      <span className="text-[var(--app-muted)]">Input:</span> {testCase.input}
                    </div>
                    <div className="mt-1">
                      <span className="text-[var(--app-muted)]">Output:</span> {testCase.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-medium text-[var(--app-text)]">
                Constraints
              </h2>
              <ul className="list-inside list-disc space-y-1 leading-5 text-[var(--app-muted)]">
                {problem.constraints.map((constraint, index) => (
                  <li key={`${constraint}-${index}`}>{constraint}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="editorial-markdown text-[var(--app-text)]/88">
            {problem.editorial.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.editorial}
              </ReactMarkdown>
            ) : (
              <p className="text-[var(--app-muted)]">Editorial not available yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProblemPane;
