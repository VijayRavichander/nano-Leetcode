import { create } from 'zustand';

type CodeState = {
  c: string;
  setC: (newCode: string) => void;
};

type LanuageState = {
    lang: string,
    setLang: (newLang: string) => void;
}

type TestCase = {
    id: number
    description: string
}

type TestCaseState = {
    testCaseStatus: TestCase[],
    setTestCaseStatus: (newTestCaseStatus: TestCase[]) => void
}

type Slug = {
    slug: string
    setSlug: (newSlug: string) => void;
}

export const useSlugStore = create<Slug>((set) => ({
    slug: '',
    setSlug: (newSlug) => set({slug: newSlug})
}))


export const useCodeStore = create<CodeState>((set) => ({
  c: '',
  setC: (newCode) => set({ c: newCode }),
}));


export const useLangStore = create<LanuageState>((set) => ({
    lang: 'cpp',
    setLang: (newLang) => set({ lang: newLang }),
  }));
  

export const useTestCaseStore = create<TestCaseState>((set) => ({
    testCaseStatus: [],
    setTestCaseStatus: (newTestCaseStatus) => set({testCaseStatus: newTestCaseStatus})
}))