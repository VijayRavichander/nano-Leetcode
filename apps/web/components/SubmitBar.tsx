"use client";
import { PlayIcon, RocketIcon } from "lucide-react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubmitBar = ({code} : {code: string}) => {


  const runCode = () => {
    
  }
  return (
    <div className="flex justify-between bg-[#1E1E1E] text-white p-2">
      {/* Buttons */}
      <div>
        <div>
          <div className="flex justify-between gap-2">
            <div>
              <Select>
                <SelectTrigger className="w-[180px] focus:ring-0 focus:outline-none border-[2px] border-blue-200 shadow-none">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white ">
                  <SelectItem value="cpp">CPP</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">Javascript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="bg-blue-400" onClick={runCode()}><PlayIcon />Run</Button>
            </div>
            <div>
              <Button className="bg-green-400"><RocketIcon />Submit</Button>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBar;
