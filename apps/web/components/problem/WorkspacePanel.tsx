"use client";

import type { DragEvent } from "react";
import { type PanelId, type TabId, usePanelStore } from "@/lib/store/panelStore";
import { RotateCcw } from "lucide-react";
import PanelTabBar from "./PanelTabBar";
import ProblemPane from "./ProblemPane";
import EditorPane from "./EditorPane";
import ResultPane from "./ResultPane";
import NotesPane from "./NotesPane";
import {
  useCodeStore,
  useCurrentSlug,
  useLangStore,
} from "@/lib/store/codeStore";
import { useExecutionStore } from "@/lib/store/executionStore";
import { resolveDefaultCode } from "@/lib/problem/session";
import type { ProblemDetail } from "@/lib/types/problem";

interface WorkspacePanelProps {
  panelId: PanelId;
  problem: ProblemDetail;
}

interface DragTabPayload {
  tabId: TabId;
  fromPanel: PanelId;
}

const TAB_DRAG_MIME_TYPE = "application/x-litecode-tab";

const parseDragPayload = (event: DragEvent): DragTabPayload | null => {
  const payload = event.dataTransfer.getData(TAB_DRAG_MIME_TYPE);

  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as Partial<DragTabPayload>;

    if (!parsed.tabId || !parsed.fromPanel) {
      return null;
    }

    return {
      tabId: parsed.tabId,
      fromPanel: parsed.fromPanel,
    };
  } catch {
    return null;
  }
};

const EditorActions = ({ problem }: { problem: ProblemDetail }) => {
  const currentSlug = useCurrentSlug();
  const language = useLangStore((s) => s.lang);
  const resetCodeForSlug = useCodeStore((s) => s.resetCodeForSlug);
  const clearTestCaseStatus = useExecutionStore(
    (s) => s.clearTestCaseStatus
  );

  return (
    <button
      type="button"
      onClick={() => {
        if (!currentSlug) return;
        resetCodeForSlug(
          currentSlug,
          resolveDefaultCode(problem.functionCode, language)
        );
        clearTestCaseStatus(currentSlug);
      }}
      className="app-text-action app-text-action-muted flex items-center gap-1 px-0 py-0 text-[10px] shadow-none"
    >
      <RotateCcw className="h-3 w-3" />
      Reset
    </button>
  );
};

const WorkspacePanel = ({ panelId, problem }: WorkspacePanelProps) => {
  const tabs = usePanelStore((s) => s.layout[panelId]);
  const activeTab = usePanelStore((s) => s.activeTabs[panelId]);
  const moveTab = usePanelStore((s) => s.moveTab);

  if (tabs.length === 0) {
    return (
      <div
        onDragOver={(event) => {
          if (parseDragPayload(event)) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }
        }}
        onDrop={(event) => {
          const payload = parseDragPayload(event);

          if (!payload) {
            return;
          }

          event.preventDefault();
          moveTab(payload.tabId, payload.fromPanel, panelId, 0);
        }}
        className="flex h-full items-center justify-center bg-[var(--app-panel)] text-xs text-[var(--app-muted)]"
      >
        Drop a tab here
      </div>
    );
  }

  const extraControls =
    activeTab === "editor" ? <EditorActions problem={problem} /> : null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelTabBar panelId={panelId} extraControls={extraControls} />
      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "question" && <ProblemPane problem={problem} />}
        {activeTab === "editor" && <EditorPane />}
        {activeTab === "results" && <ResultPane problem={problem} />}
        {activeTab === "notes" && <NotesPane />}
      </div>
    </div>
  );
};

export default WorkspacePanel;
