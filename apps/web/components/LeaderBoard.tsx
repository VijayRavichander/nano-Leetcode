import { useTab } from "@/lib/store/uiStore";
import { Button } from "./ui/button";
import { ArrowLeft, Trophy } from "lucide-react";

const LeaderBoardTab = ({ sidebarWidth}: {sidebarWidth: number}) => {
  const { tab, setTab } = useTab();

  return (
    <div
      className={`${tab == "leaderboard" ? "" : "hidden"} border-r border-gray-700 overflow-y-auto p-6`}
      style={{ width: `${sidebarWidth}px` }}
    >
    
      <Button
        onClick={() => {
          setTab("problem");
        }}
      >
        <ArrowLeft />
      </Button>
      <span className="px-5 text-md font-bold text-white">LeaderBoard</span>
    </div>
  );
};

export default LeaderBoardTab;
