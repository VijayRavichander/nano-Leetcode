import type { CodeTemplate, ProblemDetail } from "@/lib/types/problem";
import type { SupportedLanguage } from "@/lib/store/codeStore";

const FALLBACK_LANGUAGE: SupportedLanguage = "cpp";

export const resolveDefaultCode = (
  templates: CodeTemplate[],
  language: SupportedLanguage
): string => {
  if (!Array.isArray(templates) || templates.length === 0) {
    return "";
  }

  const requestedLanguage =
    templates.find((template) => template.language === language)?.code;

  if (requestedLanguage) {
    return requestedLanguage;
  }

  const fallback = templates.find(
    (template) => template.language === FALLBACK_LANGUAGE
  )?.code;

  return fallback ?? templates[0]?.code ?? "";
};

interface InitializeProblemSessionInput {
  problem: ProblemDetail;
  slug: string;
  language: SupportedLanguage;
  setProblemId: (problemId: string) => void;
  setCurrentSlug: (slug: string) => void;
  ensureCodeForSlug: (slug: string, defaultCode: string) => void;
}

export const initializeProblemSession = ({
  problem,
  slug,
  language,
  setProblemId,
  setCurrentSlug,
  ensureCodeForSlug,
}: InitializeProblemSessionInput) => {
  setProblemId(problem.id);
  setCurrentSlug(slug);

  const defaultCode = resolveDefaultCode(problem.functionCode, language);
  ensureCodeForSlug(slug, defaultCode);
};
