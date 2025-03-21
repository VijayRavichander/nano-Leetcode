"use client";

import ProblemDescription from "@/components/ProblemDescription";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { Loader2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

function App() {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [problemDesc, setProblemDesc] = useState({});
  const [metaData, setMetaData] = useState({});
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data fetching moved from ProblemDescription to here
  useEffect(() => {
    const getProblem = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/v1/getProblem?slug=two-sum`);
        const data = res.data.problemInfo;
        setProblemDesc(data);

        const metaData = await JSON.parse(data.metaData);
        const testCases = data.sampleTestCase.map((testCase: any) => {
          return JSON.parse(testCase);
        });

        setMetaData(metaData);
        setSampleTestCases(testCases);
        setIsLoading(false);

        console.log(metaData);
        console.log(testCases);
      } catch (error) {
        console.error("Error fetching problem data:", error);
        setIsLoading(false);
      }
    };

    getProblem();
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        // Limit the sidebar width between 300px and 800px
        if (newWidth >= 300 && newWidth <= 1000) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1E1E1E]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1E1E1E] text-white">
      <ProblemDescription 
        sidebarWidth={sidebarWidth}
        problemDesc={problemDesc}
        metaData={metaData}
        sampleTestCases={sampleTestCases}
      />

      <div
        className="w-1 cursor-col-resize bg-transparent hover:bg-gray-700 active:bg-gray-600 transition-colors"
        onMouseDown={startResizing}
      />
      <div className="flex-1 flex flex-col">
        <CodeEditor sampleTestCases={sampleTestCases}/>
      </div>
    </div>
  );
}

export default App;