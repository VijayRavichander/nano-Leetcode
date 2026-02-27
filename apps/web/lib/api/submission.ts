import { apiRequest, type ApiResult } from "./client";
import type {
  SubmissionPageResponse,
  SubmissionStatusResponse,
} from "@/lib/types/submission";

export const getSubmissionsPage = async (
  problemId: string,
  cursor: string | null,
  limit = 5
): Promise<ApiResult<SubmissionPageResponse>> => {
  return apiRequest<SubmissionPageResponse>({
    method: "GET",
    url: "/api/submissions",
    params: {
      problemId,
      cursor: cursor ?? undefined,
      limit,
    },
  });
};

export const getSubmissionStatus = async (
  submissionId: string
): Promise<ApiResult<SubmissionStatusResponse>> => {
  return apiRequest<SubmissionStatusResponse>({
    method: "GET",
    url: "/api/submissionstatus",
    params: { submissionId },
  });
};
