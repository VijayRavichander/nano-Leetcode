"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const AppEmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: AppEmptyStateProps) => {
  const action = actionLabel ? (
    actionHref ? (
      <Link href={actionHref} className="app-link-button mt-2">
        {actionLabel}
      </Link>
    ) : onAction ? (
      <button type="button" className="app-link-button mt-2 cursor-pointer" onClick={onAction}>
        {actionLabel}
      </button>
    ) : null
  ) : null;

  return (
    <div
      className={cn(
        "app-empty-state flex min-h-36 flex-col items-center justify-center gap-3 rounded-[14px] px-6 py-8 text-center",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-panel)] text-[var(--app-accent)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-sm font-medium text-[var(--app-text)]">{title}</h3>
        <p className="text-sm leading-6 text-[var(--app-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
};

export default AppEmptyState;
