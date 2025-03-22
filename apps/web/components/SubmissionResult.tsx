import { useTestCaseStore } from "@/lib/store/codeStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CheckIcon, Circle, X } from "lucide-react";

const SubmissionResult = ({ problemDesc }: { problemDesc: any }) => {
  const { testCaseStatus, setTestCaseStatus } = useTestCaseStore();

  const allPassed =
  testCaseStatus?.length &&
  testCaseStatus.every((test) => test.description === "Accepted");

  return (
    <>
      {/* Console Output */}
      <div className="h-48">
        <div className={`p-2 text-xl font-semibold my-3 mx-5 ${testCaseStatus?.length > 0 ? "" : "hidden"}`}>
          {testCaseStatus?.length > 0 ? (
            <span
              className={`px-3 py-2 rounded-lg ${
                allPassed ? "text-green-500" : "bg-red-200 text-red-800"
              }`}
            >
              {allPassed ? "Accepted" : "Failed"}
            </span>
          ) : null}
        </div>
        <div className="p-4 font-mono text-sm">
          <Tabs defaultValue="0" className="font-mono text-sm text-gray-300">
            <div className=" bg-black/10 rounded-2xl ">
              <TabsList className="bg-black/10 py-5 ">
                {problemDesc.sampleTestCase.map((t: any, index: number) => {
                  let circleColor = "";

                  if (testCaseStatus && testCaseStatus.length != 0) {
                    console.log(testCaseStatus[index]);
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
                      className="font-mono text-sm text-gray-600 mx-5 py-4 data-[state=active]:text-blue-500 data-[state=active]:bg-black"
                    >
                      <div>Test Case {index + 1}</div>
                      <div>
                        {circleColor === "green" && (
                          <CheckIcon className="ml-2 w-5 h-5 text-green-500" />
                        )}
                        {circleColor === "red" && (
                          <X className="ml-2 w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="my-3 bg-black/40 rounded-2xl px-5">
              {problemDesc.sampleTestCase.map((testcase: any, index: number) => (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="py-4"
                >
                  {testcase.input}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SubmissionResult;
