import { useProblemIDStore, useTab } from "@/lib/store/uiStore";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCodeStore } from "@/lib/store/codeStore";
import SubmissionCard from "./submissionCard";
import SubmissionDetailsModal from "./SubmissionDetailsModal";

const SubmissionTab = ({ sidebarWidth }: { sidebarWidth: number }) => {
  const { tab, setTab } = useTab();

  // isInitialLoading is true when the submissions tab is first loaded and the submissions are being fetched.
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Cursor marks the last submission we returned; backend uses it to resume the next page.
  const [cursor, setCursor] = useState<string | null>(null);

  // hasNext mirrors the API flag so the UI knows if additional pages are available.
  const [hasNext, setHasNext] = useState(true);

  // Accumulates submissions as we append new pages during infinite scrolling.
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);

  const { problemIDStore } = useProblemIDStore();
  const { setCodeForSlug } = useCodeStore();
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // Shared fetcher that either resets the list or appends the next page based on "append".
  const fetchSubmissions = useCallback(
    async (cursorParam: string | null, append: boolean) => {
      if (!problemIDStore || isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setIsFetching(true);
      try {
        const params = new URLSearchParams({ problemId: problemIDStore });
        if (cursorParam) {
          params.set("cursor", cursorParam);
        }

        const res = await axios.get(`/api/submissions?${params.toString()}`);
        const { data, nextCursor, hasNext: nextHasNext } = res.data;

        setSubmissionsList((prev) => (append ? [...prev, ...data] : data));

        // Update cursor/hasNext from the payload so the client can request the following slice.
        setCursor(nextCursor ?? null);

        setHasNext(Boolean(nextHasNext));
        setAuthError(false); // Reset auth error on successful fetch
      } catch (error: any) {
        if (!append) {
          setSubmissionsList([]);
          // Check if it's an authentication error
          if (error.response?.status === 401) {
            setAuthError(true);
          }
        }
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        setIsInitialLoading(false);
      }
    },
    [problemIDStore]
  );

  useEffect(() => {
    if (tab !== "submissions") {
      return;
    }

    // Reset pagination cache when we revisit the submissions tab or switch problems.
    setSubmissionsList([]); 
    setCursor(null);
    setHasNext(true);
    setIsInitialLoading(true);
    setAuthError(false); // Reset auth error when switching tabs/problems

    fetchSubmissions(null, false);
  }, [tab, problemIDStore, fetchSubmissions]);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = loadMoreRef.current;

    if (tab !== "submissions" || !container || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasNext && !isFetchingRef.current) {
          // When the sentinel enters view, pull the next page using the stored cursor.
          fetchSubmissions(cursor, true);
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
  }, [tab, cursor, hasNext, fetchSubmissions, submissionsList.length]);

  if (isInitialLoading) {
    return (
      <div
        className={`${tab == "submissions" ? "" : "hidden"} h-screen overflow-y-auto p-6`}
        style={{ width: `${sidebarWidth}px` }}
      >
        <div>
          <Button
            className="bg-none! hover:bg-red-100"
            onClick={() => {
              setTab("problem");
            }}
          >
            <ArrowLeft />
          </Button>
          <span className="px-5 text-md font-bold text-white">Submissions</span>
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
      className={`${tab == "submissions" ? "" : "hidden"} h-screen overflow-y-auto p-6`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div>
        <Button
          className="hover:scale-95 transition-all duration-200 hover:bg-white/20"
          onClick={() => {
            setTab("problem");
          }}
        >
          <ArrowLeft />
        </Button>
        <span className="px-5 text-md font-bold text-white">
          Submissions
        </span>
      </div>
      <div className="my-5">
        <div className="max-w-3xl mx-auto">
          {submissionsList.length > 0 ? (
            <div>
              {submissionsList.map((submission, index) => (
                <div key={index} className="my-4">
                  <SubmissionCard
                    submission={submission}
                    setCodeInEditor={setCodeForSlug}
                    onViewSubmission={(item) => {
                      setSelectedSubmission(item);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center font-thin text-white/80">
              {authError ? "Please log in first" : "No Earlier Submissions"}{" "}
            </div>
          )}
          {/* Invisible sentinel that the intersection observer watches to trigger pagination. */}
          <div ref={loadMoreRef} className="h-1" />
          {isFetching && submissionsList.length > 0 && (
            <div className="flex items-center justify-center py-4 text-white/70 text-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more submissions...
            </div>
          )}
          {!hasNext && submissionsList.length > 0 && (
            <div className="py-4 text-center text-xs text-white/50">
              You've reached the end
            </div>
          )}
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
