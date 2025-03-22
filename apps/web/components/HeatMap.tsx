"use client";
import React from "react";

interface Submission {
  createdAt: string;
}

interface ContributionDay {
  date: string;
  count: number;
}

const ContributionsHeatmap = ({ data }: { data: Submission[] }) => {
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-400";
    if (count <= 2) return "bg-green-900";
    if (count <= 3) return "bg-green-700";
    if (count <= 4) return "bg-green-500";
    return "bg-green-300";
  };

  const transformSubmissionsToContributionDays = (
    inputData: Submission[]
  ): ContributionDay[] => {
    // Get current date and date from 365 days ago
    const today = new Date();

    // Initialize result array with all dates in the past year having 0 count
    const result: ContributionDay[] = [];
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push({
        date: date.toISOString().split("T")[0] || "",
        count: 0,
      });
    }

    // Create a map for faster lookups
    const dateCountMap = new Map(result.map((item) => [item.date, item]));
    console.log(inputData);
    // Count submissions for each date
    if (inputData) {
      inputData.forEach((submission) => {
        const date = new Date(submission.createdAt).toISOString().split("T")[0] || "";
        const entry = dateCountMap.get(date);
        if (entry) {
          entry.count++;
        }
      });
    }

    return result;
  };

  const contributionsData = transformSubmissionsToContributionDays(data);
  console.log(contributionsData);
  const weeks = [];

  for (let i = 0; i < contributionsData.length; i += 7) {
    weeks.push(contributionsData.slice(i, i + 7));
  }

  return (
    <div className="p-4 bg-black rounded-lg shadow-md max-w-fit">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Contribution Activity
      </h2>
      <div className="flex gap-1 max-w-fit">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3  ${getColor(day.count)}`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3  bg-gray-400" />
          <div className="w-3 h-3  bg-green-900" />
          <div className="w-3 h-3  bg-green-700" />
          <div className="w-3 h-3  bg-green-500" />
          <div className="w-3 h-3  bg-green-300" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionsHeatmap;
