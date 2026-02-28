import axios from "axios";
import { env, requireEnv } from "../config/env";
import { AppError } from "../lib/errors";

const getJudge0Config = () => ({
  url: requireEnv("JUDGE0_URL", env.judge0.url),
  apiKey: requireEnv("JUDGE0_API_KEY", env.judge0.apiKey),
  host: requireEnv("JUDGE0_HOST", env.judge0.host),
});

const getHeaders = () => {
  const config = getJudge0Config();

  return {
    "x-rapidapi-key": config.apiKey,
    "x-rapidapi-host": config.host,
    "Content-Type": "application/json",
  };
};

export const languageToIdMap: Record<string, number> = {
  cpp: 54,
  python: 71,
};

export interface RunResult {
  id: number;
  description: string;
}

export interface SubmissionStatusResult {
  status:
    | "ACCEPTED"
    | "REJECTED"
    | "PENDING"
    | "TLE"
    | "COMPILATIONERROR"
    | "RUNTIMEERROR"
    | "INTERNALERROR";
  metrics: {
    maxTime: number | null;
    maxMemory: number | null;
  };
}

export const submitBatchToJudge0 = async (payload: {
  sourceCodeBase64: string;
  languageId: number;
  testCases: Array<{ input: string; output: string }>;
}): Promise<string[]> => {
  const config = getJudge0Config();

  const submissions = payload.testCases.map((testCase) => ({
    source_code: payload.sourceCodeBase64,
    language_id: payload.languageId,
    stdin: Buffer.from(testCase.input).toString("base64"),
    expected_output: Buffer.from(testCase.output).toString("base64"),
  }));

  const response = await axios.post(
    `${config.url}/submissions/batch?base64_encoded=true`,
    { submissions },
    { headers: getHeaders() }
  );

  return (response.data as Array<{ token?: string }>)
    .map((item) => item.token)
    .filter((token): token is string => Boolean(token));
};

export const runAgainstVisibleTests = async (payload: {
  sourceCodeBase64: string;
  languageId: number;
  testCases: Array<{ input: string; output: string }>;
}): Promise<RunResult[]> => {
  const config = getJudge0Config();
  const results: RunResult[] = [];

  for (const testCase of payload.testCases) {
    try {
      const response = await axios.post(
        `${config.url}/submissions/?base64_encoded=true&wait=true`,
        {
          source_code: payload.sourceCodeBase64,
          language_id: payload.languageId,
          stdin: Buffer.from(testCase.input).toString("base64"),
          expected_output: Buffer.from(testCase.output).toString("base64"),
        },
        { headers: getHeaders() }
      );

      const status = response.data?.status;
      if (!status) {
        results.push({ id: -1, description: "Failed" });
        continue;
      }

      results.push({
        id: status.id ?? -1,
        description: status.description ?? "Failed",
      });
    } catch {
      results.push({ id: -1, description: "Failed" });
    }
  }

  return results;
};

const mapJudge0Status = (description: string): SubmissionStatusResult["status"] => {
  switch (description) {
    case "Accepted":
      return "ACCEPTED";
    case "Wrong Answer":
      return "REJECTED";
    case "In Queue":
    case "Processing":
      return "PENDING";
    case "Time Limit Exceeded":
      return "TLE";
    case "Compilation Error":
      return "COMPILATIONERROR";
    default:
      if (description.startsWith("Runtime error")) {
        return "RUNTIMEERROR";
      }
      return "INTERNALERROR";
  }
};

export const checkSubmissionStatus = async (
  tokenQuery: string
): Promise<SubmissionStatusResult> => {
  const config = getJudge0Config();

  for (let attempts = 0; attempts < 15; attempts += 1) {
    const response = await axios.get(
      `${config.url}/submissions/batch?tokens=${tokenQuery}&base64_encoded=true`,
      { headers: getHeaders() }
    );

    const submissions = response.data?.submissions as Array<{
      status?: { description?: string };
      time?: string | null;
      memory?: number | null;
    }>;

    if (!Array.isArray(submissions) || submissions.length === 0) {
      throw new AppError("Invalid Judge0 response", 502);
    }

    let pending = false;
    let maxTime = 0;
    let maxMemory = 0;

    for (const submission of submissions) {
      const description = submission.status?.description ?? "Unknown";
      const mapped = mapJudge0Status(description);

      if (mapped === "PENDING") {
        pending = true;
        break;
      }

      if (mapped !== "ACCEPTED") {
        return {
          status: mapped,
          metrics: { maxTime: null, maxMemory: null },
        };
      }

      maxTime = Math.max(maxTime, Number.parseFloat(submission.time ?? "0") || 0);
      maxMemory = Math.max(maxMemory, submission.memory ?? 0);
    }

    if (!pending) {
      return {
        status: "ACCEPTED",
        metrics: {
          maxTime,
          maxMemory,
        },
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return {
    status: "PENDING",
    metrics: { maxTime: null, maxMemory: null },
  };
};
