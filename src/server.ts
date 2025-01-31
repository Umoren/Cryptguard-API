import path from "node:path";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { encryptionRouter } from "./api/encryption/encryptionRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Serve encrypted files
const cdnPath = path.resolve(__dirname, "..", "cdn");
app.use("/cdn", express.static(cdnPath));

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/encryption", encryptionRouter);

// Swagger UI
app.use("/api-docs", openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
