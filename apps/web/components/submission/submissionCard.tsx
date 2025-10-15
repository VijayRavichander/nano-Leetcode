import { Clock, BarChart2, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type SubmissionResult =
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING"
  | "TLE"
  | "COMPILATIONERROR"
  | "RUNTIMEERROR"
  | "INTERNALERROR";

export const STATUS_STYLES: Record<SubmissionResult, {
  label: string;
  textClass: string;
}> = {
  ACCEPTED: {
    label: "Accepted",
    textClass: "text-emerald-300",
  },
  REJECTED: {
    label: "Rejected",
    textClass: "text-rose-300",
  },
  PENDING: {
    label: "In Progress",
    textClass: "text-amber-200",

  },
  TLE: {
    label: "Time Limit Exceeded",
    textClass: "text-orange-300",
  },
  COMPILATIONERROR: {
    label: "Compilation Error",
    textClass: "text-purple-300",
  },
  RUNTIMEERROR: {
    label: "Runtime Error",
    textClass: "text-red-300",
  },
  INTERNALERROR: {
    label: "Internal Error",
    textClass: "text-zinc-200",
  },
};

export const formatSubmissionStatus = (status: string | null | undefined) => {
  if (!status) {
    return STATUS_STYLES.PENDING;
  }

  const normalized = status.replace(/\s+/g, "").toUpperCase() as SubmissionResult;

  if (normalized in STATUS_STYLES) {
    return STATUS_STYLES[normalized];
  }

  return STATUS_STYLES.PENDING;
};

const SubmissionCard = ({
  submission,
  setCodeInEditor,
  onViewSubmission,
}: {
  submission: any;
  setCodeInEditor: any;
  onViewSubmission?: (submission: any) => void;
}) => {
  const statusStyle = formatSubmissionStatus(submission.status);
  const utcDate = new Date(submission.createdAt);
  // Convert to local date string
  const localDateString = utcDate.toLocaleString();

  return (
    <div className="bg-zinc-900/50 rounded-xl p-2 hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full py-1 text-sm font-medium ${statusStyle.textClass}`}
          >
            <span className={`h-2 w-2 rounded-full font-bold`} />
            {statusStyle.label}
          </span>
          <span className="text-zinc-400 text-xs">{localDateString}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="text-xs">
            {submission.max_cpu_time != -1
              ? submission.max_cpu_time * 1000 + " ms"
              : "NA"}
          </span>
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
              if (typeof setCodeInEditor === "function") {
                setCodeInEditor(submission.code);
              }
              onViewSubmission?.(submission);
            }}
          >
            View Submission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;


