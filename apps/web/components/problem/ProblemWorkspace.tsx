"use client";

import { Button } from "@/components/ui/button";
import SubmissionTab from "@/components/submission/SubmissionTab";
import LeaderBoardTab from "@/components/LeaderBoard";
import ProblemPane from "@/components/problem/ProblemPane";
import EditorPane from "@/components/problem/EditorPane";
import ResultPane from "@/components/problem/ResultPane";
import WorkspaceSplitLayout from "@/components/problem/WorkspaceSplitLayout";
import { useWorkspaceLayout } from "@/lib/hooks/useWorkspaceLayout";
import { useProblemUIStore } from "@/lib/store/uiStore";
import type { ProblemDetail } from "@/lib/types/problem";
import type { WorkspaceMode } from "@/lib/types/workspace";

interface ProblemWorkspaceProps {
  problem: ProblemDetail;
}

const MODES: WorkspaceMode[] = ["problem", "submissions", "leaderboard"];

const modeLabel: Record<WorkspaceMode, string> = {
  problem: "Workspace",
  submissions: "Submissions",
  leaderboard: "Leaderboard",
};

const ProblemWorkspace = ({ problem }: ProblemWorkspaceProps) => {
  const tab = useProblemUIStore((state) => state.tab);
  const setTab = useProblemUIStore((state) => state.setTab);

  const {
    leftPaneRatio,
    topRightRatio,
    setLeftPaneRatio,
    setTopRightRatio,
    resetLayout,
  } = useWorkspaceLayout();

  return (
    <section className="app-theme min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
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

      <div className="h-[calc(100dvh-10.5rem)] min-h-[34rem]">
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
