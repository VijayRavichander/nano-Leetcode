"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { isDevAuthBypassEnabledClient } from "@/lib/auth/client-session";

const STORAGE_KEY = "litecode:onboarding-seen:v2";

const onboardingSteps = [
  {
    title: "From question to submission.",
    description:
      "Start in the Question pane to read the prompt, examples, and constraints. Then move to the Editor to write your solution, use Run to check it quickly, and Submit when you are ready.",
  },
  {
    title: "Use the extra tools when you need them.",
    description:
      "Open the AI Assistant for hints, debugging help, or a second look at your approach. Use the theme toggle in the top bar to switch between light, dark, and stealth modes whenever you want a different view.",
  },
] as const;

function isWorkspacePath(pathname: string | null) {
  return Boolean(pathname && pathname.startsWith("/problem/"));
}

const OnboardingGate = () => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isDevBypass = isDevAuthBypassEnabledClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const shouldRender = isWorkspacePath(pathname);
  const step = onboardingSteps[stepIndex] ?? onboardingSteps[0];
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  const closeModal = useCallback(() => {
    if (typeof window !== "undefined" && !isDevBypass) {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }

    setIsOpen(false);
  }, [isDevBypass]);

  useEffect(() => {
    if (!shouldRender) {
      setIsOpen(false);
      setIsReady(true);
      return;
    }

    setIsReady(true);

    if (isDevBypass) {
      setIsOpen(true);
      return;
    }

    const hasSeenOnboarding =
      typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "true";

    setIsOpen(!hasSeenOnboarding);
  }, [isDevBypass, pathname, shouldRender]);

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isReady || !shouldRender || !step) {
    return null;
  }

  const panelAnimation = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.2,
          ease: [0.215, 0.61, 0.355, 1] as const,
        },
      };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={closeModal}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="onboarding-title"
              tabIndex={-1}
              className="app-theme w-full max-w-xl rounded-[24px] border border-[var(--app-border)] bg-[var(--app-panel)] p-6 text-[var(--app-text)] shadow-[var(--app-shadow-strong)] outline-none md:p-8"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={panelAnimation}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs tracking-[0.12em] text-[var(--app-muted)] uppercase">
                    {stepIndex + 1} of {onboardingSteps.length}
                  </p>
                  <h2
                    id="onboarding-title"
                    className="text-[1.8rem] font-semibold tracking-[-0.03em] text-[var(--app-text)]"
                  >
                    {step.title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="app-text-action app-text-action-muted cursor-pointer px-0 py-0"
                  onClick={closeModal}
                  aria-label="Close onboarding"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--app-muted)] md:text-base">
                {step.description}
              </p>

              <div className="mt-6 flex items-center gap-2">
                {onboardingSteps.map((item, index) => (
                  <span
                    key={item.title}
                    className={`h-1.5 rounded-full transition-all ${
                      index === stepIndex
                        ? "w-8 bg-[var(--app-text)]"
                        : "w-3 bg-[var(--app-border)]"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--app-border)] pt-5">
                <button
                  type="button"
                  className="app-text-action app-text-action-muted cursor-pointer px-0 py-0"
                  onClick={stepIndex === 0 ? closeModal : () => setStepIndex(stepIndex - 1)}
                >
                  {stepIndex === 0 ? "Not now" : "Back"}
                </button>
                <button
                  type="button"
                  className="app-text-action cursor-pointer px-0 py-0"
                  onClick={isLastStep ? closeModal : () => setStepIndex(stepIndex + 1)}
                >
                  {isLastStep ? "Done" : "Next"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default OnboardingGate;
