import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { getServerSession } from "@/lib/auth/server-session";

export async function GET(req: NextRequest) {

  const session = await getServerSession(req);

  const problemId = req.nextUrl.searchParams.get("problemId");
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(5, parseInt(req.nextUrl.searchParams.get("limit") || "5"));

  if(!session){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if(!problemId){
    return NextResponse.json({ error: "Problem ID is required" }, { status: 400 });
  }

  const userId = session.session.userId;

  const submissions = await db.submission.findMany({
    where: {userId, problemId},
    orderBy: { createdAt: 'desc' },
    cursor: cursor ? { id: cursor} : undefined,
    take: limit + 1,
    skip: cursor ? 1 : 0,
  });

  const hasNext = submissions.length > limit;
  const data = hasNext ? submissions.slice(0, limit) : submissions;
  const nextCursor = hasNext ? data[data.length - 1]?.id : null;

  return NextResponse.json({data, nextCursor, hasNext});
}
