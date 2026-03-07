"use client";

import { useCallback, useEffect } from "react";
import SubmissionTab from "@/components/submission/SubmissionTab";
import ProblemPane from "@/components/problem/ProblemPane";
import EditorialPane from "@/components/problem/EditorialPane";
import EditorPane from "@/components/problem/EditorPane";
import ResultPane from "@/components/problem/ResultPane";
import NotesPane from "@/components/problem/NotesPane";
import AIPane from "@/components/problem/AIPane";
import WorkspacePanel from "@/components/problem/WorkspacePanel";
import WorkspaceSplitLayout from "@/components/problem/WorkspaceSplitLayout";
import { useWorkspaceLayout } from "@/lib/hooks/useWorkspaceLayout";
import { initializeProblemSession } from "@/lib/problem/session";
import { useCodeStore, useLangStore } from "@/lib/store/codeStore";
import { useProblemUIStore } from "@/lib/store/uiStore";
import type { TabId } from "@/lib/store/panelStore";
import type { ProblemDetail } from "@/lib/types/problem";

interface ProblemWorkspaceProps {
  problem: ProblemDetail;
  problemSlug: string;
}

const ProblemWorkspace = ({ problem, problemSlug }: ProblemWorkspaceProps) => {
  const setProblemId = useProblemUIStore((state) => state.setProblemId);
  const language = useLangStore((state) => state.lang);
  const setCurrentSlug = useCodeStore((state) => state.setCurrentSlug);
  const ensureCodeForSlug = useCodeStore((state) => state.ensureCodeForSlug);

  const {
    leftPaneRatio,
    topRightRatio,
    setLeftPaneRatio,
    setTopRightRatio,
  } = useWorkspaceLayout();

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

  const renderMobileContent = useCallback(
    (tabId: TabId) => {
      switch (tabId) {
        case "question":
          return <ProblemPane problem={problem} />;
        case "editorial":
          return <EditorialPane problem={problem} />;
        case "submissions":
          return <SubmissionTab />;
        case "ai":
          return <AIPane problem={problem} />;
        case "editor":
          return <EditorPane />;
        case "results":
          return <ResultPane problem={problem} />;
        case "notes":
          return <NotesPane />;
        default:
          return null;
      }
    },
    [problem]
  );

  return (
    <section className="app-theme flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--app-panel)] text-[var(--app-text)]">
      <div className="flex h-full min-h-0 flex-1 bg-[var(--app-panel)]">
        <WorkspaceSplitLayout
          layout={{ leftPaneRatio, topRightRatio }}
          setLeftPaneRatio={setLeftPaneRatio}
          setTopRightRatio={setTopRightRatio}
          leftPanel={<WorkspacePanel panelId="left" problem={problem} />}
          topRightPanel={<WorkspacePanel panelId="topRight" problem={problem} />}
          bottomRightPanel={<WorkspacePanel panelId="bottomRight" problem={problem} />}
          renderMobileContent={renderMobileContent}
        />
      </div>
    </section>
  );
};

export default ProblemWorkspace;
