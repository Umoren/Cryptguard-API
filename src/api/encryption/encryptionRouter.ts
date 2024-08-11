import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { encryptVideo } from "./encryptionService";

export const encryptionRegistry = new OpenAPIRegistry();
export const encryptionRouter: Router = express.Router();

const EncryptionRequestSchema = z.object({
  videoUrl: z.string().url(),
  contentId: z.string().length(32),
});

const EncryptionResponseSchema = z.object({
  mpdUrl: z.string().url(),
});

encryptionRegistry.registerPath({
  method: "post",
  path: "/encrypt",
  tags: ["Encryption"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EncryptionRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(EncryptionResponseSchema, "Video encrypted successfully"),
});

encryptionRouter.post("/encrypt", async (req: Request, res: Response) => {
  const parseResult = EncryptionRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    const serviceResponse = ServiceResponse.failure("Invalid request body", parseResult.error);
    return handleServiceResponse(serviceResponse, res);
  }

  const { videoUrl, contentId } = parseResult.data;
  const result = await encryptVideo(videoUrl, contentId);
  return handleServiceResponse(result, res);
});
