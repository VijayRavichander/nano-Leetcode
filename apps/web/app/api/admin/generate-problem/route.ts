import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ProblemFormSchema } from "@/lib/schemas/problem-schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getErrorCode = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  const { code } = error;
  return typeof code === "string" ? code : undefined;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examples, problemHint } = body;

    if (!examples || typeof examples !== "string") {
      return NextResponse.json(
        { error: "Examples are required for few-shot prompting" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert leetcode problem creator. Generate a complete LeetCode-style problem with all required fields.

The problem should include:
1. A clear, engaging title
2. A URL-friendly slug
3. Appropriate difficulty level (Easy/Medium/Hard)
4. Relevant tags (like "array", "hash-map", "two-pointers", etc.)
5. A detailed problem description with input/output format
6. A markdown editorial with sections for intuition, approach, and complexity
7. Realistic constraints
8. Example test cases with explanations
9. Both visible and hidden test cases for evaluation
10. Boilerplate code in C++ (function signature only)
11. Complete solution code in C++

Make the problem interesting, well-structured, and similar in style to the examples provided.`;

    const userPrompt = `Here are some example problems for reference:

${examples}

${problemHint ? `Problem hint/topic: ${problemHint}` : ""}

Generate a new, original leetcode problem following the same format and quality as the examples above. Make sure all fields are properly filled out.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "problem_generation",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              difficulty: {
                type: "string",
                enum: ["Easy", "Medium", "Hard"],
              },
              type: {
                type: "string",
                enum: ["None", "Contest", "Non_Contest"],
              },
              tags: {
                type: "array",
                items: { type: "string" },
              },
              description: { type: "string" },
              editorial: { type: "string" },
              constraints: {
                type: "array",
                items: { type: "string" },
              },
              testCases: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    input: { type: "string" },
                    output: { type: "string" },
                    explanation: { type: "string" },
                  },
                  required: ["input", "output", "explanation"],
                },
              },
              visibleTestCases: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    input: { type: "string" },
                    output: { type: "string" },
                  },
                  required: ["input", "output"],
                },
              },
              hiddenTestCases: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    input: { type: "string" },
                    output: { type: "string" },
                  },
                  required: ["input", "output"],
                },
              },
              functionCode: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    language: { type: "string" },
                    code: { type: "string" },
                  },
                  required: ["language", "code"],
                },
              },
              completeCode: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    language: { type: "string" },
                    code: { type: "string" },
                  },
                  required: ["language", "code"],
                },
              },
            },
            required: [
              "title",
              "slug",
              "difficulty",
              "type",
              "tags",
              "description",
              "editorial",
              "constraints",
              "testCases",
              "visibleTestCases",
              "hiddenTestCases",
              "functionCode",
              "completeCode",
            ],
          },
        },
      },
      temperature: 1,
      max_completion_tokens: 4000,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        { error: "Failed to generate problem content" },
        { status: 500 }
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse generated content" },
        { status: 500 }
      );
    }

    // Validate the generated content against our schema
    const validationResult = ProblemFormSchema.safeParse(parsedContent);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Generated content doesn't match expected schema",
          details: validationResult.error.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      problem: validationResult.data,
    });
  } catch (error: unknown) {
    console.error("Error generating problem:", error);

    const errorCode = getErrorCode(error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorCode === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded" },
        { status: 429 }
      );
    }

    if (errorCode === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate problem",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
