import express from "express";
import { prismaClient } from "db";
import cors from "cors";
import axios from "axios";
import {checkSubmissionStatus} from "./utils"
import { authMiddleware } from "./middleware";

const PORT = process.env.PORT || 3012;

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_HOST;
const app = express();

app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({
    message: "All Good",
  });
});

// Get the details of the problem like boilerplate code and everything
app.get("/v1/getproblem", async (req, res) => {
  const slug = req.query.slug as string;

  let problemInfo = await prismaClient.problemInfo.findFirst({
    where: {
      slug,
    },
  });


  res.status(200).json({
    problemInfo,
  });

  return;
});

// Submitting a Problem
app.post("/v1/submit", authMiddleware, async (req, res) => {
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
      problemId: problemInfo!.id,
    },
  });

  if(boilerplateData == null || boilerplateData.code == null){
    res.status(401).json({
      message: "Bad Request"
    })
    return;
  }

  const finalCode = boilerplateData.code.cpp.replace("##USER_CODE_HERE##", userCode); // NEED TO REPLACE CPP

  //@ts-ignore
  const submissions = boilerplateData?.testCases?.map((testcase, index) => ({
    source_code: finalCode,
    language_id: 54,
    stdin: testcase.input,
    expected_output: testcase.output,
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
      code: {userCode},
      languageId: 54,
      tokens: judgeZeroTokens,
      problemId: problemInfo?.id,
      userId: req.userId!,
    },
  });

  // After the loop, you can send the results
  res.status(200).json({
    submissionId: submissionId.id,
  });
});

app.post("/v1/run", authMiddleware, async (req, res) => {
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

  const finalCode = boilerplateData?.code.cpp.replace("##USER_CODE_HERE##", userCode); // NEED TO CHANGE CPP HERE
  const testCases = problemInfo?.testCases 
  const results = [];

  for (const testcase of testCases) {
    try {
      const res = await axios.post(
        `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=true`,
        {
          source_code: finalCode,
          language_id: 54,
          stdin: testcase.input,
          expected_output: testcase.output,
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

app.get("/v1/getsubmissionstatus", authMiddleware, async (req, res) => {
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

// // Get Submission Status of an Problem
// app.get("/v1/submissioninfo", async (req, res) => {});

app.get("/v1/getproblems", async (req, res) => {

  try{
    const problems = await prismaClient.problemInfo.findMany({
      where: {

      }, select: {
        metaData: true,
        slug: true
      }
    })
  
    res.status(200).json({
      problems
    })
  }catch(error){
    console.error("Error while retreiving problems", error);
    res.status(504).json({
      message: "Internal Server Error"
    })
  }

})



// Get ALL the submission status of the problem
app.get("/v1/submissioninfobulk", authMiddleware, async (req, res) => {

    const problemId = req.query.id as string
    const userId = req.userId
    // const userId = USERID

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


app.get("/v1/getContributions", authMiddleware, async (req, res) => {

  const userId = req.userId!

  const submissions = await prismaClient.submission.findMany({
    where: {
      userId,
    }, select: {
      createdAt: true
    }
  })

  res.status(200).json({
    submissions
  })

})

app.post("/v1/addProblem", async (req, res) => {
  try {
    const { problemInfo, code, testCases } = req.body;
    const { metaData, slug, type, solved, sampleTestCase, functionCode, testCases: testCasePI } = problemInfo;

    // Store problem information
    const newProblemInfo = await prismaClient.problemInfo.create({
      data: {
        metaData,
        slug,
        type,
        solved,
        sampleTestCase,
        functionCode,
        testCases: testCasePI,
      },
    });

    // Store default code
    const newProblem = await prismaClient.defaultCode.create({
      data: {
        problemId: newProblemInfo.id,
        code,
        testCases,
      },
    });

    res.json({ id: newProblem.id });

  } catch (error) {
    console.error("Error adding problem info:", error);
    res.status(500).json({ error: "Failed to add problem info" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running in PORT:${PORT}`);
});
