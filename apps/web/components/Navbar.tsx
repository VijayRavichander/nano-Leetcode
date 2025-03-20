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

const NavBar = () => {
  return (
    <div className="flex justify-between bg-black text-white p-2">
      {/* Logo  */}
      <div className="text-center text-3xl text-purple-600">LiteCode</div>

      {/* Buttons */}
      {/* <div>
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
              <Button className="bg-blue-400"><PlayIcon />Run</Button>
            </div>
            <div>
              <Button className="bg-green-400"><RocketIcon />Submit</Button>
            </div>  
          </div>
        </div>
      </div> */}
      {/* Premium & Signup */}
      <div className="flex justify-between gap-2">
        <Button className="bg-purple-600">Pro</Button>
        <Button className="bg-blue-400">Signup</Button>
      </div>
    </div>
  );
};

export default NavBar;
