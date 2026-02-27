import { create } from "zustand";
import type { RunResultItem } from "@/lib/types/submission";

type ExecutionState = {
  isRunning: boolean;
  statusBySlug: Record<string, RunResultItem[]>;
  setIsRunning: (value: boolean) => void;
  setTestCaseStatus: (slug: string, status: RunResultItem[]) => void;
  clearTestCaseStatus: (slug?: string) => void;
};

const EMPTY_RESULTS: RunResultItem[] = [];

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  statusBySlug: {},
  setIsRunning: (value) => set({ isRunning: value }),
  setTestCaseStatus: (slug, status) =>
    set((state) => ({
      statusBySlug: {
        ...state.statusBySlug,
        [slug]: status,
      },
    })),
  clearTestCaseStatus: (slug) =>
    set((state) => {
      if (!slug) {
        return { statusBySlug: {} };
      }

      const nextStatusBySlug = { ...state.statusBySlug };
      delete nextStatusBySlug[slug];
      return { statusBySlug: nextStatusBySlug };
    }),
}));

export const useTestCaseStatusForSlug = (slug: string | null) =>
  useExecutionStore((state) => {
    if (!slug) {
      return EMPTY_RESULTS;
    }

    return state.statusBySlug[slug] ?? EMPTY_RESULTS;
  });
