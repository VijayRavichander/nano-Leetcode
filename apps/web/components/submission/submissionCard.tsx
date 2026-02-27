import { Clock, BarChart2, Lock } from "lucide-react";
import { Button } from "../ui/button";
import type { SubmissionListItem, SubmissionStatus } from "@/lib/types/submission";

export const STATUS_STYLES: Record<
  SubmissionStatus,
  {
    label: string;
    textClass: string;
  }
> = {
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

export const formatSubmissionStatus = (
  status: string | null | undefined
): { label: string; textClass: string } => {
  if (!status) {
    return STATUS_STYLES.PENDING;
  }

  const normalized = status
    .replace(/\s+/g, "")
    .toUpperCase() as SubmissionStatus;

  if (normalized in STATUS_STYLES) {
    return STATUS_STYLES[normalized];
  }

  return STATUS_STYLES.PENDING;
};

interface SubmissionCardProps {
  submission: SubmissionListItem;
  setCodeInEditor: (code: string) => void;
  onViewSubmission?: (submission: SubmissionListItem) => void;
}

const SubmissionCard = ({
  submission,
  setCodeInEditor,
  onViewSubmission,
}: SubmissionCardProps) => {
  const statusStyle = formatSubmissionStatus(submission.status);
  const utcDate = new Date(submission.createdAt);
  const localDateString = utcDate.toLocaleString();

  return (
    <div className="rounded-xl bg-zinc-900/50 p-2 transition-colors hover:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full py-1 text-sm font-medium ${statusStyle.textClass}`}
          >
            <span className="h-2 w-2 rounded-full font-bold" />
            {statusStyle.label}
          </span>
          <span className="text-xs text-zinc-400">{localDateString}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-blue-400" />
          <span className="text-xs">
            {submission.max_cpu_time != null && submission.max_cpu_time !== -1
              ? `${submission.max_cpu_time * 1000} ms`
              : "NA"}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-3 w-3 text-blue-400" />
          <Lock className="h-3 w-3 text-zinc-600" />
          <span className="text-xs text-zinc-400">percentile</span>
        </div>
        <div className="flex items-center gap-1 text-blue-400 transition-colors">
          <Button
            className="text-xs hover:text-blue-300"
            onClick={() => {
              setCodeInEditor(submission.code);
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
