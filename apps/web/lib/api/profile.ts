import { apiRequest, type ApiResult } from "./client";
import type { ProfileSummaryResponse } from "@/lib/types/profile";

export const getProfileSummary = async (): Promise<ApiResult<ProfileSummaryResponse>> => {
  return apiRequest<ProfileSummaryResponse>({
    method: "GET",
    url: "/api/profile/summary",
  });
};
