import Problems from "@/components/Problems";
import { db } from "@repo/db";
import type { ProblemListItem } from "@/lib/types/problem";

export default async function App() {
  const problems = await db.problem.findMany({
    where: {},
    select: {
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
    },
  });

  const res: ProblemListItem[] = problems.map((problem: { title: string; slug: string; difficulty: string | null; tags: string[] }) => ({
    ...problem,
    difficulty: problem.difficulty as ProblemListItem["difficulty"],
  }));

  return <Problems problems={res} />;
}
