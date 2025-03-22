"use client";

import ContributionsHeatmap from "@/components/HeatMap";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { GithubIcon } from "lucide-react";

const USERID = "test";

export default function Profile() {
  const router = useRouter();
  const [contributions, setContributions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getContributions = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/v1/getContributions?userId=${USERID}`
        );
        const submissions = res.data.submissions;
        console.log(submissions)
        setContributions(submissions)
        setIsLoading(false)
      } catch (error) {
        router.push("/internal-server-error");
      }
    };

    getContributions();
  }, []);

  if(isLoading){
    return <div>
        <Loader color="green" />
    </div>
  }

  return (
    <div className="relative min-h-screen bg-black/90 px-16 py-8">
    <div className="max-w-5xl">
      <div className="glass-effect rounded-xl p-6">
        <ContributionsHeatmap data={contributions} />
      </div>
    </div>
  </div>
  );
}
