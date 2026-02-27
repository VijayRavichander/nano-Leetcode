"use client";

import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSubmissionsPage } from "@/lib/api/submission";
import { useCodeStore, useCurrentSlug } from "@/lib/store/codeStore";
import { useProblemUIStore } from "@/lib/store/uiStore";
import SubmissionCard from "./submissionCard";
import SubmissionDetailsModal from "./SubmissionDetailsModal";
import type { SubmissionListItem } from "@/lib/types/submission";

const PAGE_SIZE = 5;

interface SubmissionTabProps {
  sidebarWidth?: number;
  onBack?: () => void;
  className?: string;
}

const SubmissionTab = ({ sidebarWidth, onBack, className }: SubmissionTabProps) => {
  const problemId = useProblemUIStore((state) => state.problemId);

  const setCodeForSlug = useCodeStore((state) => state.setCodeForSlug);
  const currentSlug = useCurrentSlug();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [submissionsList, setSubmissionsList] = useState<SubmissionListItem[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionListItem | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const fetchSubmissions = useCallback(
    async (cursorParam: string | null, append: boolean) => {
      if (!problemId || isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setIsFetching(true);

      const response = await getSubmissionsPage(problemId, cursorParam, PAGE_SIZE);

      if (!response.ok) {
        if (!append) {
          setSubmissionsList([]);
          setAuthError(response.status === 401);
        }

        isFetchingRef.current = false;
        setIsFetching(false);
        setIsInitialLoading(false);
        return;
      }

      const { data, nextCursor, hasNext: nextHasNext } = response.data;

      setSubmissionsList((prev) => (append ? [...prev, ...data] : data));
      setCursor(nextCursor ?? null);
      setHasNext(Boolean(nextHasNext));
      setAuthError(false);

      isFetchingRef.current = false;
      setIsFetching(false);
      setIsInitialLoading(false);
    },
    [problemId]
  );

  useEffect(() => {
    setSubmissionsList([]);
    setCursor(null);
    setHasNext(true);
    setIsInitialLoading(true);
    setAuthError(false);

    void fetchSubmissions(null, false);
  }, [problemId, fetchSubmissions]);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = loadMoreRef.current;

    if (!container || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && hasNext && !isFetchingRef.current) {
          void fetchSubmissions(cursor, true);
        }
      },
      {
        root: container,
        rootMargin: "200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [cursor, hasNext, fetchSubmissions]);

  const setSubmissionCodeInEditor = (code: string) => {
    if (!currentSlug) {
      return;
    }

    setCodeForSlug(currentSlug, code);
  };

  const widthStyle = sidebarWidth ? { width: `${sidebarWidth}px` } : undefined;

  if (isInitialLoading) {
    return (
      <div
        className={`h-full overflow-y-auto p-4 md:p-5 ${className ?? ""}`}
        style={widthStyle}
      >
        <div className="mb-4 flex items-center">
          {onBack ? (
            <Button
              className="h-7 border border-white/10 bg-transparent px-2 hover:bg-white/10"
              onClick={onBack}
            >
              <ArrowLeft />
            </Button>
          ) : null}
          <span className="px-3 text-sm font-semibold text-white">Submissions</span>
        </div>
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-y-auto p-4 md:p-5 ${className ?? ""}`}
      style={widthStyle}
    >
      <div className="mb-4 flex items-center">
        {onBack ? (
          <Button
            className="h-7 border border-white/10 bg-transparent px-2 transition-all duration-150 hover:bg-white/10"
            onClick={onBack}
          >
            <ArrowLeft />
          </Button>
        ) : null}
        <span className="px-3 text-sm font-semibold text-white">Submissions</span>
      </div>
      <div>
        <div className="mx-auto max-w-3xl">
          {submissionsList.length > 0 ? (
            <div>
              {submissionsList.map((submission) => (
                <div key={submission.id} className="my-4">
                  <SubmissionCard
                    submission={submission}
                    setCodeInEditor={setSubmissionCodeInEditor}
                    onViewSubmission={(item) => {
                      setSelectedSubmission(item);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center font-thin text-white/80">
              {authError ? "Please log in first" : "No Earlier Submissions"}
            </div>
          )}
          <div ref={loadMoreRef} className="h-1" />
          {isFetching && submissionsList.length > 0 ? (
            <div className="flex items-center justify-center py-4 text-sm text-white/70">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more submissions...
            </div>
          ) : null}
          {!hasNext && submissionsList.length > 0 ? (
            <div className="py-3 text-center text-xs text-white/50">
              You&apos;ve reached the end
            </div>
          ) : null}
        </div>
      </div>
      <SubmissionDetailsModal
        submission={selectedSubmission}
        onClose={() => {
          setSelectedSubmission(null);
        }}
      />
    </div>
  );
};

export default SubmissionTab;
