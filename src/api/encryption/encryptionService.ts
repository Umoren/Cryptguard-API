import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

const packagerPath = path.join(__dirname, "..", "..", "..", "bin", "packager");
const cdnPath = path.join(__dirname, "..", "..", "..", "cdn");

// Ensure the cdn directory exists
if (!fs.existsSync(cdnPath)) {
  fs.mkdirSync(cdnPath, { recursive: true });
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const totalLength = response.headers["content-length"];

  let downloadedLength = 0;
  let lastReportedProgress = 0;

  response.data.on("data", (chunk: Buffer) => {
    downloadedLength += chunk.length;
    const progress = Math.floor((downloadedLength / Number.parseInt(totalLength)) * 100);

    if (progress >= lastReportedProgress + 10) {
      lastReportedProgress = Math.floor(progress / 10) * 10;
      logger.info(`Download progress: ${lastReportedProgress}%`);
    }
  });

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export async function encryptVideo(videoUrl: string, contentId: string): Promise<ServiceResponse<{ mpdUrl: string }>> {
  const tempFilePath = path.join(cdnPath, `temp_${contentId}.mp4`);

  try {
    logger.info(`Downloading video for ${contentId}`);
    await downloadFile(videoUrl, tempFilePath);
    logger.info(`Download completed for ${contentId}`);

    return new Promise((resolve) => {
      const args = [
        `in=${tempFilePath},stream=audio,output=${cdnPath}/audio_${contentId}.mp4`,
        `in=${tempFilePath},stream=video,output=${cdnPath}/video_${contentId}.mp4`,
        "--enable_widevine_encryption",
        "--key_server_url",
        "https://license.uat.widevine.com/cenc/getcontentkey/widevine_test",
        "--content_id",
        contentId,
        "--signer",
        "widevine_test",
        "--aes_signing_key",
        env.AES_SIGNING_KEY,
        "--aes_signing_iv",
        env.AES_SIGNING_IV,
        "--mpd_output",
        `${cdnPath}/${contentId}.mpd`,
      ];

      logger.info(`Starting encryption process for ${contentId}`);
      logger.debug(`Command: ${packagerPath} ${args.join(" ")}`);

      const packager = spawn(packagerPath, args);

      let stdout = "";
      let stderr = "";

      packager.stdout.on("data", (data) => {
        stdout += data;
        logger.debug(`Packager stdout: ${data}`);
      });

      packager.stderr.on("data", (data) => {
        stderr += data;
        logger.debug(`Packager stderr: ${data}`);
      });

      packager.on("error", (error) => {
        logger.error(`Packager process error: ${error.message}`);
        resolve(
          ServiceResponse.failure(
            "Video encryption failed due to process error",
            { mpdUrl: "" },
            StatusCodes.INTERNAL_SERVER_ERROR,
          ),
        );
      });

      packager.on("close", (code) => {
        // Remove the temporary file
        fs.unlinkSync(tempFilePath);

        if (code === 0) {
          logger.info(`Video encrypted successfully: ${contentId}`);
          resolve(
            ServiceResponse.success(
              "Video encrypted successfully",
              { mpdUrl: `${env.CDN_URL}/${contentId}.mpd` },
              StatusCodes.OK,
            ),
          );
        } else {
          logger.error(`Encryption failed for ${contentId}. Exit code: ${code}`);
          logger.error(`stdout: ${stdout}`);
          logger.error(`stderr: ${stderr}`);
          resolve(
            ServiceResponse.failure("Video encryption failed", { mpdUrl: "" }, StatusCodes.INTERNAL_SERVER_ERROR),
          );
        }
      });
    });
  } catch (error) {
    logger.error(`Error during video processing: ${error instanceof Error ? error.message : String(error)}`);
    return ServiceResponse.failure("Video processing failed", { mpdUrl: "" }, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
