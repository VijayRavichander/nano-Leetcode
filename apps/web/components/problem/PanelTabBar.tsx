"use client";

import { useState, type DragEvent } from "react";
import {
  type TabId,
  type PanelId,
  usePanelStore,
  TAB_LABELS,
} from "@/lib/store/panelStore";

interface PanelTabBarProps {
  panelId: PanelId;
  extraControls?: React.ReactNode;
}

interface DragPayload {
  tabId: TabId;
  fromPanel: PanelId;
}

const DRAG_MIME_TYPE = "application/x-litecode-tab";
const VALID_TAB_IDS: TabId[] = [
  "question",
  "submissions",
  "ai",
  "editor",
  "results",
  "notes",
];
const VALID_PANEL_IDS: PanelId[] = ["left", "topRight", "bottomRight"];
let currentDragPayload: DragPayload | null = null;

const parsePayload = (raw: string): DragPayload | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DragPayload>;

    if (
      !parsed.tabId ||
      !parsed.fromPanel ||
      !VALID_TAB_IDS.includes(parsed.tabId) ||
      !VALID_PANEL_IDS.includes(parsed.fromPanel)
    ) {
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

const readPayload = (event: DragEvent<HTMLElement>): DragPayload | null => {
  const primary = event.dataTransfer.getData(DRAG_MIME_TYPE);
  if (primary) {
    return parsePayload(primary);
  }

  const fallback = event.dataTransfer.getData("text/plain");
  return parsePayload(fallback);
};

const DropIndicator = () => (
  <span className="mx-0.5 h-5 w-0.5 rounded bg-[var(--app-accent)]" />
);

const PanelTabBar = ({ panelId, extraControls }: PanelTabBarProps) => {
  const tabs = usePanelStore((s) => s.layout[panelId]);
  const layout = usePanelStore((s) => s.layout);
  const activeTab = usePanelStore((s) => s.activeTabs[panelId]);
  const moveTab = usePanelStore((s) => s.moveTab);
  const setActiveTab = usePanelStore((s) => s.setActiveTab);

  const [draggingTabId, setDraggingTabId] = useState<TabId | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  if (tabs.length === 0) return null;

  const canDrop = (payload: DragPayload) => {
    if (payload.fromPanel === panelId) {
      return true;
    }

    return layout[payload.fromPanel].length > 1;
  };

  const allowDrop = (event: DragEvent<HTMLElement>, index: number) => {
    const payload = currentDragPayload ?? readPayload(event);
    if (!payload) {
      return false;
    }

    if (!canDrop(payload)) {
      event.dataTransfer.dropEffect = "none";
      return false;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropIndex(index);
    return true;
  };

  const commitDrop = (event: DragEvent<HTMLElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();

    const payload = currentDragPayload ?? readPayload(event);
    setDropIndex(null);

    if (!payload || !canDrop(payload)) {
      return;
    }

    moveTab(payload.tabId, payload.fromPanel, panelId, index);
  };

  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--app-editor-border)] bg-[var(--app-chrome)] px-1">
      <div
        className="flex items-center"
        onDragOver={(event) => {
          void allowDrop(event, tabs.length);
        }}
        onDrop={(event) => {
          commitDrop(event, tabs.length);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && event.currentTarget.contains(nextTarget)) {
            return;
          }
          setDropIndex(null);
        }}
      >
        {tabs.map((tabId: TabId, index: number) => {
          const isDraggable = tabs.length > 1;
          const isActive = activeTab === tabId;
          const isDragging = draggingTabId === tabId;

          return (
            <div
              key={tabId}
              className="relative flex items-center"
              onDragOver={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const insertAfter = event.clientX >= rect.left + rect.width / 2;
                const targetIndex = insertAfter ? index + 1 : index;
                const isAllowed = allowDrop(event, targetIndex);
                if (!isAllowed) {
                  return;
                }
                event.stopPropagation();
              }}
              onDrop={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const insertAfter = event.clientX >= rect.left + rect.width / 2;
                const targetIndex = insertAfter ? index + 1 : index;
                commitDrop(event, targetIndex);
              }}
            >
              {dropIndex === index ? <DropIndicator /> : null}

              <button
                type="button"
                draggable={isDraggable}
                onDragStart={(event) => {
                  if (!isDraggable) {
                    event.preventDefault();
                    return;
                  }

                  const payload: DragPayload = {
                    tabId,
                    fromPanel: panelId,
                  };

                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData(
                    DRAG_MIME_TYPE,
                    JSON.stringify(payload)
                  );
                  event.dataTransfer.setData("text/plain", JSON.stringify(payload));
                  currentDragPayload = payload;
                  setDraggingTabId(tabId);
                }}
                onDragEnd={() => {
                  currentDragPayload = null;
                  setDraggingTabId(null);
                  setDropIndex(null);
                }}
                onClick={() => setActiveTab(panelId, tabId)}
                className={`relative px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-[var(--app-text)]"
                    : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                } ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""} ${
                  isDragging ? "opacity-45" : ""
                }`}
              >
                {TAB_LABELS[tabId]}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-[1.5px] w-[60%] -translate-x-1/2 bg-[var(--app-text)]" />
                )}
              </button>
            </div>
          );
        })}

        {dropIndex === tabs.length ? <DropIndicator /> : null}
      </div>

      {extraControls && (
        <div className="flex items-center gap-1.5 pr-1.5">{extraControls}</div>
      )}
    </div>
  );
};

export default PanelTabBar;
