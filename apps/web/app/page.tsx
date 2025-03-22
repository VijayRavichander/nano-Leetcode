"use client"
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { ArrowRight, Brain, Code2, Github, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black">
      {/* Navigation */}

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="shape w-72 h-72 -left-20 top-20 shape-animation"></div>
        <div className="shape w-96 h-96 -right-20 top-40 shape-animation-reverse"></div>
        <div className="shape w-64 h-64 left-1/4 bottom-0 shape-animation"></div>

        {/* Content */}
        <div className="relative text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
            Master Your Coding Journey
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Practice coding, prepare for interviews, and land your dream job
          </p>
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg text-lg hover:bg-purple-700 transition flex items-center mx-auto backdrop-blur-sm"
          onClick = {() => {router.push("/problem")}}>
            Start Coding Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Features */}

    </div>
  );
}
