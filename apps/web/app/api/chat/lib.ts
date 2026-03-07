import { createOpenAI } from "@ai-sdk/openai";

const deepinfra = createOpenAI({
    baseURL: 'https://api.deepinfra.com/v1/openai',
    apiKey: process.env.DEEPINFRA_API_KEY,
  });

export const model = deepinfra.chat('MiniMaxAI/MiniMax-M2.5');