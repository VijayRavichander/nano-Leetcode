"use client";

import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { useProblemData } from "@/lib/hooks/useProblemData";
import ProblemWorkspace from "@/components/problem/ProblemWorkspace";

const ProblemPage = () => {
  const params = useParams<{ problemId: string }>();
  const problemIdParam = params?.problemId;
  const problemSlug = Array.isArray(problemIdParam)
    ? problemIdParam[0] ?? ""
    : (problemIdParam ?? "");

  const { problem, isLoading } = useProblemData(problemSlug);

  if (isLoading || !problem) {
    return <Loader />;
  }

  return (
    <ProblemWorkspace problem={problem} />
  );
};

export default ProblemPage;
