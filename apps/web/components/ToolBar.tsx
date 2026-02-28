"use client";
import { Button } from "./ui/button";

interface ToolBarProps {
  onReset: () => void;
}

const ToolBar = ({ onReset }: ToolBarProps) => {
  return (
    <div className="app-toolbar flex justify-between px-3 py-2">
      {/* Buttons */}
      <div>
        <span></span>
      </div>
      <div className="flex justify-around items-center gap-3">
        <div>
          <Button
            onClick={onReset}
            className="app-text-action app-text-action-muted flex cursor-pointer items-center gap-1 px-0 py-0 text-xs shadow-none"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
