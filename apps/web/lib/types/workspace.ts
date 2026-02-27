export type WorkspaceMode = "problem" | "submissions" | "leaderboard";

export interface WorkspaceLayoutState {
  leftPaneRatio: number;
  topRightRatio: number;
}

export interface WorkspaceLayoutActions {
  setLeftPaneRatio: (ratio: number) => void;
  setTopRightRatio: (ratio: number) => void;
  resetLayout: () => void;
}
