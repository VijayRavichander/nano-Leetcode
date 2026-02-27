import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProblemBySlug } from "@/lib/api/problem";
import { initializeProblemSession } from "@/lib/problem/session";
import { useCodeStore, useLangStore } from "@/lib/store/codeStore";
import { useProblemUIStore } from "@/lib/store/uiStore";
import type { ProblemDetail } from "@/lib/types/problem";

export const useProblemData = (problemSlug: string) => {
  const router = useRouter();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const language = useLangStore((state) => state.lang);
  const setCurrentSlug = useCodeStore((state) => state.setCurrentSlug);
  const ensureCodeForSlug = useCodeStore((state) => state.ensureCodeForSlug);

  const setShowNavControls = useProblemUIStore(
    (state) => state.setShowNavControls
  );
  const setProblemId = useProblemUIStore((state) => state.setProblemId);
  const setTab = useProblemUIStore((state) => state.setTab);

  useEffect(() => {
    let isCancelled = false;

    const loadProblem = async () => {
      setIsLoading(true);
      setShowNavControls(true);
      setTab("problem");

      if (!problemSlug) {
        if (!isCancelled) {
          setIsLoading(false);
          router.push("/internal-server-error");
        }
        return;
      }

      const response = await getProblemBySlug(problemSlug);

      if (!response.ok) {
        if (!isCancelled) {
          setIsLoading(false);
          router.push("/internal-server-error");
        }
        return;
      }

      if (!isCancelled) {
        setProblem(response.data);
        setIsLoading(false);
      }
    };

    void loadProblem();

    return () => {
      isCancelled = true;
      setShowNavControls(false);
    };
  }, [
    problemSlug,
    router,
    setShowNavControls,
    setTab,
  ]);

  useEffect(() => {
    if (!problem || !problemSlug) {
      return;
    }

    initializeProblemSession({
      problem,
      slug: problemSlug,
      language,
      setProblemId,
      setCurrentSlug,
      ensureCodeForSlug,
    });
  }, [
    ensureCodeForSlug,
    language,
    problem,
    problemSlug,
    setCurrentSlug,
    setProblemId,
  ]);

  return {
    problem,
    isLoading,
  };
};
