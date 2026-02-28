"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isWorkspace = pathname.startsWith("/problem/");

  if (isLanding) {
    return (
      <footer
        className="border-t border-[var(--landing-border)] bg-[var(--landing-footer-bg)]"
        style={{ boxShadow: "var(--landing-chrome-shadow)" }}
      >
        <div className="landing-container py-6">
          <div className="flex flex-col gap-3 text-sm text-[var(--landing-muted)] md:flex-row md:items-center md:justify-between">
            <p>LiteCode is a focused practice space for steadier interview prep.</p>
            <div className="flex items-center gap-4">
              <Link className="hover:text-[var(--landing-link)]" href="/problem">
                Problems
              </Link>
              <a
                href="https://github.com/VijayRavichander"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[var(--landing-link)]"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (isWorkspace) {
    return null;
  }

  return (
    <footer
      className="border-t border-[var(--app-border)] bg-[var(--app-footer)]"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset" }}
    >
      <div className="app-container py-6">
        <div className="flex flex-col gap-3 text-sm text-[var(--app-muted)] md:flex-row md:items-center md:justify-between">
          <p>LiteCode is a focused practice space for steadier interview prep.</p>
          <div className="flex items-center gap-4">
            <Link className="hover:text-[var(--app-text)]" href="/problem">
              Problems
            </Link>
            <a
              href="https://github.com/VijayRavichander"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--app-text)]"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
