export type SubmissionStatus =
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING"
  | "TLE"
  | "COMPILATIONERROR"
  | "RUNTIMEERROR"
  | "INTERNALERROR";

export interface RunResultItem {
  id: number;
  description: string;
  time: number;
  memory: number;
  stdout: string;
}

export interface SubmissionListItem {
  id: string;
  code: string;
  languageId: number;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  judgetokens: string[];
  max_cpu_time: number | null;
  max_memory: number | null;
  problemId: string;
  userId: string;
}

export interface SubmissionPageResponse {
  data: SubmissionListItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface SubmissionStatusResponse {
  status: SubmissionStatus;
}
