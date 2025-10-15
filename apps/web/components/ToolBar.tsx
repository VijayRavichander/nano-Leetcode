"use client";
import { BugIcon, RefreshCcwDotIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ToolBarProps {
  onReset: () => void;
}

const ToolBar = ({ onReset }: ToolBarProps) => {
  return (
    <div className="flex justify-between bg-[#121212] text-white p-2 py-2">
      {/* Buttons */}
      <div>
        <span></span>
      </div>
      <div className="flex justify-around items-center gap-3">
        <div>
          <Button 
            onClick={onReset}
            className="text-white/80 text-xs bg-neutral-800 hover:bg-neutral-700 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
