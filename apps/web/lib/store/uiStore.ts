import { create } from "zustand";
import type { WorkspaceMode } from "@/lib/types/workspace";

type ProblemUIState = {
  tab: WorkspaceMode;
  showNavControls: boolean;
  problemId: string;
  setTab: (tab: WorkspaceMode) => void;
  setShowNavControls: (show: boolean) => void;
  setProblemId: (problemId: string) => void;
};

type TokenState = {
  tokenStore: string;
  setTokenStore: (newToken: string) => void;
};

export const useProblemUIStore = create<ProblemUIState>((set) => ({
  tab: "problem",
  showNavControls: false,
  problemId: "",
  setTab: (tab) => set({ tab }),
  setShowNavControls: (showNavControls) => set({ showNavControls }),
  setProblemId: (problemId) => set({ problemId }),
}));

export const useTokenStore = create<TokenState>((set) => ({
  tokenStore: "",
  setTokenStore: (newToken) => set({ tokenStore: newToken }),
}));
