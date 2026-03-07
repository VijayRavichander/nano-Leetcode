"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { UIMessage } from "ai";
import { DEFAULT_AI_MODEL_ID } from "@/lib/ai/models";

interface ProblemChatState {
  messages: UIMessage[];
  modelId: string;
}

interface AIChatStoreState {
  chatsByProblem: Record<string, ProblemChatState>;
  setMessagesForProblem: (problemKey: string, messages: UIMessage[]) => void;
  setModelForProblem: (problemKey: string, modelId: string) => void;
  clearProblemChat: (problemKey: string) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const createPersistStorage = () =>
  createJSONStorage(() =>
    typeof window === "undefined" ? noopStorage : window.localStorage
  );

export const useAIChatStore = create<AIChatStoreState>()(
  persist(
    (set) => ({
      chatsByProblem: {},

      setMessagesForProblem: (problemKey, messages) =>
        set((state) => {
          const previous = state.chatsByProblem[problemKey];

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                messages,
                modelId: previous?.modelId ?? DEFAULT_AI_MODEL_ID,
              },
            },
          };
        }),

      setModelForProblem: (problemKey, modelId) =>
        set((state) => {
          const previous = state.chatsByProblem[problemKey];

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                messages: previous?.messages ?? [],
                modelId,
              },
            },
          };
        }),

      clearProblemChat: (problemKey) =>
        set((state) => {
          const next = { ...state.chatsByProblem };
          delete next[problemKey];

          return {
            chatsByProblem: next,
          };
        }),
    }),
    {
      name: "litecode:ai-chat:v1",
      storage: createPersistStorage(),
    }
  )
);
