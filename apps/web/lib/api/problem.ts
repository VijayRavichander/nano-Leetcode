import { apiRequest, type ApiResult } from "./client";
import type { ProblemDetail } from "@/lib/types/problem";

export const getProblemBySlug = async (
  slug: string
): Promise<ApiResult<ProblemDetail>> => {
  return apiRequest<ProblemDetail>({
    method: "GET",
    url: "/api/getProblem",
    params: { slug },
  });
};
