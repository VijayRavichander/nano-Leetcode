import Editor from "@monaco-editor/react";
import { useCodeStore, useLangStore, useSlugStore, useTestCaseStore } from "@/lib/store/codeStore";
import SubmissionResult from "./submission/SubmissionResult";
import ToolBar from "./ToolBar";

const CodeEditor = ({ problemDesc }: { problemDesc: any }) => {
  const { setCodeForSlug, getCurrentCode, resetCodeForSlug } = useCodeStore();
  const { lang } = useLangStore();
  const problemSlug = useSlugStore((state) => state.slug || null);
  const { clearTestCaseStatus } = useTestCaseStore();

  // Get current code for the active problem
  const currentCode = getCurrentCode();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && problemSlug) {
      setCodeForSlug(problemSlug, value);
    }
  };

  const handleReset = () => {
    if (problemSlug && problemDesc?.functionCode) {
      // Get default code for current language, fallback to first available
      const defaultCode = Array.isArray(problemDesc.functionCode)
        ? problemDesc.functionCode.find((fc: any) => fc.language === lang)?.code ||
          problemDesc.functionCode[0]?.code ||
          ""
        : "";
      resetCodeForSlug(problemSlug, defaultCode);
      // Clear test case results for this problem
      clearTestCaseStatus(problemSlug);
    }
  };

  const normalizedForSubmission = {
    ...problemDesc,
    sampleTestCase: problemDesc?.visibleTestCases || [],
  };

  return (
    <div className="flex h-full min-h-screen  flex-col">
      <div className="h-13 bg-black/30">
        <ToolBar onReset={handleReset}/>
      </div>
      <div className="basis-1/2 min-h-60 lg:min-h-0 border-t border-gray-500">
        <Editor
          height="100%"
          defaultLanguage={lang}
          theme="vs-dark"
          value={currentCode}
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
      <div className="flex-1 min-h-0 border-t border-gray-700">
          <SubmissionResult problemDesc={normalizedForSubmission} problemSlug={problemSlug} />
      </div>

    </div>
  );
};

export default CodeEditor;
