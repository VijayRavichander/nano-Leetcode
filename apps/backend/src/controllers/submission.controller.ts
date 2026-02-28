import type { Request, Response } from "express";
import { db } from "../lib/db";
import { AppError } from "../lib/errors";
import { parseCodeTemplates, parseSimpleTestCases } from "../lib/problem-json";
import {
  checkSubmissionStatus,
  languageToIdMap,
  runAgainstVisibleTests,
  submitBatchToJudge0,
} from "../services/judge0.service";

const pickUserCode = (body: any) => {
  if (typeof body?.code === "string") return body.code;
  if (typeof body?.userCode === "string") return body.userCode;
  return "";
};

const getProblemExecutionData = async (slug: string) => {
  const problem = await db.problem.findUnique({
    where: { slug },
    select: {
      id: true,
      completeCode: true,
      visibleTestCases: true,
      hiddenTestCases: true,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  return {
    id: problem.id,
    completeCode: parseCodeTemplates(problem.completeCode),
    visibleTestCases: parseSimpleTestCases(problem.visibleTestCases),
    hiddenTestCases: parseSimpleTestCases(problem.hiddenTestCases),
  };
};

const buildFinalCode = (params: {
  templates: Array<{ language: string; code: string }>;
  language: string;
  userCode: string;
}) => {
  const template = params.templates.find(
    (item) => item.language === params.language
  )?.code;

  if (!template) {
    throw new AppError("Unsupported language for this problem", 400);
  }

  return template.replace("##USER_CODE_HERE##", params.userCode);
};

export const submitProblem = async (req: Request, res: Response) => {
  const slug = String(req.body?.slug ?? "");
  const language = String(req.body?.language ?? "");
  const userCode = pickUserCode(req.body);
  const userId = req.userId;

  if (!slug || !language || !userCode || !userId) {
    throw new AppError("slug, language and code are required", 400);
  }

  const languageId = languageToIdMap[language];
  if (!languageId) {
    throw new AppError("Unsupported language", 400);
  }

  const problem = await getProblemExecutionData(slug);
  const finalCode = buildFinalCode({
    templates: problem.completeCode,
    language,
    userCode,
  });

  if (problem.hiddenTestCases.length === 0) {
    throw new AppError("No hidden test cases configured", 400);
  }

  const sourceCodeBase64 = Buffer.from(finalCode).toString("base64");
  const judgeTokens = await submitBatchToJudge0({
    sourceCodeBase64,
    languageId,
    testCases: problem.hiddenTestCases,
  });

  const created = await db.submission.create({
    data: {
      code: userCode,
      languageId,
      judgetokens: judgeTokens,
      problemId: problem.id,
      userId,
    },
    select: { id: true },
  });

  res.status(200).json({ submissionId: created.id });
};

export const runProblem = async (req: Request, res: Response) => {
  const slug = String(req.body?.slug ?? "");
  const language = String(req.body?.language ?? "");
  const userCode = pickUserCode(req.body);

  if (!slug || !language || !userCode) {
    throw new AppError("slug, language and code are required", 400);
  }

  const languageId = languageToIdMap[language];
  if (!languageId) {
    throw new AppError("Unsupported language", 400);
  }

  const problem = await getProblemExecutionData(slug);
  if (problem.visibleTestCases.length === 0) {
    throw new AppError("No visible test cases configured", 400);
  }

  const finalCode = buildFinalCode({
    templates: problem.completeCode,
    language,
    userCode,
  });

  const sourceCodeBase64 = Buffer.from(finalCode).toString("base64");
  const result = await runAgainstVisibleTests({
    sourceCodeBase64,
    languageId,
    testCases: problem.visibleTestCases,
  });

  res.status(200).json({ result });
};

export const getSubmissionStatus = async (req: Request, res: Response) => {
  const submissionId = String(req.query.submissionId ?? "");
  const userId = req.userId;

  if (!submissionId || !userId) {
    throw new AppError("submissionId is required", 400);
  }

  const submission = await db.submission.findFirst({
    where: {
      id: submissionId,
      userId,
    },
    select: {
      id: true,
      judgetokens: true,
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  const tokenQuery = submission.judgetokens.join(",");
  const statusResult = await checkSubmissionStatus(tokenQuery);

  await db.submission.update({
    where: { id: submission.id },
    data: {
      status: statusResult.status,
      max_cpu_time: statusResult.metrics.maxTime,
      max_memory: statusResult.metrics.maxMemory,
    },
  });

  res.status(200).json({ status: statusResult.status });
};

export const getSubmissionInfoBulk = async (req: Request, res: Response) => {
  const problemId = String(req.query.id ?? "");
  const userId = req.userId;

  if (!problemId || !userId) {
    throw new AppError("problem id is required", 400);
  }

  const submissions = await db.submission.findMany({
    where: {
      problemId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  res.status(200).json({ submissions });
};

export const getContributions = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const submissions = await db.submission.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  res.status(200).json({ submissions });
};
