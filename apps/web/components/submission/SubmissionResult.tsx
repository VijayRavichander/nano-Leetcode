import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckIcon, X } from "lucide-react";
import { useExecutionStore, useTestCaseStatusForSlug } from "@/lib/store/executionStore";
import type { VisibleTestCase } from "@/lib/types/problem";

const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[var(--app-panel-muted)] ${className}`} />
);

export const SubmissionResultSkeleton = () => {
  const placeholderTabs = Array.from({ length: 2 });

  return (
    <div className="h-full overflow-auto bg-[var(--app-panel)]">
      <div className="h-full overflow-auto px-3.5 py-3 text-sm text-[var(--app-muted)]">
        <div className="flex flex-wrap gap-2 pb-4">
          {placeholderTabs.map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="flex h-8 w-24 flex-col items-center justify-center rounded-lg border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-3"
            >
              <SkeletonPulse className="h-2 w-14" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <SkeletonPulse className="h-5 w-24" />
            <SkeletonPulse className="h-4 w-24" />
          </div>

          <div className="space-y-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-panel-muted)] p-4">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-4 w-48" />
            <SkeletonPulse className="h-2 w-full" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface SubmissionResultProps {
  problemDesc: {
    sampleTestCase: VisibleTestCase[];
  };
  problemSlug: string | null;
}

const getStatusColor = (description?: string) => {
  if (!description) {
    return "text-[var(--app-muted)]";
  }

  switch (description) {
    case "Accepted":
      return "text-[var(--app-success-text)]";
    case "Wrong Answer":
    case "Runtime Error":
      return "text-[var(--app-danger-text)]";
    case "Compilation Error":
      return "text-[var(--app-danger-text)]";
    case "Time Limit Exceeded":
      return "text-[var(--app-danger-text)]";
    case "Memory Limit Exceeded":
      return "text-[var(--app-warning-text)]";
    default:
      return "text-[var(--app-danger-text)]";
  }
};

const buildTestCaseKey = (testCase: VisibleTestCase, index: number): string => {
  return `${index}-${testCase.input}-${testCase.output}`;
};

const SubmissionResult = ({ problemDesc, problemSlug }: SubmissionResultProps) => {
  const isRunning = useExecutionStore((state) => state.isRunning);
  const testCaseStatus = useTestCaseStatusForSlug(problemSlug);

  const sampleTestCases = Array.isArray(problemDesc.sampleTestCase)
    ? problemDesc.sampleTestCase
    : [];

  if (sampleTestCases.length === 0 || isRunning) {
    return <SubmissionResultSkeleton />;
  }

  return (
    <div className="h-full overflow-auto bg-[var(--app-panel)]">
      <div className="h-full overflow-auto">
        <div className="px-3.5 py-3 text-sm">
          <Tabs defaultValue="0" className="text-sm text-[var(--app-muted)]">
            <div className="rounded-xl bg-[var(--app-panel)]">
              <TabsList className="bg-[var(--app-panel-muted)] p-1.5">
                {sampleTestCases.map((testCase, index) => {
                  const status = testCaseStatus[index];
                  const isAccepted = status?.description === "Accepted";
                  const isRejected = Boolean(status) && !isAccepted;

                  return (
                    <TabsTrigger
                      key={buildTestCaseKey(testCase, index)}
                      value={index.toString()}
                      className="mx-1 px-2.5 py-1.5 text-xs font-medium text-[var(--app-muted)] data-[state=active]:bg-[var(--app-panel)] data-[state=active]:text-[var(--app-text)]"
                    >
                      <div>Test Case {index + 1}</div>
                      <div>
                        {isAccepted ? (
                          <CheckIcon
                            className="ml-1.5 h-4 w-4 text-[var(--app-success-text)]"
                            strokeWidth={3}
                          />
                        ) : null}
                        {isRejected ? (
                          <X
                            className="ml-1.5 h-4 w-4 text-[var(--app-danger-text)]"
                            strokeWidth={3}
                          />
                        ) : null}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="mt-2 py-1">
              {sampleTestCases.map((testCase, index) => {
                const status = testCaseStatus[index];
                const statusColor = getStatusColor(status?.description);

                return (
                  <TabsContent
                    key={buildTestCaseKey(testCase, index)}
                    value={index.toString()}
                    className="py-2"
                  >
                    <div className="flex items-center justify-between px-1 pb-4 pt-1 text-sm">
                      <div className={`text-base font-semibold ${statusColor}`}>
                        {status?.description ?? "Not run"}
                      </div>
                      <div className="text-xs text-[var(--app-muted)]">
                        {status ? `Runtime: ${status.time * 1000} ms` : "Runtime: --"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-panel-muted)] px-3 py-2.5 font-mono text-[11px] leading-5 text-[var(--app-text)]">
                      {testCase.input}
                    </div>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
