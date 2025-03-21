import { useTestCaseStore } from "@/lib/store/codeStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Circle } from "lucide-react";


const SubmissionResult = ({ sampleTestCases }: { sampleTestCases: any }) => {


    const { testCaseStatus, setTestCaseStatus } = useTestCaseStore();

    return (<>
          {/* Console Output */}
          <div className="h-48 border-t border-gray-700 bg-black/20">
        <div className="p-4 font-mono text-sm">
          <Tabs defaultValue="0" className="font-mono text-sm text-gray-300">
            <div className=" bg-black/10 rounded-2xl ">
              <TabsList className="bg-black/40 py-5 ">
                {sampleTestCases.map((t: any, index: number) => {
                  let circleColor = "";

                  if (testCaseStatus && testCaseStatus.length != 0) {
                    console.log(testCaseStatus[index]);
                    if (testCaseStatus[index]!.description === "Accepted") {
                      circleColor = "text-green-500";
                    } else if (testCaseStatus[index]!.description !== "Accepted") {
                      circleColor = "text-red-500";
                    }
                  }

                  return (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="font-mono text-sm text-black-300 mx-5 py-4 data-[state=active]:text-blue-500 data-[state=active]:bg-blue-100"
                    >
                      <div>Test Case {index + 1}</div>
                      <div>
                        <Circle
                          className={
                            circleColor.length > 0
                              ? `${circleColor}`
                              : `hidden`
                          }
                        />
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="my-3 bg-black/40 rounded-2xl px-5">
              {sampleTestCases.map((testcase, index: number) => (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="py-4"
                >
                  {testcase.Input}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </>)
}

export default SubmissionResult;