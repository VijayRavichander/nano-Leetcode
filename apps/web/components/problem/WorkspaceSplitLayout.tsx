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
import { type TabId, TAB_LABELS } from "@/lib/store/panelStore";

interface WorkspaceSplitLayoutProps {
  layout: WorkspaceLayoutState;
  setLeftPaneRatio: (ratio: number) => void;
  setTopRightRatio: (ratio: number) => void;
  leftPanel: React.ReactNode;
  topRightPanel: React.ReactNode;
  bottomRightPanel: React.ReactNode;
  renderMobileContent: (tabId: TabId) => React.ReactNode;
}

type DragAxis = "vertical" | "horizontal" | null;

const MOBILE_TABS: TabId[] = ["question", "editor", "results", "notes"];

const WorkspaceSplitLayout = ({
  layout,
  setLeftPaneRatio,
  setTopRightRatio,
  leftPanel,
  topRightPanel,
  bottomRightPanel,
  renderMobileContent,
}: WorkspaceSplitLayoutProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const [dragAxis, setDragAxis] = useState<DragAxis>(null);
  const [mobileTab, setMobileTab] = useState<TabId>("question");

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
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--app-panel)]">
      {/* Desktop layout */}
      <div
        className={`hidden h-full min-h-0 flex-1 md:flex ${desktopClassName}`}
        ref={containerRef}
      >
        <div
          className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-[var(--app-border)] bg-[var(--app-panel)]"
          style={desktopPaneStyle.left}
        >
          {leftPanel}
        </div>

        <PaneResizeHandle
          orientation="vertical"
          ariaLabel="Resize left and right panes"
          onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setDragAxis("vertical");
          }}
          onStep={(delta) => {
            setLeftPaneRatio(layout.leftPaneRatio + delta);
          }}
          isActive={dragAxis === "vertical"}
        />

        <div
          ref={rightPaneRef}
          className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--app-panel)]"
        >
          <div
            className="flex min-h-0 flex-col overflow-hidden"
            style={desktopPaneStyle.rightTop}
          >
            {topRightPanel}
          </div>

          <PaneResizeHandle
            orientation="horizontal"
            ariaLabel="Resize top and bottom right panes"
            onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setDragAxis("horizontal");
            }}
            onStep={(delta) => {
              setTopRightRatio(layout.topRightRatio + delta);
            }}
            isActive={dragAxis === "horizontal"}
          />

          <div className="min-h-0 flex-1 overflow-hidden border-t border-[var(--app-border)]">
            {bottomRightPanel}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--app-panel)] md:hidden">
        <div className="flex gap-3 border-b border-[var(--app-border)] bg-[var(--app-chrome)] px-3 py-1.5">
          {MOBILE_TABS.map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setMobileTab(tabId)}
              className={`px-0 py-0 text-[10px] font-medium ${
                mobileTab === tabId
                  ? "app-text-action text-[var(--app-text)] underline"
                  : "app-text-action app-text-action-muted"
              }`}
            >
              {TAB_LABELS[tabId]}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-[var(--app-panel)]">
          {renderMobileContent(mobileTab)}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSplitLayout;
