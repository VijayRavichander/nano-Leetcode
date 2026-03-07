"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

export type TabId =
  | "question"
  | "editorial"
  | "submissions"
  | "ai"
  | "editor"
  | "results"
  | "notes";
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

export const ALL_PANELS: PanelId[] = ["left", "topRight", "bottomRight"];

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
  focusTab: (tabId: TabId) => void;
}

const ALL_TABS: TabId[] = [
  "question",
  "editorial",
  "submissions",
  "ai",
  "editor",
  "results",
  "notes",
];

const DEFAULT_LAYOUT: PanelLayout = {
  left: ["question", "editorial", "submissions", "ai", "notes"],
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

const clampIndex = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

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

          const sourceTabs = newLayout[fromPanel];
          const destinationTabs = newLayout[toPanel];
          const sourceIndex = sourceTabs.indexOf(tabId);

          if (sourceIndex === -1) {
            return state;
          }

          if (fromPanel === toPanel) {
            if (sourceTabs.length <= 1) {
              return state;
            }

            const droppedIndex = clampIndex(
              targetIndex ?? sourceTabs.length,
              0,
              sourceTabs.length
            );
            const adjustedIndex =
              droppedIndex > sourceIndex ? droppedIndex - 1 : droppedIndex;
            const reorderedTabs = sourceTabs.filter((id) => id !== tabId);
            const insertionIndex = clampIndex(
              adjustedIndex,
              0,
              reorderedTabs.length
            );
            reorderedTabs.splice(insertionIndex, 0, tabId);

            if (reorderedTabs.every((id, index) => id === sourceTabs[index])) {
              return state;
            }

            newLayout[fromPanel] = reorderedTabs;

            return {
              layout: newLayout,
              activeTabs: { ...state.activeTabs, [fromPanel]: tabId },
            };
          }

          if (sourceTabs.length <= 1) {
            return state;
          }

          const sourceWithoutTab = sourceTabs.filter((id) => id !== tabId);
          const destinationWithoutTab = destinationTabs.filter(
            (id) => id !== tabId
          );
          const insertionIndex = clampIndex(
            targetIndex ?? destinationWithoutTab.length,
            0,
            destinationWithoutTab.length
          );
          destinationWithoutTab.splice(insertionIndex, 0, tabId);

          newLayout[fromPanel] = sourceWithoutTab;
          newLayout[toPanel] = destinationWithoutTab;

          const newActiveTabs: ActiveTabs = { ...state.activeTabs };

          if (newActiveTabs[fromPanel] === tabId) {
            newActiveTabs[fromPanel] = sourceWithoutTab[0] ?? null;
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

      focusTab: (tabId) => {
        set((state) => {
          const targetPanel = ALL_PANELS.find((panelId) =>
            state.layout[panelId].includes(tabId)
          );

          if (!targetPanel) {
            return state;
          }

          return {
            activeTabs: { ...state.activeTabs, [targetPanel]: tabId },
          };
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
  editorial: "Editorial",
  submissions: "Submissions",
  ai: "AI",
  editor: "Editor",
  results: "Results",
  notes: "Notes",
};
