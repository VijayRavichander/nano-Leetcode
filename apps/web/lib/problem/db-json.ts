import type { Prisma } from "@repo/db";

export interface CodeTemplate {
  language: string;
  code: string;
}

export interface SimpleTestCase {
  input: string;
  output: string;
}

export interface DescriptionTestCase extends SimpleTestCase {
  explanation: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonObject = (value: Prisma.JsonValue): value is Prisma.JsonObject =>
  isObject(value);

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
};

export const parseCodeTemplates = (
  value: Prisma.JsonValue | null | undefined
): CodeTemplate[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    language: asString(item.language),
    code: asString(item.code),
  }));
};

export const parseSimpleTestCases = (
  value: Prisma.JsonValue | null | undefined
): SimpleTestCase[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    input: asString(item.input),
    output: asString(item.output),
  }));
};

export const parseDescriptionTestCases = (
  value: Prisma.JsonValue | null | undefined
): DescriptionTestCase[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    input: asString(item.input),
    output: asString(item.output),
    explanation: asString(item.explanation),
  }));
};
