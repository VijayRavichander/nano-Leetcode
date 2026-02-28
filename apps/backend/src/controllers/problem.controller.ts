import { Prisma } from "@repo/db";
import type { Request, Response } from "express";
import { db } from "../lib/db";
import { AppError } from "../lib/errors";
import {
  parseCodeTemplates,
  parseDescriptionTestCases,
  parseSimpleTestCases,
} from "../lib/problem-json";

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (value == null) return fallback;
  return String(value);
};

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((item) => asString(item)).filter(Boolean)
    : [];

const asJson = (
  value: unknown
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput => {
  if (value == null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
};

const normalizeAddProblemPayload = (body: any) => {
  if (body?.problemInfo) {
    const problemInfo = body.problemInfo;
    const metaData = problemInfo.metaData ?? {};

    const functionCodeArray = Array.isArray(problemInfo.functionCode)
      ? problemInfo.functionCode
      : Object.entries(problemInfo.functionCode ?? {}).map(([language, code]) => ({
          language,
          code,
        }));

    const completeCodeArray = Array.isArray(body.code)
      ? body.code
      : Object.entries(body.code ?? {}).map(([language, code]) => ({
          language,
          code,
        }));

    return {
      title: asString(metaData.title),
      slug: asString(problemInfo.slug),
      description: asString(metaData.description),
      difficulty: asString(metaData.difficulty, "Easy"),
      type: asString(problemInfo.type, "None"),
      tags: asStringArray(metaData.tags),
      constraints: asStringArray(metaData.constraints),
      testCases: problemInfo.testCases ?? [],
      visibleTestCases: problemInfo.sampleTestCase ?? [],
      hiddenTestCases: body.testCases ?? [],
      functionCode: functionCodeArray,
      completeCode: completeCodeArray,
      solved: Number(problemInfo.solved ?? 0),
    };
  }

  return {
    title: asString(body?.title),
    slug: asString(body?.slug),
    description: asString(body?.description),
    difficulty: asString(body?.difficulty, "Easy"),
    type: asString(body?.type, "None"),
    tags: asStringArray(body?.tags),
    constraints: asStringArray(body?.constraints),
    testCases: body?.testCases ?? [],
    visibleTestCases: body?.visibleTestCases ?? [],
    hiddenTestCases: body?.hiddenTestCases ?? [],
    functionCode: body?.functionCode ?? [],
    completeCode: body?.completeCode ?? [],
    solved: Number(body?.solved ?? 0),
  };
};

export const getProblem = async (req: Request, res: Response) => {
  const slug = asString(req.query.slug);
  if (!slug) {
    throw new AppError("slug is required", 400);
  }

  const problem = await db.problem.findUnique({
    where: { slug },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  res.status(200).json({
    problemInfo: {
      ...problem,
      testCases: parseDescriptionTestCases(problem.testCases),
      visibleTestCases: parseSimpleTestCases(problem.visibleTestCases),
      hiddenTestCases: parseSimpleTestCases(problem.hiddenTestCases),
      functionCode: parseCodeTemplates(problem.functionCode),
      completeCode: parseCodeTemplates(problem.completeCode),
    },
  });
};

export const getProblems = async (_req: Request, res: Response) => {
  const problems = await db.problem.findMany({
    select: {
      slug: true,
      title: true,
      difficulty: true,
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    problems: problems.map((problem) => ({
      slug: problem.slug,
      metaData: {
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
      },
    })),
  });
};

export const addProblem = async (req: Request, res: Response) => {
  const payload = normalizeAddProblemPayload(req.body);

  if (!payload.title || !payload.slug || !payload.description) {
    throw new AppError("title, slug, and description are required", 400);
  }

  const existing = await db.problem.findUnique({ where: { slug: payload.slug } });
  if (existing) {
    throw new AppError("A problem with this slug already exists", 409);
  }

  const created = await db.problem.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      difficulty: payload.difficulty,
      type: payload.type,
      tags: payload.tags,
      constraints: payload.constraints,
      solved: payload.solved,
      testCases: asJson(payload.testCases),
      visibleTestCases: asJson(payload.visibleTestCases),
      hiddenTestCases: asJson(payload.hiddenTestCases),
      functionCode: asJson(payload.functionCode),
      completeCode: asJson(payload.completeCode),
    },
    select: { id: true },
  });

  res.status(200).json({ id: created.id });
};
