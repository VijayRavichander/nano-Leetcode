"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import PaneResizeHandle from "@/components/problem/PaneResizeHandle";
import type { WorkspaceLayoutState } from "@/lib/types/workspace";

interface WorkspaceSplitLayoutProps {
  layout: WorkspaceLayoutState;
  setLeftPaneRatio: (ratio: number) => void;
  setTopRightRatio: (ratio: number) => void;
  questionPane: React.ReactNode;
  editorPane: React.ReactNode;
  resultPane: React.ReactNode;
}

type DragAxis = "vertical" | "horizontal" | null;
type MobileSection = "question" | "editor" | "results";

const WorkspaceSplitLayout = ({
  layout,
  setLeftPaneRatio,
  setTopRightRatio,
  questionPane,
  editorPane,
  resultPane,
}: WorkspaceSplitLayoutProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const [dragAxis, setDragAxis] = useState<DragAxis>(null);
  const [mobileSection, setMobileSection] = useState<MobileSection>("question");

  useEffect(() => {
    if (!dragAxis) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (dragAxis === "vertical") {
        const container = containerRef.current;
        if (!container) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        setLeftPaneRatio(ratio);
      }

      if (dragAxis === "horizontal") {
        const rightPane = rightPaneRef.current;
        if (!rightPane) {
          return;
        }

        const rect = rightPane.getBoundingClientRect();
        const ratio = (event.clientY - rect.top) / rect.height;
        setTopRightRatio(ratio);
      }
    };

    const stopDragging = () => {
      setDragAxis(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [dragAxis, setLeftPaneRatio, setTopRightRatio]);

  const desktopPaneStyle = useMemo(
    () => ({
      left: {
        flexBasis: `${layout.leftPaneRatio * 100}%`,
      },
      rightTop: {
        flexBasis: `${layout.topRightRatio * 100}%`,
      },
    }),
    [layout.leftPaneRatio, layout.topRightRatio]
  );

  const desktopClassName = dragAxis ? "select-none" : "";

  return (
    <div className="h-full min-h-0">
      <div
        className={`hidden h-full min-h-0 md:flex ${desktopClassName}`}
        ref={containerRef}
      >
        <div
          className="min-w-0 overflow-hidden border-r border-white/10"
          style={desktopPaneStyle.left}
        >
          {questionPane}
        </div>

        <PaneResizeHandle
          orientation="vertical"
          ariaLabel="Resize question and code panes"
          onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setDragAxis("vertical");
          }}
          onStep={(delta) => {
            setLeftPaneRatio(layout.leftPaneRatio + delta);
          }}
          isActive={dragAxis === "vertical"}
        />

        <div ref={rightPaneRef} className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 overflow-hidden" style={desktopPaneStyle.rightTop}>
            {editorPane}
          </div>

          <PaneResizeHandle
            orientation="horizontal"
            ariaLabel="Resize editor and result panes"
            onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setDragAxis("horizontal");
            }}
            onStep={(delta) => {
              setTopRightRatio(layout.topRightRatio + delta);
            }}
            isActive={dragAxis === "horizontal"}
          />

          <div className="min-h-0 flex-1 overflow-hidden border-t border-white/10">
            {resultPane}
          </div>
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col md:hidden">
        <div className="flex gap-1.5 border-b border-white/10 px-3 py-2">
          <button
            type="button"
            onClick={() => setMobileSection("question")}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
              mobileSection === "question"
                ? "border-white/60 bg-white text-black"
                : "border-white/10 bg-transparent text-zinc-300"
            }`}
          >
            Question
          </button>
          <button
            type="button"
            onClick={() => setMobileSection("editor")}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
              mobileSection === "editor"
                ? "border-white/60 bg-white text-black"
                : "border-white/10 bg-transparent text-zinc-300"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileSection("results")}
            className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
              mobileSection === "results"
                ? "border-white/60 bg-white text-black"
                : "border-white/10 bg-transparent text-zinc-300"
            }`}
          >
            Results
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {mobileSection === "question" ? questionPane : null}
          {mobileSection === "editor" ? editorPane : null}
          {mobileSection === "results" ? resultPane : null}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSplitLayout;
