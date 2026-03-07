"use client";

import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";

const FEEDBACK_MAX_LENGTH = 2000;

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useOnClickOutside(ref as RefObject<HTMLElement>, () => setIsOpen(false));

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  const handleSubmit = useCallback(async () => {
    if (!feedback.trim() || isSubmitting) return;

    clearCloseTimeout();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: feedback.trim(),
          pageUrl: window.location.href,
          website,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(payload?.error || "Failed to send feedback.");
        return;
      }

      setSubmitted(true);
      setFeedback("");
      setWebsite("");

      closeTimeoutRef.current = window.setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (submitError) {
      console.error("Failed to submit feedback", submitError);
      setError("Failed to send feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }, [clearCloseTimeout, feedback, isSubmitting, website]);

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
        onClick={() => {
          clearCloseTimeout();
          setIsOpen((open) => {
            const nextOpen = !open;

            if (nextOpen) {
              setError("");
            }

            return nextOpen;
          });
        }}
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
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Tell us what you think..."
                  className="w-full resize-none rounded-lg border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3 text-sm text-[var(--landing-text)] placeholder:text-[var(--landing-muted)] focus:border-[var(--landing-accent-blue-strong)] focus:outline-none focus:ring-1 focus:ring-[var(--landing-accent-blue-strong)]"
                  rows={3}
                  maxLength={FEEDBACK_MAX_LENGTH}
                  autoFocus
                />

                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0 pointer-events-none">
                  <input
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {error ? (
                  <p className="mt-3 text-xs text-[var(--landing-accent-red)]" role="alert">
                    {error}
                  </p>
                ) : null}

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
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--landing-accent-blue-strong)] px-3 py-1.5 text-sm font-medium text-[var(--landing-accent-foreground)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
