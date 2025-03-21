import { useTab } from "@/lib/store/uiStore";
import { Button } from "./ui/button";
import { ArrowLeft, TimerIcon } from "lucide-react";

const SubmissionTab = ({ sidebarWidth}: {sidebarWidth: number}) => {
  const { tab, setTab } = useTab();

  return (
    <div
      className={`${tab == "submissions" ? "" : "hidden"} border-r border-gray-700 overflow-y-auto p-6`}
      style={{ width: `${sidebarWidth}px` }}
    >
    
      <Button
        onClick={() => {
          setTab("problem");
        }}
      >
        <ArrowLeft />
      </Button>
      <span className="px-5 text-xl font-bold text-blue-500"><TimerIcon className="inline mx-2" />Submissions</span>
    </div>
  );
};

export default SubmissionTab;
