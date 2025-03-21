"use client";
import { PlayIcon, RefreshCcw, RefreshCcwDotIcon, RocketIcon } from "lucide-react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { useCodeStore } from "@/lib/store/codeStore";


const ToolBar = () => {

  return (
    <div className="flex justify-between bg-[#1b1b14] text-white p-2">
      {/* Buttons */}
      <div>
        <span></span>
      </div>
      <div>
        <Button><RefreshCcwDotIcon/>  Reset</Button>
      </div>
    </div>
  );
};

export default ToolBar;
