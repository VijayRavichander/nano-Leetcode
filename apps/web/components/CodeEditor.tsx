import Editor from "@monaco-editor/react";
import { useState } from "react";
import SubmitBar from "./SubmitBar";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const defaultCode =
  "int sum(int num1, int num2) { \n    // Implementation goes here   \n  return result; }";

const CodeEditor = ({ sampleTestCases }: { sampleTestCases: any }) => {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState("cpp");

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };
  return (
    <>
      <div className="h-15">
        <SubmitBar code={code} />
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Console Output */}
      <div className="h-48 border-t border-gray-700 bg-black/20">
        <div className="p-4 font-mono text-sm">
          <Tabs defaultValue="0" className="font-mono text-sm text-gray-300">
            <div className="border-black bg-black/10 rounded-2xl">
            <TabsList className="bg-black/40">
              {sampleTestCases.map((t, index: number) => (
                <TabsTrigger key= {index} value={index.toString()} className="font-mono text-sm text-black-300 mx-5">
                  Test Case {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            </div>
            <div className="my-3 bg-black/40 rounded-2xl px-5">
            {sampleTestCases.map((testcase, index: number) => (
              <TabsContent key = {index} value={index.toString()} className="py-4">
                {testcase.Input}
              </TabsContent>
            ))}
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
