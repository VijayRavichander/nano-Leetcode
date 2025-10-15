"use client";

import React from "react";
import { Code2, TimerIcon, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { useTab } from "@/lib/store/uiStore";
import SubmissionTab from "./submission/SubmissionTab";
import LeaderBoardTab from "./LeaderBoard";

interface ProblemDescriptionProps {
  sidebarWidth: number;
  problemDesc: any;
}

function ProblemDescription({
  sidebarWidth,
  problemDesc,
}: ProblemDescriptionProps) {
  const { tab, setTab } = useTab();

  const difficulty = problemDesc?.difficulty;
  const title = problemDesc?.title;
  const description = problemDesc?.description;
  const constraints: string[] = problemDesc?.constraints || [];
  const examples: any[] = problemDesc?.visibleTestCases || [];

  return (
    <>
      <div
        className={`${tab == "problem" ? "" : "hidden"}  md:overflow-y-auto p-6`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="flex justify-between items-center gap-2 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold">
              {title}
            </h1>
          </div>

          <div className="flex justify-between items-center gap-2 mb-6">
            <div
            >
              <Button
                className="text-white/90 hover:bg-neutral-700 text-xs font-normal bg-neutral-800 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setTab("submissions");
                }}
              >
                <TimerIcon className="w-2 h-2" /> Submissions
              </Button>
            </div>
            <div>
              <Button
                className="text-white/90 hover:bg-neutral-700 text-xs font-normal bg-neutral-800 active:scale-95  transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setTab("leaderboard");
                }}
              >
                <Trophy className="w-2 h-2" /> LeaderBoard
              </Button>
            </div>
          </div>
        </div>
        <div></div>
        {/* Difficulty */}
        <div className="mb-6">
          <span
            className={`px-3 py-1 bg-[#1a472f] text-[#00FF9D] rounded-full text-sm ${
              difficulty === "Easy"
                ? "bg-green-900/30 text-green-400"
                : difficulty === "Medium"
                  ? "bg-blue-900/30 text-yellow-400"
                  : "bg-red-900/30 text-red-400"
            }`}
          >
            {difficulty}
          </span>
        </div>

        {/* Problem Description */}
        <p className="text-white/90 mb-8 font-light ">{description}</p>

        {/* Examples */}
        {examples.map((testCase: any, index: number) => (
          <div className="mb-8" key={index}>
            <h2 className="text-sm font-semibold mb-3">Example {index + 1}:</h2>
            <div className="bg-white/5 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-gray-500">Input: </span>
                <span>{testCase.input}</span>
              </div>
              <div>
                <span className="text-gray-500">Output: </span>
                <span>{testCase.output}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Constraints */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3">Constraints</h2>
          <ul className="list-disc list-inside text-white/90 mb-8 font-light text-sm">
            {constraints &&
              constraints.map(
                (constraint: any, index: number) => (
                  <li key={index}>{constraint}</li>
                )
              )}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Topics</h2>
          {/* TODO */}
          {problemDesc?.tags.map((tag: any) => (
            <span key={tag} className="text-sm  mr-2 bg-white/10 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <SubmissionTab sidebarWidth={sidebarWidth} />
        <LeaderBoardTab sidebarWidth={sidebarWidth} />
      </div>
    </>
  );
}

export default ProblemDescription;
