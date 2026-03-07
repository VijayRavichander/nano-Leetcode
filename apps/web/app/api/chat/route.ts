import { NextResponse } from "next/server";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { isAIModelId } from "@/lib/ai/models";
import { getChatModel } from "./lib";

interface ProblemChatContext {
  title?: string;
  difficulty?: string;
  tags?: string[];
  description?: string;
  language?: string;
  code?: string;
}

interface ChatRequestBody {
  messages?: UIMessage[];
  modelId?: string;
  context?: ProblemChatContext;
}

const MAX_DESCRIPTION_CHARS = 4000;
const MAX_CODE_CHARS = 4000;

const sanitizeText = (value: unknown, maxChars: number) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxChars);
};

const sanitizeTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag): tag is string => typeof tag === "string").slice(0, 8);
};

const buildSystemPrompt = (context?: ProblemChatContext) => {
  if (!context) {
    return undefined;
  }

  const title = sanitizeText(context.title, 120);
  const difficulty = sanitizeText(context.difficulty, 20);
  const description = sanitizeText(context.description, MAX_DESCRIPTION_CHARS);
  const language = sanitizeText(context.language, 20);
  const code = sanitizeText(context.code, MAX_CODE_CHARS);
  const tags = sanitizeTags(context.tags);

  const contextBlocks: string[] = [];

  if (title) {
    contextBlocks.push(`Title: ${title}`);
  }

  if (difficulty) {
    contextBlocks.push(`Difficulty: ${difficulty}`);
  }

  if (tags.length > 0) {
    contextBlocks.push(`Tags: ${tags.join(", ")}`);
  }

  if (description) {
    contextBlocks.push(`Problem Description:\n${description}`);
  }

  if (language) {
    contextBlocks.push(`Current Language: ${language}`);
  }

  if (code) {
    contextBlocks.push(`Current Code:\n${code}`);
  }

  if (contextBlocks.length === 0) {
    return undefined;
  }

  return [
    "You are LiteCode's interview prep assistant.",
    "Prioritize concise, practical guidance to help solve the active coding problem.",
    "When code is provided, identify concrete bugs and suggest improvements.",
    "",
    "Problem Context:",
    ...contextBlocks,
  ].join("\n");
};

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }

    const model = getChatModel(
      isAIModelId(body.modelId) ? body.modelId : undefined
    );
    const system = buildSystemPrompt(body.context);

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
      ...(system ? { system } : {}),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
};
