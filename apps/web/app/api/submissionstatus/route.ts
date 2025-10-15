import { db } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { checkSubmissionStatus } from "./utils";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {

  const session = await auth.api.getSession(req);

  if(!session){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.session.userId;

  const submissionId = req.nextUrl.searchParams.get("submissionId");

  const submissionRes = await db.submission.findFirst({
    where: {
      id: submissionId as string,
      userId: userId,
    },
    select: {
      judgetokens: true,
    },
  });

  if (submissionRes == null) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  const tokens = submissionRes.judgetokens;

  const tokenQuery = tokens.join(",");

  const {status, metrics} = await checkSubmissionStatus(tokenQuery);

  await db.submission.update({
    where: {
      id: submissionId as string,
    },
    data: {
      status: status,
      max_cpu_time: metrics?.time,
      max_memory: metrics?.memory
    },
  });

  return NextResponse.json({ status }, { status: 200 });
}
