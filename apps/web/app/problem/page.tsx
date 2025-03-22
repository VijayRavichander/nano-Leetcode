"use client";

import ProblemDescription from "@/components/ProblemDescription";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { CheckCircle2, ChevronRight } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useNavBarStore } from "@/lib/store/uiStore";
import { useRouter } from "next/navigation";

import Loader from "@/components/Loader";

// interface Challenge {
//   id: string;
//   title: string;
//   difficulty: "Easy" | "Medium" | "Hard";
//   description: string;
//   completed?: boolean;
//   slug?: string;
// }

// const challenges: Challenge[] = [
//   {
//     id: "1",
//     title: "Add Sum",
//     difficulty: "Easy",
//     description:
//       "Find the sum of two given elements. Both the numbers will always be 0 or positive.",
//     completed: true,
//     slug: "two-sum",
//   },
//   {
//     id: "2",
//     title: "Matrix Multiplication",
//     difficulty: "Easy",
//     description:
//       "Write a program that multiplies two matrices of 32-bit floating point numbers on a GPU.",
//   },
//   {
//     id: "3",
//     title: "Matrix Transpose",
//     difficulty: "Easy",
//     description:
//       "Write a program that transposes a matrix of 32-bit floating point numbers on a GPU.",
//   },
//   {
//     id: "4",
//     title: "Softmax",
//     difficulty: "Easy",
//     description:
//       "Write a program that computes the softmax function for an array of 32-bit floating-point numbers.",
//   },
//   {
//     id: "5",
//     title: "Color Inversion",
//     difficulty: "Easy",
//     description:
//       "Write a CUDA program to invert the colors of an image. The image is represented as a 1D array.",
//   },
//   {
//     id: "6",
//     title: "Reduction",
//     difficulty: "Medium",
//     description:
//       "Write a CUDA program that performs parallel reduction on an array of 32-bit floating point numbers.",
//   },
// ];

interface MetaData {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  constraints: string[];
  tags: string[];
}

interface Problem {
  metaData: MetaData;
  slug: string;
}

function App() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { show, setShow } = useNavBarStore();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // const filteredChallenges = challenges.filter((challenge) => {
  //   const matchesDifficulty =
  //     filter === "All" || challenge.difficulty === filter;
  //   const matchesSearch =
  //     challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesDifficulty && matchesSearch;
  // });

  useEffect(() => {
    setShow(false);
    setIsLoading(true);
    const getProblems = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/v1/getproblems`);
        // await new Promise((resolve) => setTimeout(resolve, 4000))
        const problems: Problem[] = res.data.problems;
        setProblems(problems);
        setIsLoading(false);
      } catch (error) {
        router.push("/internal-server-error");
        // console.error("Something Went Wrong", error)
      }
    };
    getProblems();
  }, []);

  if (isLoading) {
    return (
      <Loader color = {"purple"} />
    )
  }

  return (
    <div className="min-h-screen bg-black px-32 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((challenge, index) => (
          <div
            key={index}
            className="bg-[#2a2a2a] rounded-lg p-6 hover:bg-[#3a3a3a] transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    challenge.metaData.difficulty === "Easy"
                      ? "bg-green-900/30 text-green-400"
                      : challenge.metaData.difficulty === "Medium"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-red-900/30 text-red-400"
                  }`}
                >
                  {challenge.metaData.difficulty}
                </span>
                {/* {challenge.completed && (
                    <span className="ml-2 text-[#4ecca3]">
                      <CheckCircle2 className="w-5 h-5 inline" />
                    </span>
                  )} */}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              {challenge.metaData.title}
            </h3>
            <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
              {challenge.metaData.description}
            </p>
            <div className="flex items-center text-[#8c53e1] group-hover:translate-x-1 transition-transform">
              <Link href={`/problem/${challenge.slug}`}>
                <Button
                  // asChild
                  variant="outline"
                  className="text-[#8c53e1] bg-black/50 border-0"
                >
                  <span className="mr-1 text-sm">Solve Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
