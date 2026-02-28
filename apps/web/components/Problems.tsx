import Link from "next/link";

export interface Problem {
  title: string;
  difficulty: string;
  tags: string[];
  slug: string;
}

function Problems({ problems }: { problems: Problem[] }) {
  return (
    <section className="app-theme app-page py-10 md:py-14">
      <div className="app-container">
        <div className="max-w-3xl">
          <p className="app-section-label">Problem set</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--app-text)] md:text-4xl">
            A steady set of interview problems.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--app-muted)]">
            Browse by title, pick a problem, and get straight into practice.
          </p>
        </div>

        <div className="mt-12 max-w-4xl border-t border-[var(--app-border)]">
          {problems.map((challenge) => (
            <div
              key={challenge.slug}
              className="group border-b border-[var(--app-border)] py-5 transition-colors duration-150"
            >
              <div className="min-w-0">
                <Link
                  href={`/problem/${challenge.slug}`}
                  className="inline text-lg font-medium tracking-[-0.02em] text-[var(--app-text)] transition-colors hover:text-[var(--app-accent)]"
                >
                  {challenge.title}
                </Link>
                {challenge.tags.length > 0 ? (
                  <span className="ml-3 text-sm italic text-[var(--app-muted)]">
                    {challenge.tags.slice(0, 4).join(", ")}
                  </span>
                ) : null}
                <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">{challenge.difficulty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Problems;
