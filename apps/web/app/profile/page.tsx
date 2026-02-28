"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useTokenStore } from "@/lib/store/uiStore";

const USERID = "test";

export default function Profile() {
  const router = useRouter();
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { tokenStore } = useTokenStore();

  useEffect(() => {
    const getContributions = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/v1/getContributions?userId=${USERID}`,
          {
            headers: {
              Authorization: `Bearer ${tokenStore}`,
            },
          }
        );
        const submissions = res.data.submissions;
        console.log(submissions);
        setContributions(submissions);
        setIsLoading(false);
      } catch {
        router.push("/internal-server-error");
      }
    };

    void getContributions();
  }, [router, tokenStore]);

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
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Submission activity</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
              Contribution history is not fully wired into this view yet. Your data fetch remains
              intact, and this section is ready to host the chart once it is connected.
            </p>
            <div className="app-empty-state mt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--app-text)]">
                  {contributions.length > 0
                    ? `${contributions.length} submissions loaded`
                    : "No contribution chart available yet"}
                </p>
                <p className="mt-2 text-sm text-[var(--app-muted)]">
                  This page now matches the site design system and is ready for the heatmap
                  component.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
