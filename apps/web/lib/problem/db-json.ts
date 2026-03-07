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

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonObject = (value: unknown): value is JsonObject =>
  isObject(value);

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
};

export const parseCodeTemplates = (
  value: unknown
): CodeTemplate[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    language: asString(item.language),
    code: asString(item.code),
  }));
};

export const parseSimpleTestCases = (
  value: unknown
): SimpleTestCase[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    input: asString(item.input),
    output: asString(item.output),
  }));
};

export const parseDescriptionTestCases = (
  value: unknown
): DescriptionTestCase[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isJsonObject).map((item) => ({
    input: asString(item.input),
    output: asString(item.output),
    explanation: asString(item.explanation),
  }));
};
