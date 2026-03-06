"use client";

import {
  type TabId,
  type PanelId,
  usePanelStore,
  TAB_LABELS,
  PANEL_LABELS,
  ALL_PANELS,
} from "@/lib/store/panelStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightLeft } from "lucide-react";

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

  const otherPanels = ALL_PANELS.filter((p) => p !== panelId);

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded p-0.5 text-[var(--app-muted)] opacity-0 transition-all hover:bg-[var(--app-panel-muted)] hover:text-[var(--app-text)] group-hover:opacity-100"
                >
                  <ArrowRightLeft className="h-2.5 w-2.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="min-w-[150px] border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)]"
              >
                {otherPanels.map((targetPanel) => (
                  <DropdownMenuItem
                    key={targetPanel}
                    onClick={() => moveTab(tabId, panelId, targetPanel)}
                    className="cursor-pointer text-xs"
                  >
                    Move to {PANEL_LABELS[targetPanel]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
