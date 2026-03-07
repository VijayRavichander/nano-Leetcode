import { create } from "zustand";

type ProblemUIState = {
  problemId: string;
  setProblemId: (problemId: string) => void;
};

type TokenState = {
  tokenStore: string;
  setTokenStore: (newToken: string) => void;
};

export const useProblemUIStore = create<ProblemUIState>((set) => ({
  problemId: "",
  setProblemId: (problemId) => set({ problemId }),
}));

export const useTokenStore = create<TokenState>((set) => ({
  tokenStore: "",
  setTokenStore: (newToken) => set({ tokenStore: newToken }),
}));
