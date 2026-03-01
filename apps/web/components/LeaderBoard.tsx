"use client";

import { Button } from "./ui/button";
import { ArrowLeft, Trophy } from "lucide-react";

interface LeaderBoardTabProps {
  sidebarWidth?: number;
  onBack?: () => void;
  className?: string;
}

const LeaderBoardTab = ({
  sidebarWidth,
  onBack,
  className,
}: LeaderBoardTabProps) => {
  const widthStyle = sidebarWidth ? { width: `${sidebarWidth}px` } : undefined;

  return (
    <section
      className={`flex h-full min-h-0 flex-col overflow-y-auto p-4 md:p-5 ${className ?? ""}`}
      style={widthStyle}
    >
      <div className="mb-4 flex items-center">
        {onBack ? (
          <Button
            onClick={onBack}
            className="app-text-action app-text-action-muted h-auto px-0 py-0 shadow-none"
          >
            <ArrowLeft />
            Back
          </Button>
        ) : null}
        <span className="px-3 text-sm font-semibold text-[var(--app-text)]">Leaderboard</span>
      </div>

      <div className="app-empty-state h-[16rem]">
        <Trophy className="mr-2 h-4 w-4" />
        Leaderboard will be available here.
      </div>
    </section>
  );
};

export default LeaderBoardTab;
