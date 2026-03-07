export const AI_MODEL_OPTIONS = [
  {
    id: "MiniMaxAI/MiniMax-M2.5",
    label: "MiniMax M2.5",
  },
] as const;

export type AIModelId = (typeof AI_MODEL_OPTIONS)[number]["id"];

export const DEFAULT_AI_MODEL_ID: AIModelId = AI_MODEL_OPTIONS[0].id;

const AI_MODEL_ID_SET = new Set<string>(AI_MODEL_OPTIONS.map((model) => model.id));

export const isAIModelId = (value: unknown): value is AIModelId => {
  return typeof value === "string" && AI_MODEL_ID_SET.has(value);
};
