import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { getServerSession } from "@/lib/auth/server-session";
import type { ProfileSummaryResponse } from "@/lib/types/profile";

export async function GET(req: NextRequest) {
  const session = await getServerSession(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.session.userId;

  const [activity, recentSubmissions] = await Promise.all([
    db.submission.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    db.submission.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        status: true,
        max_cpu_time: true,
        max_memory: true,
        problem: {
          select: {
            slug: true,
            title: true,
          },
        },
      },
    }),
  ]);

  const response: ProfileSummaryResponse = {
    activity: activity.map((item) => ({
      createdAt: item.createdAt.toISOString(),
    })),
    recentSubmissions: recentSubmissions.map((submission) => ({
      ...submission,
      createdAt: submission.createdAt.toISOString(),
    })),
  };

  return NextResponse.json(response);
}
