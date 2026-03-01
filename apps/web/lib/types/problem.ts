export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemType = "None" | "Contest" | "Non_Contest";

export interface CodeTemplate {
  language: string;
  code: string;
}

export interface DescriptionTestCase {
  input: string;
  output: string;
  explanation: string;
}

export interface VisibleTestCase {
  input: string;
  output: string;
}

export interface ProblemDetail {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  editorial: string;
  constraints: string[];
  testCases: DescriptionTestCase[];
  tags: string[];
  functionCode: CodeTemplate[];
  visibleTestCases: VisibleTestCase[];
}

export interface ProblemListItem {
  title: string;
  difficulty: Difficulty;
  tags: string[];
  slug: string;
}
