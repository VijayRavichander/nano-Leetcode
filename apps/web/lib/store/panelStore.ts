"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

export type TabId = "question" | "editor" | "results" | "notes";
export type PanelId = "left" | "topRight" | "bottomRight";

export interface PanelLayout {
  left: TabId[];
  topRight: TabId[];
  bottomRight: TabId[];
}

export interface ActiveTabs {
  left: TabId | null;
  topRight: TabId | null;
  bottomRight: TabId | null;
}

interface PanelState {
  layout: PanelLayout;
  activeTabs: ActiveTabs;
  moveTab: (
    tabId: TabId,
    fromPanel: PanelId,
    toPanel: PanelId,
    targetIndex?: number
  ) => void;
  setActiveTab: (panelId: PanelId, tabId: TabId) => void;
  resetPanelLayout: () => void;
}

const ALL_TABS: TabId[] = ["question", "editor", "results", "notes"];

const DEFAULT_LAYOUT: PanelLayout = {
  left: ["question", "notes"],
  topRight: ["editor"],
  bottomRight: ["results"],
};

const DEFAULT_ACTIVE: ActiveTabs = {
  left: "question",
  topRight: "editor",
  bottomRight: "results",
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const createPersistStorage = () =>
  createJSONStorage(() =>
    typeof window === "undefined" ? noopStorage : window.localStorage
  );

function isValidLayout(layout: unknown): layout is PanelLayout {
  if (!layout || typeof layout !== "object") return false;
  const l = layout as Record<string, unknown>;
  return (
    Array.isArray(l.left) &&
    Array.isArray(l.topRight) &&
    Array.isArray(l.bottomRight)
  );
}

function ensureAllTabs(layout: PanelLayout): PanelLayout {
  const present = new Set([
    ...layout.left,
    ...layout.topRight,
    ...layout.bottomRight,
  ]);
  const missing = ALL_TABS.filter((t) => !present.has(t));
  if (missing.length === 0) return layout;
  return {
    ...layout,
    left: [...layout.left, ...missing],
  };
}

export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      layout: { ...DEFAULT_LAYOUT },
      activeTabs: { ...DEFAULT_ACTIVE },

      moveTab: (tabId, fromPanel, toPanel, targetIndex) => {
        set((state) => {
          const newLayout: PanelLayout = {
            left: [...state.layout.left],
            topRight: [...state.layout.topRight],
            bottomRight: [...state.layout.bottomRight],
          };

          if (!newLayout[fromPanel].includes(tabId)) {
            return state;
          }

          newLayout[fromPanel] = newLayout[fromPanel].filter(
            (id) => id !== tabId
          );

          const destinationTabs = [...newLayout[toPanel]].filter((id) => id !== tabId);
          const insertionIndex =
            typeof targetIndex === "number"
              ? Math.min(Math.max(targetIndex, 0), destinationTabs.length)
              : destinationTabs.length;

          destinationTabs.splice(insertionIndex, 0, tabId);
          newLayout[toPanel] = destinationTabs;

          if (newLayout[fromPanel].length === 0 && fromPanel === toPanel) {
            newLayout[fromPanel] = [tabId];
          }

          const newActiveTabs: ActiveTabs = { ...state.activeTabs };

          if (newActiveTabs[fromPanel] === tabId) {
            newActiveTabs[fromPanel] = newLayout[fromPanel][0] ?? null;
          }

          newActiveTabs[toPanel] = tabId;

          return { layout: newLayout, activeTabs: newActiveTabs };
        });
      },

      setActiveTab: (panelId, tabId) => {
        set((state) => ({
          activeTabs: { ...state.activeTabs, [panelId]: tabId },
        }));
      },

      resetPanelLayout: () => {
        set({
          layout: { ...DEFAULT_LAYOUT },
          activeTabs: { ...DEFAULT_ACTIVE },
        });
      },
    }),
    {
      name: "litecode:panel-layout:v1",
      storage: createPersistStorage(),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isValidLayout(state.layout)) {
          state.layout = { ...DEFAULT_LAYOUT };
          state.activeTabs = { ...DEFAULT_ACTIVE };
          return;
        }
        state.layout = ensureAllTabs(state.layout);
      },
    }
  )
);

export const TAB_LABELS: Record<TabId, string> = {
  question: "Question",
  editor: "Editor",
  results: "Results",
  notes: "Notes",
};

export const PANEL_LABELS: Record<PanelId, string> = {
  left: "Left",
  topRight: "Top Right",
  bottomRight: "Bottom Right",
};

export const ALL_PANELS: PanelId[] = ["left", "topRight", "bottomRight"];
