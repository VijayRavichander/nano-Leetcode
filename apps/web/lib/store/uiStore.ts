import { create } from 'zustand';

type leftTab = {
    tab: string
    setTab: (newTab: string) => void;
}

export const useTab = create<leftTab>((set) => ({
    tab: 'problem',
    setTab: (newTab) => set({tab: newTab})
}))