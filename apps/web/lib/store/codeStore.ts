"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

export type SupportedLanguage = "cpp" | "python";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const createPersistStorage = () =>
  createJSONStorage(() =>
    typeof window === "undefined" ? noopStorage : window.localStorage
  );

type CodeState = {
  codeBySlug: Record<string, string>;
  currentSlug: string;
  setCurrentSlug: (slug: string) => void;
  setCodeForSlug: (slug: string, code: string) => void;
  ensureCodeForSlug: (slug: string, defaultCode: string) => void;
  resetCodeForSlug: (slug: string, defaultCode: string) => void;
};

type LanguageState = {
  lang: SupportedLanguage;
  setLang: (language: SupportedLanguage) => void;
};

export const useCodeStore = create<CodeState>()(
  persist(
    (set) => ({
      codeBySlug: {},
      currentSlug: "",
      setCurrentSlug: (slug) => set({ currentSlug: slug }),
      setCodeForSlug: (slug, code) =>
        set((state) => ({
          codeBySlug: {
            ...state.codeBySlug,
            [slug]: code,
          },
        })),
      ensureCodeForSlug: (slug, defaultCode) =>
        set((state) => {
          if (state.codeBySlug[slug]) {
            return state;
          }

          return {
            codeBySlug: {
              ...state.codeBySlug,
              [slug]: defaultCode,
            },
          };
        }),
      resetCodeForSlug: (slug, defaultCode) =>
        set((state) => ({
          codeBySlug: {
            ...state.codeBySlug,
            [slug]: defaultCode,
          },
        })),
    }),
    {
      name: "code-store",
      storage: createPersistStorage(),
    }
  )
);

export const useLangStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "cpp",
      setLang: (language) => set({ lang: language }),
    }),
    {
      name: "language-store",
      storage: createPersistStorage(),
    }
  )
);

export const useCurrentSlug = () => useCodeStore((state) => state.currentSlug);

export const useCurrentCode = () =>
  useCodeStore((state) => {
    if (!state.currentSlug) {
      return "";
    }

    return state.codeBySlug[state.currentSlug] ?? "";
  });

export const useCodeForSlug = (slug: string | null | undefined) =>
  useCodeStore((state) => {
    if (!slug) {
      return "";
    }

    return state.codeBySlug[slug] ?? "";
  });
