import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ProblemFormSchema } from "@/lib/schemas/problem-schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const few_shot_examples = `
[
{
"title": "Longest Substring Without Repeating Characters",
"slug": "longest-substring-without-repeating",
"difficulty": "Medium",
"type": "None",
"tags": ["Strings", "Sliding Window"],
"description": "Given a string s, return the length of the longest substring without repeating characters.",
"constraints": ["1 <= |s| <= 100000", "s consists of ASCII letters and digits only"],
"testCases": [
{ "input": "abcabcbb", "output": "3", "explanation": "The answer is "abc"" },
{ "input": "bbbbb", "output": "1", "explanation": "The answer is "b"" }
],
"visibleTestCases": [
{ "input": "abcabcbb", "output": "3" },
{ "input": "bbbbb", "output": "1" }
],
"hiddenTestCases": [
{ "input": "pwwkew", "output": "3" },
{ "input": "dvdf", "output": "3" },
{ "input": "aab", "output": "2" },
{ "input": "abcdef", "output": "6" },
{ "input": "tmmzuxt", "output": "5" }
],
"functionCode": [
{ "language": "cpp", "code": "int lengthOfLongestSubstring(const string& s) { int result = 0; return result; }" }
],
"completeCode": [
{ "language": "cpp", "code": "#include <bits/stdc++.h> using namespace std; ##USER_CODE_HERE## int main(){ ios::sync_with_stdio(false); cin.tie(nullptr); string s; if(!(cin >> s)) return 0; cout << lengthOfLongestSubstring(s); return 0; }" }
]
},
{
"title": "Subarray Sum Equals K (Count)",
"slug": "subarray-sum-equals-k",
"difficulty": "Medium",
"type": "None",
"tags": ["Arrays", "Hash Map", "Prefix Sum"],
"description": "Given an array of integers and an integer k, return the total number of continuous subarrays whose sum equals k.",
"constraints": ["1 <= n <= 100000", "-1000000000 <= nums[i] <= 1000000000", "-100000000000000 <= k <= 100000000000000"],
"testCases": [
{ "input": "5\n1 1 1 2 1\n3", "output": "3", "explanation": "Subarrays: [1,1,1], [1,2], [2,1]" },
{ "input": "3\n1 2 3\n3", "output": "2", "explanation": "[1,2] and [3]" }
],
"visibleTestCases": [
{ "input": "5\n1 1 1 2 1\n3", "output": "3" },
{ "input": "3\n1 2 3\n3", "output": "2" }
],
"hiddenTestCases": [
{ "input": "1\n3\n3", "output": "1" },
{ "input": "4\n0 0 0 0\n0", "output": "10" },
{ "input": "6\n-1 -1 1 1 -1 1\n0", "output": "9" },
{ "input": "5\n2 -2 2 -2 2\n0", "output": "9" },
{ "input": "5\n1000000000 -1000000000 1 -1 0\n0", "output": "7" }
],
"functionCode": [
{ "language": "cpp", "code": "long long subarraySumEqualsK(const vector<long long>& nums, long long k) { long long result = 0; return result; }" }
],
"completeCode": [
{ "language": "cpp", "code": "#include <bits/stdc++.h> using namespace std; ##USER_CODE_HERE## int main(){ ios::sync_with_stdio(false); cin.tie(nullptr); int n; if(!(cin >> n)) return 0; vector<long long> a(n); for(int i=0;i<n;++i) cin >> a[i]; long long k; cin >> k; cout << subarraySumEqualsK(a, k); return 0; }" }
]
},
{
"title": "Minimum Window Substring",
"slug": "minimum-window-substring",
"difficulty": "Hard",
"type": "None",
"tags": ["Strings", "Sliding Window", "Hash Map"],
"description": "Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such substring exists, return -1.",
"constraints": ["1 <= |s|, |t| <= 100000", "s and t consist of lowercase English letters only"],
"testCases": [
{ "input": "ADOBECODEBANC\nABC", "output": "BANC", "explanation": "" },
{ "input": "a\naa", "output": "-1", "explanation": "No window covers both 'a's" }
],
"visibleTestCases": [
{ "input": "ADOBECODEBANC\nABC", "output": "BANC" },
{ "input": "a\naa", "output": "-1" }
],
"hiddenTestCases": [
{ "input": "aa\naa", "output": "aa" },
{ "input": "ab\nb", "output": "b" },
{ "input": "bbaa\naba", "output": "baa" },
{ "input": "abcdebdde\nbde", "output": "bdde" },
{ "input": "aaaaaab\nab", "output": "ab" }
],
"functionCode": [
{ "language": "cpp", "code": "string minWindow(const string& s, const string& t) { string result = "-1"; return result; }" }
],
"completeCode": [
{ "language": "cpp", "code": "#include <bits/stdc++.h> using namespace std; ##USER_CODE_HERE## int main(){ ios::sync_with_stdio(false); cin.tie(nullptr); string s, t; if(!getline(cin, s)) return 0; if(s.size()==0) return 0; if(!getline(cin, t)) return 0; cout << minWindow(s, t); return 0; }" }
]
}
]
`;

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
6. Realistic constraints
7. Example test cases with explanations
8. Both visible and hidden test cases for evaluation
9. Boilerplate code in C++ (function signature only)
10. Complete solution code in C++

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
    } catch (parseError) {
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
  } catch (error: any) {
    console.error("Error generating problem:", error);

    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded" },
        { status: 429 }
      );
    }

    if (error.code === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate problem",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
