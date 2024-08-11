import { app } from "@/server"; // Make sure this import is correct
import { StatusCodes } from "http-status-codes";
import request from "supertest";

describe("OpenAPI Router", () => {
  describe("Swagger JSON route", () => {
    it("should serve the Swagger JSON", async () => {
      const response = await request(app).get("/api-docs/swagger.json");

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.headers["content-type"]).toContain("application/json");
    });

    it("should serve the Swagger UI", async () => {
      const response = await request(app).get("/api-docs/");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response text:", response.text.substring(0, 200));

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain("swagger-ui");
    });
  });
});
