"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { UIMessage } from "ai";
import { DEFAULT_AI_MODEL_ID } from "@/lib/ai/models";

interface ChatSessionState {
  id: string;
  title: string;
  messages: UIMessage[];
  modelId: string;
}

interface ProblemChatState {
  sessions: ChatSessionState[];
  activeSessionId: string | null;
}

interface AIChatStoreState {
  chatsByProblem: Record<string, ProblemChatState>;
  createSession: (problemKey: string) => string;
  setActiveSession: (problemKey: string, sessionId: string) => void;
  setMessagesForSession: (
    problemKey: string,
    sessionId: string,
    messages: UIMessage[]
  ) => void;
  setModelForSession: (
    problemKey: string,
    sessionId: string,
    modelId: string
  ) => void;
  clearSession: (problemKey: string, sessionId: string) => void;
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

const buildSession = (index: number): ChatSessionState => {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    title: `Chat ${index}`,
    messages: [],
    modelId: DEFAULT_AI_MODEL_ID,
  };
};

const ensureProblemState = (
  state: AIChatStoreState,
  problemKey: string
): ProblemChatState => {
  const existing = state.chatsByProblem[problemKey];

  if (existing && existing.sessions.length > 0) {
    const hasActiveSession = existing.sessions.some(
      (session) => session.id === existing.activeSessionId
    );

    return {
      ...existing,
      activeSessionId: hasActiveSession
        ? existing.activeSessionId
        : existing.sessions[0]?.id ?? null,
    };
  }

  const initialSession = buildSession(1);

  return {
    sessions: [initialSession],
    activeSessionId: initialSession.id,
  };
};

export const useAIChatStore = create<AIChatStoreState>()(
  persist(
    (set) => ({
      chatsByProblem: {},

      createSession: (problemKey) => {
        const createdSession = buildSession(1);

        set((state) => {
          const problemState = ensureProblemState(state, problemKey);
          createdSession.title = `Chat ${problemState.sessions.length + 1}`;

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                sessions: [...problemState.sessions, createdSession],
                activeSessionId: createdSession.id,
              },
            },
          };
        });

        return createdSession.id;
      },

      setActiveSession: (problemKey, sessionId) =>
        set((state) => {
          const problemState = ensureProblemState(state, problemKey);
          const hasSession = problemState.sessions.some(
            (session) => session.id === sessionId
          );

          if (!hasSession) {
            return state;
          }

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                ...problemState,
                activeSessionId: sessionId,
              },
            },
          };
        }),

      setMessagesForSession: (problemKey, sessionId, messages) =>
        set((state) => {
          const problemState = ensureProblemState(state, problemKey);
          const hasSession = problemState.sessions.some(
            (session) => session.id === sessionId
          );

          if (!hasSession) {
            return state;
          }

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                ...problemState,
                sessions: problemState.sessions.map((session) =>
                  session.id === sessionId ? { ...session, messages } : session
                ),
              },
            },
          };
        }),

      setModelForSession: (problemKey, sessionId, modelId) =>
        set((state) => {
          const problemState = ensureProblemState(state, problemKey);
          const hasSession = problemState.sessions.some(
            (session) => session.id === sessionId
          );

          if (!hasSession) {
            return state;
          }

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                ...problemState,
                sessions: problemState.sessions.map((session) =>
                  session.id === sessionId ? { ...session, modelId } : session
                ),
              },
            },
          };
        }),

      clearSession: (problemKey, sessionId) =>
        set((state) => {
          const problemState = state.chatsByProblem[problemKey];

          if (!problemState || problemState.sessions.length <= 1) {
            return state;
          }

          const nextSessions = problemState.sessions.filter(
            (session) => session.id !== sessionId
          );

          if (nextSessions.length === problemState.sessions.length) {
            return state;
          }

          const nextActiveSessionId =
            problemState.activeSessionId === sessionId
              ? nextSessions[0]?.id ?? null
              : problemState.activeSessionId;

          return {
            chatsByProblem: {
              ...state.chatsByProblem,
              [problemKey]: {
                sessions: nextSessions,
                activeSessionId: nextActiveSessionId,
              },
            },
          };
        }),
    }),
    {
      name: "litecode:ai-chat:v1",
      storage: createPersistStorage(),
      version: 2,
      migrate: (persistedState) => {
        const typedState = persistedState as {
          chatsByProblem?: Record<
            string,
            { messages?: UIMessage[]; modelId?: string } | ProblemChatState
          >;
        };

        if (!typedState?.chatsByProblem) {
          return { chatsByProblem: {} };
        }

        const migrated = Object.entries(typedState.chatsByProblem).reduce<
          Record<string, ProblemChatState>
        >((acc, [problemKey, value]) => {
          if (
            value &&
            "sessions" in value &&
            Array.isArray(value.sessions) &&
            value.sessions.length > 0
          ) {
            acc[problemKey] = value;
            return acc;
          }

          const legacyValue = value as { messages?: UIMessage[]; modelId?: string };
          const session = buildSession(1);
          session.messages = legacyValue.messages ?? [];
          session.modelId = legacyValue.modelId ?? DEFAULT_AI_MODEL_ID;

          acc[problemKey] = {
            sessions: [session],
            activeSessionId: session.id,
          };

          return acc;
        }, {});

        return {
          chatsByProblem: migrated,
        };
      },
    }
  )
);
