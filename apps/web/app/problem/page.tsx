import Problems from "@/components/Problems";
import { db } from "@repo/db";
import { type Problem } from "@/components/Problems";

export default async function App() {
  const res: Problem[] = await db.problem.findMany({
    where: {},
    select: {
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
    },
  });

  return <Problems problems={res} />;
}
