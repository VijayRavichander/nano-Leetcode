import { apiRequest, type ApiResult } from "./client";
import type { RunResultItem } from "@/lib/types/submission";

export interface ExecutionPayload {
  slug: string;
  language: string;
  userCode: string;
}

interface RunCodeResponse {
  result: RunResultItem[];
}

interface SubmitCodeResponse {
  submissionId: string;
}

export const runCode = async (
  payload: ExecutionPayload
): Promise<ApiResult<RunCodeResponse>> => {
  return apiRequest<RunCodeResponse>({
    method: "POST",
    url: "/api/run",
    data: payload,
  });
};

export const submitCode = async (
  payload: ExecutionPayload
): Promise<ApiResult<SubmitCodeResponse>> => {
  return apiRequest<SubmitCodeResponse>({
    method: "POST",
    url: "/api/submit",
    data: payload,
  });
};
