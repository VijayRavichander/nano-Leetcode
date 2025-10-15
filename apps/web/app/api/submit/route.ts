import { NextRequest, NextResponse } from "next/server"
import { db } from "@repo/db"
import { auth } from "@/lib/auth";
import axios from "axios";



const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;

const languagetoIdMap: Record<string, number> = {
    "cpp": 54,
    "python": 71,
}


export async function POST(req: NextRequest) {

    const session = await auth.api.getSession(req);

    if(!session){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.session.userId;

    const { slug, language, userCode } = await req.json();

    const completeCodeRes = await db.problem.findFirst({
    where: {
        slug: slug,
      },
      select: {
        completeCode: true,
        id: true,
        hiddenTestCases: true,
      }
    });
  
    if(completeCodeRes == null || completeCodeRes.completeCode == null){
      return NextResponse.json({ error: "Bad Request" }, { status: 401 });
    }
  
    let finalCode = completeCodeRes.completeCode.find((code: any) => code.language === language)?.code;

    if (!finalCode) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    finalCode = finalCode?.replace("##USER_CODE_HERE##", userCode);

    const finalCodeEncoded = Buffer.from(finalCode).toString('base64')
    
    const submissions = completeCodeRes.hiddenTestCases?.map((testcase: any, index: number) => ({
      source_code: finalCodeEncoded,
      language_id: languagetoIdMap[language],
      stdin: Buffer.from(testcase.input).toString('base64'),
      expected_output: Buffer.from(testcase.output).toString('base64'),
    }));
  
    const judgeZeroRes = await axios.post(
      `${JUDGE0_URL}/submissions/batch?base64_encoded=true`,
      {
        submissions: submissions,
      },
      {
        headers: {
          "x-rapidapi-key": JUDGE0_API_KEY,
          "x-rapidapi-host": JUDGE0_HOST,
          "Content-Type": "application/json",
        },
      }
    );
  
    const judgeZeroTokens = judgeZeroRes.data.map((submission: any) => submission.token);
  
  
    const submissionId = await db.submission.create({
      data: {
        code: userCode,
        languageId: languagetoIdMap[language]!,
        judgetokens: judgeZeroTokens,
        problemId: completeCodeRes.id,
        userId: userId,
      },
    });
  
    return NextResponse.json({ submissionId: submissionId.id }, { status: 200 });
}