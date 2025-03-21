import { create } from 'zustand';

type leftTab = {
    tab: string
    setTab: (newTab: string) => void;
}

export const useTab = create<leftTab>((set) => ({
    tab: 'problem',
    setTab: (newTab) => set({tab: newTab})
}))



type problemIDState = {
    problemIDStore: string
    setProblemIDStore: (newproblemIDStore: string) => void;
}

export const useProblemIDStore = create<problemIDState>((set) => ({
    problemIDStore: 'problem',
    setProblemIDStore: (newproblemIDStore) => set({problemIDStore: newproblemIDStore})
}))
