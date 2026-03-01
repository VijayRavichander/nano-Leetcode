import { create } from "zustand";
import type { WorkspaceMode } from "@/lib/types/workspace";

type ProblemUIState = {
  tab: WorkspaceMode;
  problemId: string;
  setTab: (tab: WorkspaceMode) => void;
  setProblemId: (problemId: string) => void;
};

type TokenState = {
  tokenStore: string;
  setTokenStore: (newToken: string) => void;
};

export const useProblemUIStore = create<ProblemUIState>((set) => ({
  tab: "problem",
  problemId: "",
  setTab: (tab) => set({ tab }),
  setProblemId: (problemId) => set({ problemId }),
}));

export const useTokenStore = create<TokenState>((set) => ({
  tokenStore: "",
  setTokenStore: (newToken) => set({ tokenStore: newToken }),
}));
