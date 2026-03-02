"use client";

import { useState, useRef, useCallback, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref as RefObject<HTMLElement>, () => setIsOpen(false));

  const handleSubmit = useCallback(async () => {
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFeedback("");

    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2000);
  }, [feedback, isSubmitting]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-link)]"
      >
        Feedback
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-3 w-80 origin-bottom-left rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface-strong)] p-4 shadow-[var(--landing-shadow-strong)]"
            onKeyDown={handleKeyDown}
          >
            {submitted ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--landing-accent-blue)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--landing-accent-blue-strong)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--landing-text)]">
                  Thanks for your feedback!
                </p>
                <p className="text-xs text-[var(--landing-muted)]">
                  We appreciate you taking the time.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <p className="text-sm font-medium text-[var(--landing-text)]">Send feedback</p>
                  <p className="mt-0.5 text-xs text-[var(--landing-muted)]">
                    Found a bug? Have a suggestion?
                  </p>
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full resize-none rounded-lg border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3 text-sm text-[var(--landing-text)] placeholder:text-[var(--landing-muted)] focus:border-[var(--landing-accent-blue-strong)] focus:outline-none focus:ring-1 focus:ring-[var(--landing-accent-blue-strong)]"
                  rows={3}
                  autoFocus
                />

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-[var(--landing-muted)]">
                    <kbd className="rounded border border-[var(--landing-border)] bg-[var(--landing-surface)] px-1 py-0.5 font-sans">
                      ⌘
                    </kbd>{" "}
                    +{" "}
                    <kbd className="rounded border border-[var(--landing-border)] bg-[var(--landing-surface)] px-1 py-0.5 font-sans">
                      ↵
                    </kbd>{" "}
                    to send
                  </p>

                  <button
                    onClick={handleSubmit}
                    disabled={!feedback.trim() || isSubmitting}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--landing-accent-blue-strong)] px-3 py-1.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
                      <span>Send</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
