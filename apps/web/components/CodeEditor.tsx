import Editor from "@monaco-editor/react";
import { useState } from "react";
import SubmitBar from "./SubmitBar";

const defaultCode = "int sum(int num1, int num2) { \n    // Implementation goes here   \n  return result; }"
const CodeEditor = () => {

  const [code, setCode] = useState(defaultCode);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };
  return (
    <>
      <div className="h-15">
        <SubmitBar code = {code}/>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="cpp"
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
      <div className="h-48 border-t border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <span className="text-sm text-gray-400">Console Output</span>
          <button className="text-sm text-gray-400 hover:text-white">
            clear
          </button>
        </div> 
        <div className="p-4 font-mono text-sm text-gray-300">
        </div>
      </div>


    </>
  );
};


export default CodeEditor;