import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
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

interface Judge0Status {
  id: number;
  description: string;
}

interface RunResult {
  id: number;
  description: string;
  time: number, 
  memory: number, 
  stdout: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession(req);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      where: { slug },
      select: {
        completeCode: true,
        visibleTestCases: true,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const completeCode = parseCodeTemplates(problem.completeCode);
    const testCases = parseSimpleTestCases(problem.visibleTestCases);

    const template = completeCode.find(
      (code) => code.language === language
    )?.code;
    if (!template) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    if (!testCases.length) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    const finalCode = template.replace("##USER_CODE_HERE##", userCode);

    console.log(finalCode);

    if (!finalCode) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
    //base64 encode the finalCode
    const base64FinalCode = Buffer.from(finalCode).toString('base64');

    const runResults: RunResult[] = [];

    for (const testcase of testCases) {
      try {
        const response = await axios.post(
          `${JUDGE0_URL}/submissions/?base64_encoded=true&wait=true`,
          {
            source_code: base64FinalCode,
            language_id: languageId,
            stdin: Buffer.from(testcase.input).toString('base64'),
            expected_output: Buffer.from(testcase.output).toString('base64'),
          },
          {
            headers: {
              "x-rapidapi-key": JUDGE0_API_KEY,
              "x-rapidapi-host": JUDGE0_HOST,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data)  

        if (response.status !== 200 || response.data?.error) {
          runResults.push({ id: -1, description: "Failed", time: -1, memory: -1, stdout: "" });
        } else {
          const status: Judge0Status | undefined = response.data?.status;
          runResults.push({
            id: status?.id ?? 0,
            description: status?.description ?? "Unknown",
            time: parseInt(response.data.time) ?? -1, 
            memory: response.data.memory ?? -1,
            stdout: response.data.stdout ?? ""
          });
        }
      } catch (error) {
        console.error("Error while calling Judge0", error);
        runResults.push({ id: -1, description: "Failed", time: -1, memory: -1, stdout: ""  });
      }
    }

    return NextResponse.json({ result: runResults });
  } catch (error) {
    console.error("Error running code", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
