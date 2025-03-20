import React, { useState, useCallback } from 'react';
import { Code2, Play, RotateCcw } from 'lucide-react';

const defaultCode = `#include "solve.h"
#include <cuda_runtime.h>

__global__ void vector_add(const float* A, const float* B, float* C, int N) {
}

// A, B, C are device pointers (i.e. pointers to memory on the GPU)
void solve(const float* A, const float* B, float* C, int N) {
    int threadsPerBlock = 256;
    int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;
    
    vector_add<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, N);
    cudaDeviceSynchronize();
}`;

function App() {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const [code, setCode] = useState(defaultCode);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  React.useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1E1E1E] text-white">
      {/* Left Sidebar */}
      <div 
        className="border-r border-gray-700 overflow-y-auto"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-6 h-6 text-[#00FF9D]" />
            <h1 className="text-xl font-semibold">Vector Addition</h1>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <span className="px-3 py-1 bg-[#1a472f] text-[#00FF9D] rounded-full text-sm">
              Easy
            </span>
          </div>

          {/* Problem Description */}
          <p className="text-gray-300 mb-8">
            Implement program that performs element-wise addition of two vectors containing 32-bit floating point 
            numbers on a GPU. The program should take two input vectors of equal length and produce a single 
            output vector containing their sum.
          </p>

          {/* Implementation Requirements */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Implementation Requirements</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>External libraries are not permitted</li>
              <li>The <code className="bg-gray-800 px-1 rounded">solve</code> function signature must remain unchanged</li>
              <li>The final result must be stored in vector <code className="bg-gray-800 px-1 rounded">C</code></li>
            </ul>
          </div>

          {/* Example 1 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Example 1:</h2>
            <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-gray-500">Input: </span>
                <span>A = [1.0, 2.0, 3.0, 4.0]</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500">      </span>
                <span>B = [5.0, 6.0, 7.0, 8.0]</span>
              </div>
              <div>
                <span className="text-gray-500">Output: </span>
                <span>C = [6.0, 8.0, 10.0, 12.0]</span>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Example 2:</h2>
            <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-gray-500">Input: </span>
                <span>A = [1.5, 1.5, 1.5]</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500">      </span>
                <span>B = [2.3, 2.3, 2.3]</span>
              </div>
              <div>
                <span className="text-gray-500">Output: </span>
                <span>C = [3.8, 3.8, 3.8]</span>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Constraints</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Input vectors <code className="bg-gray-800 px-1 rounded">A</code> and <code className="bg-gray-800 px-1 rounded">B</code> have identical lengths</li>
              <li>1 ≤ <code className="bg-gray-800 px-1 rounded">N</code> ≤ 100,000,000</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resizer */}
      <div
        className="w-1 cursor-col-resize bg-transparent hover:bg-gray-700 active:bg-gray-600 transition-colors"
        onMouseDown={startResizing}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <select className="bg-[#2D2D2D] text-white border border-gray-700 rounded px-3 py-1.5 text-sm">
              <option>NVIDIA TESLA T4</option>
            </select>
            <select className="bg-[#2D2D2D] text-white border border-gray-700 rounded px-3 py-1.5 text-sm">
              <option>CUDA</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white px-4 py-1.5 rounded text-sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm">
              <Play className="w-4 h-4" />
              Run
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm">
              Submit
            </button>
          </div>
        </div>

        {/* Editor */}
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
            {/* Console output will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;