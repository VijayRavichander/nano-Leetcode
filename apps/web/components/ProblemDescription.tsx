"use client";
import React, { useEffect, useState } from "react";
import { Code2, Loader2 } from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

function ProblemDescription({sidebarWidth} : {sidebarWidth: number}) {
  useEffect(() => {
    const getProblem = async () => {
      const res = await axios.get(`${BACKEND_URL}/v1/getProblem?slug=two-sum`);
      const data = res.data.problemInfo;
      setProblemDesc(data);

      const metaData = await JSON.parse(data.metaData);
      const testCases = data.sampleTestCase.map((testCase: any) => {
        // Parse the string into a JSON object
        return JSON.parse(testCase);
      });

      setMetaData(metaData);
      setSampleTestCases(testCases);
      setIsLoading(false);

      console.log(metaData);
      console.log(testCases);
    };

    getProblem();
  }, []);

  const [problemDesc, setProblemDesc] = useState({});
  const [metaData, setMetaData] = useState({});
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <div className="flex text-center justify-center"><Loader2 /></div>;
  }
  {/* Left Sidebar */}
  return (
      <div className="border-r border-gray-700 overflow-y-auto p-6"
      style={{ width: `${sidebarWidth}px` }}>
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

        {/* Example 1 */}
        {sampleTestCases.map((testCase: any, index: number) => (
          <div className="mb-8" key = {index}>
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
            {metaData.constraints.map((constraint: any, index: number) => (
              <li key = {index}>{constraint}</li>
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
