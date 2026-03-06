"use client";

import type { DragEvent } from "react";
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

const PanelTabBar = ({ panelId, extraControls }: PanelTabBarProps) => {
  const tabs = usePanelStore((s) => s.layout[panelId]);
  const activeTab = usePanelStore((s) => s.activeTabs[panelId]);
  const moveTab = usePanelStore((s) => s.moveTab);
  const setActiveTab = usePanelStore((s) => s.setActiveTab);

  if (tabs.length === 0) return null;

  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-chrome)] px-1">
      <div
        className="flex items-center"
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
          moveTab(payload.tabId, payload.fromPanel, panelId, tabs.length);
        }}
      >
        {tabs.map((tabId: TabId, index) => (
          <div
            key={tabId}
            className="relative flex items-center"
            onDragOver={(event) => {
              if (!parseDragPayload(event)) {
                return;
              }

              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              const payload = parseDragPayload(event);

              if (!payload) {
                return;
              }

              event.preventDefault();
              moveTab(payload.tabId, payload.fromPanel, panelId, index);
            }}
          >
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(
                  TAB_DRAG_MIME_TYPE,
                  JSON.stringify({ tabId, fromPanel: panelId })
                );
              }}
              onClick={() => setActiveTab(panelId, tabId)}
              className={`relative cursor-grab px-2.5 py-1.5 text-[11px] font-medium transition-colors active:cursor-grabbing ${
                activeTab === tabId
                  ? "text-[var(--app-text)]"
                  : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
              }`}
            >
              {TAB_LABELS[tabId]}
              {activeTab === tabId && (
                <span className="absolute bottom-0 left-1/2 h-[1.5px] w-[60%] -translate-x-1/2 bg-[var(--app-text)]" />
              )}
            </button>
          </div>
        ))}
      </div>
      {extraControls && (
        <div className="flex items-center gap-1.5 pr-1.5">{extraControls}</div>
      )}
    </div>
  );
};

export default PanelTabBar;
