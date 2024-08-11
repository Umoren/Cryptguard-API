import dotenv from "dotenv";
import { url, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  AES_SIGNING_KEY: str({ devDefault: testOnly("1ae8ccd0e7985cc0b6203a55855a1034afc252980e970ca90e5202689f947ab9") }),
  AES_SIGNING_IV: str({ devDefault: testOnly("d58ce954203b7c9a9a9d467f59839249") }),
  CDN_URL: url({ devDefault: testOnly("http://localhost:8080/cdn") }),
});
