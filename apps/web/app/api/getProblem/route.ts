import { db } from "@repo/db";
import { NextResponse } from "next/server";


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

    return NextResponse.json(problem);
}