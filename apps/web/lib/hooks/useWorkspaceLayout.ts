"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  WorkspaceLayoutActions,
  WorkspaceLayoutState,
} from "@/lib/types/workspace";

const STORAGE_KEY = "litecode:workspace-layout:v1";

const DEFAULT_LAYOUT: WorkspaceLayoutState = {
  leftPaneRatio: 0.42,
  topRightRatio: 0.56,
};

const LEFT_BOUNDS = { min: 0.25, max: 0.7 };
const TOP_BOUNDS = { min: 0.3, max: 0.8 };

const clamp = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

const clampLeft = (value: number) =>
  clamp(value, LEFT_BOUNDS.min, LEFT_BOUNDS.max);

const clampTop = (value: number) => clamp(value, TOP_BOUNDS.min, TOP_BOUNDS.max);

const isValidStoredLayout = (
  value: unknown
): value is WorkspaceLayoutState => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.leftPaneRatio === "number" &&
    Number.isFinite(candidate.leftPaneRatio) &&
    typeof candidate.topRightRatio === "number" &&
    Number.isFinite(candidate.topRightRatio)
  );
};

export const useWorkspaceLayout = (): WorkspaceLayoutState &
  WorkspaceLayoutActions => {
  const [layout, setLayout] = useState<WorkspaceLayoutState>(DEFAULT_LAYOUT);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        return;
      }

      const parsed = JSON.parse(rawValue) as unknown;

      if (!isValidStoredLayout(parsed)) {
        return;
      }

      setLayout({
        leftPaneRatio: clampLeft(parsed.leftPaneRatio),
        topRightRatio: clampTop(parsed.topRightRatio),
      });
    } catch {
      // Ignore corrupted localStorage values.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  const setLeftPaneRatio = useCallback((ratio: number) => {
    setLayout((current) => ({
      ...current,
      leftPaneRatio: clampLeft(ratio),
    }));
  }, []);

  const setTopRightRatio = useCallback((ratio: number) => {
    setLayout((current) => ({
      ...current,
      topRightRatio: clampTop(ratio),
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
  }, []);

  return useMemo(
    () => ({
      leftPaneRatio: layout.leftPaneRatio,
      topRightRatio: layout.topRightRatio,
      setLeftPaneRatio,
      setTopRightRatio,
      resetLayout,
    }),
    [layout.leftPaneRatio, layout.topRightRatio, setLeftPaneRatio, setTopRightRatio, resetLayout]
  );
};
