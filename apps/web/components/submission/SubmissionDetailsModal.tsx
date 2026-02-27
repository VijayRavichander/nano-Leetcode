"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { X, Clock, Gauge, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { formatSubmissionStatus } from "./submissionCard";
import type { SubmissionListItem } from "@/lib/types/submission";

interface SubmissionDetailsModalProps {
  submission: SubmissionListItem | null;
  onClose: () => void;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.6 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.92, y: 16 },
};

const SubmissionDetailsModal = ({
  submission,
  onClose,
}: SubmissionDetailsModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useOnClickOutside(modalRef as RefObject<HTMLElement>, onClose);

  useEffect(() => {
    setMounted(true);

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    setCopied(false);
    if (copyResetTimeout.current) {
      clearTimeout(copyResetTimeout.current);
      copyResetTimeout.current = null;
    }
  }, [submission]);

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!submission?.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(submission.code);
      setCopied(true);
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
      copyResetTimeout.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const content = (
    <AnimatePresence>
      {submission ? (
        <>
          <motion.div
            layout
            className="fixed inset-0 z-40 bg-black"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            layout
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <motion.div
              layout
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f0f10] p-6 text-white shadow-2xl"
              ref={modalRef}
            >
              <button
                className="absolute right-4 top-4 rounded-full bg-white/5 p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                onClick={onClose}
                aria-label="Close submission details"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.div layout className="mb-4 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wide text-white/40">
                    Submission Status
                  </span>
                  {(() => {
                    const statusInfo = formatSubmissionStatus(submission.status);
                    return (
                      <span className={`text-lg font-semibold ${statusInfo.textClass}`}>
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
                <span className="mt-5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                  {new Date(submission.createdAt).toLocaleString()}
                </span>
              </motion.div>

              <motion.div layout className="grid gap-3 rounded-xl bg-white/5 p-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-300" />
                  <span className="text-white/50">Runtime</span>
                  <span className="font-medium text-white">
                    {submission.max_cpu_time != null && submission.max_cpu_time !== -1
                      ? `${submission.max_cpu_time * 1000} ms`
                      : "Not available"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-emerald-300" />
                  <span className="text-white/50">Memory</span>
                  <span className="font-medium text-white">
                    {submission.max_memory != null && submission.max_memory !== -1
                      ? `${submission.max_memory} KB`
                      : "Not available"}
                  </span>
                </div>
              </motion.div>

              <motion.div layout className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-white/40">
                  <span>Submitted Code</span>
                  <span>
                    {submission.code.length ? `${submission.code.length} chars` : ""}
                  </span>
                </div>
                <div className="relative">
                  {submission.code ? (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70 transition hover:bg-white/20 hover:text-white"
                      aria-label={copied ? "Code copied" : "Copy submission code"}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  ) : null}
                  <motion.pre
                    layout
                    className="max-h-72 overflow-auto rounded-xl bg-black/60 p-4 pr-14 font-mono text-xs text-white/80"
                  >
                    {submission.code || "Code not available."}
                  </motion.pre>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default SubmissionDetailsModal;
