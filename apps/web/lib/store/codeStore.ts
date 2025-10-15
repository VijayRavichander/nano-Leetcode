"use client";

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const createPersistStorage = () =>
  createJSONStorage(() => (typeof window === 'undefined' ? noopStorage : window.localStorage));

const getStorage = () =>
  typeof window === 'undefined' ? undefined : window.localStorage;

type CodeState = {
  codeBySlug: Record<string, string>; // Store code per problem slug
  currentSlug: string;
  setCodeForSlug: (slug: string, code: string) => void;
  getCodeForSlug: (slug: string) => string;
  setCurrentSlug: (slug: string) => void;
  getCurrentCode: () => string;
  resetCodeForSlug: (slug: string, defaultCode: string) => void;
};

type LanuageState = {
    lang: string,
    setLang: (newLang: string) => void;
}

type TestCase = {
    id: number
    description: string
    time: number, 
    memory: number,
    stdout: string,
}

type TestCaseState = {
    statusBySlug: Record<string, TestCase[]>
    setTestCaseStatus: (slug: string, newTestCaseStatus: TestCase[]) => void
    clearTestCaseStatus: (slug?: string) => void
}

type Slug = {
    slug: string
    setSlug: (newSlug: string) => void;
}

export const useSlugStore = create<Slug>((set) => ({
    slug: '',
    setSlug: (newSlug) => set({slug: newSlug})
}))


export const useCodeStore = create<CodeState>()(
  persist(
    (set, get) => ({
      codeBySlug: {},
      currentSlug: '',
      setCodeForSlug: (slug, code) =>
        set((state) => ({
          codeBySlug: {
            ...state.codeBySlug,
            [slug]: code,
          },
        })),
      getCodeForSlug: (slug) => {
        const state = get();
        return state.codeBySlug[slug] || '';
      },
      setCurrentSlug: (slug) => set({ currentSlug: slug }),
      getCurrentCode: () => {
        const state = get();
        return state.codeBySlug[state.currentSlug] || '';
      },
      resetCodeForSlug: (slug, defaultCode) =>
        set((state) => ({
          codeBySlug: {
            ...state.codeBySlug,
            [slug]: defaultCode,
          },
        })),
    }),
    {
      name: 'code-store',
      storage: createPersistStorage(),
    }
  )
);


export const useLangStore = create<LanuageState>()(
  persist(
    (set) => ({
      lang: 'cpp',
      setLang: (newLang) => set({ lang: newLang }),
    }),
    {
      name: 'language-store',
      storage: createPersistStorage(),
    }
  )
);
  

export const useTestCaseStore = create<TestCaseState>()(
  persist(
    (set) => ({
      statusBySlug: {},
      setTestCaseStatus: (slug, newTestCaseStatus) =>
        set((state) => ({
          statusBySlug: {
            ...state.statusBySlug,
            [slug]: newTestCaseStatus,
          },
        })),
      clearTestCaseStatus: (slug) =>
        set((state) => {
          if (!slug) {
            return { statusBySlug: {} };
          }
          // _removed is the slug that is being removed
          // rest is the remaining slugs
          const { [slug]: _removed, ...rest } = state.statusBySlug;
          return { statusBySlug: rest };
        }),
    }),
    {
      name: 'test-case-store',
      storage: createPersistStorage(),
    }
  )
);