"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SubmissionTab from "@/components/submission/SubmissionTab";
import LeaderBoardTab from "@/components/LeaderBoard";
import ProblemPane from "@/components/problem/ProblemPane";
import EditorPane from "@/components/problem/EditorPane";
import ResultPane from "@/components/problem/ResultPane";
import WorkspaceSplitLayout from "@/components/problem/WorkspaceSplitLayout";
import { useWorkspaceLayout } from "@/lib/hooks/useWorkspaceLayout";
import { initializeProblemSession } from "@/lib/problem/session";
import { useCodeStore, useLangStore } from "@/lib/store/codeStore";
import { useProblemUIStore } from "@/lib/store/uiStore";
import type { ProblemDetail } from "@/lib/types/problem";
import type { WorkspaceMode } from "@/lib/types/workspace";

interface ProblemWorkspaceProps {
  problem: ProblemDetail;
  problemSlug: string;
}

const MODES: WorkspaceMode[] = ["problem", "submissions", "leaderboard"];

const modeLabel: Record<WorkspaceMode, string> = {
  problem: "Workspace",
  submissions: "Submissions",
  leaderboard: "Leaderboard",
};

const ProblemWorkspace = ({ problem, problemSlug }: ProblemWorkspaceProps) => {
  const tab = useProblemUIStore((state) => state.tab);
  const setTab = useProblemUIStore((state) => state.setTab);
  const setProblemId = useProblemUIStore((state) => state.setProblemId);
  const language = useLangStore((state) => state.lang);
  const setCurrentSlug = useCodeStore((state) => state.setCurrentSlug);
  const ensureCodeForSlug = useCodeStore((state) => state.ensureCodeForSlug);

  const {
    leftPaneRatio,
    topRightRatio,
    setLeftPaneRatio,
    setTopRightRatio,
    resetLayout,
  } = useWorkspaceLayout();

  useEffect(() => {
    setTab("problem");
  }, [problemSlug, setTab]);

  useEffect(() => {
    initializeProblemSession({
      problem,
      slug: problemSlug,
      language,
      setProblemId,
      setCurrentSlug,
      ensureCodeForSlug,
    });
  }, [
    ensureCodeForSlug,
    language,
    problem,
    problemSlug,
    setCurrentSlug,
    setProblemId,
  ]);

  return (
    <section className="app-theme flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--app-panel)] text-[var(--app-text)]">
      <header className="app-toolbar flex items-center justify-between px-3 py-2 md:px-4">
        <div className="text-[0.72rem] font-medium text-[var(--app-muted)]">Problem workspace</div>

        <div className="flex items-center gap-3">
          {MODES.map((mode) => (
            <Button
              key={mode}
              type="button"
              onClick={() => setTab(mode)}
              className={`h-auto px-0 py-0 text-[10px] font-medium shadow-none ${
                tab === mode
                  ? "app-text-action text-[var(--app-text)] underline"
                  : "app-text-action app-text-action-muted"
              }`}
            >
              {modeLabel[mode]}
            </Button>
          ))}
          <Button
            type="button"
            onClick={resetLayout}
            className="app-text-action app-text-action-muted hidden px-0 py-0 text-[10px] md:inline-flex"
          >
            Reset Layout
          </Button>
        </div>
      </header>

      <div className="flex h-full min-h-0 flex-1 bg-[var(--app-panel)]">
        {tab === "problem" ? (
          <WorkspaceSplitLayout
            layout={{ leftPaneRatio, topRightRatio }}
            setLeftPaneRatio={setLeftPaneRatio}
            setTopRightRatio={setTopRightRatio}
            questionPane={<ProblemPane problem={problem} />}
            editorPane={<EditorPane problem={problem} />}
            resultPane={<ResultPane problem={problem} />}
          />
        ) : null}

        {tab === "submissions" ? (
          <SubmissionTab
            onBack={() => {
              setTab("problem");
            }}
          />
        ) : null}

        {tab === "leaderboard" ? (
          <LeaderBoardTab
            onBack={() => {
              setTab("problem");
            }}
          />
        ) : null}
      </div>
    </section>
  );
};

export default ProblemWorkspace;
