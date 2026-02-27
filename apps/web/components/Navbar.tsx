"use client";

import { Loader2, LockIcon, PlayIcon, RocketIcon } from "lucide-react";
import { Button } from "./ui/button";
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

import { AnimatePresence, motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
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

  return (
    <div
      className={`flex justify-between bg-black p-2 px-4 text-white ${showControls ? "" : "border-b border-violet-400"}`}
    >
      <Link href={showControls ? "/problem" : "/"}>
        <div className="text-center text-2xl font-bold lowercase tracking-tighter text-purple-400 md:text-3xl">
          LiteCode
        </div>
      </Link>

      <div className={`${showControls ? "" : "hidden"}`}>
        <div className="flex justify-between gap-2">
          <div>
            <Select
              onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
              defaultValue="cpp"
            >
              <SelectTrigger className="w-full border-0 bg-neutral-900 text-white shadow-none focus:outline-none! focus:ring-0! md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white/90!">
                <SelectItem value="cpp">CPP</SelectItem>
                <SelectItem value="python" disabled>
                  <LockIcon className="h-4 w-4" /> Python
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              className="cursor-pointer font-normal text-blue-400 transition-all duration-200 hover:bg-blue-500/50 hover:text-blue-200 active:scale-95"
              onClick={() => {
                void runCodeInEditor();
              }}
            >
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="run"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <PlayIcon className="hidden fill-current md:block" />
                    Run
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          <div>
            <Button
              className="group cursor-pointer font-normal text-green-600 transition-all duration-200 hover:bg-emerald-500/50 hover:text-green-200 active:scale-95"
              onClick={() => {
                void submitCodeFromEditor();
              }}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                        <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                        <div className="h-1 w-1 animate-bounce rounded-full bg-current" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <RocketIcon className="hidden md:block" />
                    Submit
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {!session.data ? (
          <Button
            className="
              cursor-pointer rounded-md bg-neutral-950
              px-2 text-sm lowercase text-white/90 hover:bg-neutral-800 hover:text-white hover:underline
              transition-all duration-300 active:scale-95
              focus:outline-none
            "
            onClick={handleSignIn}
          >
            Sign in
          </Button>
        ) : (
          <NavbarActionDropDown session={session} />
        )}
      </div>
    </div>
  );
};

export default NavBar;
