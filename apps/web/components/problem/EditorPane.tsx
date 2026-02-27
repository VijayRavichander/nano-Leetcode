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

interface EditorPaneProps {
  problem: ProblemDetail;
}

const EditorPane = ({ problem }: EditorPaneProps) => {
  const currentCode = useCurrentCode();
  const currentSlug = useCurrentSlug();
  const language = useLangStore((state) => state.lang);

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
      <header className="flex h-10 items-center justify-between border-b border-white/10 px-3.5">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Editor
        </h2>
        <Button
          type="button"
          onClick={handleReset}
          className="h-7 rounded-md border border-white/10 bg-transparent px-2.5 text-[11px] font-medium text-zinc-300 hover:bg-white/10"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </header>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
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
