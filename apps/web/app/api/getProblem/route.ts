import { NextResponse } from "next/server";
import { getProblemDetailBySlug } from "@/lib/problem/get-problem-detail";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";

  const problem = await getProblemDetailBySlug(slug);

  return NextResponse.json(problem);
}
