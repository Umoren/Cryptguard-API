const { execSync } = require("node:child_process");
const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");

const platform = os.platform();
const arch = os.arch();

const SHAKA_PACKAGER_VERSION = "2.6.1";

const downloadUrls = {
  linux: `https://github.com/google/shaka-packager/releases/download/v${SHAKA_PACKAGER_VERSION}/packager-linux-x64`,
  darwin: `https://github.com/google/shaka-packager/releases/download/v${SHAKA_PACKAGER_VERSION}/packager-osx-x64`,
  win32: `https://github.com/google/shaka-packager/releases/download/v${SHAKA_PACKAGER_VERSION}/packager-win-x64.exe`,
};

const binaryName = platform === "win32" ? "packager.exe" : "packager";
const downloadUrl = downloadUrls[platform];

if (!downloadUrl) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(1);
}

const binPath = path.join(__dirname, "..", "bin");
const binaryPath = path.join(binPath, binaryName);

if (!fs.existsSync(binPath)) {
  fs.mkdirSync(binPath, { recursive: true });
}

console.log(`Downloading Shaka Packager for ${platform}...`);
execSync(`curl -L ${downloadUrl} -o ${binaryPath}`);
execSync(`chmod +x ${binaryPath}`);

console.log("Shaka Packager installed successfully.");
