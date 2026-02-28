import { Router } from "express";
import { addProblem, getProblem, getProblems } from "../controllers/problem.controller";
import {
  getContributions,
  getSubmissionInfoBulk,
  getSubmissionStatus,
  runProblem,
  submitProblem,
} from "../controllers/submission.controller";
import { asyncHandler } from "../lib/errors";
import { authMiddleware } from "../middleware/auth";

export const v1Router = Router();

v1Router.get("/getproblem", asyncHandler(getProblem));
v1Router.get("/getproblems", asyncHandler(getProblems));
v1Router.post("/addProblem", asyncHandler(addProblem));

v1Router.post("/submit", authMiddleware, asyncHandler(submitProblem));
v1Router.post("/run", authMiddleware, asyncHandler(runProblem));
v1Router.get(
  "/getsubmissionstatus",
  authMiddleware,
  asyncHandler(getSubmissionStatus)
);
v1Router.get(
  "/submissioninfobulk",
  authMiddleware,
  asyncHandler(getSubmissionInfoBulk)
);
v1Router.get(
  "/getContributions",
  authMiddleware,
  asyncHandler(getContributions)
);
