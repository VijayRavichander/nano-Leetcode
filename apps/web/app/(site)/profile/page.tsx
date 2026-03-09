"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, Gauge, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppEmptyState from "@/components/AppEmptyState";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import Loader from "@/components/Loader";
import { formatSubmissionStatus } from "@/components/submission/submissionCard";
import { useAppSession } from "@/lib/auth/client-session";
import { getProfileSummary } from "@/lib/api/profile";
import type { ProfileSummaryResponse } from "@/lib/types/profile";

function formatRuntime(value: number | null) {
  if (value == null || value === -1) {
    return "Runtime unavailable";
  }

  return `${value * 1000} ms`;
}

function formatMemory(value: number | null) {
  if (value == null || value === -1) {
    return "Memory unavailable";
  }

  return `${value} KB`;
}

export default function Profile() {
  const router = useRouter();
  const session = useAppSession();
  const [summary, setSummary] = useState<ProfileSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileSummary = async () => {
      const response = await getProfileSummary();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin");
          return;
        }

        router.push("/internal-server-error");
        return;
      }

      setSummary(response.data);
      setIsLoading(false);
    };

    void loadProfileSummary().catch(() => {
      router.push("/internal-server-error");
    });
  }, [router]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const activity = summary?.activity ?? [];
  const recentSubmissions = summary?.recentSubmissions ?? [];
  const profileName = session.data?.user?.name || "Practice overview";

  return (
    <section className="app-theme app-page py-10 md:py-14">
      <div className="app-container">
        <div className="max-w-3xl">
          <p className="app-section-label">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
            {profileName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--app-muted)]">
            Activity and the latest 10 submissions, in one quiet view.
          </p>
        </div>

        <div className="mt-10 grid gap-6">
          <div className="app-panel p-6 md:p-8">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-[var(--app-text)]">Contribution heatmap</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                Your submissions over the last year.
              </p>
            </div>
            <div className="mt-6">
              {activity.length > 0 ? (
                <ContributionHeatmap submissions={activity} />
              ) : (
                <AppEmptyState
                  icon={Sparkles}
                  title="Start your first streak."
                  description="Once you submit a solution, your yearly activity map will fill in here."
                  actionLabel="Browse problems"
                  actionHref="/problem"
                  className="min-h-52"
                />
              )}
            </div>
          </div>

          <div className="app-panel p-6 md:p-8">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-[var(--app-text)]">Latest submissions</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                The newest 10, across all problems.
              </p>
            </div>

            <div className="mt-6">
              {recentSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => {
                    const status = formatSubmissionStatus(submission.status);

                    return (
                      <div
                        key={submission.id}
                        className="rounded-[16px] border border-[var(--app-border)] bg-[var(--app-panel-muted)] p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <Link
                              href={`/problem/${submission.problem.slug}`}
                              className="inline-flex items-center gap-1 text-base font-medium tracking-[-0.02em] text-[var(--app-text)] transition-colors hover:text-[var(--app-accent)]"
                            >
                              <span className="truncate">{submission.problem.title}</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <p className="mt-1 text-sm text-[var(--app-muted)]">
                              {new Date(submission.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-panel)] px-3 py-1 text-xs font-medium">
                            <span className={status.textClass}>{status.label}</span>
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--app-muted)]">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5 text-[var(--app-accent)]" />
                            {formatRuntime(submission.max_cpu_time)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Gauge className="h-3.5 w-3.5 text-[var(--app-success-text)]" />
                            {formatMemory(submission.max_memory)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <AppEmptyState
                  icon={Sparkles}
                  title="Nothing here yet."
                  description="Your latest 10 submissions will appear once you start practicing."
                  actionLabel="Browse problems"
                  actionHref="/problem"
                  className="min-h-44"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
