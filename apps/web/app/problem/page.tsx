"use client";

import CodeEditor from "@/components/CodeEditor";
import ProblemDescription from "@/components/ProblemDescription";
import React, { useState, useCallback } from "react";

function App() {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(500);

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
        if (newWidth >= 300 && newWidth <= 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex min-h-screen bg-[#1E1E1E] text-white">
      <ProblemDescription sidebarWidth={sidebarWidth} />

      <div
        className="w-1 cursor-col-resize bg-transparent hover:bg-gray-700 active:bg-gray-600 transition-colors"
        onMouseDown={startResizing}
      />
      <div className="flex-1 flex flex-col">
        {/* Content will be added in the next step */}
        <CodeEditor />
      </div>
    </div>
  );
}

export default App;
