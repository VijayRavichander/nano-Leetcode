import { useTestCaseStore } from "@/lib/store/codeStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CheckIcon, X } from "lucide-react";
import { useRunButtonState } from "@/lib/store/uiStore";
const EMPTY_TEST_RESULTS: {
  id: number;
  description: string;
  time: number;
  memory: number;
  stdout: string;
}[] = [];

const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
);

export const SubmissionResultSkeleton = () => {
  const placeholderTabs = Array.from({ length: 2 });

  return (
    <div className="h-full bg-[#121212] overflow-auto">
      <div className="h-full overflow-auto py-2 px-4 text-sm text-gray-300">
        <div className="flex flex-wrap gap-4 pb-6">
          {placeholderTabs.map((_, index) => (
            <div
              key={index}
              className="flex w-32 h-10 flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/10 px-4 py-4"
            >
              <SkeletonPulse className="h-2 w-20" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <SkeletonPulse className="h-6 w-32" />
            <SkeletonPulse className="h-4 w-24" />
          </div>

          <div className="space-y-4 rounded-2xl border border-white/5 bg-white/10 p-5">
            <SkeletonPulse className="h-4 w-36" />
            <SkeletonPulse className="h-4 w-64" />
            <SkeletonPulse className="h-2 w-full" />
            <SkeletonPulse className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionResult = ({
  problemDesc,
  problemSlug,
}: {
  problemDesc: any;
  problemSlug: string | null;
}) => {
  const { isRunning } = useRunButtonState();

  const testCaseStatus = useTestCaseStore((state) =>
    problemSlug
      ? (state.statusBySlug[problemSlug] ?? EMPTY_TEST_RESULTS)
      : EMPTY_TEST_RESULTS
  );

  const sampleTestCases = Array.isArray(problemDesc?.sampleTestCase)
    ? problemDesc.sampleTestCase
    : null;

  if (!sampleTestCases || isRunning) {
    return <SubmissionResultSkeleton />;
  }

  const allPassed =
    testCaseStatus?.length &&
    testCaseStatus.every((test) => test.description === "Accepted");

  const getStatusColor = (description?: string) => {
    if (!description) {
      return "text-gray-500";
    }

    switch (description) {
      case "Accepted":
        return "text-emerald-400";
      case "Wrong Answer":
      case "Runtime Error":
        return "text-red-400";
      case "Compilation Error":
        return "text-rose-400";
      case "Time Limit Exceeded":
        return "text-red-500";
      case "Memory Limit Exceeded":
        return "text-amber-400";
      default:
        return "text-red-700";
    }
  };

  return (
    <div className="h-full bg-[#121212] overflow-auto">
      {/* Console Output */}
      <div className="h-full overflow-auto">
        {/* <div
          className={`py-1 px-4 text-xl font-semibold my-3 ${testCaseStatus?.length > 0 ? "" : "hidden"}`}
        >
          {testCaseStatus?.length > 0 ? (
            <span
              className={`px-2 py-2 rounded-lg text-sm bg-black/95 ${
                allPassed ? "text-green-500" : "text-red-800"
              }`}
            >
              {allPassed ? "Accepted" : "Failed"}
            </span>
          ) : null}
        </div> */}
        <div className="py-2 px-4 text-sm">
          <Tabs defaultValue="0" className="font-mono text-sm text-gray-300">
            <div className=" bg-[#121212] rounded-2xl ">
              <TabsList className="bg-neutral-950 py-6">
                {sampleTestCases.map((t: any, index: number) => {
                  let circleColor = "";

                  if (testCaseStatus && testCaseStatus.length != 0) {
                    if (testCaseStatus[index]!.description === "Accepted") {
                      circleColor = "green";
                    } else if (
                      testCaseStatus[index]!.description !== "Accepted"
                    ) {
                      circleColor = "red";
                    }
                  }

                  return (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="font-mono text-sm text-white/80 mx-5 py-4 px-3!  data-[state=active]:text-white data-[state=active]:bg-neutral-800"
                    >
                      <div>Test Case {index + 1}</div>
                      <div>
                        {circleColor === "green" && (
                          <CheckIcon
                            className=" ml-2 w-5 h-5 text-green-500"
                            strokeWidth={3}
                          />
                        )}
                        {circleColor === "red" && (
                          <X
                            className="ml-2 w-5 h-5 text-red-500"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="my-1 py-2">
              {sampleTestCases.map((testcase: any, index: number) => {
                const status = testCaseStatus[index];
                const statusColor = getStatusColor(status?.description);

                return (
                  <TabsContent
                    key={index}
                    value={index.toString()}
                    className="py-2"
                  >
                    <div className="flex text-sm justify-between px-2 pb-6 pt-2">
                      <div className={`text-lg font-bold ${statusColor}`}>
                        {status && status.description}
                      </div>
                      <div className="">
                        {status && "Runtime: " + status.time * 1000 + " ms"}
                      </div>
                    </div>

                    <div className="bg-neutral-950 rounded-2xl py-4 px-5">
                      {testcase.input}
                    </div>
                    <div>{/* {status && status.memory + " KB"} */}</div>
                    <div>{/* {status && status.stdout} */}</div>
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
