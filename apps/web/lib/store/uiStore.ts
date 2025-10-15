import { create } from 'zustand';

type leftTab = {
    tab: string
    setTab: (newTab: string) => void;
}

export const useTab = create<leftTab>((set) => ({
    tab: 'problem',
    setTab: (newTab) => set({tab: newTab})
}))

type RunButtonState = {
    isRunning: boolean
    setIsRunning: (isRunning: boolean) => void
}

export const useRunButtonState = create<RunButtonState>((set) => ({
    isRunning: false,
    setIsRunning: (isRunning) => set({isRunning})
}))

    
type problemIDState = {
    problemIDStore: string
    setProblemIDStore: (newproblemIDStore: string) => void;
}

export const useProblemIDStore = create<problemIDState>((set) => ({
    problemIDStore: 'problem',
    setProblemIDStore: (newproblemIDStore) => set({problemIDStore: newproblemIDStore})
}))


type navBarState = {
    show: boolean
    setShow: (newShow: boolean) => void;
}

export const useNavBarStore = create<navBarState>((set) => ({
    show: false,
    setShow: (newShow) => set({show: newShow})
}))

type tokenState = {
    tokenStore: string
    setTokenStore: (newToken: string) => void;
}

export const useTokenStore = create<tokenState>((set) => ({
    tokenStore: "",
    setTokenStore: (newToken) => set({tokenStore: newToken})
}))