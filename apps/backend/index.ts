import express from "express";
import { prismaClient } from "db";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 3010;

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;
const USERID = "cm8ifurfy0000sipeax0reziu";
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



const checkSubmissionStatus = async (tokenQuery: string) => {
  while (true) {
    try {
      const response = await axios.get(
        `${JUDGE0_URL}/submissions/batch?tokens=${tokenQuery}&base64_encoded=false`,
        {
          headers: {
            "x-rapidapi-key": JUDGE0_API_KEY,
            "x-rapidapi-host": JUDGE0_HOST,
            "Content-Type": "application/json",
          },
        }
      );

      const submissions = response.data.submissions;

      // Check statuses
      let allAccepted = true;
      for (const submission of submissions) {
        const status = submission.status.description;

        if (status === "In Queue" || status === "Processing") {
          console.log("Still processing... Retrying in 2 seconds.");
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
          allAccepted = false;
          break; // Exit loop and retry the request
        }

        if (status !== "Accepted") {
          return "REJECTED"; // If any status is not "Accepted", return "Failed"
        }
      }

      if (allAccepted) {
        return "ACCEPTED";
      }
    } catch (error) {
      console.error("Error fetching submission status:", error);
      return "REJECTED";
    }
  }

}
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "All Good",
  });
});

// Get the details of the problem like boilerplate code and everything
app.get("/v1/getproblem", async (req, res) => {
  const slug = req.query.slug;

  let problemInfo = await prismaClient.problemInfo.findFirst({
    where: {
      slug,
    },
  });

  if (problemInfo && problemInfo.functionCode) {
    problemInfo.functionCode = problemInfo.functionCode.replace(/\\n/g, "\n");
  }

  res.status(200).json({
    problemInfo,
  });

  return;
});

// Submitting a Problem
app.post("/v1/submit", async (req, res) => {
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

  const testCases = boilerplateData?.testCases.slice(0, 6).map((testcase) => {
    return JSON.parse(testcase);
  });

  const cleanCode = boilerplateData?.code.replace(/\\n/g, "\n");

  const finalCode = cleanCode.replace("##USER_CODE_HERE##", userCode);

  const submissions = testCases?.map((testcase, index) => ({
    source_code: finalCode,
    language_id: 54,
    stdin: testcase.Input,
    expected_output: testcase.Output,
  }));

  const judgeZeroRes = await axios.post(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions: submissions,
    },
    {
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": JUDGE0_HOST,
        "Content-Type": "application/json",
      },
    }
  );

  const judgeZeroTokens = judgeZeroRes.data;



  const submissionId = await prismaClient.submission.create({
    data: {
      code: userCode,
      languageId: 54,
      tokens: judgeZeroTokens,
      problemId: problemInfo?.id,
      userId: USERID,
    },
  });

  // After the loop, you can send the results
  res.status(200).json({
    submissionId: submissionId.id,
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

  const testCases = problemInfo?.testCases.map((testcase) => {
    return JSON.parse(testcase);
  });

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

      // const res = {status: 401, data: {
      //     error: "failed"
      // }}

      // Check for errors or non-2xx status codes here
      if (res.status !== 200 || res.data.error) {
        results.push({
          id: -1,
          description: "Failed",
        });
      } else {
        results.push(res.data.status);
      }
    } catch (e) {
      // Handle network errors or other exceptions
      console.log(`Error while calling Judge0 ${e}`);
      results.push({
        id: -1,
        description: "Failed",
      });
    }
  }

  // After the loop, you can send the results
  res.status(200).json({
    result: results,
  });
});




app.get("/v1/getsubmissionstatus", async (req, res) => {
  const submissionId = req.query.submissionId;

  const submissionRes = await prismaClient.submission.findFirst({
    where: {
      id: (submissionId)
    },
  });

  const tokens = submissionRes.tokens;

  const tokenQuery = tokens.map((t) => t.token).join(",");

  const status = await checkSubmissionStatus(tokenQuery);

  await prismaClient.submission.update({
    where: {
      id: (submissionId as string)
    }, data: {
      status: status
    }
  })

  res.json({
    status,
  });
});
// Get Submission Status of an Problem
app.get("/v1/submissioninfo", async (req, res) => {});

// Get ALL the submission status of the problem
app.get("/v1/submissioninfobulk", async (req, res) => {

    const problemId = req.query.id as string
    // const userId = req.query.userid
    const userId = USERID

    const submissions = await prismaClient.submission.findMany({
      where: {
        problemId,
        userId
      }, 
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    res.status(200).json({
      submissions
    })

});

app.post("/v1/addtest", async (req, res) => {
  const id = req.body.id;
  const payload = req.body.testCases;

  await prismaClient.defaultCode.update({
    where: {
      id: id,
    },
    data: {
      testCases: payload,
    },
  });

  const updateData = await prismaClient.defaultCode.findFirst({
    where: {
      id,
    },
  });

  res.json({ updateData });
});

app.listen(PORT, () => {
  console.log("Server is running in PORT:3010");
});
