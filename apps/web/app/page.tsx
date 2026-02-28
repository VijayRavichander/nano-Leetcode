import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page min-h-screen">
      <section className="landing-container pt-10 pb-20 md:pt-16 md:pb-24">
        <div className="landing-narrow landing-appear">
          <p className="landing-kicker">Interview prep, without the usual noise.</p>

          <h1 className="landing-hero mt-8 text-[var(--landing-text)]">
            <span className="landing-highlight">Turn patterns</span> into{" "}
            <span className="landing-underline">confidence</span>.
          </h1>

          <p className="mt-8 max-w-[38rem] text-[1.15rem] leading-8 text-[var(--landing-text)]/78">
            LiteCode helps you practice interview problems, sharpen core patterns, and build the
            kind of consistency that carries into real rounds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <Link href="/problem" className="landing-link-button">
              Start practicing
            </Link>
            <Link
              href="/problem"
              className="landing-text-action landing-text-action-muted"
            >
              Explore problems
            </Link>
          </div>
        </div>

        <div className="landing-narrow landing-appear mt-16 md:mt-20">
          <p className="landing-kicker">Built for steady practice</p>
          <p className="mt-2 max-w-[38rem] text-[1.05rem] leading-8 text-[var(--landing-text)]/72">
            Work through problems, run your code, and learn from each submission without breaking
            your flow.
          </p>

          <div className="landing-proof mt-8 overflow-hidden p-3 md:p-4">
            <div className="rounded-[10px] border border-[var(--landing-border)] bg-[var(--landing-surface-strong)]">
              <div className="flex items-center gap-1.5 border-b border-[var(--landing-border)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f2b6a8]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#e7d290]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#a9d3a6]" />
                <span className="ml-4 text-xs text-[var(--landing-muted)]">litecode.app/problem</span>
              </div>

              <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="border-b border-[var(--landing-border)] px-5 py-5 md:border-b-0 md:border-r">
                  <p className="text-xs text-[var(--landing-muted)]">Problem</p>
                  <h2 className="mt-3 text-lg font-medium text-[var(--landing-text)]">
                    Longest Substring Without Repeating Characters
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--landing-text)]/72">
                    Find the length of the longest substring without repeating characters.
                  </p>
                </div>

                <div className="px-5 py-5">
                  <div className="rounded-[10px] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-3 text-sm text-[var(--landing-text)]/82">
                    <div>int left = 0;</div>
                    <div>track the last seen index</div>
                    <div>expand, then tighten the window</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-[var(--landing-muted)]">
                    <span>Run</span>
                    <span>0.6s</span>
                  </div>

                  <div className="mt-3 rounded-[10px] border border-[var(--landing-border)] px-4 py-3 text-sm text-[var(--landing-text)]">
                    Accepted after one quick revision.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
