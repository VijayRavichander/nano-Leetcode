"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ContributionHeatmap from "@/components/ContributionHeatmap";

export default function Profile() {
  const router = useRouter();
  const [contributions, setContributions] = useState<{ createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getContributions = async () => {
      try {
        const res = await fetch("/api/contributions");
        if (!res.ok) {
          router.push("/internal-server-error");
          return;
        }
        const data = await res.json();
        setContributions(data.submissions);
        setIsLoading(false);
      } catch {
        router.push("/internal-server-error");
      }
    };

    void getContributions();
  }, [router]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <section className="app-theme app-page py-10 md:py-14">
      <div className="app-container">
        <div className="max-w-3xl">
          <p className="app-section-label">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--app-text)]">
            Your progress
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--app-muted)]">
            Track your recent submissions and build steadier interview practice over time.
          </p>
        </div>

        <div className="app-panel mt-10 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Submission activity</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
            Your submission history over the last year.
          </p>
          <div className="mt-6">
            <ContributionHeatmap submissions={contributions} />
          </div>
        </div>
      </div>
    </section>
  );
}
