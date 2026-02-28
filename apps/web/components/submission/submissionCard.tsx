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
    textClass: "text-[var(--app-success-text)]",
  },
  REJECTED: {
    label: "Rejected",
    textClass: "text-[var(--app-danger-text)]",
  },
  PENDING: {
    label: "In Progress",
    textClass: "text-[var(--app-warning-text)]",
  },
  TLE: {
    label: "Time Limit Exceeded",
    textClass: "text-[var(--app-warning-text)]",
  },
  COMPILATIONERROR: {
    label: "Compilation Error",
    textClass: "text-[var(--app-danger-text)]",
  },
  RUNTIMEERROR: {
    label: "Runtime Error",
    textClass: "text-[var(--app-danger-text)]",
  },
  INTERNALERROR: {
    label: "Internal Error",
    textClass: "text-[var(--app-muted)]",
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
    <div className="app-panel p-4 transition-colors hover:bg-[var(--app-surface)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full py-1 text-sm font-medium ${statusStyle.textClass}`}
          >
            <span className="h-2 w-2 rounded-full font-bold" />
            {statusStyle.label}
          </span>
          <span className="text-xs text-[var(--app-muted)]">{localDateString}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-[var(--app-accent)]" />
          <span className="text-xs text-[var(--app-text)]/82">
            {submission.max_cpu_time != null && submission.max_cpu_time !== -1
              ? `${submission.max_cpu_time * 1000} ms`
              : "NA"}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-3 w-3 text-[var(--app-accent)]" />
          <Lock className="h-3 w-3 text-[var(--app-muted)]" />
          <span className="text-xs text-[var(--app-muted)]">percentile</span>
        </div>
        <div className="flex items-center gap-1 text-[var(--app-accent)] transition-colors">
          <Button
            className="h-auto bg-transparent px-0 py-0 text-xs text-[var(--app-accent)] shadow-none hover:bg-transparent hover:text-[var(--app-text)]"
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
