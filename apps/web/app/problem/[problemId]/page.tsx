"use client";

import ProblemDescription from "@/components/ProblemDescription";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { Loader2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { useParams } from 'next/navigation';
import { useCodeStore, useSlugStore } from "@/lib/store/codeStore";
import { useNavBarStore, useProblemIDStore } from "@/lib/store/uiStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

function App() {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [problemDesc, setProblemDesc] = useState({});
  const [metaData, setMetaData] = useState({});
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { problemId } = useParams();
  const {c, setC} = useCodeStore();
  const {slug, setSlug} = useSlugStore();
  const {problemIDStore, setProblemIDStore} = useProblemIDStore();
  const {show, setShow} = useNavBarStore();
  const router = useRouter();


  // Data fetching moved from ProblemDescription to here
  useEffect(() => {
    const getProblem = async () => {
      try {
        setShow(true)
        const res = await axios.get(`${BACKEND_URL}/v1/getProblem?slug=${problemId}`);
        const data = res.data.problemInfo;
        setProblemDesc(data);
        setSlug(problemId as string);
        setC(data.functionCode.cpp);
        setProblemIDStore(res.data.problemInfo.id);
        setIsLoading(false);
        console.log(data)
      } catch (error) {
        router.push("/internal-server-error")
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
        <Loader color = {"amber"} />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1E1E1E] text-white">
      <ProblemDescription 
        sidebarWidth={sidebarWidth}
        problemDesc={problemDesc}
      />

      <div
        className="w-1 cursor-col-resize bg-transparent hover:bg-gray-700 active:bg-gray-600 transition-colors"
        onMouseDown={startResizing}
      />
      <div className="flex-1 flex flex-col border-l border-gray-700">
        <CodeEditor problemDesc={problemDesc}/>
      </div>
    </div>
  );
}

export default App;