import { createOpenAI } from "@ai-sdk/openai";
import { DEFAULT_AI_MODEL_ID, isAIModelId } from "@/lib/ai/models";

const deepinfra = createOpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.DEEPINFRA_API_KEY,
});

export const getChatModel = (modelId?: string) => {
  const resolvedModel = isAIModelId(modelId) ? modelId : DEFAULT_AI_MODEL_ID;
  return deepinfra.chat(resolvedModel);
};
