import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import SubmitBar from "./SubmitBar";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCodeStore, useLangStore, useTestCaseStore } from "@/lib/store/codeStore";
import SubmissionResult from "./SubmissionResult";
import ToolBar from "./ToolBar";

const CodeEditor = ({ problemDesc }: { problemDesc: any }) => {
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
      <div className="h-13 bg-black/30">
        <ToolBar/>
      </div>
      <div className="flex-1 border-t border-gray-500 max-h-7/12">
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
      <div className="border-t border-gray-700 bg-black/20 flex-1">
          <SubmissionResult problemDesc={problemDesc} />
      </div>

    </>
  );
};

export default CodeEditor;
