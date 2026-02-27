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
    <section className="min-h-screen bg-[#0f1115] text-zinc-100">
      <header className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 md:px-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Problem Workspace
        </div>

        <div className="flex items-center gap-1.5">
          {MODES.map((mode) => (
            <Button
              key={mode}
              type="button"
              onClick={() => setTab(mode)}
              className={`h-7 rounded-md border px-2.5 text-[11px] font-medium ${
                tab === mode
                  ? "border-white/60 bg-white text-black hover:bg-white/90"
                  : "border-white/10 bg-transparent text-zinc-300 hover:bg-white/10"
              }`}
            >
              {modeLabel[mode]}
            </Button>
          ))}
          <Button
            type="button"
            onClick={resetLayout}
            className="hidden h-7 rounded-md border border-white/10 bg-transparent px-2.5 text-[11px] font-medium text-zinc-300 hover:bg-white/10 md:inline-flex"
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
