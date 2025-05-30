import { useProblemIDStore, useTab, useTokenStore } from "@/lib/store/uiStore";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Clock,
  Loader2,
  Lock,
  TimerIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { useCodeStore } from "@/lib/store/codeStore";

const SubmissionTab = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const { tab, setTab } = useTab();
  const [isLoading, setIsLoading] = useState(true);
  const [submissionsList, setSubmissionsList] = useState([]);
  const { problemIDStore, setProblemIDStore } = useProblemIDStore();
  const { c, setC } = useCodeStore();
  const { tokenStore, setTokenStore } = useTokenStore();
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/v1/submissioninfobulk?id=${problemIDStore}`, {
            headers: {
              Authorization: `Bearer ${tokenStore}`
            }
          }
        );
        setSubmissionsList(res.data.submissions);
        setIsLoading(false);
      } catch (errror) {
        setSubmissionsList([])
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [tab]);

  if (isLoading) {
    return (
      <div
        className={`${tab == "submissions" ? "" : "hidden"} border-r border-gray-700 overflow-y-auto p-6 min-h-screen`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div>
          <Button
            onClick={() => {
              setTab("problem");
            }}
          >
            <ArrowLeft />
          </Button>
          <span className="px-5 text-xl font-bold text-blue-500">
            <TimerIcon className="inline mx-2" />
            Submissions
          </span>
        </div>
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${tab == "submissions" ? "" : "hidden"} border-r border-gray-700 overflow-y-auto p-6 min-h-screen`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div>
        <Button
          onClick={() => {
            setTab("problem");
          }}
        >
          <ArrowLeft />
        </Button>
        <span className="px-5 text-xl font-bold text-blue-500">
          <TimerIcon className="inline mx-2" />
          Submissions
          <span className="text-[10px] font-thin mx-2">
            Lastest 5 submissions
          </span>
        </span>
      </div>
      <div className="my-5">
        <div className="max-w-3xl mx-auto">
          {submissionsList.length > 0 ? (
            <div>
              {submissionsList.map((submission, index) => (
                <div key={index} className="my-4">
                  <SubmissionCard submission={submission} setC={setC} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center font-thin text-blue-200">
              No Earlier Submissions{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubmissionCard = ({
  submission,
  setC,
}: {
  submission: any;
  setC: any;
}) => {
  const utcDate = new Date(submission.createdAt);
  // Convert to local date string
  const localDateString = utcDate.toLocaleString();
  console.log(submission)
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {submission.status == "ACCEPTED" ? (
            <span className="text-emerald-400 font-medium text-sm">
              Success
            </span>
          ) : (
            <span className="text-red-400 font-medium">Failed</span>
          )}
          <span className="text-zinc-400 text-xs">{localDateString}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-blue-400" />
          <Lock className="w-3 h-3 text-zinc-600" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-3 h-3 text-blue-400" />
          <Lock className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-400 text-xs">percentile</span>
        </div>
        <div className="flex items-center gap-1 text-blue-400 transition-colors">
          <Button
            className="hover:text-blue-300 text-xs"
            onClick={() => {
              setC(submission.code.code);
            }}
          >
            View Submission <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTab;
