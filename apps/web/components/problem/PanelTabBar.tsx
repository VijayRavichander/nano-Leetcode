"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  type TabId,
  type PanelId,
  usePanelStore,
  TAB_LABELS,
  PANEL_LABELS,
  ALL_PANELS,
} from "@/lib/store/panelStore";
import { ArrowRightLeft } from "lucide-react";

interface MoveMenuProps {
  tabId: TabId;
  panelId: PanelId;
  onMove: (tabId: TabId, from: PanelId, to: PanelId) => void;
}

const MoveMenu = ({ tabId, panelId, onMove }: MoveMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const otherPanels = ALL_PANELS.filter((p) => p !== panelId);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded p-1 text-[var(--app-muted)] opacity-0 transition-all hover:bg-[var(--app-panel-muted)] hover:text-[var(--app-text)] group-hover:opacity-100"
      >
        <ArrowRightLeft className="h-3 w-3" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 top-full z-50 mt-1 min-w-[150px] rounded-md border border-[var(--app-border)] bg-[var(--app-panel)] py-1 shadow-md"
        >
          {otherPanels.map((targetPanel) => (
            <button
              key={targetPanel}
              type="button"
              onClick={() => {
                onMove(tabId, panelId, targetPanel);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center px-3 py-1.5 text-xs text-[var(--app-text)] hover:bg-[var(--app-panel-muted)]"
            >
              Move to {PANEL_LABELS[targetPanel]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface PanelTabBarProps {
  panelId: PanelId;
  extraControls?: React.ReactNode;
}

const PanelTabBar = ({ panelId, extraControls }: PanelTabBarProps) => {
  const tabs = usePanelStore((s) => s.layout[panelId]);
  const activeTab = usePanelStore((s) => s.activeTabs[panelId]);
  const moveTab = usePanelStore((s) => s.moveTab);
  const setActiveTab = usePanelStore((s) => s.setActiveTab);

  if (tabs.length === 0) return null;

  const canMove = tabs.length > 1;

  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-chrome)] px-1">
      <div className="flex items-center">
        {tabs.map((tabId: TabId) => (
          <div key={tabId} className="group relative flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab(panelId, tabId)}
              className={`relative px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
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

            {canMove && (
              <MoveMenu tabId={tabId} panelId={panelId} onMove={moveTab} />
            )}
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
