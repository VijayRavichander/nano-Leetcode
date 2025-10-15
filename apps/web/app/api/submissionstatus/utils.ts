import axios from "axios";

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;

export enum SubmissionResult {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  TLE = "TLE",
  COMPILATIONERROR = "COMPILATIONERROR",
  RUNTIMEERROR = "RUNTIMEERROR",
  INTERNALERROR = "INTERNALERROR",
}

export interface SubmissionStatus {
  status: SubmissionResult;
  metrics: {
    time: number;
    memory: number;
  } | null;
}

interface Judge0Submission {
  memory: number | null;
  time: string | null;
  status: {
    description: string;
  };
}

interface Judge0Response {
  submissions: Judge0Submission[];
}

type SubmissionMetrics = SubmissionStatus["metrics"];

const PROCESSING_STATUSES = new Set(["In Queue", "Processing"]);
const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 30; // 1 minute total with 2s intervals

const JUDGE0_STATUS_MAP: Record<string, SubmissionResult> = {
  Accepted: SubmissionResult.ACCEPTED,
  "Wrong Answer": SubmissionResult.REJECTED,
  "Time Limit Exceeded": SubmissionResult.TLE,
  "Compilation Error": SubmissionResult.COMPILATIONERROR,
  "Runtime error (SIGSEGV)": SubmissionResult.RUNTIMEERROR,
  "Runtime error (SIGXFSZ)": SubmissionResult.RUNTIMEERROR,
  "Runtime error (SIGFPE)": SubmissionResult.RUNTIMEERROR,
  "Runtime error (SIGABRT)": SubmissionResult.RUNTIMEERROR,
  "Runtime error (NZEC)": SubmissionResult.RUNTIMEERROR,
  "Runtime error (Other)": SubmissionResult.RUNTIMEERROR,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkSubmissionStatus = async (tokenQuery: string): Promise<SubmissionStatus> => {
  assertJudge0Config();

  for (let retries = 0; retries < MAX_RETRIES; retries++) {
    try {
      const submissions = await fetchSubmissions(tokenQuery);
      const evaluation = evaluateSubmissions(submissions);

      if (!evaluation.complete) {
        console.log(`Still processing... Retry ${retries + 1}/${MAX_RETRIES}`);
        await delay(POLL_INTERVAL);
        continue;
      }

      return {
        status: evaluation.status,
        metrics: evaluation.metrics,
      };
    } catch (error) {
      console.error("Error fetching submission status:", error);
      return {
        status: SubmissionResult.INTERNALERROR,
        metrics: null,
      };
    }
  }

  console.error(`Max retries (${MAX_RETRIES}) exceeded`);
  return {
    status: SubmissionResult.INTERNALERROR,
    metrics: null,
  };
};

const fetchSubmissions = async (tokenQuery: string): Promise<Judge0Submission[]> => {

  console.log("Token Query: ")
  console.log(tokenQuery)

  const response = await axios.get<Judge0Response>(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokenQuery}&base64_encoded=true`,
    {
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY!,
        "x-rapidapi-host": JUDGE0_HOST!,
        "Content-Type": "application/json",
      },
    }
    );

  return response.data.submissions;
};

const evaluateSubmissions = (submissions: Judge0Submission[]) => {
  const metrics: { memory: number[]; time: number[] } = { memory: [], time: [] };

  for (const submission of submissions) {
    console.log("Submission Status")
    console.log(submission.status)
    const description = submission.status.description;

    if (PROCESSING_STATUSES.has(description)) {
      return {
        complete: false,
        status: SubmissionResult.PENDING,
        metrics: null as SubmissionMetrics,
      };
    }

    const result = mapJudge0Status(description);

    if (result !== SubmissionResult.ACCEPTED) {
      return {
        complete: true,
        status: result,
        metrics: null as SubmissionMetrics,
      };
    }

    metrics.memory.push(submission.memory ?? 0);
    metrics.time.push(parseFloat(submission.time ?? "0"));
  }

  return {
    complete: true,
    status: SubmissionResult.ACCEPTED,
    metrics: {
      memory: maxValue(metrics.memory),
      time: maxValue(metrics.time),
    } satisfies SubmissionMetrics,
  };
};

const mapJudge0Status = (description: string): SubmissionResult => {
  return JUDGE0_STATUS_MAP[description] ?? SubmissionResult.INTERNALERROR;
};

const maxValue = (values: number[]): number => {
  const finiteValues = values.filter(value => Number.isFinite(value));

  if (!finiteValues.length) {
    return -1;
  }

  return finiteValues.reduce((max, current) => (current > max ? current : max), finiteValues[0]!);
};

const assertJudge0Config = () => {
  if (!JUDGE0_URL || !JUDGE0_API_KEY || !JUDGE0_HOST) {
    throw new Error("Missing Judge0 configuration");
  }
};