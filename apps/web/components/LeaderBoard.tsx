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
      className={`h-full overflow-y-auto p-4 md:p-5 ${className ?? ""}`}
      style={widthStyle}
    >
      <div className="mb-4 flex items-center">
        {onBack ? (
          <Button
            onClick={onBack}
            className="h-7 border border-white/10 bg-transparent px-2 hover:bg-white/10"
          >
            <ArrowLeft />
          </Button>
        ) : null}
        <span className="px-3 text-sm font-semibold text-white">Leaderboard</span>
      </div>

      <div className="flex h-[16rem] items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 text-sm text-zinc-400">
        <Trophy className="mr-2 h-4 w-4" />
        Leaderboard will be available here.
      </div>
    </section>
  );
};

export default LeaderBoardTab;
