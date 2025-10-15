"use client";

import ProblemDescription from "@/components/ProblemDescription";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import CodeEditor from "@/components/CodeEditor";
import { useParams } from "next/navigation";
import { useCodeStore, useSlugStore } from "@/lib/store/codeStore";
import { useNavBarStore, useProblemIDStore } from "@/lib/store/uiStore";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

function App() {
  // States
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [problemDesc, setProblemDesc] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Stores
  const { setCodeForSlug, getCodeForSlug, setCurrentSlug } = useCodeStore();
  const setSlug = useSlugStore((s) => s.setSlug);
  const setShow = useNavBarStore((s) => s.setShow);
  const { setProblemIDStore } = useProblemIDStore();
  

  // Hooks
  const { problemId: urlSlug } = useParams();
  const router = useRouter();

  useEffect(() => {
    const getProblem = async () => {
      try {
        // Initialize UI state
        setShow(true);

        // Fetch problem data
        const res = await axios.get(`/api/getProblem?slug=${urlSlug}`);
        const data = res.data;

        // Set problem-related state
        setProblemDesc(data);
        setSlug(urlSlug as string);
        setProblemIDStore(data.id);
        setCurrentSlug(urlSlug as string);

        // Get default code for this problem
        const defaultCode = Array.isArray(data?.functionCode)
          ? data.functionCode.find((fc: any) => fc.language === "cpp")?.code ||
            data.functionCode[0]?.code ||
            ""
          : "";

        // Check if we have saved code for this problem
        const savedCode = getCodeForSlug(urlSlug as string);
        
        // Use saved code if it exists, otherwise use default
        const codeToUse = savedCode || defaultCode;
        
        // Set the code for this problem (this will persist it)
        setCodeForSlug(urlSlug as string, codeToUse);
        
        setIsLoading(false);

      } catch (error) {
        // Handle error
        router.push("/internal-server-error");
      }
    };

    getProblem();

    return () => {
      setShow(false);
    };
  }, [urlSlug, setProblemIDStore, setShow, setSlug, setCodeForSlug, getCodeForSlug, setCurrentSlug, router]);

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
        if (newWidth >= 0 && newWidth <= 1000) {
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
    return <Loader colorClass={"text-violet-400"} />;
  }

  return (
    <div className="flex flex-col md:flex-row lg:min-h-screen bg-[#121212] text-white max-h-screen overflow-y-scroll md:overflow-y-auto">
      <ProblemDescription
        sidebarWidth={sidebarWidth}
        problemDesc={problemDesc}
      />
      <div
        className="hidden md:block w-1 cursor-col-resize bg-transparent hover:bg-gray-700 active:bg-gray-600 transition-colors "
        onMouseDown={startResizing}
      />
      <div className="flex-1 min-h-0 flex flex-col border-l border-gray-700 border-t md:border-t-0 max-h-screen">
        <CodeEditor problemDesc={problemDesc} />
      </div>
    </div>
  );
}

export default App;
