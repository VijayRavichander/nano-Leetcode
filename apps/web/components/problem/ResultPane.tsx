import SubmissionResult from "@/components/submission/SubmissionResult";
import { useCurrentSlug } from "@/lib/store/codeStore";
import type { ProblemDetail } from "@/lib/types/problem";

interface ResultPaneProps {
  problem: ProblemDetail;
}

const ResultPane = ({ problem }: ResultPaneProps) => {
  const problemSlug = useCurrentSlug() || null;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-10 items-center border-b border-white/10 px-3.5">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Results
        </h2>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">
        <SubmissionResult
          problemDesc={{ sampleTestCase: problem.visibleTestCases }}
          problemSlug={problemSlug}
        />
      </div>
    </section>
  );
};

export default ResultPane;
