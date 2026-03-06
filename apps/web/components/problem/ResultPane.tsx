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
