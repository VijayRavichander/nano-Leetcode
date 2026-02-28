import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { healthRouter } from "./routes/health.routes";
import { v1Router } from "./routes/v1.routes";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(healthRouter);
app.use("/v1", v1Router);

app.use(notFoundHandler);
app.use(errorHandler);
