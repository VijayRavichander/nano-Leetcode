import type { ProblemDetail } from "@/lib/types/problem";

interface ProblemPaneProps {
  problem: ProblemDetail;
}

const ProblemPane = ({ problem }: ProblemPaneProps) => {
  return (
    <section className="flex h-full flex-col overflow-y-auto px-4 py-3">
      <header className="border-b border-white/10 pb-3">
        <h1 className="text-base font-semibold leading-6 text-white">{problem.title}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              problem.difficulty === "Easy"
                ? "bg-emerald-500/15 text-emerald-300"
                : problem.difficulty === "Medium"
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-rose-500/15 text-rose-300"
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-5 py-3 text-sm leading-6 text-zinc-300">
        <article className="whitespace-pre-wrap text-zinc-200">
          {problem.description}
        </article>

        <div>
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Examples
          </h2>
          <div className="space-y-2.5">
            {problem.visibleTestCases.map((testCase, index) => (
              <div
                key={`${index}-${testCase.input}-${testCase.output}`}
                className="rounded-lg border border-white/10 bg-black/20 p-2.5 font-mono text-[11px] leading-5"
              >
                <div>
                  <span className="text-zinc-500">Input:</span> {testCase.input}
                </div>
                <div className="mt-1">
                  <span className="text-zinc-500">Output:</span> {testCase.output}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Constraints
          </h2>
          <ul className="list-inside list-disc space-y-1 leading-5 text-zinc-300">
            {problem.constraints.map((constraint, index) => (
              <li key={`${constraint}-${index}`}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProblemPane;
