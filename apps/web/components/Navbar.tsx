"use client";

import { Loader2, LockIcon } from "lucide-react";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCurrentCode,
  useCurrentSlug,
  useLangStore,
  type SupportedLanguage,
} from "@/lib/store/codeStore";
import { useState } from "react";
import { useProblemUIStore } from "@/lib/store/uiStore";
import Link from "next/link";
import NavbarActionDropDown from "./ActionDropDown";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { runCode, submitCode } from "@/lib/api/execution";
import { getSubmissionStatus } from "@/lib/api/submission";
import { useExecutionStore } from "@/lib/store/executionStore";

const NavBar = () => {
  const codeInEditor = useCurrentCode();
  const selectedLanguage = useLangStore((state) => state.lang);
  const setSelectedLanguage = useLangStore((state) => state.setLang);

  const setTestStatus = useExecutionStore((state) => state.setTestCaseStatus);
  const problemSlug = useCurrentSlug();
  const setTab = useProblemUIStore((state) => state.setTab);
  const showControls = useProblemUIStore((state) => state.showNavControls);

  const isRunning = useExecutionStore((state) => state.isRunning);
  const setIsRunning = useExecutionStore((state) => state.setIsRunning);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === "/" && !showControls;
  const isWorkspace = Boolean(showControls) || (pathname?.startsWith("/problem/") ?? false);
  const isAppRoute = !isLanding && !isWorkspace;

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleUnauthorized = () => {
    handleSignIn();
  };

  const buildPayload = () => {
    if (!problemSlug) {
      return null;
    }

    return {
      slug: problemSlug,
      userCode: codeInEditor,
      language: selectedLanguage,
    };
  };

  const runCodeInEditor = async () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    setIsRunning(true);

    const response = await runCode(payload);

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized();
      }
      setIsRunning(false);
      return;
    }

    setTestStatus(payload.slug, response.data.result);
    setIsRunning(false);
  };

  const submitCodeFromEditor = async () => {
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    setIsSubmitting(true);

    const runResponse = await runCode(payload);

    if (!runResponse.ok) {
      if (runResponse.status === 401) {
        handleUnauthorized();
      }
      setIsSubmitting(false);
      return;
    }

    setTestStatus(payload.slug, runResponse.data.result);

    const submitResponse = await submitCode(payload);

    if (!submitResponse.ok) {
      if (submitResponse.status === 401) {
        handleUnauthorized();
      }
      setIsSubmitting(false);
      return;
    }

    const statusResponse = await getSubmissionStatus(submitResponse.data.submissionId);

    if (statusResponse.ok && statusResponse.data.status === "ACCEPTED") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#60A5FA", "#34D399", "#818CF8"],
      });
    }

    setTab("submissions");
    setIsSubmitting(false);
  };

  if (isLanding) {
    return (
      <header
        className="border-b border-[var(--landing-border)] bg-[var(--landing-chrome-bg)]"
        style={{ boxShadow: "var(--landing-chrome-shadow)" }}
      >
        <div className="landing-container">
          <div className="flex items-center justify-between gap-4 py-5 md:py-6">
            <Link href="/" className="group min-w-0">
              <div className="min-w-0">
                <div className="text-[1.35rem] font-medium tracking-[-0.03em] text-[var(--landing-text)]">
                  LiteCode
                </div>
                <p className="hidden text-sm text-[var(--landing-muted)] md:block">
                  Steady interview practice
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-5 text-sm md:gap-6">
              <Link
                href="/problem"
                className="landing-text-action landing-text-action-muted"
              >
                Problems
              </Link>
              <ThemeToggle variant="landing" />
              {!session.data ? (
                <button className="landing-text-action cursor-pointer" onClick={handleSignIn}>
                  Sign in
                </button>
              ) : (
                <NavbarActionDropDown session={session} variant="landing" />
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isAppRoute) {
    return (
      <header
        className="border-b border-[var(--app-border)] bg-[var(--app-chrome)] text-[var(--app-text)]"
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset" }}
      >
        <div className="app-container">
          <div className="flex items-center justify-between gap-4 py-4 md:py-5">
            <Link href="/" className="min-w-0">
              <div className="min-w-0">
                <div className="text-[1.35rem] font-medium tracking-[-0.03em] text-[var(--app-text)]">
                  LiteCode
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm md:gap-5">
              <Link
                href="/problem"
                className="app-text-action app-text-action-muted"
              >
                Problems
              </Link>
              <ThemeToggle variant="app" />
              {!session.data ? (
                <button className="app-text-action cursor-pointer" onClick={handleSignIn}>
                  Sign in
                </button>
              ) : (
                <NavbarActionDropDown session={session} variant="app" />
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 border-b border-[var(--app-border)] bg-[var(--app-chrome)] px-4 py-2 text-[var(--app-text)]"
    >
      <Link href={showControls ? "/problem" : "/"}>
        <div className="text-center text-2xl font-semibold tracking-[-0.03em] text-[var(--app-text)] md:text-[1.8rem]">
          LiteCode
        </div>
      </Link>

      <div className={showControls ? "" : "hidden"}>
        <div className="flex items-center justify-between gap-2.5 md:gap-3">
          <div>
            <Select
              onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
              defaultValue="cpp"
            >
              <SelectTrigger className="h-auto w-full border-none bg-transparent px-0 py-0 text-[12px] font-medium text-[var(--app-muted)] underline-offset-4 shadow-none transition-colors hover:underline hover:text-[var(--app-text)] focus:outline-none! focus:ring-0! md:w-[72px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-text)]">
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python" disabled>
                  <LockIcon className="h-4 w-4" /> Python
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <button
              className="app-text-action app-text-action-muted cursor-pointer text-[12px]"
              onClick={() => {
                void runCodeInEditor();
              }}
            >
              {isRunning ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Running
                </span>
              ) : (
                "Run"
              )}
            </button>
          </div>
          <div>
            <button
              className="app-text-action cursor-pointer text-[12px]"
              onClick={() => {
                void submitCodeFromEditor();
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Submitting
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle variant="app" />
        {!session.data ? (
          <button className="app-text-action cursor-pointer text-sm focus:outline-none" onClick={handleSignIn}>
            Sign in
          </button>
        ) : (
          <NavbarActionDropDown session={session} variant="app" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
