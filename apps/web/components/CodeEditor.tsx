import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import SubmitBar from "./SubmitBar";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCodeStore, useLangStore, useTestCaseStore } from "@/lib/store/codeStore";
import SubmissionResult from "./SubmissionResult";

const CodeEditor = ({ sampleTestCases }: { sampleTestCases: any }) => {
  const { c, setC } = useCodeStore();
  const { lang, setLang } = useLangStore();
  const { testCaseStatus, setTestCaseStatus } = useTestCaseStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setC(value);
    }
  };

  return (
    <>
      {/* <div className="h-15"><SubmitBar code={code} /></div> */}
      <div className="flex-1 mt-4">
        <Editor
          height="100%"
          defaultLanguage={lang}
          theme="vs-dark"
          value={c}
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
      <div>
          <SubmissionResult sampleTestCases={sampleTestCases} />
      </div>

    </>
  );
};

export default CodeEditor;
