import { redirect } from "next/navigation";
import ProblemWorkspace from "@/components/problem/ProblemWorkspace";
import { getProblemDetailBySlug } from "@/lib/problem/get-problem-detail";

interface ProblemPageProps {
  params: Promise<{
    problemId: string;
  }>;
}

const ProblemPage = async ({ params }: ProblemPageProps) => {
  const { problemId } = await params;
  const problem = await getProblemDetailBySlug(problemId);

  if (!problem) {
    redirect("/internal-server-error");
  }

  return <ProblemWorkspace problem={problem} problemSlug={problemId} />;
};

export default ProblemPage;
