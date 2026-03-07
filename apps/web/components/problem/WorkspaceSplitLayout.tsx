"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
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

const MOBILE_TABS: TabId[] = [
  "question",
  "submissions",
  "ai",
  "editor",
  "results",
  "notes",
];

const HORIZONTAL_HANDLE_HEIGHT_PX = 8;
const MIN_EDITOR_HEIGHT_PX = 180;
const FALLBACK_MIN_RESULTS_HEIGHT_PX = 140;
const RESULTS_VISIBILITY_PADDING_PX = 12;
const MIN_RATIO = 0.08;
const MAX_RATIO = 0.92;

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

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
  const topRightRatioRef = useRef(layout.topRightRatio);
  const [dragAxis, setDragAxis] = useState<DragAxis>(null);
  const [mobileTab, setMobileTab] = useState<TabId>("question");

  const getTopRightBounds = useCallback(() => {
    const rightPane = rightPaneRef.current;

    if (!rightPane) {
      return { min: MIN_RATIO, max: MAX_RATIO };
    }

    const rightPaneRect = rightPane.getBoundingClientRect();
    const paneHeight = rightPaneRect.height;

    if (!Number.isFinite(paneHeight) || paneHeight <= 0) {
      return { min: MIN_RATIO, max: MAX_RATIO };
    }

    const resultPaneRoot = rightPane.querySelector<HTMLElement>("[data-results-pane-root]");
    const resultsControls = rightPane.querySelector<HTMLElement>("[data-results-controls]");

    let minResultsHeightPx = FALLBACK_MIN_RESULTS_HEIGHT_PX;

    if (resultPaneRoot && resultsControls) {
      const resultPaneRect = resultPaneRoot.getBoundingClientRect();
      const controlsRect = resultsControls.getBoundingClientRect();
      const controlsBottomOffset = controlsRect.bottom - resultPaneRect.top;

      if (Number.isFinite(controlsBottomOffset) && controlsBottomOffset > 0) {
        minResultsHeightPx = Math.max(
          FALLBACK_MIN_RESULTS_HEIGHT_PX,
          Math.ceil(controlsBottomOffset + RESULTS_VISIBILITY_PADDING_PX)
        );
      }
    }

    const minRatio = clamp(MIN_EDITOR_HEIGHT_PX / paneHeight, MIN_RATIO, MAX_RATIO);
    const maxRatio = clamp(
      (paneHeight - minResultsHeightPx - HORIZONTAL_HANDLE_HEIGHT_PX) / paneHeight,
      MIN_RATIO,
      MAX_RATIO
    );

    // If both constraints can't be true on tiny viewports, preserve the results controls visibility.
    if (maxRatio < minRatio) {
      return { min: maxRatio, max: maxRatio };
    }

    return { min: minRatio, max: maxRatio };
  }, []);

  const clampTopRightRatio = useCallback(
    (ratio: number) => {
      const bounds = getTopRightBounds();
      return clamp(ratio, bounds.min, bounds.max);
    },
    [getTopRightBounds]
  );

  useEffect(() => {
    topRightRatioRef.current = layout.topRightRatio;
  }, [layout.topRightRatio]);

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
        setTopRightRatio(clampTopRightRatio(ratio));
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
  }, [clampTopRightRatio, dragAxis, setLeftPaneRatio, setTopRightRatio]);

  useEffect(() => {
    const reconcileTopRightRatio = () => {
      const currentRatio = topRightRatioRef.current;
      const boundedRatio = clampTopRightRatio(currentRatio);

      if (Math.abs(boundedRatio - currentRatio) > 0.001) {
        setTopRightRatio(boundedRatio);
      }
    };

    reconcileTopRightRatio();

    window.addEventListener("resize", reconcileTopRightRatio);

    const rightPane = rightPaneRef.current;
    const resizeObserver =
      rightPane && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            reconcileTopRightRatio();
          })
        : null;

    if (resizeObserver && rightPane) {
      resizeObserver.observe(rightPane);
    }

    const mutationObserver =
      rightPane && typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            reconcileTopRightRatio();
          })
        : null;

    if (mutationObserver && rightPane) {
      mutationObserver.observe(rightPane, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", reconcileTopRightRatio);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [clampTopRightRatio, setTopRightRatio]);

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
          className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-[var(--app-editor-border)] bg-[var(--app-panel)]"
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
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--app-panel)]"
        >
          <div className="flex min-h-0 flex-col overflow-hidden" style={desktopPaneStyle.rightTop}>
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
              setTopRightRatio(clampTopRightRatio(layout.topRightRatio + delta));
            }}
            isActive={dragAxis === "horizontal"}
          />

          <div className="min-h-0 flex-1 overflow-hidden border-t border-[var(--app-editor-border)]">
            {bottomRightPanel}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--app-panel)] md:hidden">
        <div className="flex gap-3 border-b border-[var(--app-editor-border)] bg-[var(--app-chrome)] px-3 py-1.5">
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
