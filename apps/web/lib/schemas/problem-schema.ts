import { z } from "zod";

// Zod schema matching the ProblemForm interface for OpenAI structured output
export const CodeAndLanguageSchema = z.object({
  language: z.string(),
  code: z.string(),
});

export const SimpleTestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
});

export const DescriptionTestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string(),
});

export const ProblemFormSchema = z.object({
  title: z.string(),
  slug: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  type: z.enum(["None", "Contest", "Non_Contest"]),
  tags: z.array(z.string()),
  description: z.string(),
  constraints: z.array(z.string()),
  testCases: z.array(DescriptionTestCaseSchema),
  visibleTestCases: z.array(SimpleTestCaseSchema),
  hiddenTestCases: z.array(SimpleTestCaseSchema),
  functionCode: z.array(CodeAndLanguageSchema),
  completeCode: z.array(CodeAndLanguageSchema),
});

export type ProblemFormType = z.infer<typeof ProblemFormSchema>;
