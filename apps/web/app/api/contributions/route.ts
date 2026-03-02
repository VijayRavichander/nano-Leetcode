import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.session.userId;

  const submissions = await db.submission.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  return NextResponse.json({ submissions });
}
