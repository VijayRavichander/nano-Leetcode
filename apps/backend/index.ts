import express from "express";
import { prismaClient } from "db";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 3010;

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "All Good",
  });
});

// Get the details of the problem like boilerplate code and everything
app.get("/v1/getproblem", async (req, res) => {
  const slug = req.query.slug;

  const problemInfo = await prismaClient.problemInfo.findFirst({
    where: {
      slug,
    },
  });

  res.status(200).json({
    problemInfo,
  });

  return;
});

// Get Submission Status of an Problem
app.get("/v1/submissioninfo/:id", async (req, res) => {});

// Get ALL the submission status of the problem
app.get("/v1/submissioninfobulk/:id", async (req, res) => {});

// Submitting a Problem
app.post("/v1/submit", async (req, res) => {
  const body = req.body;
  res.json({
    message: "Done",
  });
});

app.post("/v1/run", async (req, res) => {
  const slug = req.body.slug;
  const language = req.body.language;
  const userCode = req.body.code;

  const problemInfo = await prismaClient.problemInfo.findFirst({
    where: {
      slug: slug,
    },
  });

  let boilerplateData = await prismaClient.defaultCode.findFirst({
    where: {
      problemId: problemInfo.id,
    },
  });

  const testCases = boilerplateData?.testCases.map((testcase, index) =>
    JSON.parse(testcase)
  );

  const cleanCode = boilerplateData?.code.replace(/\\n/g, "\n");

  const finalCode = cleanCode.replace("##USER_CODE_HERE##", userCode);

  const results = [];
  for (const testcase of testCases) {
    try {
      const res = await axios.post(
        `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=true`,
        {
          source_code: finalCode,
          language_id: 54,
          stdin: testcase.Input,
          expected_output: testcase.Output,
        },
        {
          headers: {
            "x-rapidapi-key": JUDGE0_API_KEY,
            "x-rapidapi-host": JUDGE0_HOST,
            "Content-Type": "application/json",
          },
        }
      );

      results.push(res.data.status);

    } catch (e) {
      console.log(`Error while calling Judge0 ${e}`);
    }
  }

  res.status(200).json({
    result: results
  });

});

app.listen(PORT, () => {
  console.log("Server is running in PORT:3010");
});
