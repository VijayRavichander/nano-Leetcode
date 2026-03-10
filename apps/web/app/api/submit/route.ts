import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { getServerSession } from "@/lib/auth/server-session";
import axios from "axios";
import {
  parseCodeTemplates,
  parseSimpleTestCases,
} from "@/lib/problem/db-json";

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;

const languageToIdMap: Record<string, number> = {
  cpp: 54,
  python: 71,
};

export async function POST(req: NextRequest) {
  try {
    assertJudge0Config();

    const session = await getServerSession(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.session.userId;

    const { slug, language, userCode } = await req.json();

    if (!slug || !language || !userCode) {
      return NextResponse.json(
        { error: "slug, language and userCode are required" },
        { status: 400 }
      );
    }

    const languageId = languageToIdMap[language];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const problem = await db.problem.findFirst({
      where: {
        slug: slug,
      },
      select: {
        completeCode: true,
        id: true,
        hiddenTestCases: true,
      },
    });

    if (!problem || problem.completeCode == null) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const completeCode = parseCodeTemplates(problem.completeCode);
    const hiddenTestCases = parseSimpleTestCases(problem.hiddenTestCases);

    let finalCode = completeCode.find((code) => code.language === language)?.code;

    if (!finalCode) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    if (!hiddenTestCases.length) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    finalCode = finalCode.replace("##USER_CODE_HERE##", userCode);

    const finalCodeEncoded = Buffer.from(finalCode).toString("base64");
    const submissions = hiddenTestCases.map((testcase) => ({
      source_code: finalCodeEncoded,
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString("base64"),
      expected_output: Buffer.from(testcase.output).toString("base64"),
    }));

    const judgeZeroRes = await axios.post(
      `${JUDGE0_URL}/submissions/batch?base64_encoded=true`,
      {
        submissions,
      },
      {
        headers: {
          "x-rapidapi-key": JUDGE0_API_KEY,
          "x-rapidapi-host": JUDGE0_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    const judgeZeroTokens = judgeZeroRes.data.map(
      (submission: { token: string }) => submission.token
    );

    const submissionId = await db.submission.create({
      data: {
        code: userCode,
        languageId,
        judgetokens: judgeZeroTokens,
        problemId: problem.id,
        userId,
      },
    });

    return NextResponse.json({ submissionId: submissionId.id }, { status: 200 });
  } catch (error) {
    console.error("Error submitting code", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const assertJudge0Config = () => {
  if (!JUDGE0_URL || !JUDGE0_API_KEY || !JUDGE0_HOST) {
    throw new Error("Missing Judge0 configuration");
  }
};
