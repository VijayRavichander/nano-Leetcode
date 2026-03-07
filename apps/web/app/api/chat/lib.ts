import { createOpenAI } from "@ai-sdk/openai";
import { DEFAULT_AI_MODEL_ID, isAIModelId } from "@/lib/ai/models";

const getDeepInfraClient = () => {
  const apiKey = process.env.DEEPINFRA_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPINFRA_API_KEY is not configured");
  }

  return createOpenAI({
    baseURL: "https://api.deepinfra.com/v1/openai",
    apiKey,
  });
};

export const getChatModel = (modelId?: string) => {
  const resolvedModel = isAIModelId(modelId) ? modelId : DEFAULT_AI_MODEL_ID;
  return getDeepInfraClient().chat(resolvedModel);
};
