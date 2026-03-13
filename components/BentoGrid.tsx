"use client";

import { McpIllustration } from "./illustrations/McpIllustration";
import { EditorIllustration } from "./illustrations/EditorIllustration";
import { SpeedometerIllustration } from "./illustrations/SpeedometerIllustration";
import { SecurityIllustration } from "./illustrations/SecurityIllustration";
import { ThemesIllustration } from "./illustrations/ThemesIllustration";
import { RaycastIllustration } from "./illustrations/RaycastIllustration";
import { PlatformsIllustration } from "./illustrations/PlatformsIllustration";

interface FeatureCardProps {
  illustration: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  illustrationHeight?: string;
}

function FeatureCard({
  illustration,
  title,
  description,
  className = "",
  illustrationHeight = "h-44",
}: FeatureCardProps) {
  return (
    <div
      className={`flex flex-col bg-surface border border-border rounded-none overflow-hidden ${className}`}
    >
      <div
        className={`${illustrationHeight} flex items-center justify-center p-6 bg-background border-b border-border`}
      >
        {illustration}
      </div>
      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-base font-semibold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-20">
      {/* Section header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance mb-4">
          Small things that add up
        </h2>
        <p className="text-base text-muted max-w-md mx-auto leading-relaxed">
          Details you&apos;ll appreciate every day. Polish that shows someone
          actually uses this.
        </p>
      </div>

      {/* Grid wrapper with outer border */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Row 1 — 3 columns, varied widths: ~30% | ~40% | ~30% */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_4fr_3fr] border-b border-border">
          <FeatureCard
            illustration={<McpIllustration />}
            title="MCP integrations"
            description="Exposes your processes, logs, and project state to AI agents via MCP. Let Claude or other AI tools help debug and manage your stack."
            illustrationHeight="h-48"
          />
          <div className="border-l border-r border-border md:border-l md:border-r">
            <FeatureCard
              illustration={<EditorIllustration />}
              title="Open in your editor"
              description="Set your default editor and open any project directly. One click to VS Code, Zed — whatever you use."
              illustrationHeight="h-48"
            />
          </div>
          <FeatureCard
            illustration={<SpeedometerIllustration />}
            title="Lightweight & fast"
            description="Built with Tauri, not Electron. Around 25MB download. Uses less RAM than a single Chrome tab."
            illustrationHeight="h-48"
          />
        </div>

        {/* Row 2 — 4 equal columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <FeatureCard
            illustration={<SecurityIllustration />}
            title="Security first"
            description="If your config changes after a git pull, the app asks you to confirm before running anything. No surprises."
            illustrationHeight="h-40"
          />
          <div className="sm:border-l border-t sm:border-t-0 border-border">
            <FeatureCard
              illustration={<ThemesIllustration />}
              title="Themes"
              description="Light mode and dark mode included. Your dev environment doesn't have to clash with your setup."
              illustrationHeight="h-40"
            />
          </div>
          <div className="sm:border-l border-t sm:border-t-0 border-border">
            <FeatureCard
              illustration={<RaycastIllustration />}
              title="Raycast extension"
              description="Launch projects, start processes, and manage your stack from Raycast. (Pending Raycast Store approval.)"
              illustrationHeight="h-40"
            />
          </div>
          <div className="sm:border-l border-t sm:border-t-0 border-border">
            <FeatureCard
              illustration={<PlatformsIllustration />}
              title="Mac, Windows & Linux"
              description="Works wherever you work. Mac available now, Windows and Linux coming soon."
              illustrationHeight="h-40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
