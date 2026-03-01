"use client";

import type { KeyboardEvent, PointerEvent } from "react";

interface PaneResizeHandleProps {
  orientation: "vertical" | "horizontal";
  ariaLabel: string;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onStep: (delta: number) => void;
  isActive?: boolean;
}

const STEP = 0.02;

const PaneResizeHandle = ({
  orientation,
  ariaLabel,
  onPointerDown,
  onStep,
  isActive = false,
}: PaneResizeHandleProps) => {
  const isVertical = orientation === "vertical";

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isVertical) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onStep(-STEP);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onStep(STEP);
      }
    } else {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        onStep(-STEP);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        onStep(STEP);
      }
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onKeyDown={handleKeyDown}
      className={
        isVertical
          ? "group relative h-full w-2 self-stretch cursor-col-resize bg-transparent focus:outline-none"
          : "group relative h-2 w-full shrink-0 cursor-row-resize bg-transparent focus:outline-none"
      }
    >
      <span
        className={
          isVertical
            ? `absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:bg-[var(--app-muted)] group-focus-visible:bg-[var(--app-muted)] ${
                isActive ? "bg-[var(--app-text)]" : "bg-[var(--app-border)]"
              }`
            : `absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:bg-[var(--app-muted)] group-focus-visible:bg-[var(--app-muted)] ${
                isActive ? "bg-[var(--app-text)]" : "bg-[var(--app-border)]"
              }`
        }
      />
    </button>
  );
};

export default PaneResizeHandle;
