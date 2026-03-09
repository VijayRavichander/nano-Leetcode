import type { SubmissionStatus } from "@/lib/types/submission";

export interface ProfileActivityItem {
  createdAt: string;
}

export interface ProfileRecentSubmissionItem {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  max_cpu_time: number | null;
  max_memory: number | null;
  problem: {
    slug: string;
    title: string;
  };
}

export interface ProfileSummaryResponse {
  activity: ProfileActivityItem[];
  recentSubmissions: ProfileRecentSubmissionItem[];
}
