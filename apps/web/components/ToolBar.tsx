"use client";
import { BugIcon, RefreshCcwDotIcon } from "lucide-react";
import { Button } from "./ui/button";

const ToolBar = () => {
  return (
    <div className="flex justify-between bg-[#1b1b14] text-white p-2 py-2">
      {/* Buttons */}
      <div>
        <span></span>
      </div>
      <div className="flex justify-around items-center gap-3">
        <div className="bg-amber-600 p-1 rounded-lg hover:bg-amber-700">
          <BugIcon className="w-4 h-4" />
        </div>
        <div>
          <Button className=" bg-blue-300 text-blue-400">
            <RefreshCcwDotIcon className="w-[2px] h-[2px]" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
