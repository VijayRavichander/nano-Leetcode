"use client";
import React from "react";
import { Code2 } from "lucide-react";

interface ProblemDescriptionProps {
  sidebarWidth: number;
  problemDesc: any;
  metaData: any;
  sampleTestCases: any[];
}

function ProblemDescription({ 
  sidebarWidth,
  problemDesc,
  metaData,
  sampleTestCases
}: ProblemDescriptionProps) {
  
  return (
    <div 
      className="border-r border-gray-700 overflow-y-auto p-6"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Code2 className="w-6 h-6 text-[#00FF9D]" />
        <h1 className="text-xl font-semibold">{metaData.title}</h1>
      </div>
      <div></div>
      {/* Difficulty */}
      <div className="mb-6">
        <span className="px-3 py-1 bg-[#1a472f] text-[#00FF9D] rounded-full text-sm">
          {metaData.difficulty}
        </span>
      </div>

      {/* Problem Description */}
      <p className="text-gray-300 mb-8">{metaData.description}</p>

      {/* Examples */}
      {sampleTestCases.map((testCase: any, index: number) => (
        <div className="mb-8" key={index}>
          <h2 className="text-lg font-semibold mb-3">Example {index + 1}:</h2>
          <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2">
              <span className="text-gray-500">Input: </span>
              <span>{testCase.Input}</span>
            </div>
            <div>
              <span className="text-gray-500">Output: </span>
              <span>{testCase.Output}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Constraints */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Constraints</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          {metaData.constraints && metaData.constraints.map((constraint: any, index: number) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Topics</h2>
        {/* TODO */}
      </div>
    </div>
  );
}

export default ProblemDescription;