import { db } from "@repo/db";
import { NextResponse } from "next/server";
import {
  parseCodeTemplates,
  parseDescriptionTestCases,
  parseSimpleTestCases,
} from "@/lib/problem/db-json";


// "getProblem?slug=${problemId}"

export async function GET(req: Request){

    const {searchParams} = new URL(req.url);

    const slug = searchParams.get("slug");

    const problem = await db.problem.findUnique({
        where: {
            slug: slug as string
        }, 
        select: {
            title: true,
            difficulty: true,
            description: true,
            constraints: true,
            testCases: true,
            tags: true,
            functionCode: true,
            visibleTestCases: true,
            id: true,
        }
    })

    if (!problem) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      ...problem,
      testCases: parseDescriptionTestCases(problem.testCases),
      functionCode: parseCodeTemplates(problem.functionCode),
      visibleTestCases: parseSimpleTestCases(problem.visibleTestCases),
    });
}
