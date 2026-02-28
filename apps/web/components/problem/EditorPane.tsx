"use client";

import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  useCodeStore,
  useCurrentCode,
  useCurrentSlug,
  useLangStore,
} from "@/lib/store/codeStore";
import { useExecutionStore } from "@/lib/store/executionStore";
import { resolveDefaultCode } from "@/lib/problem/session";
import type { ProblemDetail } from "@/lib/types/problem";
import { useTheme } from "next-themes";
import { registerLiteCodeMonacoThemes } from "@/lib/monaco-theme";

interface EditorPaneProps {
  problem: ProblemDetail;
}

const EditorPane = ({ problem }: EditorPaneProps) => {
  const currentCode = useCurrentCode();
  const currentSlug = useCurrentSlug();
  const language = useLangStore((state) => state.lang);
  const { resolvedTheme } = useTheme();

  const setCodeForSlug = useCodeStore((state) => state.setCodeForSlug);
  const resetCodeForSlug = useCodeStore((state) => state.resetCodeForSlug);

  const clearTestCaseStatus = useExecutionStore((state) => state.clearTestCaseStatus);

  const handleReset = () => {
    if (!currentSlug) {
      return;
    }

    const defaultCode = resolveDefaultCode(problem.functionCode, language);
    resetCodeForSlug(currentSlug, defaultCode);
    clearTestCaseStatus(currentSlug);
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-11 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-chrome)] px-3.5">
        <h2 className="text-sm font-medium text-[var(--app-muted)]">
          Editor
        </h2>
        <Button
          type="button"
          onClick={handleReset}
          className="app-text-action app-text-action-muted h-auto px-0 py-0 text-[11px] shadow-none"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </header>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          beforeMount={registerLiteCodeMonacoThemes}
          theme={resolvedTheme === "dark" ? "litecode-dark" : "litecode-light"}
          value={currentCode}
          onChange={(value) => {
            if (!currentSlug || value === undefined) {
              return;
            }

            setCodeForSlug(currentSlug, value);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  );
};

export default EditorPane;
