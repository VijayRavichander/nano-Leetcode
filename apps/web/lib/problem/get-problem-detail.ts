import { db } from "@repo/db";
import {
  parseCodeTemplates,
  parseDescriptionTestCases,
  parseSimpleTestCases,
} from "@/lib/problem/db-json";
import type { ProblemDetail } from "@/lib/types/problem";

export const getProblemDetailBySlug = async (
  slug: string
): Promise<ProblemDetail | null> => {
  if (!slug) {
    return null;
  }

  const problem = await db.problem.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      difficulty: true,
      description: true,
      editorial: true,
      constraints: true,
      testCases: true,
      tags: true,
      functionCode: true,
      visibleTestCases: true,
      id: true,
    },
  });

  if (!problem) {
    return null;
  }

  return {
    ...problem,
    difficulty: problem.difficulty as ProblemDetail["difficulty"],
    testCases: parseDescriptionTestCases(problem.testCases),
    functionCode: parseCodeTemplates(problem.functionCode),
    visibleTestCases: parseSimpleTestCases(problem.visibleTestCases),
  };
};
